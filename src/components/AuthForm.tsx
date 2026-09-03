"use client";

import Link from "next/link";
import { FormEvent, useState, type ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { IconKey, IconUser, IconUserPlus } from "@/components/icons";

function AuthLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-black"
    >
      {icon}
      {children}
    </Link>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {hint ? (
        <span className="mt-0.5 block text-xs text-[var(--muted)]">{hint}</span>
      ) : null}
      {children}
    </label>
  );
}

function AuthError({ message }: { message: string }) {
  return <p className="text-sm text-red-600">{message}</p>;
}

function AuthNotice({ message }: { message: string }) {
  return <p className="text-sm text-[var(--muted)]">{message}</p>;
}

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function onPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const { error: result } = await authClient.signIn.email({
      email,
      password: String(form.get("password") || ""),
      callbackURL: nextPath,
    });
    setPending(false);
    if (result) {
      const status = (result as { status?: number }).status;
      if (status === 403) {
        setError("Please verify your email first. We sent you a fresh verification link.");
        return;
      }
      setError(result.message || "Could not sign in.");
    }
  }

  async function onMagic() {
    setError("");
    setNotice("");
    setPending(true);
    const { error: result } = await authClient.signIn.magicLink({
      email,
      callbackURL: nextPath,
    });
    setPending(false);
    if (result) {
      setError("Could not send email.");
      return;
    }
    setNotice("Check your email for a sign-in link. In local dev it may appear in the server log.");
  }

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={onPassword}>
        <Field label="Email">
          <input
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field"
          />
        </Field>
        <Field label="Password">
          <input name="password" type="password" required className="field" />
        </Field>
        <button type="submit" className="btn-primary w-full" disabled={pending}>
          Sign in
        </button>
      </form>
      <div className="flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-[var(--line)]" />
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
          or
        </span>
        <span className="h-px flex-1 bg-[var(--line)]" />
      </div>
      <button
        type="button"
        className="btn-secondary w-full"
        disabled={pending || !email}
        onClick={onMagic}
      >
        Email me a magic link
      </button>
      {error ? <AuthError message={error} /> : null}
      {notice ? <AuthNotice message={notice} /> : null}
      <p className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)]">
        <AuthLink href="/signup" icon={<IconUserPlus className="h-3.5 w-3.5" />}>
          Create an account
        </AuthLink>
        <AuthLink href="/forgot-password" icon={<IconKey className="h-3.5 w-3.5" />}>
          Forgot password
        </AuthLink>
      </p>
    </div>
  );
}

export function SignupForm({ nextPath = "/account" }: { nextPath?: string }) {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setPending(true);
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const { error: result } = await authClient.signUp.email({
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      callbackURL: nextPath,
    });
    setPending(false);
    if (result) {
      setError(result.message || "Could not create account.");
      return;
    }
    setNotice("Account created. Check your inbox and verify your email before signing in.");
    formEl.reset();
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label="Name">
        <input name="name" required className="field" />
      </Field>
      <Field label="Email">
        <input name="email" type="email" required className="field" />
      </Field>
      <Field label="Password" hint="At least 8 characters.">
        <input name="password" type="password" required minLength={8} className="field" />
      </Field>
      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </button>
      {error ? <AuthError message={error} /> : null}
      {notice ? <AuthNotice message={notice} /> : null}
      <p className="flex flex-wrap items-center gap-x-1.5 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)]">
        Already have an account?
        <AuthLink href="/login" icon={<IconUser className="h-3.5 w-3.5" />}>
          Sign in
        </AuthLink>
      </p>
    </form>
  );
}

export function ForgotForm() {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const { error: result } = await authClient.requestPasswordReset({
      email: String(form.get("email") || ""),
      redirectTo: "/reset-password",
    });
    setPending(false);
    if (result) {
      setError("Could not send email.");
      return;
    }
    setNotice("If that email exists, we sent a reset link. In local dev it may appear in the server log.");
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label="Email">
        <input name="email" type="email" required className="field" />
      </Field>
      <button type="submit" className="btn-primary w-full" disabled={pending}>
        Send reset link
      </button>
      {error ? <AuthError message={error} /> : null}
      {notice ? <AuthNotice message={notice} /> : null}
      <p className="border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)]">
        <AuthLink href="/login" icon={<IconUser className="h-3.5 w-3.5" />}>
          Back to sign in
        </AuthLink>
      </p>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const { error: result } = await authClient.resetPassword({
      token,
      newPassword: String(form.get("password") || ""),
    });
    setPending(false);
    if (result) {
      setError(result.message || "Could not reset password.");
      return;
    }
    window.location.href = "/login";
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label="New password" hint="At least 8 characters.">
        <input name="password" type="password" required minLength={8} className="field" />
      </Field>
      <button type="submit" className="btn-primary w-full" disabled={pending}>
        Set new password
      </button>
      {error ? <AuthError message={error} /> : null}
    </form>
  );
}
