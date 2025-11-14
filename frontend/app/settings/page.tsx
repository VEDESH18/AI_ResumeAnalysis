import { UserProfile } from "@clerk/nextjs";

export default function Settings() {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Account Settings
        </h1>
        <UserProfile
          appearance={{ elements: { rootBox: "w-full", card: "w-full" } }}
        />
      </div>
    </main>
  );
}
