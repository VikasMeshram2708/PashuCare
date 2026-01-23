"use server";

import { ContactTemplate } from "@/email-templates/contact-template";
import { resend } from "@/lib/resend-instance";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Please enter a valid email"),
});

export async function sendContactMail(input: unknown) {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid payload",
      errors: z.prettifyError(parsed.error),
    };
  }

  const { name, email } = parsed.data;

  try {
    const { data, error } = await resend.emails.send({
      from: "PashuCare <support@pashucare.com>",
      to: [email],
      subject: `New contact request from ${name}`,
      react: ContactTemplate({ name }),
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Mail sent", data };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}
