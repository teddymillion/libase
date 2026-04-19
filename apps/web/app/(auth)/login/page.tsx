"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/useAuth";

const schema = z.object({
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-slide-up space-y-8">

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-primary-400 rounded-xl mx-auto flex items-center justify-center mb-4">
            <span className="text-2xl">👗</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-neutral-900">Welcome back</h1>
          <p className="text-neutral-500 text-sm">Let&apos;s see what you&apos;re wearing today 👀</p>
        </div>

        <form onSubmit={handleSubmit((d) => login(d.email, d.password))} className="space-y-4">
          <Input label="Email address" placeholder="you@example.com" error={errors.email?.message}    {...register("email")}    type="email" />
          <Input label="Password"      placeholder="Your password"   error={errors.password?.message} {...register("password")} type="password" />

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="mt-2">
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary-400 font-semibold hover:underline">Sign up free</Link>
        </p>

      </div>
    </main>
  );
}
