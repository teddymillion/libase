"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/useAuth";

const schema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const { signup, loading, error } = useAuth();
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
          <h1 className="font-display text-2xl font-bold text-neutral-900">Create your account</h1>
          <p className="text-neutral-500 text-sm">Your wardrobe is waiting ✨</p>
        </div>

        <form onSubmit={handleSubmit((d) => signup(d.name, d.email, d.password))} className="space-y-4">
          <Input label="Your name"      placeholder="Abebe"              error={errors.name?.message}     {...register("name")} />
          <Input label="Email address"  placeholder="you@example.com"    error={errors.email?.message}    {...register("email")}    type="email" />
          <Input label="Password"       placeholder="Min. 6 characters"  error={errors.password?.message} {...register("password")} type="password" />

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="mt-2">
            Let&apos;s go 🚀
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-400 font-semibold hover:underline">Sign in</Link>
        </p>

      </div>
    </main>
  );
}
