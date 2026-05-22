// src/pages/Account.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkContext";
import { FaCheckCircle, FaBookmark } from "react-icons/fa";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark } = useBookmarks();

  const ITEMS_PER_PAGE = 4;
  const [page, setPage] = useState(1);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const totalPages = Math.ceil(bookmarks.length / ITEMS_PER_PAGE);

  const paginatedBookmarks = bookmarks.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* 🚨 Admin should not see Account */
  useEffect(() => {
    if (!user) return;
    if (user.role === "ADMIN") {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  /* ✅ Reset page if bookmarks shrink */
  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [bookmarks, totalPages, page]);

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f6f8fa" }}>
      {/* ================= TOP NAV ================= */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#f6f8fa",
          padding: "16px 24px"
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            border: "none",
            background: "transparent",
            color: "#0969da",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          ← Back
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="container" style={{ marginTop: "24px" }}>
        <h1
          style={{
            marginBottom: "24px",
            fontSize: "24px",
            fontWeight: 700,
            color: "#24292f"
          }}
        >
          Account
        </h1>

        {/* ================= ACCOUNT OVERVIEW ================= */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #d0d7de",
            borderRadius: "8px",
            padding: "24px"
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
              fontSize: "16px",
              fontWeight: 600
            }}
          >
            Account overview
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              rowGap: "14px",
              fontSize: "14px"
            }}
          >
            <span style={{ color: "#57606a" }}>Login phone</span>
            <span style={{ fontWeight: 600 }}>{user.phone}</span>

            <span style={{ color: "#57606a" }}>Role</span>
            <span style={{ fontWeight: 600 }}>
              {user.role === "ADMIN" ? "Administrator" : "Guest user"}
            </span>
          </div>

          {/* ================= BOOKMARKED PROFILES ================= */}
          <div
            style={{
              marginTop: "32px",
              background: "#ffffff",
              border: "1px solid #d0d7de",
              borderRadius: "8px",
              padding: "24px"
            }}
          >
            <h2
              style={{
                marginBottom: "16px",
                fontSize: "16px",
                fontWeight: 600
              }}
            >
              Bookmarked Profiles
            </h2>

            {bookmarks.length === 0 ? (
              <p style={{ fontSize: "14px", color: "#57606a" }}>
                You haven’t bookmarked any profiles yet.
              </p>
            ) : (
              <>
                {/* 🔹 CARDS GRID */}
                <div className="row g-4 justify-content-start">
                  {paginatedBookmarks.map((item, i) => {
                    const rawViews = Number(item.views || 0);
                    const percentage = Math.min(
                      100,
                      Math.log10(rawViews + 1) * 12
                    );

                    return (
                      <div
                        key={`${item.receiverId}-${i}`}
                        className="col-6 col-sm-6 col-md-4 col-lg-3 d-flex"
                      >
                        <div
                          className="card product-card w-100"


                          onClick={() => navigate(item.seoURL)}
                          style={{
                            cursor: "pointer",
                            background: "#FFFFFF",
                            borderRadius: "22px",
                            padding: "14px",
                            border: "1px solid rgba(30,111,255,0.15)",
                            boxShadow:
                              "0 12px 28px rgba(30,111,255,0.08)",
                            transition: "all 0.25s ease"
                          }}
                        >
                          {/* CARD HEADER ROW */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px"
  }}
>
  {/* VERIFIED BADGE */}
  {item.isApproved && !item.isDisabled ? (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 12px",
        fontSize: "0.7rem",
        fontWeight: 700,
        color: "#1B7F3C",
        background: "rgba(46,204,113,0.18)",
        border: "1px solid rgba(46,204,113,0.45)",
        borderRadius: "999px"
      }}
    >
      <FaCheckCircle size={12} />
      Verified
    </span>
  ) : (
    <div />
  )}

  {/* REMOVE BOOKMARK */}
  <div
    onClick={e => {
      e.stopPropagation();
      toggleBookmark(item);
    }}
    style={{
      background: "#fff",
      borderRadius: "50%",
      padding: "6px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
    }}
  >
    <FaBookmark color="#1E6FFF" size={16} />
  </div>
</div>


                          {/* IMAGE */}
                          <img
                            src={item.ImageResolved || "/images/default.png"}
                            alt={item.name}
                            className="img-fluid rounded-3 mb-2 product-thumb"
                            style={{
                              background: "#F3F7FF",
                              padding: "6px"
                            }}
                            loading="lazy"
                            onError={e =>
                              (e.target.src = "/images/default.png")
                            }
                          />

                          {/* NAME */}
                          <div style={{ textAlign: "center" }}>
                            <div
                              className="fw-bold"
                              style={{
                                color: "#0B2A4A",
                                fontSize: "1rem"
                              }}
                            >
                              {item.name}
                              {/* VILLAGE */}
{item.village && (
  <div
    style={{
      fontSize: "0.82rem",
      color: "#64748B",
      marginTop: "4px",
      fontWeight: 500
    }}
  >
    📍 {item.village}
    {item.district ? `, ${item.district}` : ""}
  </div>
)}

                            </div>

                          </div>

                          {/* TARGET */}
                          {item.targetAmount > 0 && (
                            <div
                              style={{
                                marginTop: "8px",
                                textAlign: "center",
                                fontWeight: 700,
                                color: "#1E6FFF"
                              }}
                            >
                              Needs ₹
                              {item.targetAmount.toLocaleString("en-IN")}
                            </div>
                          )}

                          {/* PROGRESS */}
                          <div style={{ marginTop: 10 }}>
                            <div style={{ fontSize: 13, color: "#555" }}>
                              {rawViews} People Supported
                            </div>
                            <div className="progress-container">
                              <div
                                className="progress-bar"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 🔹 PAGINATION */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "12px",
                      marginTop: "28px"
                    }}
                  >
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      ← Prev
                    </button>

                    <span style={{ fontWeight: 600 }}>
                      Page {page} of {totalPages}
                    </span>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ================= LOGOUT ================= */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid #d8dee4"
            }}
          >
            <button
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                padding: "8px 18px",
                borderRadius: "6px",
                border: "none",
                background: "#cf222e",
                color: "#fff",
                fontWeight: 600
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
