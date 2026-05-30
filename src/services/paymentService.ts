import { axiosInstance } from '@/app/api/axios';

export interface CreateOrderRequest {
  tenantId: string;
  planId: string;
}

export interface CreateOrderResponse {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface ActivateFreePlanRequest {
  tenantId: string;
  planId: string;
}

export interface VerifyPaymentRequest {
  paymentId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export const paymentService = {
  createOrder: async (data: CreateOrderRequest) => {
    const res = await axiosInstance.post<{
      success: boolean;
      data: CreateOrderResponse;
    }>('/payment/create-order', data);
    return res.data;
  },

  verifyPayment: async (data: VerifyPaymentRequest) => {
    const res = await axiosInstance.post<{
      success: boolean;
      data: { subscriptionId: string };
    }>('/payment/verify', data);
    return res.data;
  },

  retryPayment: async (paymentId: string) => {
    const res = await axiosInstance.post<{
      success: boolean;
      data: CreateOrderResponse;
    }>(`/payment/retry/${paymentId}`);
    return res.data;
  },

  activateFreePlan: async (data: ActivateFreePlanRequest) => {
    const res = await axiosInstance.post<{
      success: boolean;
      data: { subscriptionId: string };
    }>('/payment/activate-free', data);
    return res.data;
  },

  getLatestPending: async () => {
    const res = await axiosInstance.get<{
      success: boolean;
      data: { id: string } | null;
    }>('/payment/latest-pending');
    return res.data;
  },
};
