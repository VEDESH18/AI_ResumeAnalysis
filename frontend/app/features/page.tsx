export default function Features() {
  return (
    <main className="min-h-screen bg-white">
      <section className="px-4 py-16 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-gray-900">Features</h1>

        <div className="space-y-12">
          <div className="border-b pb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              ATS Score Analysis
            </h2>
            <p className="text-gray-600">
              Our AI analyzes your resume against Applicant Tracking System
              (ATS) standards. Get a score from 0-100 and understand what's
              working and what needs improvement.
            </p>
          </div>

          <div className="border-b pb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Keyword Matching
            </h2>
            <p className="text-gray-600">
              Compare your resume against job descriptions. See which keywords
              are missing and receive suggestions to improve your match score.
            </p>
          </div>

          <div className="border-b pb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Formatting Feedback
            </h2>
            <p className="text-gray-600">
              Get detailed feedback on formatting, structure, and readability.
              Learn how to optimize your resume for both humans and machines.
            </p>
          </div>

          <div className="border-b pb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Actionable Suggestions
            </h2>
            <p className="text-gray-600">
              Receive specific, actionable recommendations to improve each
              section of your resume. Prioritized by impact.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Secure & Private
            </h2>
            <p className="text-gray-600">
              Your resume data is encrypted and never shared. We delete it after
              analysis unless you save it.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
