import { Resend } from "resend";
import { env } from "@/app/env";

export const resend = new Resend(env.RESEND_API_KEY);
