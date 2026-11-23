export type LoginResult = { kind: "ok" } | { kind: "mfa_required" } | { kind: "locked" } | { kind: "bad_credentials" };
export type MfaResult = { kind: "ok" } | { kind: "bad_code" } | { kind: "expired" } | { kind: "locked" };

export async function login(email: string, password: string): Promise<LoginResult> {
  const res = await fetch("/api/login", { method: "POST", body: JSON.stringify({ email, password }) });
  return res.json();
}

export async function verifyMfa(code: string): Promise<MfaResult> {
  const res = await fetch("/api/login/mfa", { method: "POST", body: JSON.stringify({ code }) });
  return res.json();
}

export async function resendCode(): Promise<void> {
  await fetch("/api/login/mfa/resend", { method: "POST" });
}
