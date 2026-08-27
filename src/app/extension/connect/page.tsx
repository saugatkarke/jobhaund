import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { isAllowedRedirectUri } from "@/lib/crypto-hash";
import { insertAuthCode } from "@/lib/extension-auth";

export const dynamic = "force-dynamic";

export default async function ExtensionConnectPage({
  searchParams,
}: {
  searchParams: Promise<{
    redirect_uri?: string;
    state?: string;
    code_challenge?: string;
    code_challenge_method?: string;
  }>;
}) {
  const q = await searchParams;
  const redirectUri = String(q.redirect_uri || "");
  const state = String(q.state || "");
  const codeChallenge = String(q.code_challenge || "");
  const method = String(q.code_challenge_method || "");

  if (method !== "S256" || !isAllowedRedirectUri(redirectUri) || !state || !codeChallenge) {
    return (
      <main className="mx-auto max-w-lg px-5 py-24">
        <h1 className="text-2xl font-bold">Invalid extension sign-in</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          The redirect URI or PKCE challenge is not allowed.
        </p>
      </main>
    );
  }

  const next = `/extension/connect?${new URLSearchParams({
    redirect_uri: redirectUri,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: method,
  }).toString()}`;

  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  const code = await insertAuthCode({
    userId: session.user.id,
    codeChallenge,
    redirectUri,
    state,
  });
  redirect(`${redirectUri}?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`);
}
