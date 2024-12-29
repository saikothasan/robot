import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        Cloudflare AI Tools
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* AI Image Generator */}
        <Link href="/tools/ai-image-generator">
          <a className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
            <img
              src="/images/ai-image-icon.svg"
              alt="AI Image Generator"
              className="w-16 h-16 mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              AI Image Generator
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Generate stunning AI images based on your prompt.
            </p>
            <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md transition-colors hover:bg-blue-700 focus:outline-none">
              Start Generating
            </button>
          </a>
        </Link>

        {/* Text Generator */}
        <Link href="/tools/text-generator">
          <a className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
            <img
              src="/images/text-generator-icon.svg"
              alt="Text Generator"
              className="w-16 h-16 mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Text Generator
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Generate creative content, stories, and more with AI.
            </p>
            <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md transition-colors hover:bg-blue-700 focus:outline-none">
              Start Generating
            </button>
          </a>
        </Link>

        {/* Sentiment Analyzer */}
        <Link href="/tools/sentiment-analyzer">
          <a className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
            <img
              src="/images/sentiment-analyzer-icon.svg"
              alt="Sentiment Analyzer"
              className="w-16 h-16 mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Sentiment Analyzer
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Analyze the sentiment of your text inputs.
            </p>
            <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md transition-colors hover:bg-blue-700 focus:outline-none">
              Start Analyzing
            </button>
          </a>
        </Link>
      </div>
    </div>
  );
}
