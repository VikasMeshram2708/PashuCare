"use server";

import {
  contactSchema,
  ContactSchema,
} from "@/app/(root)/contact/contact-schema";
import { ContactEmailTemplate } from "@/app/email-templates";
import { resend } from "@/lib/resend-instance";
import { render } from "@react-email/render";
import z from "zod";

export async function sendContactMail(_prevState: unknown, formData: FormData) {
  try {
    const data: ContactSchema = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    const parsed = contactSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid payload",
        errors: z.flattenError(parsed.error).fieldErrors,
      };
    }

    const { email, name } = parsed.data;

    //  IMPORTANT: render() is async
    const html = await render(ContactEmailTemplate({ firstName: name }));

    const { data: mailData, error } = await resend.emails.send({
      from: "PashuCare <no-reply@pashucare.com>",
      to: email,
      subject: "We’ve received your message — PashuCare",
      html,
    });

    if (error) {
      return {
        success: false,
        message: "Failed to send email",
      };
    }

    return {
      success: true,
      message: "Confirmation email sent",
      metadata: { mailData },
    };
  } catch (error) {
    console.error("sendContactMail error:", error);
    return {
      success: false,
      message: "Something went wrong while sending the email",
    };
  }
}
