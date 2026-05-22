// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../App.css";
// import ShopNow from "./ShopNow";
import { useAuth } from "../context/AuthContext";
import { incrementReceiverViewApi } from "../api/api";

import { FaShareAlt } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { recordDonationApi, hasDonatedApi } from "../api/api";
import Cookies from "js-cookie"; 


export default function ProductDetail({ excelData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [askNameModal, setAskNameModal] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  /* -------------------------------------------------------------
        GET RECEIVER BY FIRESTORE ID
  ------------------------------------------------------------- */
  const receiver =
    excelData.find((item) => item.id === id) ||
    excelData.find((item) => item.receiverId === id);

  const imageUrl =
    receiver?.ImageResolved || receiver?.imageFile || "/images/default.png";

  const shareTitle = receiver?.name || "Donifi Profile";
  const shareDesc =
    receiver?.problemDescription?.slice(0, 120) + "..." ||
    "Support real people through Donifi.";
  const shareUrl = window.location.href;

  /* -------------------------------------------------------------
        REDIRECT SHARED LINKS
  ------------------------------------------------------------- */
  useEffect(() => {
    const isShared =
      new URLSearchParams(location.search).get("shared") === "true";
    if (isShared) {
      try {
        localStorage.setItem(
          "donifi_shared_visit",
          JSON.stringify({ ts: Date.now() })
        );
      } catch (e) {}

      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);

  /* -------------------------------------------------------------
        UNIQUE VIEW TRACKING
  ------------------------------------------------------------- */
  

  useEffect(() => {
  if (!receiver) return;
  if (!user || !user.phone) return;

  const profileId = receiver.receiverId || receiver.id || id;
  if (!profileId) return;

  incrementReceiverViewApi(profileId, user.phone);
}, [receiver, user, id]);



  /* -------------------------------------------------------------
        SHARE HANDLER
  ------------------------------------------------------------- */
  const handleShare = async () => {
    if (!receiver) return;

    const docId = receiver.id || receiver.receiverId || id;
    const slug =
      receiver.slug ||
      (receiver.name && receiver.name.toLowerCase().replace(/\s+/g, "-")) ||
      "";

    const shareUrl = `${window.location.origin}/product/${encodeURIComponent(
      docId
    )}/${encodeURIComponent(slug)}?shared=true`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Check out ${receiver.name} on Donifi`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.warn("Share failed", err);
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    } catch {
      prompt("Copy this link:", shareUrl);
    }
  };
  

  /* -------------------------------------------------------------
        UI
  ------------------------------------------------------------- */
  if (!receiver) {
    return (
      <div className="text-center mt-5 pt-5">
        <h4>Receiver not found.</h4>
        <button
          className="btn btn-outline-gold mt-3"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>
    );
  }
//console.log(receiver);
  return (
    <>
      {/* ---------------------------------------------------------
            OPEN GRAPH META TAGS (DYNAMIC)
      ---------------------------------------------------------- */}
      <Helmet>
        <title>{shareTitle}</title>

        {/* Standard OG tags */}
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareDesc} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={shareTitle} />
        <meta name="twitter:description" content={shareDesc} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>

      <div className="container pb-5 mt-3 receiver-details">



        {/* BACK BUTTON */}
        {/* BACK BUTTON */}

{/* BACK BUTTON ROW */}
<div
  style={{
    marginBottom: "16px",
    display: "flex",
    alignItems: "center"
  }}
>
  <button
    onClick={() => navigate("/", { replace: true })}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",

      padding: window.innerWidth < 768 ? "6px 10px" : "6px 14px",
      fontSize: window.innerWidth < 768 ? "13px" : "14px",
      fontWeight: 600,

      backgroundColor: "#ffffff",
      border: "1px solid #d0d0d0",
      borderRadius: "999px",
      color: "#333",

      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.18)"
    }}
  >
    <span style={{ fontSize: "18px", lineHeight: 1 }}>←</span>
    {window.innerWidth >= 768 && "Back"}
  </button>
</div>

        <div className="row g-4">
          {/* LEFT SIDE */}
          <div className="col-md-5 text-center">
            <img
              src={imageUrl}
              alt={receiver.name}
              className="img-fluid rounded-4 shadow detail-image"
              style={{ maxHeight: 420, objectFit: "contain" }}
              loading="lazy"
              onError={(e) => (e.target.src = "/images/default.png")}
            />

            <div className="mt-3 text-muted">
              {receiver.views || 0} People Supported
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-7 text-start d-flex flex-column justify-content-start">
            {/* Title + Share */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 className="receiver-title mb-0">{receiver.name}</h1>

              <div
                className="share-btn-detail"
                onClick={handleShare}
                title="Share Profile"
              >
                <FaShareAlt size={20} />
              </div>
            </div>

            <h5 className="mb-2">Problem</h5>

            <p className="text-muted mb-4">
              {receiver.problemDescription ||
                "No problem description provided."}
            </p>
            <p
  style={{
    fontSize: "13px",
    color: "#666",
    marginBottom: "10px"
  }}
>
  Contributions are directed to support the beneficiary.
</p>

           <button
  className="btn btn-gold"
  //onClick={() => setShowUpiModal(true)}
  onClick={async () => {

  if (!user?.phone) return;

  try {
    const { hasDonated } = await hasDonatedApi(user.phone);

    // If donated before → directly record new donation
    if (hasDonated) {

      await recordDonationApi(
        receiver.receiverId || receiver.id,
        {
          Phone: user.phone,
          Name: user.name || "",
          IsAnonymous: !user.name
        }
      );

      setShowUpiModal(true);
      return;
    }

    // First ever donation → ask name
    setDonorName("");
    setIsAnonymous(false);
    setAskNameModal(true);

  } catch (err) {
    console.error("Donation check failed", err);
    alert("Something went wrong. Please try again.");
  }
}}
  style={{
    padding: "10px 28px",
    fontSize: "15px",
    fontWeight: 600,
    borderRadius: "999px",
    width: "fit-content",
    alignSelf: "flex-start",
    transition: "all 0.2s ease"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-1px)";
    e.currentTarget.style.boxShadow =
      "0 6px 16px rgba(0,0,0,0.18)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow =
      "0 2px 6px rgba(0,0,0,0.15)";
  }}
>
  Pay Now
</button>

            {/* <div className="d-flex justify-content-end mt-auto">
              <ShopNow receiver={receiver} />
            </div> */}
          </div>
        </div>
       {askNameModal && (
  <div
    onClick={() => setAskNameModal(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(6px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 7000
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#fff",
        padding: "32px",
        borderRadius: "24px",
        width: "90%",
        maxWidth: "420px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        position: "relative"
      }}
    >
      {/* CLOSE BUTTON */}
      <div
        onClick={() => setAskNameModal(false)}
        style={{
          position: "absolute",
          top: "14px",
          right: "16px",
          cursor: "pointer",
          fontSize: "18px",
          color: "#777"
        }}
      >
        ✕
      </div>

      <h4 style={{ fontWeight: 600 }}>
        May we know your name?
      </h4>

      <p style={{
        fontSize: "14px",
        color: "#6b7280",
        marginTop: "6px",
        marginBottom: "14px"
      }}>
        Sharing your name helps the beneficiary feel grateful.
        You may choose to stay anonymous if you prefer.
      </p>

      <input
        type="text"
        value={isAnonymous ? "" : donorName}
        onChange={(e) => setDonorName(e.target.value)}
        placeholder="Enter your name"
        disabled={isAnonymous}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "14px",
          border: "1px solid #e5e7eb",
          background: isAnonymous ? "#f3f4f6" : "#fff"
        }}
      />

      <div style={{ marginTop: "14px", fontSize: "14px" }}>
        <label style={{ cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={() => {
              const next = !isAnonymous;
              setIsAnonymous(next);
              if (next) setDonorName("");
            }}
            style={{ marginRight: "6px" }}
          />
          I prefer to donate anonymously
        </label>
      </div>

      <button
        style={{
          width: "100%",
          marginTop: "18px",
          padding: "14px",
          borderRadius: "16px",
          border: "none",
          background: "linear-gradient(135deg,#f97316,#f59e0b)",
          color: "#fff",
          fontWeight: 600,
          fontSize: "15px"
        }}
        onClick={async () => {

          if (!isAnonymous && !donorName.trim()) {
            alert("Please enter your name or choose anonymous.");
            return;
          }

         await recordDonationApi(
  receiver.receiverId || receiver.id,
  {
    Phone: user.phone,
    Name: isAnonymous ? "" : donorName.trim(),   // <-- NEVER send null
    IsAnonymous: isAnonymous
  }
);

          // 🔥 Update frontend user
          // 🔥 Properly update user in context
if (!isAnonymous && donorName.trim()) {

  const updatedUser = {
    ...user,
    name: donorName.trim()
  };

  // Update cookie
  Cookies.set("donifi_user", JSON.stringify(updatedUser), {
  expires: 365,
  sameSite: "Lax"
});

setUser(updatedUser);

  // IMPORTANT: update auth state
  window.location.reload(); 
}

          setAskNameModal(false);
          setShowUpiModal(true);
        }}
      >
        Submit & Continue
      </button>
    </div>
  </div>
)}
        {/* ================= UPI MODAL ================= */}
{/* ================= LIGHT PREMIUM DONATION MODAL ================= */}
{showUpiModal && (
  <div
    onClick={() => setShowUpiModal(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(6px)",
      zIndex: 6000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "14px"
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxWidth: "500px",
        maxHeight: "92vh",
        overflowY: "auto",
        borderRadius: "26px",
        background: "#ffffff",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        animation: "modalPop 0.3s ease",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "28px 22px 18px",
          textAlign: "center",
          background: "linear-gradient(135deg,#fef9f3,#fff7ed)",
          borderTopLeftRadius: "26px",
          borderTopRightRadius: "26px",
          position: "relative"
        }}
      >
        <div
          onClick={() => setShowUpiModal(false)}
          style={{
            position: "absolute",
            top: "16px",
            right: "18px",
            cursor: "pointer",
            fontSize: "18px",
            color: "#555"
          }}
        >
          ✕
        </div>

        <h2
          style={{
            fontWeight: 700,
            fontSize: "clamp(20px,4vw,26px)",
            marginBottom: "8px",
            color: "#111827"
          }}
        >
          Donate to {receiver.name}
        </h2>

        <div
          style={{
            fontSize: "14px",
            color: "#6b7280"
          }}
        >
          Your contribution is securely transferred to the beneficiary’s account.
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: "22px" }}>

       {/* CONTACT SECTION */}
{receiver.phone && (
  <div
    style={{
      background: "#f8fafc",
      borderRadius: "18px",
      padding: "20px",
      marginBottom: "24px",
      textAlign: "center",
      border: "1px solid #e5e7eb"
    }}
  >
    <div
      style={{
        fontSize: "13px",
        color: "#6b7280",
        marginBottom: "8px"
      }}
    >
      For additional information, you may reach out to the beneficiary directly.
    </div>

    <div
      style={{
        fontSize: "20px",
        fontWeight: 700,
        color: "#111827",
        marginBottom: "12px"
      }}
    >
      {receiver.phone}
    </div>

    <a
      href={`tel:${receiver.phone}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "10px 24px",
        borderRadius: "999px",
        background: "#ffffff",
        border: "1px solid #d1d5db",
        color: "#111827",
        fontSize: "14px",
        fontWeight: 600,
        textDecoration: "none",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f3f4f6";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#ffffff";
      }}
    >
      📞 Call
    </a>
  </div>
)}
        {/* QR SECTION */}
        {receiver.qrCodeUrl && (
          <div
            style={{
              background: "#f9fafb",
              borderRadius: "22px",
              padding: "22px",
              textAlign: "center",
              marginBottom: "20px"
            }}
          >
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "14px",
                color: "#111827"
              }}
            >
              Scan the QR code below to complete your donation
            </div>

            <img
              src={receiver.qrCodeUrl}
              alt="QR Code"
              style={{
                width: "min(220px, 80%)",
                borderRadius: "16px",
                background: "#fff",
                padding: "10px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
              }}
            />
          </div>
        )}

        {/* UPI ID */}
        {receiver.upiId && (
          <div
            style={{
              background: "#ecfdf5",
              borderRadius: "16px",
              padding: "14px",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: 600,
              border: "1px solid #a7f3d0",
              marginBottom: "22px",
              color: "#065f46"
            }}
          >
            UPI ID: {receiver.upiId}
          </div>
        )}

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setShowUpiModal(false)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "18px",
            border: "none",
            background:
              "linear-gradient(135deg,#f97316,#f59e0b)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "15px",
            boxShadow: "0 10px 25px rgba(249,115,22,0.35)"
          }}
        >
          Close
        </button>
      </div>

      <style>
        {`
          @keyframes modalPop {
            from { transform: scale(0.94); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  </div>
)}
      </div>
    </>
  );
}
