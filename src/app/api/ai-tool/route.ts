export const runtime = "edge";

export async function GET(request: Request, context: { env: { AI: any } }) {
  const { AI } = context.env;

  if (!AI) {
    return new Response(
      JSON.stringify({ error: "AI model is not available." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Call the AI model with streaming enabled
    const answer = await AI.run('@cf/meta/llama-3.1-8b-instruct', {
      prompt: "What is the origin of the phrase 'Hello, World'?",
      stream: true
    });

    // Return the streaming response
    return new Response(answer, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error while generating AI response.", details: error }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
