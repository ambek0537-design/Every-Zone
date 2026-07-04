// Data Transfer Objects
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
}

export interface UpdateOrderStatusDto {
  status: string;
  paymentStatus?: string;
}
