import { z } from "zod";

export const contributionFormSchema = z.object({
  name: z.string().min(1, "Escribe tu nombre"),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  paymentMethod: z.enum(
    ["Yape Sofía", "Yape Luis", "Interbank Soles", "Interbank dólares"],
    { message: "Elige un método de pago" }
  ),
  proof: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, "Sube tu comprobante")
    .refine(
      (files) => files?.[0]?.type?.startsWith("image/"),
      "El comprobante debe ser una imagen"
    ),
  message: z.string().optional(),
});

export type ContributionFormData = z.infer<typeof contributionFormSchema>;
