import { prisma, useDbFallback, isMemoryDb } from "../../../server";

export interface CreateOrderDto {
  buyerId: string;
  vendorId: string;
  subtotal: number;
  deliveryFee: number;
  tax?: number;
  discount?: number;
  total: number;
  notes?: string;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  address: {
    fullName: string;
    phone: string;
    city: string;
    subCity?: string;
    kebele?: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
  };
}

export class OrdersRepository {
  async create(dto: CreateOrderDto) {
    const orderNumber = `EVZ-ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (prisma && !useDbFallback) {
      // 1. Create using Prisma
      return prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            orderNumber,
            buyerId: dto.buyerId,
            vendorId: dto.vendorId,
            subtotal: dto.subtotal,
            deliveryFee: dto.deliveryFee,
            tax: dto.tax,
            discount: dto.discount,
            total: dto.total,
            notes: dto.notes,
            status: "PENDING_PAYMENT",
            paymentStatus: "PENDING",
          },
        });

        const items = await Promise.all(
          dto.items.map((it) =>
            tx.orderItem.create({
              data: {
                orderId: order.id,
                productId: it.productId,
                variantId: it.variantId || null,
                quantity: it.quantity,
                unitPrice: it.unitPrice,
                totalPrice: it.totalPrice,
              },
            })
          )
        );

        const address = await tx.shippingAddress.create({
          data: {
            orderId: order.id,
            fullName: dto.address.fullName,
            phone: dto.address.phone,
            city: dto.address.city,
            subCity: dto.address.subCity || null,
            kebele: dto.address.kebele || null,
            landmark: dto.address.landmark || null,
            latitude: dto.address.latitude || null,
            longitude: dto.address.longitude || null,
          },
        });

        // Create initial tracking
        const tracking = await tx.orderTracking.create({
          data: {
            orderId: order.id,
            status: "PENDING",
            message: "ትዕዛዝ ተፈጥሯል / Order created successfully.",
            latitude: dto.address.latitude || null,
            longitude: dto.address.longitude || null,
          },
        });

        return { ...order, items, address, tracking: [tracking] };
      });
    } else {
      // 2. Create in memory
      const orderId = `ord-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const order = {
        id: orderId,
        orderNumber,
        buyerId: dto.buyerId,
        vendorId: dto.vendorId,
        status: "PENDING_PAYMENT",
        paymentStatus: "PENDING",
        subtotal: dto.subtotal,
        deliveryFee: dto.deliveryFee,
        tax: dto.tax || null,
        discount: dto.discount || null,
        total: dto.total,
        notes: dto.notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const items = dto.items.map((it, idx) => {
        const itemObj = {
          id: `item-${Date.now()}-${idx}`,
          orderId,
          productId: it.productId,
          variantId: it.variantId || null,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          totalPrice: it.totalPrice,
        };
        isMemoryDb.orderItems.push(itemObj);
        return itemObj;
      });

      const address = {
        id: `addr-${Date.now()}`,
        orderId,
        fullName: dto.address.fullName,
        phone: dto.address.phone,
        city: dto.address.city,
        subCity: dto.address.subCity || null,
        kebele: dto.address.kebele || null,
        landmark: dto.address.landmark || null,
        latitude: dto.address.latitude || null,
        longitude: dto.address.longitude || null,
        createdAt: new Date(),
      };
      isMemoryDb.shippingAddresses.push(address);

      const trackingObj = {
        id: `track-${Date.now()}`,
        orderId,
        status: "PENDING" as any,
        message: "ትዕዛዝ ተፈጥሯል / Order created successfully.",
        latitude: dto.address.latitude || null,
        longitude: dto.address.longitude || null,
        createdAt: new Date(),
      };
      isMemoryDb.orderTrackings.push(trackingObj);

      isMemoryDb.orders.push(order);

      return { ...order, items, address, tracking: [trackingObj] };
    }
  }

