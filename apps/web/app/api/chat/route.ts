import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import * as z from "zod";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";

const chatSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

export async function POST(req: NextRequest) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = await getToken({ template: "convex" });

    if (!token) {
      throw new Error("Missing Convex token");
    }
    const body = await req.json();

    // sanitize
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid payload",
        errors: z.flattenError(parsed.error).fieldErrors,
      });
    }
    const { text } = parsed.data;

    // db operation
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    client.setAuth(token);

    const result = await client.mutation(api.chats.createChat, {
      name: text.substring(0, 40) + (text.length > 40 ? "..." : ""),
      initialMessage: text,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Saved",
        metadata: { data: result },
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Chat API Error:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
