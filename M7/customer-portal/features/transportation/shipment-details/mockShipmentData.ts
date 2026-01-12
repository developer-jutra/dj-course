import type { ShipmentTimelineData } from './shipment-timeline.model';

export const mockShipmentData: ShipmentTimelineData = {
  id: "1234567890",
  trackingId: "9876543210",
  currentStatusIndex: 2, // Currently "In Transit"
  statuses: [
    {
      id: "order-placed",
      name: "Order Placed",
      timestamp: "July 10, 10:00 AM",
      icon: "package",
      completed: true,
      description: "Your order has been confirmed and is being prepared for pickup."
    },
    {
      id: "picked-up",
      name: "Picked Up",
      timestamp: "July 11, 2:00 PM", 
      icon: "box",
      completed: true,
      description: "Package has been picked up from the origin facility and is in our network."
    },
    {
      id: "in-transit",
      name: "In Transit",
      timestamp: "July 12, 9:00 AM",
      icon: "truck",
      completed: false,
      description: "Package is on its way to the destination facility."
    },
    {
      id: "out-for-delivery",
      name: "Out for Delivery",
      timestamp: "July 13, 11:00 AM",
      icon: "truck",
      completed: false,
      description: "Package is out for delivery and will arrive soon."
    },
    {
      id: "delivered",
      name: "Delivered",
      timestamp: "July 13, 1:00 PM",
      icon: "check",
      completed: false,
      description: "Package has been successfully delivered to the recipient."
    }
  ]
};

// Example with different number of statuses
export const shortShipmentData: ShipmentTimelineData = {
  id: "9876543210",
  trackingId: "1234567890",
  currentStatusIndex: 1,
  statuses: [
    {
      id: "order-placed",
      name: "Order Placed",
      timestamp: "July 15, 2:00 PM",
      icon: "package",
      completed: true,
      description: "Your order has been confirmed and is being processed."
    },
    {
      id: "in-transit",
      name: "In Transit", 
      timestamp: "July 16, 8:00 AM",
      icon: "truck",
      completed: false,
      description: "Package is being shipped to you."
    },
    {
      id: "delivered",
      name: "Delivered",
      timestamp: "July 17, 12:00 PM",
      icon: "check",
      completed: false,
      description: "Package will be delivered to your address."
    }
  ]
};

// Example with completed delivery
export const completedShipmentData: ShipmentTimelineData = {
  id: "5555555555",
  trackingId: "COMP123456",
  currentStatusIndex: 4,
  statuses: [
    {
      id: "order-placed",
      name: "Order Placed",
      timestamp: "July 8, 9:00 AM",
      icon: "package",
      completed: true,
      description: "Order confirmed and payment processed."
    },
    {
      id: "picked-up",
      name: "Picked Up",
      timestamp: "July 8, 3:00 PM", 
      icon: "box",
      completed: true,
      description: "Package collected from sender."
    },
    {
      id: "in-transit",
      name: "In Transit",
      timestamp: "July 9, 6:00 AM",
      icon: "truck",
      completed: true,
      description: "Package transported to destination city."
    },
    {
      id: "out-for-delivery",
      name: "Out for Delivery",
      timestamp: "July 10, 9:00 AM",
      icon: "truck",
      completed: true,
      description: "Package loaded for final delivery."
    },
    {
      id: "delivered",
      name: "Delivered",
      timestamp: "July 10, 2:30 PM",
      icon: "check",
      completed: true,
      description: "Package successfully delivered and signed for by recipient."
    }
  ]
};

// Example with early stage shipment
export const earlyStageShipmentData: ShipmentTimelineData = {
  id: "1111111111",
  trackingId: "EARLY789012",
  currentStatusIndex: 0,
  statuses: [
    {
      id: "order-placed",
      name: "Order Placed",
      timestamp: "July 20, 11:30 AM",
      icon: "package",
      completed: false,
      description: "Order received and being prepared for pickup."
    },
    {
      id: "picked-up",
      name: "Pickup Scheduled",
      timestamp: "July 21, 10:00 AM", 
      icon: "box",
      completed: false,
      description: "Pickup scheduled for tomorrow morning."
    },
    {
      id: "in-transit",
      name: "In Transit",
      timestamp: "July 21, 2:00 PM",
      icon: "truck",
      completed: false,
      description: "Package will be in transit to destination."
    },
    {
      id: "delivered",
      name: "Delivered",
      timestamp: "July 22, 5:00 PM",
      icon: "check",
      completed: false,
      description: "Expected delivery by end of day."
    }
  ]
};

// Example with express delivery (fewer steps)
export const expressDeliveryData: ShipmentTimelineData = {
  id: "EXPRESS001",
  trackingId: "EXP987654",
  currentStatusIndex: 2,
  statuses: [
    {
      id: "order-placed",
      name: "Express Order",
      timestamp: "July 18, 1:00 PM",
      icon: "package",
      completed: true,
      description: "Express order confirmed with priority handling."
    },
    {
      id: "in-transit",
      name: "Express Transit",
      timestamp: "July 18, 4:00 PM",
      icon: "truck",
      completed: true,
      description: "Package in express transit network."
    },
    {
      id: "delivered",
      name: "Delivered",
      timestamp: "July 19, 10:00 AM",
      icon: "check",
      completed: false,
      description: "Express delivery scheduled for tomorrow morning."
    }
  ]
};