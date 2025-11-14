import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="px-4 py-20 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          AI Resume Analyzer
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Get instant ATS scoring, keyword optimization, and actionable
          suggestions to land more interviews.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/upload">
            <button className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
              Analyze Your Resume
            </button>
          </Link>
          <Link href="/features">
            <button className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition">
              Learn More
            </button>
          </Link>
        </div>
      </section>

      {/* Features Preview */}
      <section className="px-4 py-16 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">ATS Scoring</h3>
            <p className="text-gray-600">
              Get a comprehensive ATS score based on formatting, keywords, and
              structure.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Keyword Match</h3>
            <p className="text-gray-600">
              See how your resume aligns with job descriptions and industry
              standards.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Suggestions</h3>
            <p className="text-gray-600">
              Receive actionable recommendations to improve your resume.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
