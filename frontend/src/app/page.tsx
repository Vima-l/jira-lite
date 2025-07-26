'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      // redirect based on role
      if (data.role === "ADMIN") router.push("/admin");
      else if (data.role === "TESTER") router.push("/tester");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-64">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
        <p className="text-center text-sm">
          Dont have an account? <span className="text-blue-600 underline cursor-pointer" onClick={() => router.push("/register")}>Register?</span>
        </p>
      </form>
    </main>
  );
}
