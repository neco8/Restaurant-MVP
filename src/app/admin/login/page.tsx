"use client";

import { useState } from "react";
import { login } from "@/app/admin/login/actions";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const result = await login({ email, password });
    if (result && result.error) {
      setError(result.error);
    }
  };

  return (
    <div>
      <label htmlFor="email">Email</label>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">Password</label>
      <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>Log in</button>
      {error && <p>{error}</p>}
    </div>
  );
}
