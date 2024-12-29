"use client";

import { useState } from "react";

export default function AiToolPage() {
  const [streamedResponse, setStreamedResponse] = useState<string>(""); // To store the streamed text
  const [loading, setLoading] = useState<boolean>(false); // To manage the loading state

  const handleSubmit = async () => {
    setLoading(true);
    setStreamedResponse("");

    const eventSource = new EventSource("/api/ai-tool");

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);

      if (parsedData.error) {
        console.error(parsedData.error);
        eventSource.close();
        setLoading(false);
        return;
      }

      setStreamedResponse((prev) => prev + parsedData);
    };

    eventSource.onerror = () => {
      console.error("Error in streaming response.");
      eventSource.close();
      setLoading(false);
    };

    eventSource.onopen = () => {
      console.log("Connection opened for streaming...");
    };

    eventSource.onclose = () => {
      console.log("Connection closed.");
      setLoading(false);
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-white text-center">AI Tool with Streaming</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Ask the AI</h2>
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Generating Response..." : "Generate Response"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800">AI Response:</h3>
        <pre className="whitespace-pre-wrap text-gray-600 mt-2">{streamedResponse}</pre>
      </div>
    </div>
  );
}
