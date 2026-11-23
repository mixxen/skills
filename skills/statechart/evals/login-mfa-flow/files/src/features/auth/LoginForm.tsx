import { useState } from "react";
import { login, resendCode, verifyMfa } from "./api";

type Step = "form" | "submitting" | "mfa" | "locked";

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  async function submit() {
    setStep("submitting");
    const result = await login(email, password);
    if (result.kind === "ok") return onSuccess();
    if (result.kind === "mfa_required") return setStep("mfa");
    if (result.kind === "locked") return setStep("locked");
    setError("Wrong email or password");
    setStep("form");
  }

  async function submitCode() {
    const result = await verifyMfa(code);
    if (result.kind === "ok") return onSuccess();
    setError("That code didn't work");
  }

  async function resend() {
    await resendCode();
    setCode("");
    setError(null);
  }

  function edit(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setter(e.target.value);
    };
  }

  if (step === "locked") {
    return (
      <p>
        Your account is locked after too many attempts. <a href="/reset-password">Reset your password</a>
      </p>
    );
  }
  if (step === "mfa") {
    return (
      <div>
        <input value={code} onChange={edit(setCode)} maxLength={6} />
        {error && <p role="alert">{error}</p>}
        <button onClick={submitCode}>Verify</button>
        <button onClick={resend}>Send a new code</button>
      </div>
    );
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <input value={email} onChange={edit(setEmail)} />
      <input type="password" value={password} onChange={edit(setPassword)} />
      {error && <p role="alert">{error}</p>}
      <button disabled={step === "submitting"}>Log in</button>
    </form>
  );
}
