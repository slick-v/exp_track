import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginSchema } from "./schema";
import type { LoginFormValues } from "./schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    // /login expects OAuth2 form-encoded data, not JSON — see Step 42/44
    const formData = new URLSearchParams();
    formData.append("username", values.email);
    formData.append("password", values.password);

    const res = await fetch(`${API_BASE_URL}/api/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setServerError(data?.detail || "Login failed");
      return;
    }

    onLoginSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto space-y-4 p-6">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input {...register("email")} className="mt-1 w-full border rounded px-3 py-2" type="email" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input {...register("password")} className="mt-1 w-full border rounded px-3 py-2" type="password" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-slate-800 text-white rounded py-2 disabled:opacity-50"
      >
        {isSubmitting ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}