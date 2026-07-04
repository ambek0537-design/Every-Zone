// Orders Module Event Definitions
export interface OrderEvent {
  eventName: "ORDER_CREATED" | "PAYMENT_RECEIVED" | "ORDER_PROCESSING" | "ORDER_SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "REFUND_APPROVED" | "ESCROW_RELEASED";
  orderId: string;
  timestamp: Date;
  metadata?: any;
}
