import { PlanType } from "@/features/subscription/types";

export const PLANS = [
  {
    id: PlanType.FREE,
    title: "Free Trial",
    price: "₹0",
    duration: "/30 days",
    features: [
      "Full access to all features",
      "30 days risk-free trial",
      "Email support",
    ],
    highlighted: false,
  },
  {
    id: PlanType.PRO,
    title: "Monthly Plan",
    price: "₹4,999",
    duration: "/month",
    features: [
      "Unlimited access to all features",
      "Full CNC management tools",
      "Real-time production tracking",
      "Priority 24/7 technical support",
      "Advanced analytics dashboard",
    ],
    highlighted: true,
  },
];
