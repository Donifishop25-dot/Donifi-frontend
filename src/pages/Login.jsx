// // src/pages/Login.jsx
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const { loginWithPhone } = useAuth();

//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const navigate = useNavigate();
//   const location = useLocation();

//   const redirectTo =
//     new URLSearchParams(location.search).get("redirect") || "/";

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setErr("");

//     const cleanedPhone = phone.trim();

//     if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
//       return setErr("Enter a valid Indian mobile number");
//     }

//     setLoading(true);
//     try {
//       const user = await loginWithPhone(cleanedPhone);

//       // ✅ ROLE-BASED REDIRECT (DB decides)
//       if (user?.role === "ADMIN") {
//         navigate("/admin", { replace: true });
//       } else {
//         navigate(redirectTo, { replace: true });
//       }
//     } catch (error) {
//       setErr(error.message || "Login failed");
//     }
//     setLoading(false);
//   }

//   return (
//     <div style={{ width: "100%", paddingTop: "80px", paddingBottom: "40px" }}>
//       <button
//         onClick={() => navigate("/")}
//         style={{
//           position: "fixed",
//           top: "90px",
//           left: "16px",
//           zIndex: 50,
//           padding: "6px 14px",
//           borderRadius: "999px",
//           border: "1px solid #d0d0d0",
//           background: "#fff",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.18)"
//         }}
//       >
//         ← Back
//       </button>

//       <div className="card p-4 rounded-4 shadow" style={{ maxWidth: 520, margin: "0 auto" }}>
//         <h3 className="mb-3 fw-bold">Login</h3>

//         <form onSubmit={handleSubmit}>
//           <label className="mb-1">Phone Number</label>
//           <input
//             className="form-control mb-3"
//             maxLength={10}
//             inputMode="numeric"
//             value={phone}
//             onChange={(e) => {
//               const digitsOnly = e.target.value.replace(/\D/g, "");
//               if (digitsOnly.length <= 10) {
//                 setPhone(digitsOnly);
//                 if (err) setErr("");
//               }
//             }}
//             placeholder="Enter your mobile number"
//           />

//           {err && <div className="text-danger mb-3">{err}</div>}

//           <button className="btn btn-gold w-100" disabled={loading}>
//             {loading ? "Checking..." : "Continue"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login({ isMenuOpen }) {

  const { loginWithPhone } = useAuth();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const redirectTo =
    new URLSearchParams(location.search).get("redirect") || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    const cleanedPhone = phone.trim();

    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      return setErr("Enter a valid Indian mobile number");
    }

    setLoading(true);
    try {
      const user = await loginWithPhone(cleanedPhone);

      if (user?.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      setErr(error.message || "Login failed");
    }
    setLoading(false);
  }

  return (
    <div style={{ width: "100%", paddingTop: "80px", paddingBottom: "40px" }}>
      {/* ✅ BACK BUTTON WITH TEXT ALWAYS */}
      {!isMenuOpen && (
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "fixed",
          top: isMobile ? "72px" : "90px",
          left: "16px",
          zIndex: 1000,

          display: "flex",
          alignItems: "center",
          gap: "6px",

          padding: "6px 14px",
          borderRadius: "999px",
          border: "1px solid #d0d0d0",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",

          fontSize: "14px",
          fontWeight: "500",
          color: "#222",
          whiteSpace: "nowrap"
        }}
      >
        ← Back
      </button>
      )}
      

      <div
        className="card p-4 rounded-4 shadow"
        style={{ maxWidth: 520, margin: "0 auto" }}
      >
        <h3 className="mb-3 fw-bold">Login</h3>

        <form onSubmit={handleSubmit}>
          <label className="mb-1">Phone Number</label>

          <input
            className="form-control mb-3"
            maxLength={10}
            inputMode="numeric"
            value={phone}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, "");
              if (digitsOnly.length <= 10) {
                setPhone(digitsOnly);
                if (err) setErr("");
              }
            }}
            placeholder="Enter your mobile number"
          />

          {err && <div className="text-danger mb-3">{err}</div>}

          <button className="btn btn-gold w-100" disabled={loading}>
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
