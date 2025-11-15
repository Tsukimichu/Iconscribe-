import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../component/ui/ToastProvider";

function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const { showToast } = useToast();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, token }),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Password updated!", "success");
    } else {
      showToast(data.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold text-center mb-4">Reset Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full border p-3 rounded-lg"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 py-3 rounded-lg font-semibold hover:bg-yellow-600"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
