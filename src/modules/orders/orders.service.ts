import { OrdersRepository, CreateOrderDto } from "./orders.repository";
import { prisma, useDbFallback, isMemoryDb } from "../../../server";

export class OrdersService {
  private repository = new OrdersRepository();

  // Create notifications in isMemoryDb or Prisma
  private async createNotification(userId: string, type: string, title: string, body: string) {
    try {
      if (prisma && !useDbFallback) {
        await prisma.notification.create({
          data: {
            userId,
            type: type as any,
            title,
            body,
            status: "DELIVERED",
          },
        });
      } else {
        isMemoryDb.notifications.push({
          id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId,
          type,
          title,
          body,
          status: "DELIVERED",
          createdAt: new Date(),
        });
      }
    } catch (e) {
      console.error("Failed to create background notification:", e);
    }
  }

  // --- 1. Checkout flow ---
  async checkout(dto: CreateOrderDto) {
    // Business Rule Check: Suspended vendors cannot receive new orders
    let isSuspended = false;
    let shopName = "Vendor Stall";

    if (prisma && !useDbFallback) {
      const vendor = await prisma.vendor.findUnique({
        where: { id: dto.vendorId },
      });
      if (vendor && (vendor.status === "SUSPENDED" || vendor.subscriptionStatus === "SUSPENDED")) {
        isSuspended = true;
      }
      if (vendor) shopName = vendor.shopName;
    } else {
      const vendor = isMemoryDb.vendors.find((v: any) => v.id === dto.vendorId);
      if (vendor && (vendor.status === "SUSPENDED" || vendor.subscriptionStatus === "SUSPENDED")) {
        isSuspended = true;
      }
      if (vendor) shopName = vendor.shopName;
    }

    if (isSuspended) {
      throw new Error(`ይቅርታ፣ ይህ ሻጭ በአሁኑ ጊዜ ታግዷል / Sorry, checkout failed. The merchant "${shopName}" is currently suspended and cannot receive new orders.`);
    }

    // Process checkout
    const order = await this.repository.create(dto);

    // Notification: Order Created
    await this.createNotification(
      dto.buyerId,
      "ORDER_STATUS",
      "ትዕዛዝ ተመዝግቧል / Order Placed",
      `ትዕዛዝ ${order.orderNumber} በተሳካ ሁኔታ ተመዝግቧል። እባክዎ ክፍያ ይፈጽሙ።`
    );

    await this.createNotification(
      dto.vendorId,
      "NEW_ORDER",
      "አዲስ ትዕዛዝ ደርሶዎታል / New Order Received",
      `ከደነበኛ አዲስ ትዕዛዝ ${order.orderNumber} ደርሶዎታል።`
    );

    return order;
  }

  // --- 2. Payment received & Escrow placement ---
  async processPayment(orderId: string, reference: string, amount: number) {
    const order = await this.repository.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.status !== "PENDING_PAYMENT") {
      throw new Error("Order is already paid or cancelled");
    }

    // Transition state: PAID
    await this.repository.updateStatus(orderId, "PAID", "SUCCESS");

    // Hold funds in Escrow
    await this.repository.createEscrow(orderId, amount);

    // Initial order tracking status
    await this.repository.addTracking(
      orderId,
      "PENDING",
      "ክፍያ ተረጋግጧል። ገንዘቡ በታማኝ የሶስተኛ ወገን (Escrow) እንዲቀመጥ ተደርጓል። / Payment verified. Funds successfully placed in secure escrow escrow."
    );

    // Notifications
    await this.createNotification(
      order.buyerId,
      "PAYMENT_SUCCESS",
      "ክፍያዎ ተቀባይነት አግኝቷል / Payment Verified",
      `ለትዕዛዝ ${order.orderNumber} የከፈሉት ክፍያ ተረጋግጦ በ Escrow ተቀምጧል።`
    );

    await this.createNotification(
      order.vendorId,
      "ORDER_STATUS",
      "ክፍያ ተረጋግጧል / Payment Verified",
      `ለትዕዛዝ ${order.orderNumber} ክፍያ ተረጋግጧል። እባክዎ ማሸግ እና ማዘጋጀት ይጀምሩ።`
    );

