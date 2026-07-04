// Order Tracking definitions
export interface TrackingCoordinates {
  latitude: number;
  longitude: number;
}

export interface OrderTrackingEvent {
  id: string;
  orderId: string;
  status: string;
  message: string;
  coordinates?: TrackingCoordinates;
  createdAt: Date;
}
