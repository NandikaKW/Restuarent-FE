// services/orderStatusService.ts (NEW FILE)
import { api } from "./api";

// Local fallback explanations for offline/error scenarios
const localStatusExplanations: { [key: string]: string } = {
  // Common statuses with simple explanations
  'pending': 'Order received and waiting for restaurant confirmation.',
  'confirmed': 'Restaurant has accepted your order.',
  'preparing': 'Your food is being prepared now.',
  'cooking': 'Chefs are cooking your meal.',
  'ready': 'Order is ready for pickup/delivery.',
  'out_for_delivery': 'Your food is on its way to you!',
  'delivered': 'Order has been delivered successfully.',
  'completed': 'Order completed. Thank you!',
  'cancelled': 'This order was cancelled.',
  'delayed': 'Order is taking longer than usual.',
  'on_hold': 'Order is temporarily paused.',
  'refunded': 'Order refund has been processed.',
  'failed': 'Order could not be processed.',
  'awaiting_payment': 'Waiting for payment confirmation.',
  'payment_failed': 'Payment was not successful.',
  'scheduled': 'Order is scheduled for later.',
  
  // Additional common statuses
  'processing': 'Order is being processed.',
  'accepted': 'Order accepted by restaurant.',
  'picked_up': 'Driver has picked up your order.',
  'driver_assigned': 'Delivery driver assigned.',
  'quality_check': 'Final quality check in progress.',
};

export const orderStatusService = {
  getExplanation: async (status: string): Promise<string> => {
    try {
      // First try to get from backend
      const response = await api.post("/order-status/explain", { status });
      return response.data.explanation;
    } catch (error) {
      console.log("Using local status explanation due to:", error);
      
      // Use local fallback - try exact match
      const normalizedStatus = status.toLowerCase().trim();
      let explanation = localStatusExplanations[normalizedStatus];
      
      // If no exact match, try partial matching
      if (!explanation) {
        for (const [key, value] of Object.entries(localStatusExplanations)) {
          if (normalizedStatus.includes(key) || key.includes(normalizedStatus)) {
            explanation = value;
            break;
          }
        }
      }
      
      // Final fallback
      if (!explanation) {
        explanation = `Your order status is "${status}". This means it's currently being processed in our system.`;
      }
      
      return explanation;
    }
  }
};