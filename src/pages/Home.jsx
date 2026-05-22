// src/pages/Home.jsx
import React, { useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import LocationFilter from "../components/LocationFilter";
import HeroCarousel from "../components/HeroCarousel";
import { FaCheckCircle } from "react-icons/fa";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useBookmarks } from "../context/BookmarkContext";
import { useAuth } from "../context/AuthContext";




export default function Home({
  excelData = [],
  currentProducts = [],
  paginate,
  totalPages,
  currentPage,
  onLocationChange
}) {

  const navigate = useNavigate();
  const { toggleBookmark, isBookmarked } = useBookmarks();
const { user } = useAuth();


  /* ================= SCROLL ANIMATIONS ================= */
  useEffect(() => {
    const elements = document.querySelectorAll(".animate");
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">

      {/* ================= PAGE META ================= */}
      <Helmet>
        <title>Donifi – Empower Students Through Scholarships</title>
        <meta
          name="description"
          content="Provide scholarships to deserving students. Support real education needs with dignity."
        />
      </Helmet>

      {/* ================= HERO CAROUSEL ================= */}
<section
  style={{
    //background: "#7da7ff",
    paddingTop: "0",        // ✅ remove extra space
    paddingBottom: "2rem"
  }}
  class="home-banner"
>
  <HeroCarousel />
</section>








      {/* ================= CORE THOUGHT ================= */}
     <section
  className="section-block animate fade-up"
  style={{
    background: "linear-gradient(180deg, #F7FAFF 0%, #FFFFFF 100%)",
    borderRadius: "28px",
    padding: "clamp(2.5rem, 6vw, 4rem)",
    margin: "clamp(2.5rem, 6vw, 4rem) auto",
    maxWidth: "1100px"
  }}
>

 <h2
  className="section-heading"
  style={{
    color: "#0B2A4A",
    fontWeight: 800,
    letterSpacing: "-0.3px",
    marginBottom: "1rem"
  }}
>

    Everyone Believes in the Power of Education
  </h2>

  <p className="section-lead">
    Education is the bridge that lifts students out of hardship and opens doors
to a better life — yet for many, it remains out of reach.
  </p>

  <p className="section-text">
    While our careers move forward, many bright students still struggle to afford
tuition, books, and the basics needed to keep learning.
  </p>
  <div
  style={{
    width: "64px",
    height: "4px",
    background: "#1E6FFF",
    borderRadius: "4px",
    margin: "0.75rem auto 1.5rem"
  }}
/>


</section>

      {/* ================= WHAT IS DONIFI ================= */}
      <section className="section-block animate fade-up">
  <h2 className="section-heading">🤝 What is Donifi?</h2>

  <div className="row mt-4">
    <div className="col-12 col-md-4 mb-3 mb-md-0">
      <div
  className="value-card"
  style={{
    background: "#FFFFFF",
    borderRadius: "20px",
    padding: "1.8rem 1.4rem",
    boxShadow: "0 12px 30px rgba(30,111,255,0.08)",
    border: "1px solid rgba(30,111,255,0.12)",
    height: "100%"
  }}
>

        <h5 style={{ color: "#0B2A4A", fontWeight: 700 }}>
🌱 Local Support</h5>
        <p>Support deserving students from your own community.</p>
      </div>
    </div>

    <div className="col-12 col-md-4 mb-3 mb-md-0">
      <div
  className="value-card"
  style={{
    background: "#FFFFFF",
    borderRadius: "20px",
    padding: "1.8rem 1.4rem",
    boxShadow: "0 12px 30px rgba(30,111,255,0.08)",
    border: "1px solid rgba(30,111,255,0.12)",
    height: "100%"
  }}
>

       <h5 style={{ color: "#0B2A4A", fontWeight: 700 }}>
🤲 Flexible Giving</h5>
        <p>Contribute what you can, when you can.</p>
      </div>
    </div>

    <div className="col-12 col-md-4">
      <div
  className="value-card"
  style={{
    background: "#FFFFFF",
    borderRadius: "20px",
    padding: "1.8rem 1.4rem",
    boxShadow: "0 12px 30px rgba(30,111,255,0.08)",
    border: "1px solid rgba(30,111,255,0.12)",
    height: "100%"
  }}
>

        <h5 style={{ color: "#0B2A4A", fontWeight: 700 }}>
✅ Verified Needs</h5>
        <p>Help reaches real, verified local needs.</p>
      </div>
    </div>
  </div>

  <p className="section-strong mt-4">
    Not donations to strangers. Not faceless charity.
  </p>

  <p className="section-text">
    👉 Help for people you are connected to.
  </p>
</section>



      {/* ================= WHY SPONSOR A STUDENT ================= */}
      <section className="section-block animate fade-up">
  <h2 className="section-heading">🎓 Why Sponsor a Student’s Education?</h2>

  <div className="why-grid">
  <span
  style={{
    background: "#F3F7FF",
    border: "1px solid rgba(30,111,255,0.2)",
    color: "#0B2A4A",
    padding: "12px 18px",
    borderRadius: "14px",
    fontWeight: 600
  }}
>
Education changed your life</span>
  <span
  style={{
    background: "#F3F7FF",
    border: "1px solid rgba(30,111,255,0.2)",
    color: "#0B2A4A",
    padding: "12px 18px",
    borderRadius: "14px",
    fontWeight: 600
  }}
>
Someone believed in you once</span>
  <span
  style={{
    background: "#F3F7FF",
    border: "1px solid rgba(30,111,255,0.2)",
    color: "#0B2A4A",
    padding: "12px 18px",
    borderRadius: "14px",
    fontWeight: 600
  }}
>
A scholarship can transform a future</span>
</div>

  <p className="section-strong mt-3">
    Sponsoring a student is not an obligation.<br />
    It is gratitude in action.
  </p>
</section>


      {/* ================= OUR BELIEF ================= */}
      <section className="section-block animate fade-up">
        <h2 className="section-heading">🌱 Our Belief</h2>

        <p className="section-text">
          If every person sponsors just one student’s education,
          no deserving student in India will be left behind.
        </p>
      </section>

      
      {/* ================= LOCATION DROPDOWNS ================= */}
<section className="container mt-4">
  <h4 className="text-center mb-3">
    Find by Location
  </h4>

  <LocationFilter onChange={onLocationChange} />

</section>


      {/* ================= DONOR GRID (UNCHANGED) ================= */}
      <section id="donor-grid-section" className="products-grid container mt-5">
        <h2 className="section-heading mb-4 text-center">
          People You Can Support
        </h2>

        <div className="row g-4 justify-content-start">
          {currentProducts.length > 0 ? (
            currentProducts.map((item, i) => {
              const rawViews = Number(item.views || 0);
              const percentage = Math.min(100, Math.log10(rawViews + 1) * 12);

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
    padding: "16px",


    border: "1px solid rgba(30,111,255,0.15)",
    boxShadow: "0 12px 28px rgba(30,111,255,0.08)",
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
      title="Verified by Donifi"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 14px",
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        color: "#166534",
        background: "rgba(34,197,94,0.12)",
        border: "1px solid rgba(34,197,94,0.4)",
        borderRadius: "999px"
      }}
    >
      <FaCheckCircle size={12} />
      Verified
    </span>
  ) : (
    <div />
  )}

  {/* BOOKMARK */}
  {user && (
    <div
      onClick={(e) => {
        e.stopPropagation();
        toggleBookmark(item);
      }}
      style={{
        cursor: "pointer",
        background: "#fff",
        borderRadius: "50%",
        padding: "6px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
      }}
      title="Bookmark"
    >
      {isBookmarked(item.receiverId) ? (
        <FaBookmark color="#1E6FFF" size={16} />
      ) : (
        <FaRegBookmark color="#555" size={16} />
      )}
    </div>
  )}
</div>

    


                    {/* IMAGE WRAPPER */}
<div style={{ position: "relative", marginBottom: "10px" }}>
  <img
    src={item.ImageResolved || "/images/default.png"}
    alt={item.name}
    className="img-fluid rounded-3 product-thumb"
    loading="lazy"
    style={{
      background: "#F3F7FF",
      padding: "6px"
    }}
    onError={(e) => (e.target.src = "/images/default.png")}
  />

  
</div>



                  {/* NAME + LOCATION BLOCK */}
<div
  style={{
    textAlign: "center",
    marginBottom: "8px",
    minHeight: "70px"   // keeps cards equal height
  }}
>
  {/* NAME */}
  <div
    className="fw-bold product-title"
    style={{
      color: "#0B2A4A",
      fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
      lineHeight: "1.35",
      wordBreak: "break-word"
    }}
  >
    {item.name}
  </div>

  {/* VILLAGE */}
  {item.village && (
    <div
      style={{
        fontSize: "clamp(0.75rem, 2.2vw, 0.9rem)",
        color: "#64748B",
        marginTop: "4px",
        fontWeight: 500,
        wordBreak: "break-word"
      }}
    >
      📍 {item.village}
      {item.district ? `, ${item.district}` : ""}
    </div>
  )}
</div>


{/* TARGET AMOUNT */}
{item.targetAmount > 0 && (
  <div
    style={{
      marginTop: "8px",
      textAlign: "center",
      fontWeight: 700,
      fontSize: "0.95rem",
      color: "#1E6FFF"
    }}
  >
    Needs ₹{item.targetAmount.toLocaleString("en-IN")}


  </div>
)}


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
            })
          ) : (
            <p className="text-muted mt-4 text-center">
              No matching profiles found.
            </p>
          )}
        </div>
      </section>

    </div>
  );
}
