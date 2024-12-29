import { NextRequest, NextResponse } from "next/server";

// Enable Edge Runtime
export const runtime = "edge";

// Define the expected structure of the incoming request body
interface GenerateImageRequest {
  prompt: string;
}

// Define the structure of the response
interface GenerateImageResponse {
  imageUrl?: string;
  error?: string;
}

// API handler
export async function POST(req: NextRequest): Promise<NextResponse<GenerateImageResponse>> {
  try {
    // Parse the request body
    const { prompt }: GenerateImageRequest = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Call the external API with the provided prompt
    const response = await fetch(
      `https://silent-lab.aicodegen.workers.dev/?prompt=${encodeURIComponent(prompt)}`
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }

    // Parse the response from the external API
    const data: GenerateImageResponse = await response.json();

    if (!data.imageUrl) {
      return NextResponse.json({ error: "No image URL returned by the API" }, { status: 500 });
    }

    // Return the image URL to the client
    return NextResponse.json({ imageUrl: data.imageUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "An unknown error occurred" }, { status: 500 });
  }
}
