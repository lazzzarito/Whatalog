"use client";

export default function ErrorBoundary({ error, reset }) {
  return (
    <div style={{ padding: "4rem 2rem", textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Something went wrong</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>{error?.message || "An unexpected error occurred."}</p>
      <button onClick={reset} style={{ padding: "0.75rem 2rem", borderRadius: 30, border: "none", background: "var(--accent-green)", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
        Try again
      </button>
    </div>
  );
}