import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { registerSchema } from "./schema";
import type { RegisterFormValues } from "./schema";
import { apiPost } from "../../lib/apiClient";

type UserResponse = {
  id: number;
  email: string;
  full_name: string | null;
};

export default function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    try {
      await apiPost<UserResponse>("/api/v1/register", values);
      setSuccess(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (success) {
    return ( <div className="text-center">
      <p className="text-green-600 mb-2">Account created — you can now log in.</p>
      <a href="/login" className="text-sm underline">Go to login</a>
    </div>)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto space-y-4 p-6">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          {...register("email")}
          className="mt-1 w-full border rounded px-3 py-2"
          type="email"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          {...register("password")}
          className="mt-1 w-full border rounded px-3 py-2"
          type="password"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Full name (optional)</label>
        <input
          {...register("full_name")}
          className="mt-1 w-full border rounded px-3 py-2"
          type="text"
        />
      </div>

      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-slate-800 text-white rounded py-2 disabled:opacity-50"
      >
        {isSubmitting ? "Creating account…" : "Register"}
      </button>
    </form>
  );
}