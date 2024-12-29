import { KVNamespace } from "@cloudflare/workers-types";

export const runtime = "edge"; // Ensure this runs at the edge

export async function GET(request: Request, context: { env: { AI: any; MY_KV_2: KVNamespace } }) {
  // Prepare the input for the AI model
  const input = { prompt: "What is the origin of the phrase Hello, World?" };

  // Ensure that the AI environment variable exists
  const aiModel = context.env.AI;

  if (!aiModel) {
    return new Response(
      JSON.stringify({ error: "AI model is not available." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Run the AI model
    const aiResponse = await aiModel.run("@cf/meta/llama-3.1-8b-instruct", input);

    // Access Cloudflare KV Namespace
    const myKv = context.env.MY_KV_2;

    if (!myKv) {
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
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "An error occurred while processing the AI model.", details: error }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
