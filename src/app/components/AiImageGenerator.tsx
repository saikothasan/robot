"use client";
import { useState } from "react";

export default function AiImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok && data.imageUrl) {
        setImageUrl(data.imageUrl);  // Use the image URL from the API response
      } else {
        throw new Error(data.error || "Failed to generate image.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        placeholder="Enter your prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
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
