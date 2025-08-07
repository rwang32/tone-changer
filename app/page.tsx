"use client";

import { useState } from "react";

export default function HomePage() {
  const [original, setOriginal] = useState("");
  const [tone, setTone] = useState("professional");
  const [rewritten, setRewritten] = useState("");
  const [loading, setLoading] = useState(false);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRewritten("");

    const res = await fetch("/api/tone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original, tone }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ API error:", errorText);
      return;
    }

    const data = await res.json();
    console.log("✅ Rewritten:", data.rewritten);
    setRewritten(data.rewritten);
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">📝 Tone Changer</h1>

      <form onSubmit={submitForm} className="space-y-4">
        <textarea
          placeholder="Paste your message here..."
          rows={6}
          className="w-full p-3 border border-gray-300 rounded"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
        />

        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="casual">Casual</option>
          <option value="assertive">Assertive</option>
          <option value="apologetic">Apologetic</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Rewrite Message
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-600">Rewriting message...</p>}

      {rewritten && (
        <div className="mt-6 bg-gray-600 p-4 rounded border border-gray-300 whitespace-pre-wrap">
          <h2 className="font-semibold mb-2">Rewritten Message:</h2>
          <p>{rewritten}</p>
        </div>
      )}
    </main>
  );
}