  async findById(id: string) {
    if (prisma && !useDbFallback) {
      const order = await prisma.order.findUnique({
        where: { id },
      });
      if (!order) return null;

      const items = await prisma.orderItem.findMany({ where: { orderId: id } });
      const address = await prisma.shippingAddress.findUnique({ where: { orderId: id } });
      const tracking = await prisma.orderTracking.findMany({ where: { orderId: id }, orderBy: { createdAt: "asc" } });
      const escrow = await prisma.escrowTransaction.findUnique({ where: { orderId: id } });

      return { ...order, items, address, tracking, escrow };
    } else {
      const order = isMemoryDb.orders.find((o: any) => o.id === id);
      if (!order) return null;

      const items = isMemoryDb.orderItems.filter((it: any) => it.orderId === id);
      const address = isMemoryDb.shippingAddresses.find((addr: any) => addr.orderId === id) || null;
      const tracking = isMemoryDb.orderTrackings.filter((t: any) => t.orderId === id).sort((a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime());
      const escrow = isMemoryDb.escrowTransactions.find((e: any) => e.orderId === id) || null;

      return { ...order, items, address, tracking, escrow };
    }
  }

  async findAll(filters: { buyerId?: string; vendorId?: string; status?: string }) {
    if (prisma && !useDbFallback) {
      const where: any = {};
      if (filters.buyerId) where.buyerId = filters.buyerId;
      if (filters.vendorId) where.vendorId = filters.vendorId;
      if (filters.status) where.status = filters.status;

      const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return Promise.all(
        orders.map(async (order) => {
          const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
          const address = await prisma.shippingAddress.findUnique({ where: { orderId: order.id } });
          const tracking = await prisma.orderTracking.findMany({ where: { orderId: order.id }, orderBy: { createdAt: "asc" } });
          const escrow = await prisma.escrowTransaction.findUnique({ where: { orderId: order.id } });
          return { ...order, items, address, tracking, escrow };
        })
      );
    } else {
      let list = [...isMemoryDb.orders];
      if (filters.buyerId) list = list.filter((o: any) => o.buyerId === filters.buyerId);
      if (filters.vendorId) list = list.filter((o: any) => o.vendorId === filters.vendorId);
      if (filters.status) list = list.filter((o: any) => o.status === filters.status);

      list.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());

      return list.map((order: any) => {
        const items = isMemoryDb.orderItems.filter((it: any) => it.orderId === order.id);
        const address = isMemoryDb.shippingAddresses.find((addr: any) => addr.orderId === order.id) || null;
        const tracking = isMemoryDb.orderTrackings.filter((t: any) => t.orderId === order.id).sort((a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime());
        const escrow = isMemoryDb.escrowTransactions.find((e: any) => e.orderId === order.id) || null;
        return { ...order, items, address, tracking, escrow };
      });
    }
  }

  async updateStatus(id: string, status: any, paymentStatus?: any) {
    if (prisma && !useDbFallback) {
      const data: any = { status, updatedAt: new Date() };
      if (paymentStatus) data.paymentStatus = paymentStatus;

      const order = await prisma.order.update({
        where: { id },
        data,
      });
      return order;
    } else {
      const order = isMemoryDb.orders.find((o: any) => o.id === id);
      if (!order) throw new Error("Order not found");

      order.status = status;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      order.updatedAt = new Date();
      return order;
    }
  }

  async addTracking(orderId: string, status: any, message: string, latitude?: number, longitude?: number) {
    if (prisma && !useDbFallback) {
      return prisma.orderTracking.create({
        data: {
          orderId,
          status,
          message,
          latitude: latitude || null,
          longitude: longitude || null,
        },
      });
    } else {
      const trackObj = {
        id: `track-${Date.now()}`,
        orderId,
        status,
        message,
        latitude: latitude || null,
        longitude: longitude || null,
        createdAt: new Date(),
      };
      isMemoryDb.orderTrackings.push(trackObj);
      return trackObj;
    }
  }

  async createEscrow(orderId: string, amount: number) {
    if (prisma && !useDbFallback) {
      return prisma.escrowTransaction.upsert({
        where: { orderId },
        update: { amount, released: false, releasedAt: null },
        create: { orderId, amount, released: false },
      });
    } else {
      let escrow = isMemoryDb.escrowTransactions.find((e: any) => e.orderId === orderId);
      if (escrow) {
        escrow.amount = amount;
        escrow.released = false;
        escrow.releasedAt = null;
      } else {
        escrow = {
          id: `esc-${Date.now()}`,
          orderId,
          amount,
          released: false,
          releasedAt: null,
          createdAt: new Date(),
        };
        isMemoryDb.escrowTransactions.push(escrow);
      }
      return escrow;
    }
  }

  async releaseEscrowTransaction(orderId: string) {
    if (prisma && !useDbFallback) {
      return prisma.escrowTransaction.update({
        where: { orderId },
        data: { released: true, releasedAt: new Date() },
      });
    } else {
      const escrow = isMemoryDb.escrowTransactions.find((e: any) => e.orderId === orderId);
      if (!escrow) throw new Error("Escrow transaction not found");
      escrow.released = true;
      escrow.releasedAt = new Date();
      return escrow;
    }
  }

  async freezeEscrowTransaction(orderId: string) {
    // For freezing escrow, we can store dispute logs, or set escrow status.
    // In our simplified EscrowTransaction schema we have `released: boolean`.
    // We can simulate freeze by ensuring released remains false and registering reports.
    if (prisma && !useDbFallback) {
      // Just double checks/resets released to false to block payout
      return prisma.escrowTransaction.update({
        where: { orderId },
        data: { released: false, releasedAt: null },
      });
    } else {
      const escrow = isMemoryDb.escrowTransactions.find((e: any) => e.orderId === orderId);
      if (!escrow) throw new Error("Escrow transaction not found");
      escrow.released = false;
      escrow.releasedAt = null;
      return escrow;
    }
  }

  async createReturn(orderId: string, reason: string, description?: string) {
    const status = "PENDING_REVIEW";
    if (prisma && !useDbFallback) {
      return prisma.returnRequest.create({
        data: {
          orderId,
          reason,
          description: description || null,
          status,
        },
      });
    } else {
      const retObj = {
        id: `ret-${Date.now()}`,
        orderId,
        reason,
        description: description || null,
        status,
        createdAt: new Date(),
      };
      isMemoryDb.returnRequests.push(retObj);
      return retObj;
    }
  }

  async getReturns() {
    if (prisma && !useDbFallback) {
      return prisma.returnRequest.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      return [...isMemoryDb.returnRequests].sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }

  async createRefundTransaction(orderId: string, amount: number, reason: string) {
    const status = "PROCESSED";
    if (prisma && !useDbFallback) {
      return prisma.refund.create({
        data: {
          orderId,
          amount,
          reason,
          status,
          processedAt: new Date(),
        },
      });
    } else {
      const refObj = {
        id: `ref-${Date.now()}`,
        orderId,
        amount,
        reason,
        status,
        processedAt: new Date(),
        createdAt: new Date(),
      };
      isMemoryDb.refunds.push(refObj);
      return refObj;
    }
  }

  async getRefunds() {
    if (prisma && !useDbFallback) {
      return prisma.refund.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      return [...isMemoryDb.refunds].sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }
}
