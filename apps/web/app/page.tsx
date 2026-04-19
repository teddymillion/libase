import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="animate-fade-in space-y-6 max-w-sm w-full">

        <div className="w-16 h-16 bg-primary-400 rounded-xl mx-auto flex items-center justify-center">
          <span className="text-3xl">👗</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-neutral-900">
            Your closet,<br />elevated.
          </h1>
          <p className="text-neutral-600 text-base leading-relaxed">
            Discover outfits you never knew you had.<br />
            Style yourself with what you already own.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/signup"
            className="tap-target bg-primary-400 text-white font-semibold rounded-xl px-6 py-3 hover:bg-primary-500 transition-colors"
          >
            Get Started — It&apos;s Free
          </Link>
          <Link
            href="/login"
            className="tap-target text-neutral-600 font-medium text-sm hover:text-neutral-900 transition-colors"
          >
            Already have an account? Sign in
          </Link>
        </div>

      </div>
    </main>
  );
}
