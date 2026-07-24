"use client";

import { Button, Field, Input, Toast } from "@r1c/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

type AuthMode = "login" | "register";

type FieldErrors = {
  email?: string;
  password?: string;
  username?: string;
};

export type AuthFormProps = {
  mode: AuthMode;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearError(field: keyof FieldErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setApiError(undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const username = String(data.get("username") ?? "").trim();
    const nextErrors: FieldErrors = {};

    if (!isLogin && !username) {
      nextErrors.username = "Required field";
    }

    if (!email) {
      nextErrors.email = "Required field";
    } else if (!emailPattern.test(email)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!password) {
      nextErrors.password = "Required field";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setApiError(undefined);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        isLogin ? "/api/auth/login" : "/api/auth/register",
        {
          body: JSON.stringify({
            email,
            password,
            ...(!isLogin && { username }),
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        },
      );
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Authentication failed");
      }

      router.push(isLogin ? "/articles" : "/login");
      router.refresh();
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Authentication service is unavailable",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {apiError && (
        <Toast
          className="auth-toast"
          description={apiError}
          title={isLogin ? "Sign-in Failed!" : "Sign-up Failed!"}
          variant="error"
        />
      )}

      <section className="auth-card" aria-labelledby={`${mode}-title`}>
        <header className="auth-card__header">
          <h1 className="auth-card__title" id={`${mode}-title`}>
            {isLogin ? "Sign in" : "Sign up"}
          </h1>
        </header>

        <div className="auth-card__body">
          <form className="auth-form" noValidate onSubmit={handleSubmit}>
            {!isLogin && (
              <Field
                error={errors.username}
                htmlFor="username"
                label="Username"
              >
                <Input
                  autoComplete="username"
                  id="username"
                  disabled={isSubmitting}
                  invalid={Boolean(errors.username)}
                  name="username"
                  onChange={() => clearError("username")}
                  placeholder="Enter your username"
                />
              </Field>
            )}

            <Field error={errors.email} htmlFor="email" label="Email">
              <Input
                autoComplete="email"
                disabled={isSubmitting}
                id="email"
                invalid={Boolean(errors.email)}
                name="email"
                onChange={() => clearError("email")}
                placeholder="Enter your email"
                type="email"
              />
            </Field>

            <Field
              error={errors.password}
              htmlFor="password"
              label="Password"
            >
              <Input
                autoComplete={isLogin ? "current-password" : "new-password"}
                disabled={isSubmitting}
                id="password"
                invalid={Boolean(errors.password)}
                name="password"
                onChange={() => clearError("password")}
                placeholder="Enter your password"
                type="password"
              />
            </Field>

            <Button
              className="auth-form__submit"
              loading={isSubmitting}
              type="submit"
            >
              {isLogin ? "Sign in" : "Sign up"}
            </Button>

            <p className="auth-form__switch">
              <span>
                {isLogin
                  ? "Don’t have an account?"
                  : "Have an account?"}
              </span>
              <Link
                className="auth-form__link"
                href={isLogin ? "/register" : "/login"}
              >
                {isLogin ? "Sign up now" : "Sign in"}
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
