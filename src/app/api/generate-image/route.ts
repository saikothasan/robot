import { NextRequest, NextResponse } from "next/server";

// Define the route to fetch the generated image from the external API
export async function POST(req: NextRequest) {
  try {
    // Get the prompt from the request body
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Make the request to the external API
    const response = await fetch(`https://silent-lab.aicodegen.workers.dev/?prompt=${encodeURIComponent(prompt)}`);
    
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }

    // Convert the response into a Blob (binary data for the image)
    const imageBlob = await response.blob();
    
    // Convert Blob into a URL to send back to the client
    const imageUrl = URL.createObjectURL(imageBlob);
    
    // Return the image URL to the client
    return NextResponse.json({ imageUrl });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
