import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  text: z.string().min(1, "Text is required"),
});

const saveChatSchema = z.object({
  message: z.array(messageSchema).min(1, "At least one message is required"),
});

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body: unknown = await req.json();
    console.log("RAW BODY:", body);

    const parsed = saveChatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payload",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // At this point payload is fully validated
    // console.log("VALIDATED PAYLOAD", parsed.data);

    return NextResponse.json({
      success: true,
      message: "Payload is valid",
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
