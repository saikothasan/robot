"use client";

import { useState, ChangeEvent } from "react";

interface ApiResponse {
  aiAnswer: string | null;
  storedAnswer: string | null;
}

export default function AiToolPage() {
  const [input, setInput] = useState<string>(""); // Type for input as string
  const [aiAnswer, setAiAnswer] = useState<string | null>(null); // Type as string or null
  const [storedAnswer, setStoredAnswer] = useState<string | null>(null); // Type as string or null
  const [loading, setLoading] = useState<boolean>(false); // Type as boolean

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);

    try {
      const response = await fetch("/api/ai-tool", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response.");
      }

      // Explicitly type the response
      const data: ApiResponse = await response.json();
      setAiAnswer(data.aiAnswer);
      setStoredAnswer(data.storedAnswer);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-white text-center">AI Tool with Cloudflare KV Store</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Ask the AI</h2>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={4}
          value={input}
          onChange={handleInputChange}
          placeholder="Ask something like 'What is the origin of the phrase Hello, World?'"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Response"}
        </button>
      </div>

      {aiAnswer && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800">AI Response:</h3>
          <p className="text-gray-600 mt-2">{aiAnswer}</p>
        </div>
      )}

      {storedAnswer && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800">Stored Answer:</h3>
          <p className="text-gray-600 mt-2">{storedAnswer}</p>
        </div>
      )}
    </div>
  );
}
