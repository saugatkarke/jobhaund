export function appTrustedOrigins(
  urls: Array<string | undefined> = [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ],
): string[] {
  return [
    ...new Set(
      urls
        .map((url) => String(url || "").trim().replace(/\/$/, ""))
        .filter(Boolean),
    ),
  ];
}
