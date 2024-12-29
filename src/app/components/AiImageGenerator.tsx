"use client";
import { useState, ChangeEvent } from "react";

// Define the expected structure of the response data
interface GenerateImageResponse {
  imageUrl?: string;
  error?: string;
}

// Define types for the component's state
interface AiImageGeneratorState {
  prompt: string;
  imageUrl: string;
  loading: boolean;
  error: string;
}

export default function AiImageGenerator() {
  // Set the initial state with appropriate types
  const [state, setState] = useState<AiImageGeneratorState>({
    prompt: "",
    imageUrl: "",
    loading: false,
    error: "",
  });

  // Destructure state for easy access
  const { prompt, imageUrl, loading, error } = state;

  // Function to handle image generation
  const generateImage = async () => {
    setState({ ...state, loading: true, error: "" });
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      // Explicitly type the response data
      const data: GenerateImageResponse = await res.json();

      if (res.ok && data.imageUrl) {
        setState({ ...state, imageUrl: data.imageUrl });
      } else {
        throw new Error(data.error || "Failed to generate image.");
      }
    } catch (err: any) {
      setState({ ...state, error: err.message || "An error occurred." });
    } finally {
      setState({ ...state, loading: false });
    }
  };

  // Handle input change for prompt
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, prompt: e.target.value });
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        placeholder="Enter your prompt"
        value={prompt}
        onChange={handleInputChange}
      />
      <button
        onClick={generateImage}
        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {loading && (
        <div className="mt-4 flex justify-center">
          <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full h-12 w-12"></div>
        </div>
      )}

      {imageUrl && (
        <div className="mt-4">
          <img
            src={imageUrl}
            alt="Generated AI Image"
            className="rounded-md w-full h-auto"
          />
        </div>
      )}
    </div>
  );
}
