import { Timestamp } from "firebase/firestore";

export const COLLECTIONS = {
  gifts: "wishlist_gifts",
  contributions: "wishlist_contributions",
  purchases: "wishlist_purchases",
} as const;

export type GiftType = "contribution" | "purchase";

export type ContributionStatus = "pending" | "approved" | "rejected";

export interface Gift {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  totalCost: number;
  type?: GiftType;
  purchaseLink?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Purchase {
  id: string;
  giftId: string;
  name: string;
  message: string;
  createdAt: Timestamp;
}

export interface Contribution {
  id: string;
  name: string;
  amount: number;
  paymentMethod: string;
  proofImageUrl: string;
  status: ContributionStatus;
  giftId: string;
  createdAt: Timestamp;
}

export const PAYMENT_METHODS = [
  "Yape Sofía",
  "Yape Luis",
  "Interbank Soles",
  "Interbank dólares",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
