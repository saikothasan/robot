import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge"; // Ensure this runs at the edge

export async function GET(request: Request) {
  const context = getRequestContext();
  const input = { prompt: "What is the origin of the phrase Hello, World?" };

  // Call the AI model
  const answer = await context.env.AI.run(
    "@cf/meta/llama-3.1-8b-instruct", // Adjust with the model you have access to
    input
  );

  // Interact with KV store
  const myKv = context.env.MY_KV_2; // Access KV Namespace MY_KV_2
  await myKv.put("ai_answer", JSON.stringify(answer)); // Store AI response in KV

  // Retrieve and return stored AI response
  const storedAnswer = await myKv.get("ai_answer");

  return new Response(
    JSON.stringify({
      aiAnswer: answer,
      storedAnswer: storedAnswer,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
