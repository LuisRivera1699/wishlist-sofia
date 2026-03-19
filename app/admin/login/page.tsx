"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Escribe tu contraseña"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, isAdmin, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-disco-cream">
        <p className="font-body text-disco-gray">Cargando...</p>
      </div>
    );
  }

  if (isAdmin) {
    router.replace("/admin");
    return null;
  }

  async function onSubmit(data: LoginForm) {
    setError(null);
    try {
      await signIn(data.email, data.password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-disco-beige/40 p-4">
      <motion.div
        className="w-full max-w-sm bg-disco-cream rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-display text-2xl text-disco-deep text-center mb-6">
          Admin
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block font-body text-sm font-medium text-disco-deep mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full rounded-xl border border-disco-gray/30 bg-white px-4 py-2 font-body text-disco-deep"
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block font-body text-sm font-medium text-disco-deep mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full rounded-xl border border-disco-gray/30 bg-white px-4 py-2 font-body text-disco-deep"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-disco-deep text-disco-cream font-body font-medium py-3 hover:bg-disco-soft transition-colors"
          >
            Entrar
          </button>
        </form>
      </motion.div>
    </div>
  );
}
