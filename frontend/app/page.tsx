import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            <div>
              <span className="chip">ATS-Powered • HR-Grade Insights</span>
              <h1
                className="display-5"
                style={{ marginTop: "1rem", marginBottom: "1rem" }}
              >
                AI-Powered Resume Analyzer
              </h1>
              <p className="lead">
                Upload your resume and get instant ATS scoring, formatting
                feedback, and personalized improvement suggestions.
              </p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <Link href="/upload" className="btn btn-accent btn-lg">
                  <i
                    className="bi bi-upload"
                    style={{ marginRight: "0.5rem" }}
                  ></i>
                  Upload Resume (PDF)
                </Link>
                <Link href="/features" className="btn btn-outline-light btn-lg">
                  <i
                    className="bi bi-eye"
                    style={{ marginRight: "0.5rem" }}
                  ></i>
                  Explore Features
                </Link>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "1.5rem",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span className="icon-circle" style={{ marginBottom: 0 }}>
                    <i
                      className="bi bi-graph-up"
                      style={{ color: "var(--accent)" }}
                    ></i>
                  </span>
                  <small>Instant ATS Score</small>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span className="icon-circle" style={{ marginBottom: 0 }}>
                    <i
                      className="bi bi-magic"
                      style={{ color: "var(--accent)" }}
                    ></i>
                  </span>
                  <small>Smart Suggestions</small>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span className="icon-circle" style={{ marginBottom: 0 }}>
                    <i
                      className="bi bi-check2-circle"
                      style={{ color: "var(--accent)" }}
                    ></i>
                  </span>
                  <small>ATS Friendly</small>
                </div>
              </div>
            </div>
            <div className="gradient-border">
              <div className="mock-score">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h5 style={{ margin: 0 }}>ATS Score</h5>
                  <span
                    style={{
                      background: "#e5e7eb",
                      color: "#0f172a",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                    }}
                  >
                    Demo
                  </span>
                </div>
                <div
                  className="display-5"
                  style={{ color: "var(--accent)", marginBottom: "0.5rem" }}
                >
                  78/100
                </div>
                <div className="text-secondary">Keyword Match: 62%</div>
                <div
                  style={{
                    marginTop: "1rem",
                    height: "10px",
                    background: "var(--card-bg)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "62%",
                      height: "100%",
                      background: "var(--accent-2)",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  <div>
                    <small>Keywords</small>
                    <div
                      style={{
                        height: "6px",
                        background: "var(--card-bg)",
                        borderRadius: "4px",
                        marginTop: "0.25rem",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "72%",
                          height: "100%",
                          background: "#10b981",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <small>Structure</small>
                    <div
                      style={{
                        height: "6px",
                        background: "var(--card-bg)",
                        borderRadius: "4px",
                        marginTop: "0.25rem",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "70%",
                          height: "100%",
                          background: "#3b82f6",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <small>Formatting</small>
                    <div
                      style={{
                        height: "6px",
                        background: "var(--card-bg)",
                        borderRadius: "4px",
                        marginTop: "0.25rem",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "68%",
                          height: "100%",
                          background: "#eab308",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <small>Language</small>
                    <div
                      style={{
                        height: "6px",
                        background: "var(--card-bg)",
                        borderRadius: "4px",
                        marginTop: "0.25rem",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "60%",
                          height: "100%",
                          background: "#ef4444",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>How It Works</h2>
          <p className="text-secondary">
            A simple, transparent ATS analysis pipeline.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              marginTop: "1rem",
            }}
          >
            <div className="card-soft">
              <div className="icon-circle" style={{ marginBottom: "1rem" }}>
                <i
                  className="bi bi-upload"
                  style={{ color: "var(--accent)", fontSize: "1.5rem" }}
                ></i>
              </div>
              <h5>Upload Resume (PDF)</h5>
              <p className="text-secondary" style={{ marginBottom: 0 }}>
                Securely upload your PDF resume. We extract text with high
                fidelity.
              </p>
            </div>
            <div className="card-soft">
              <div className="icon-circle" style={{ marginBottom: "1rem" }}>
                <i
                  className="bi bi-cpu"
                  style={{ color: "var(--accent)", fontSize: "1.5rem" }}
                ></i>
              </div>
              <h5>NLP Parsing</h5>
              <p className="text-secondary" style={{ marginBottom: 0 }}>
                Experience, Skills, Projects, Education – structured with
                rule-based NLP.
              </p>
            </div>
            <div className="card-soft">
              <div className="icon-circle" style={{ marginBottom: "1rem" }}>
                <i
                  className="bi bi-graph-up-arrow"
                  style={{ color: "var(--accent)", fontSize: "1.5rem" }}
                ></i>
              </div>
              <h5>ATS Scoring</h5>
              <p className="text-secondary" style={{ marginBottom: 0 }}>
                We grade keywords, structure, formatting, and language quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card-soft" style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "1rem" }}>
              Ready to transform your resume?
            </h3>
            <Link href="/upload" className="btn btn-accent btn-lg">
              <i
                className="bi bi-cloud-arrow-up"
                style={{ marginRight: "0.5rem" }}
              ></i>
              Upload Resume Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
