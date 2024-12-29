import { NextRequest, NextResponse } from "next/server";

// Define the expected structure of the incoming request body
interface GenerateImageRequest {
  prompt: string;
}

// Define the structure of the response that will be returned
interface GenerateImageResponse {
  imageUrl?: string;
  error?: string;
}

// Define the route to fetch the generated image from the external API
export async function POST(req: NextRequest): Promise<NextResponse<GenerateImageResponse>> {
  try {
    // Get the prompt from the request body and validate its structure
    const { prompt }: GenerateImageRequest = await req.json();

    if (!prompt) {
      return NextResponse.json<GenerateImageResponse>({ error: "Prompt is required" }, { status: 400 });
    }

    // Make the request to the external API
    const response = await fetch(`https://silent-lab.aicodegen.workers.dev/?prompt=${encodeURIComponent(prompt)}`);
    
    if (!response.ok) {
      return NextResponse.json<GenerateImageResponse>({ error: "Failed to generate image" }, { status: 500 });
    }

    // Convert the response into a Blob (binary data for the image)
    const imageBlob = await response.blob();
    
    // Convert Blob into a URL to send back to the client
    const imageUrl = URL.createObjectURL(imageBlob);
    
    // Return the image URL to the client
    return NextResponse.json<GenerateImageResponse>({ imageUrl });

  } catch (error: any) {
    // Handle unexpected errors and provide an appropriate response
    return NextResponse.json<GenerateImageResponse>({ error: error.message }, { status: 500 });
  }
}
