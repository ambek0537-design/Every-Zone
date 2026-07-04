// Checkout Flow domain types
export interface CartItemDto {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CheckoutRequestDto {
  buyerId: string;
  vendorId: string;
  items: CartItemDto[];
  shippingAddressId?: string;
  notes?: string;
}
