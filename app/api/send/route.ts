import { resend } from "@/lib/resend-instance";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await resend.emails.send({
      to: "margotkim358@gmail.com",
      subject: "Testing",
      from: "support@pashucare.com",
      html: "<h1>hello, world!</h1>",
    });
    console.log("res", res);
    return NextResponse.json({
      success: "Mail sent",
      result: {
        res,
      },
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong.",
    });
  }
}
