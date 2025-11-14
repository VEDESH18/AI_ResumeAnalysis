import type { Metadata } from "next";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Resume Analyzer",
  description:
    "Analyze your resume with AI-powered ATS scoring and suggestions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
          />
        </head>
        <body>
          <header className="fixed-top" style={{ width: "100%" }}>
            <nav
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 0",
                maxWidth: "1200px",
                margin: "0 auto",
                paddingLeft: "1rem",
                paddingRight: "1rem",
              }}
            >
              <Link
                href="/"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  textDecoration: "none",
                  color: "#e5e7eb",
                }}
              >
                AI <span className="brand-grad">Resume Analyzer</span>
              </Link>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  gap: "2rem",
                  margin: 0,
                  padding: 0,
                  alignItems: "center",
                }}
              >
                <li>
                  <Link
                    href="/"
                    style={{ color: "#e5e7eb", textDecoration: "none" }}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features"
                    style={{ color: "#e5e7eb", textDecoration: "none" }}
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/upload"
                    style={{ color: "#e5e7eb", textDecoration: "none" }}
                  >
                    Upload
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    style={{ color: "#e5e7eb", textDecoration: "none" }}
                  >
                    Contact
                  </Link>
                </li>
                <SignedOut>
                  <li>
                    <SignInButton mode="modal">
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: "#e5e7eb",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                        }}
                      >
                        Sign In
                      </button>
                    </SignInButton>
                  </li>
                  <li>
                    <SignUpButton mode="modal">
                      <button
                        className="btn-accent"
                        style={{ fontSize: "0.875rem" }}
                      >
                        Sign Up
                      </button>
                    </SignUpButton>
                  </li>
                </SignedOut>
                <SignedIn>
                  <li>
                    <Link
                      href="/settings"
                      style={{ color: "#e5e7eb", textDecoration: "none" }}
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <UserButton afterSignOutUrl="/" />
                  </li>
                </SignedIn>
              </ul>
            </nav>
          </header>
          <main style={{ paddingTop: "80px" }}>{children}</main>
          <footer>
            <div
              className="container"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <span style={{ fontWeight: "bold" }}>AI Resume Analyzer</span>
                <span className="text-secondary"> © 2025</span>
              </div>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  gap: "2rem",
                  margin: 0,
                  padding: 0,
                }}
              >
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/features">Features</Link>
                </li>
                <li>
                  <Link href="/upload">Upload</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
              <div style={{ display: "flex", gap: "1rem" }}>
                <a
                  href="#"
                  aria-label="twitter"
                  style={{ color: "#c7d2fe", textDecoration: "none" }}
                >
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a
                  href="#"
                  aria-label="linkedin"
                  style={{ color: "#c7d2fe", textDecoration: "none" }}
                >
                  <i className="bi bi-linkedin"></i>
                </a>
                <a
                  href="#"
                  aria-label="github"
                  style={{ color: "#c7d2fe", textDecoration: "none" }}
                >
                  <i className="bi bi-github"></i>
                </a>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
