export const runtime = "edge";

import { DATING_AI_CONTEXT } from "@/utils/ai-config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, data } = await req.json();
    const context = data?.context || "";

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userContent = lastMessage?.content || "";

    // Combine system instruction with context
    const systemInstruction = `${DATING_AI_CONTEXT}\n\n${context}`;

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: userContent,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            if (chunk.text) {
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ content: chunk.text })}\n\n`
                )
              );
            }
          }
          controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return new Response("Error generating response", { status: 500 });
  }
}
