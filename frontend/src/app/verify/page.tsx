'use client';
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (res.ok) {
      alert("Verified successfully. You can now login.");
      router.push("/");
    } else {
      alert("Incorrect OTP. Try again.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-xl font-semibold">Verify OTP</h1>
      <form onSubmit={handleVerify} className="flex flex-col gap-4 w-64">
        <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} className="border p-2" />
        <button type="submit" className="bg-purple-500 text-white p-2">Verify</button>
      </form>
    </main>
  );
}
