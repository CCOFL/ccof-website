"use client";

import { useState } from "react";
import { Button } from "./Button";

type Status = "idle" | "submitting" | "success" | "error";

/** "Follow our launch" email capture for visitors not ready to give (brief §5). */
export function EmailCapture({ onDark = false }: { onDark?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setMessage("You're on the list — we'll share launch news soon.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please email us instead.");
    }
  }

  const labelColor = onDark ? "text-cream/80" : "text-muted";

  if (status === "success") {
    return (
      <p
        className={`flex items-center gap-2 text-base font-medium ${
          onDark ? "text-cream" : "text-sage"
        }`}
        role="status"
      >
        <CheckIcon /> {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md" noValidate>
      <label htmlFor="follow-email" className={`mb-2 block text-sm ${labelColor}`}>
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="follow-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-describedby={status === "error" ? "follow-error" : undefined}
          className="min-h-[44px] flex-1 rounded-full border border-line bg-white px-5 py-2.5 text-ink placeholder:text-muted/60 focus:border-sage focus:outline-none"
        />
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Joining…" : "Follow our launch"}
        </Button>
      </div>
      {status === "error" && (
        <p id="follow-error" className="mt-2 text-sm text-red-700" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.15" />
      <path
        d="M7 12.5l3 3 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
