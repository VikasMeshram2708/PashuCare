/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { client } from "../../chat/[id]/route";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Parse the incoming FormData from the request
    const formData = await req.formData();
    const file = formData.get("report-file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 },
      );
    }

    // Convert File to Buffer for OpenAI SDK
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a temporary file path
    const tempPath = `/tmp/${file.name}`;
    fs.writeFileSync(tempPath, buffer);

    const file_object = await client.files.create({
      file: fs.createReadStream(tempPath),
      purpose: "file-extract" as any,
    });

    const file_content = await (
      await client.files.content(file_object.id)
    ).text();

    // Clean up temp file
    fs.unlinkSync(tempPath);

    const stream = await client.chat.completions.create({
      model: "kimi-k2.5",
      messages: [
        {
          role: "system",
          content: `You are an expert veterinary AI assistant specializing in analyzing pet medical reports, lab results, and diagnostic images. 
          
Your analysis should include:
1. **Summary** - Brief overview of what the report shows
2. **Key Findings** - Important values, measurements, or observations
3. **Interpretation** - What these findings mean for the pet's health
4. **Recommendations** - Suggested next steps, treatments, or lifestyle changes
5. **Red Flags** - Any urgent concerns that need immediate veterinary attention

Be thorough but clear. Use medical terminology appropriately but explain it for pet owners. Always include a disclaimer that this is AI-assisted analysis and not a replacement for professional veterinary consultation.`,
        },
        {
          role: "user",
          content: `Please analyze the following pet medical report.

${file_content}

Include:
1. Summary
2. Key Findings
3. Interpretation
4. Recommendations
5. Red Flags

Note: Explain medical terms in simple language.`,
        },
      ],
      temperature: 1, // Slightly lower for more consistent medical analysis
      max_tokens: 4096,
      stream: true,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Stream processing error:", error);
          controller.error(error);
        }
      },
      cancel() {
        console.log("Client disconnected from stream");
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to analyze report",
      },
      { status: 500 },
    );
  }
}
