import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { login, getToken } from "../api/client";

export default function HireSyncLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (getToken()) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 font-sans text-black">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-neutral-200 bg-white p-8">
        <div className="mb-6 text-[26px] font-extrabold tracking-wide text-[#7A1315]">HIRESYNC</div>
        <label className="mb-4 block text-sm font-semibold">
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-neutral-300 px-3 py-2 font-normal"
          />
        </label>
        <label className="mb-6 block text-sm font-semibold">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-neutral-300 px-3 py-2 font-normal"
          />
        </label>
        {error && (
          <p role="alert" className="mb-4 text-sm text-[#7A1315]">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#7A1315] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {submitting ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}
