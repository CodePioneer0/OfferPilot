import type { LoginPayload, RegisterPayload } from "@offerpilot/shared";
import { useMemo, useState } from "react";

type AuthMode = "login" | "register";

interface AuthCardProps {
  pending: boolean;
  errorMessage: string | null;
  onSubmit: (mode: AuthMode, payload: RegisterPayload | LoginPayload) => Promise<void>;
}

export function AuthCard({ pending, errorMessage, onSubmit }: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const title = useMemo(
    () => (mode === "register" ? "Build Your Pipeline" : "Welcome Back"),
    [mode]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (mode === "register") {
      await onSubmit("register", {
        name,
        email,
        password
      });
      return;
    }

    await onSubmit("login", {
      email,
      password
    });
  }

  return (
    <section className="auth-card surface animate-rise">
      <p className="eyebrow">OfferPilot</p>
      <h1>{title}</h1>
      <p className="subtitle">Track applications, interviews, and outcomes with recruiter-ready discipline.</p>

      <div className="auth-switch">
        <button
          type="button"
          className={mode === "register" ? "active" : ""}
          onClick={() => setMode("register")}
        >
          Register
        </button>
        <button
          type="button"
          className={mode === "login" ? "active" : ""}
          onClick={() => setMode("login")}
        >
          Login
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <label>
            Full Name
            <input
              required
              minLength={2}
              maxLength={80}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ada Lovelace"
            />
          </label>
        ) : null}

        <label>
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="StrongPass1"
          />
        </label>

        {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

        <button type="submit" disabled={pending}>
          {pending ? "Please wait..." : mode === "register" ? "Create Account" : "Sign In"}
        </button>
      </form>
    </section>
  );
}
