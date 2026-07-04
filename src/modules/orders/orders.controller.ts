import { Router, Request, Response } from "express";
import { OrdersService } from "./orders.service";

const service = new OrdersService();

// =========================================================================
// 1. BUYER ORDER ROUTER (/orders or /api/orders)
// =========================================================================
export const ordersRouter = Router();

// POST /orders/checkout
ordersRouter.post("/checkout", async (req: Request, res: Response) => {
  try {
    const { buyerId, vendorId, subtotal, deliveryFee, tax, discount, total, notes, items, address } = req.body;
    if (!buyerId || !vendorId || !items || !items.length || !address) {
      return res.status(400).json({ error: "Missing required order checkout fields (buyerId, vendorId, items, address)." });
    }

    const order = await service.checkout({
      buyerId,
      vendorId,
      subtotal: Number(subtotal),
      deliveryFee: Number(deliveryFee),
      tax: tax ? Number(tax) : undefined,
      discount: discount ? Number(discount) : undefined,
      total: Number(total),
      notes,
      items,
      address,
    });

    return res.status(201).json({ status: "success", order });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /orders
ordersRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { buyerId, vendorId, status } = req.query;
    const orders = await service.getOrders({
      buyerId: buyerId as string,
      vendorId: vendorId as string,
      status: status as string,
    });
    return res.status(200).json({ status: "success", orders });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /orders/:id
ordersRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await service.getOrderDetails(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.status(200).json({ status: "success", order });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /orders/cancel
ordersRouter.patch("/cancel", async (req: Request, res: Response) => {
  try {
    const { orderId, userId, role } = req.body;
    if (!orderId || !userId || !role) {
      return res.status(400).json({ error: "Missing orderId, userId, or role." });
    }
    const order = await service.cancelOrder(orderId, userId, role);
    return res.status(200).json({ status: "success", order });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// PATCH /orders/confirm-delivery
ordersRouter.patch("/confirm-delivery", async (req: Request, res: Response) => {
  try {
    const { orderId, buyerId } = req.body;
    if (!orderId || !buyerId) {
      return res.status(400).json({ error: "Missing orderId or buyerId." });
    }
    const order = await service.confirmDelivery(orderId, buyerId);
    return res.status(200).json({ status: "success", order });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /orders/return
ordersRouter.post("/return", async (req: Request, res: Response) => {
  try {
    const { orderId, buyerId, reason, description } = req.body;
    if (!orderId || !buyerId || !reason) {
      return res.status(400).json({ error: "Missing orderId, buyerId, or reason." });
    }
    const returnRequest = await service.requestReturn(orderId, buyerId, reason, description);
    return res.status(201).json({ status: "success", returnRequest });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /orders/refund
ordersRouter.post("/refund", async (req: Request, res: Response) => {
  try {
    const { orderId, amount, reason } = req.body;
    if (!orderId || !amount || !reason) {
      return res.status(400).json({ error: "Missing orderId, amount, or reason." });
    }
    const refund = await service.requestRefund(orderId, Number(amount), reason);
    return res.status(201).json({ status: "success", refund });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /orders/pay (Easy testing endpoint)
ordersRouter.post("/pay", async (req: Request, res: Response) => {
  try {
    const { orderId, referenceNumber, amount } = req.body;
    if (!orderId || !referenceNumber || !amount) {
      return res.status(400).json({ error: "Missing orderId, referenceNumber, or amount." });
    }
    const order = await service.processPayment(orderId, referenceNumber, Number(amount));
    return res.status(200).json({ status: "success", order });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});


// =========================================================================
// 2. VENDOR ORDER ROUTER (/vendor/orders or /api/vendor/orders)
// =========================================================================
export const vendorOrdersRouter = Router();

// GET /vendor/orders
vendorOrdersRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { vendorId, status } = req.query;
    if (!vendorId) {
      return res.status(400).json({ error: "vendorId query param is required" });
    }
    const orders = await service.getOrders({
      vendorId: vendorId as string,
      status: status as string,
    });
    return res.status(200).json({ status: "success", orders });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /vendor/orders/process
vendorOrdersRouter.patch("/process", async (req: Request, res: Response) => {
  try {
    const { orderId, vendorId } = req.body;
    if (!orderId || !vendorId) {
      return res.status(400).json({ error: "orderId and vendorId are required." });
    }
    const order = await service.processOrder(orderId, vendorId);
    return res.status(200).json({ status: "success", order });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// PATCH /vendor/orders/ship
vendorOrdersRouter.patch("/ship", async (req: Request, res: Response) => {
  try {
    const { orderId, vendorId } = req.body;
    if (!orderId || !vendorId) {
      return res.status(400).json({ error: "orderId and vendorId are required." });
    }
    const order = await service.shipOrder(orderId, vendorId);
    return res.status(200).json({ status: "success", order });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// PATCH /vendor/orders/deliver
vendorOrdersRouter.patch("/deliver", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: "orderId is required." });
    }
    const order = await service.deliverOrder(orderId);
    return res.status(200).json({ status: "success", order });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});


// =========================================================================
// 3. ADMIN ORDER ROUTER (/admin/orders, /admin/refunds, /admin/returns, etc.)
// =========================================================================
export const adminOrdersRouter = Router();

// GET /admin/orders
adminOrdersRouter.get("/orders", async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const orders = await service.getOrders({ status: status as string });
    return res.status(200).json({ status: "success", orders });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /admin/refunds
adminOrdersRouter.get("/refunds", async (req: Request, res: Response) => {
  try {
    const refunds = await service.getRefunds();
    return res.status(200).json({ status: "success", refunds });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /admin/returns
adminOrdersRouter.get("/returns", async (req: Request, res: Response) => {
  try {
    const returns = await service.getReturns();
    return res.status(200).json({ status: "success", returns });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /admin/release-escrow
adminOrdersRouter.post("/release-escrow", async (req: Request, res: Response) => {
  try {
    const { orderId, adminId } = req.body;
    if (!orderId || !adminId) {
      return res.status(400).json({ error: "orderId and adminId are required." });
    }
    const result = await service.releaseEscrowAdmin(orderId, adminId);
    return res.status(200).json({ status: "success", result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /admin/freeze-escrow
adminOrdersRouter.post("/freeze-escrow", async (req: Request, res: Response) => {
  try {
    const { orderId, adminId } = req.body;
    if (!orderId || !adminId) {
      return res.status(400).json({ error: "orderId and adminId are required." });
    }
    const result = await service.freezeEscrow(orderId, adminId);
    return res.status(200).json({ status: "success", result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});
