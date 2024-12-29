import { KVNamespace } from '@cloudflare/workers-types';

export const runtime = "edge"; // Ensure this runs at the edge

export async function GET(request: Request) {
  // Prepare the input for the AI model
  const input = { prompt: "What is the origin of the phrase Hello, World?" };

  // Ensure that the AI environment variable exists before invoking it
  const aiModel = (request.cf() as ExecutionContext)?.env?.AI;

  if (!aiModel) {
    // Return an error if AI is not available
    return new Response(
      JSON.stringify({ error: "AI model is not available." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Assuming AI is a function, we use the optional chaining operator to call it
  const aiResponse = await aiModel?.run(
    "@cf/meta/llama-3.1-8b-instruct", // Replace with actual model
    input
  );

  if (!aiResponse) {
    // Return an error if AI response is empty or undefined
    return new Response(
      JSON.stringify({ error: "Failed to get AI response." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Access Cloudflare KV Namespace (ensuring it's defined)
  const myKv = (request.cf() as ExecutionContext)?.env?.MY_KV_2 as KVNamespace;

  if (!myKv) {
    // Return an error if KV is not available
    return new Response(
      JSON.stringify({ error: "KV store is not available." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Store AI response in KV
  await myKv.put("ai_answer", JSON.stringify(aiResponse));

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
