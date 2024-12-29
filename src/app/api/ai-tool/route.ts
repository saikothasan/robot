import { IncomingRequestCf } from '@cloudflare/workers-types';

export const runtime = "edge"; // Make sure the function runs at the edge

export async function GET(request: IncomingRequestCf) {
  const context = request.cf;

  const input = { prompt: "What is the origin of the phrase Hello, World?" };

  // Assuming you have access to the Cloudflare AI API in your environment.
  const aiResponse = await context.env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct", // Replace with your actual AI model
    input
  );

  // Access Cloudflare KV Namespace
  const myKv = context.env.MY_KV_2; // Your KV namespace
  await myKv.put("ai_answer", JSON.stringify(aiResponse)); // Store AI response

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
