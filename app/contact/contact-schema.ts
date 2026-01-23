import * as z from "zod";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Invalid phone number"),
  address: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type contactSchema = z.infer<typeof contactSchema>;

export default contactSchema;
