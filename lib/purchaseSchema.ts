import { z } from "zod";

export const purchaseFormSchema = z.object({
  name: z.string().min(1, "Escribe tu nombre"),
  message: z.string().optional(),
});

export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;
