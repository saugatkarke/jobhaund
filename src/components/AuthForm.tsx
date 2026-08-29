"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

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
    if (result) setError(result.message || "Could not sign in.");
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
      <form className="space-y-3" onSubmit={onPassword}>
        <label className="block text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            className="field"
          />
        </label>
        <button type="submit" className="btn-primary w-full" disabled={pending}>
          Sign in
        </button>
      </form>
      <button
        type="button"
        className="btn-secondary w-full"
        disabled={pending || !email}
        onClick={onMagic}
      >
        Email me a magic link
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {notice ? <p className="text-sm text-[var(--muted)]">{notice}</p> : null}
      <p className="text-sm text-[var(--muted)]">
        <Link href="/signup">Create an account</Link>
        {" · "}
        <Link href="/forgot-password">Forgot password</Link>
      </p>
    </div>
  );
}

export function SignupForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const { error: result } = await authClient.signUp.email({
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      callbackURL: "/account",
    });
    setPending(false);
    if (result) setError(result.message || "Could not create account.");
  }

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <label className="block text-sm">
        Name
        <input name="name" required className="field" />
      </label>
      <label className="block text-sm">
        Email
        <input name="email" type="email" required className="field" />
      </label>
      <label className="block text-sm">
        Password
        <input name="password" type="password" required minLength={8} className="field" />
      </label>
      <button type="submit" className="btn-primary w-full" disabled={pending}>
        Create account
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <p className="text-sm text-[var(--muted)]">
        Already have an account? <Link href="/login">Sign in</Link>
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
    <form className="space-y-3" onSubmit={onSubmit}>
      <label className="block text-sm">
        Email
        <input name="email" type="email" required className="field" />
      </label>
      <button type="submit" className="btn-primary w-full" disabled={pending}>
        Send reset link
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {notice ? <p className="text-sm text-[var(--muted)]">{notice}</p> : null}
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
    <form className="space-y-3" onSubmit={onSubmit}>
      <label className="block text-sm">
        New password
        <input name="password" type="password" required minLength={8} className="field" />
      </label>
      <button type="submit" className="btn-primary w-full" disabled={pending}>
        Set new password
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
