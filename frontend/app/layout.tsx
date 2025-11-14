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
        <body className="antialiased">
          <header className="flex justify-between items-center p-4 h-16 bg-white shadow-sm border-b">
            <Link href="/" className="font-bold text-xl text-purple-600">
              AI Resume Analyzer
            </Link>
            <nav className="flex gap-6 items-center">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                href="/features"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="/upload"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Upload
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Contact
              </Link>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/settings"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Settings
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </nav>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
