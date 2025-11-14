"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface AnalysisResult {
  atsScore: number;
  keywordMatch: number;
  subScores: Record<string, number>;
  sections: Record<string, string>;
  contacts: string[];
  skills: string[];
  keywords: string[];
  issues: string[];
  suggestions: string[];
  formattingTips: string[];
}

export default function Upload() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  if (!isLoaded) return <div className="p-8">Loading...</div>;
  if (!user) return router.push("/sign-in");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", jobDescription);

      const response = await fetch("http://localhost:4001/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Analyze Your Resume
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="job-desc"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Job Description (Optional)
                </label>
                <textarea
                  id="job-desc"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  placeholder="Paste the job description here for better keyword matching..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Analyze Resume"}
              </button>
            </form>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-6">
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ATS Score
                  </h3>
                  <span className="text-4xl font-bold text-purple-600">
                    {result.atsScore}/100
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Keyword Match: {result.keywordMatch}%
                </p>
              </div>

              {result.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Skills Found
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.skills.slice(0, 10).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.issues.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Issues</h4>
                  <ul className="space-y-1">
                    {result.issues.slice(0, 5).map((issue, idx) => (
                      <li key={idx} className="text-sm text-red-700">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.suggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Suggestions
                  </h4>
                  <ul className="space-y-1">
                    {result.suggestions.slice(0, 5).map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-green-700">
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
