import * as z from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message limit it 1000 characters only"),
});

export type ContactSchema = z.infer<typeof contactSchema>;
