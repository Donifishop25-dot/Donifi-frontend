// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    new URLSearchParams(location.search).get("redirect") || "/";

  function setVal(key, value) {
    if (key === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!name || !/^[A-Za-z ]+$/.test(name)) {
      return setErr("Enter valid name (letters only)");
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return setErr("Enter valid email");
    }
    if (!/^\d{10}$/.test(phone)) {
      return setErr("Phone must be 10 digits");
    }

    setLoading(true);

    try {
      await signup({ name, email, phone });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErr(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <div className="card p-4">
        <h3 className="mb-3">Sign up</h3>

        <form onSubmit={handleSubmit}>
          <label>Full name</label>
          <input
            className="form-control mb-2"
            value={form.name}
            onChange={(e) => setVal("name", e.target.value)}
            placeholder="Enter your full name"
          />

          <label>Email</label>
          <input
            className="form-control mb-2"
            value={form.email}
            onChange={(e) => setVal("email", e.target.value)}
            placeholder="Enter your email"
            type="email"
          />

          <label>Phone</label>
          <input
            className="form-control mb-2"
            value={form.phone}
            onChange={(e) => setVal("phone", e.target.value)}
            placeholder="10-digit phone number"
            maxLength={10}
          />

          {err && <div className="text-danger mb-2">{err}</div>}

          <button className="btn btn-gold w-100" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
