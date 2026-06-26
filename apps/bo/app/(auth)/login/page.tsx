"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button, Input } from "@repo/ui";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/auth.store";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth.schema";

export default function LoginPage() {
  const router = useRouter();
  const setTokens = useAuthStore((state) => state.setTokens);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ accessToken, refreshToken }) => {
      setTokens(accessToken, refreshToken);
      router.push("/");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">Sign in</h2>
          <p className="text-base-content/60 text-sm">Back Office Management</p>

          {error && (
            <div role="alert" className="alert alert-error alert-sm mt-2">
              <span>{error.message}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit((data) => login(data))}
            className="mt-4 flex flex-col gap-4"
          >
            <Input
              label="Email"
              type="email"
              placeholder="admin@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button type="submit" loading={isPending} className="w-full mt-2">
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