    return this.repository.findById(orderId);
  }

  // --- 3. Vendor Processing ---
  async processOrder(orderId: string, vendorId: string) {
    const order = await this.repository.findById(orderId);
    if (!order) throw new Error("Order not found");
    if (order.vendorId !== vendorId) throw new Error("Unauthorized vendor access");

    if (order.status !== "PAID") {
      throw new Error("Only PAID orders can be processed. Payment must be verified first.");
    }

    await this.repository.updateStatus(orderId, "PROCESSING");
    await this.repository.addTracking(orderId, "ASSIGNED", "ሻጩ ትዕዛዝዎን እያዘጋጀ ነው / Vendor is processing and preparing your order items.");

    await this.createNotification(
      order.buyerId,
      "ORDER_STATUS",
      "ትዕዛዝዎ በመዘጋጀት ላይ ነው / Order in Processing",
      `ትዕዛዝ ${order.orderNumber} በሻጩ እጅ ላይ ሆኖ በመዘጋጀት ላይ ነው።`
    );

    return this.repository.findById(orderId);
  }

  // --- 4. Vendor packed and Shipped ---
  async shipOrder(orderId: string, vendorId: string) {
    const order = await this.repository.findById(orderId);
    if (!order) throw new Error("Order not found");
    if (order.vendorId !== vendorId) throw new Error("Unauthorized vendor access");

    await this.repository.updateStatus(orderId, "SHIPPED");
    await this.repository.addTracking(orderId, "PICKED_UP", "እቃው ተጭኗል / Package packed and picked up by courier rider.");

    await this.createNotification(
      order.buyerId,
      "ORDER_STATUS",
      "ትዕዛዝዎ ተልኳል / Order Shipped",
      `ትዕዛዝ ${order.orderNumber} ለፈጣን መልዕክተኛ ተሰጥቶ ተልኳል።`
    );

    return this.repository.findById(orderId);
  }

  // --- 5. Delivery Rider Updates (Out for delivery) ---
  async deliverOrder(orderId: string) {
    const order = await this.repository.findById(orderId);
    if (!order) throw new Error("Order not found");

    await this.repository.updateStatus(orderId, "DELIVERED");
    await this.repository.addTracking(orderId, "DELIVERED", "ትዕዛዝ ደርሷል / Package successfully delivered to your location. Waiting for your confirmation.");

    // Escrow is NOT automatically released here. The buyer must confirm first, protecting both parties.
    await this.createNotification(
      order.buyerId,
      "ORDER_STATUS",
      "ትዕዛዝዎ ደርሷል / Order Delivered",
      `ትዕዛዝ ${order.orderNumber} መዳረሻዎ ደርሷል። እቃውን ካረጋገጡ በኋላ እባክዎ መቀበልዎን ያረጋግጡ።`
    );

    await this.createNotification(
      order.vendorId,
      "ORDER_STATUS",
      "ትዕዛዝ መዳረሻ ደርሷል / Delivered to Buyer",
      `ትዕዛዝ ${order.orderNumber} ለደንበኛ ደርሷል። ደንበኛ ሲያረጋግጥ ገንዘብዎ ከ Escrow ይለቀቅልዎታል።`
    );

    return this.repository.findById(orderId);
  }

  // --- 6. Buyer Confirms Delivery & Escrow Release ---
  async confirmDelivery(orderId: string, buyerId: string) {
    const order = await this.repository.findById(orderId);
    if (!order) throw new Error("Order not found");
    if (order.buyerId !== buyerId) throw new Error("Unauthorized buyer access");

    if (order.status !== "DELIVERED") {
      throw new Error("Delivery can only be confirmed after the courier marks it as delivered.");
    }

    // Complete order
    await this.repository.updateStatus(orderId, "COMPLETED");
    await this.repository.addTracking(orderId, "DELIVERED", "ደንበኛ እቃውን መቀበሉን አረጋግጧል። / Buyer confirmed successful receipt of package.");

    // Release escrow
    await this.repository.releaseEscrowTransaction(orderId);

    // Notifications
    await this.createNotification(
      order.buyerId,
      "ORDER_STATUS",
      "ትዕዛዝ ተጠናቋል / Order Completed Successfully",
      `የዕቃ መቀበያዎን ስላረጋገጡ እናመሰግናለን። ትዕዛዝ ${order.orderNumber} በተሳካ ሁኔታ ተጠናቋል።`
    );

    await this.createNotification(
      order.vendorId,
      "ORDER_STATUS",
      "ገንዘብ ተለቋል / Escrow Funds Released",
      `ለትዕዛዝ ${order.orderNumber} በ Escrow የተያዘው ክፍያ ተለቆ ወደ አካውንትዎ ገብቷል።`
    );

    return this.repository.findById(orderId);
  }

  // --- 7. Cancellation logic ---
  async cancelOrder(orderId: string, userId: string, role: "BUYER" | "VENDOR") {
    const order = await this.repository.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (role === "BUYER" && order.buyerId !== userId) throw new Error("Unauthorized buyer cancel request");
    if (role === "VENDOR" && order.vendorId !== userId) throw new Error("Unauthorized vendor cancel request");

    // Check cancellation logic
    if (order.status !== "PENDING_PAYMENT") {
      throw new Error("Only unpaid orders can be cancelled. Paid orders must file a return or refund.");
    }

    await this.repository.updateStatus(orderId, "CANCELLED");
    await this.repository.addTracking(orderId, "CANCELLED", "ትዕዛዝ ተሰርዟል / Order has been cancelled.");

    await this.createNotification(
      order.buyerId,
      "ORDER_STATUS",
      "ትዕዛዝ ተሰርዟል / Order Cancelled",
      `ትዕዛዝ ${order.orderNumber} በተሳካ ሁኔታ ተሰርዟል።`
    );

    await this.createNotification(
      order.vendorId,
      "ORDER_STATUS",
      "ትዕዛዝ ተሰርዟል / Order Cancelled",
      `ትዕዛዝ ${order.orderNumber} በስረዛ ተቋርጧል።`
    );

    return this.repository.findById(orderId);
  }

  // --- 8. Return logic ---
  async requestReturn(orderId: string, buyerId: string, reason: string, description?: string) {
    const order = await this.repository.findById(orderId);
    if (!order) throw new Error("Order not found");
    if (order.buyerId !== buyerId) throw new Error("Unauthorized buyer return request");

    if (order.status !== "COMPLETED" && order.status !== "DELIVERED") {
      throw new Error("Returns are only allowed for delivered or completed orders.");
    }

    // Policy Check: Allow returns only within a 7-day period
    const now = new Date();
    const orderDate = new Date(order.createdAt);
    const diffTime = Math.abs(now.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      throw new Error("ይቅርታ፣ እቃ ከተረከቡ ከ7 ቀናት በላይ ስለሆኖት መመለስ አይፈቀድም። / Sorry, return period expired. Return requests are only allowed within 7 days of order placement.");
    }

    const returnRequest = await this.repository.createReturn(orderId, reason, description);

    await this.createNotification(
      order.vendorId,
      "ORDER_STATUS",
      "የእቃ መመለስ ጥያቄ ደርሷል / Return Request Filed",
      `ለትዕዛዝ ${order.orderNumber} የደንበኛ እቃ መመለስ ጥያቄ ቀርቧል።`
    );

    return returnRequest;
  }

  // --- 9. Refund logic ---
  async requestRefund(orderId: string, amount: number, reason: string) {
    const order = await this.repository.findById(orderId);
    if (!order) throw new Error("Order not found");

    const refund = await this.repository.createRefundTransaction(orderId, amount, reason);
    await this.repository.updateStatus(orderId, "REFUNDED", "REFUNDED");

    await this.createNotification(
      order.buyerId,
      "ORDER_STATUS",
      "ገንዘብ ተመላሽ ተደርጓል / Refund Approved & Issued",
      `ለትዕዛዝ ${order.orderNumber} የከፈሉት ${amount} ETB ተመላሽ ሆኖልዎታል።`
    );

    await this.createNotification(
      order.vendorId,
      "ORDER_STATUS",
      "ክፍያ ተመላሽ ተደርጓል / Refund Processed",
      `ለትዕዛዝ ${order.orderNumber} የተከፈለው ክፍያ ለደንበኛ ተመላሽ ተደርጓል።`
    );

    return refund;
  }

  // --- 10. Admin Escrow Management ---
  async freezeEscrow(orderId: string, adminId: string) {
    await this.repository.freezeEscrowTransaction(orderId);

    const order = await this.repository.findById(orderId);
    if (order) {
      await this.createNotification(
        order.vendorId,
        "ORDER_STATUS",
        "የ Escrow ገንዘብ ታግዷል / Escrow Funds Frozen",
        `ለትዕዛዝ ${order.orderNumber} ደንበኛ ቅሬታ በማቅረቡ በምርመራ ምክንያት የ Escrow ገንዘብ በጊዜያዊነት ታግዷል።`
      );
    }
    return { status: "success", message: "Escrow funds successfully frozen for dispute investigation." };
  }

  async releaseEscrowAdmin(orderId: string, adminId: string) {
    await this.repository.releaseEscrowTransaction(orderId);

    const order = await this.repository.findById(orderId);
    if (order) {
      await this.createNotification(
        order.vendorId,
        "ORDER_STATUS",
        "የ Escrow ገንዘብ በአስተዳዳሪ ተለቋል / Escrow Released by Admin",
        `ለትዕዛዝ ${order.orderNumber} በ Escrow የተያዘው ክፍያ በአስተዳዳሪ ውሳኔ ተለቆልዎታል።`
      );
    }
    return { status: "success", message: "Escrow funds successfully released to vendor by administrator action." };
  }

  // --- 11. Generic Fetch Methods ---
  async getOrderDetails(orderId: string) {
    return this.repository.findById(orderId);
  }

  async getOrders(filters: { buyerId?: string; vendorId?: string; status?: string }) {
    return this.repository.findAll(filters);
  }

  async getRefunds() {
    return this.repository.getRefunds();
  }

  async getReturns() {
    return this.repository.getReturns();
  }
}
