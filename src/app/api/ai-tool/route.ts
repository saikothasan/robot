// src/app/api/ai-tool/route.ts
import { KVNamespace } from '@cloudflare/workers-types';

export const runtime = "edge"; // Ensure this runs at the edge

export async function GET(request: Request) {
  // You can use the standard Request object, no need for IncomingRequestCf
  const input = { prompt: "What is the origin of the phrase Hello, World?" };

  // Accessing the Cloudflare Workers environment variables
  const context = (await request.cf()) as ExecutionContext; // if needed, but typically request.cf() is not needed

  // Assuming you have access to the Cloudflare AI model in your environment
  const aiResponse = await context.env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct", // Replace with the correct model name
    input
  );

  // Access Cloudflare KV Namespace
  const myKv = context.env.MY_KV_2 as KVNamespace; // Type casting KVNamespace
  await myKv.put("ai_answer", JSON.stringify(aiResponse)); // Store AI response in KV

  // Retrieve stored value from KV
  const storedAnswer = await myKv.get("ai_answer");

  return new Response(
    JSON.stringify({
      aiAnswer: aiResponse,
      storedAnswer: storedAnswer,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
