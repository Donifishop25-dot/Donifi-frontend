import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Wait until cookie/user is restored
  if (loading) {
    return null; // or loader
  }

  // ❌ Not logged in
  if (!user) {
    const redirect = encodeURIComponent(
      location.pathname + location.search
    );
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  // ❌ Logged in but role mismatch (ADMIN check)
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
}
