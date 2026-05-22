
import { useEffect, useState } from "react";

export default function HeroCarousel() {
  const slides = [
  {
    img: "/images/hero-brand.jpg",
    alt: "Helping students through scholarships",
    title: "India’s Trusted Scholarship Platform",
    text: "Supporting deserving students with trust, dignity, and transparency",
    btn: "Explore Scholarships"
  },
  {
    img: "/images/hero1.jpg",
    alt: "Helping students achieve their education goals",
    title: "Students still need your support",
    text: "Support students whose dreams depend on education",
    btn: "Sponsor Now"
  },
  {
    img: "/images/hero2.jpg",
    alt: "Empowering students through scholarship funding",
    title: "Small help. Real future.",
    text: "Verified scholarship requests from deserving students",
    btn: "Provide Scholarship"
  },
  {
    img: "/images/hero3.jpg",
    alt: "Connecting sponsors with students in need",
    title: "Give education. Change lives.",
    text: "Your support can create a brighter future for students",
    btn: "Help a Student"
  }
];

  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* ===== Responsive resize handling ===== */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ===== Auto slide ===== */
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const scrollToDonate = () => {
    document
      .getElementById("donor-grid-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  /* ================= STYLES ================= */

  const containerStyle = {
  width: "100%",
  height: isMobile ? "62vh" : "90vh", // ✅ FIXED HEIGHT
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  margin: isMobile ? "0 auto" : "-1rem auto 0"
};



  const imageStyle = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${slides[index].img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transform: isMobile ? "scale(1.03)" : "scale(1.08)",
    filter: "brightness(1.05) contrast(1.05)",
    transition: "all 1.8s ease-in-out",
    willChange: "transform"
  };

  const gradientOverlay = {
  position: "absolute",
  inset: 0,
  background: isMobile
    ? "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.65) 100%)"
    : "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0) 100%)",
  pointerEvents: "none"
};


  const contentStyle = {
    position: "relative",
    zIndex: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: isMobile ? "flex-end" : "center",
    padding: isMobile ? "1.5rem" : "4rem",
    maxWidth: isMobile ? "100%" : "650px",
    textAlign: isMobile ? "center" : "left",
    color: "#fff"
  };

  const titleStyle = {
    fontSize: isMobile ? "1.8rem" : "3rem",
    fontWeight: 800,
    lineHeight: 1.2,
    textShadow: "0 4px 15px rgba(0,0,0,0.45)"
  };

  const textStyle = {
    fontSize: isMobile ? "1rem" : "1.2rem",
    margin: isMobile ? "0.8rem 0 1.2rem" : "1rem 0 1.8rem",
    opacity: 0.95,
    textShadow: "0 2px 10px rgba(0,0,0,0.35)"
  };

  const buttonStyle = {
    alignSelf: isMobile ? "center" : "flex-start",
    padding: isMobile ? "8px 18px" : undefined,
    fontSize: isMobile ? "0.95rem" : undefined
  };

  return (
    <div style={containerStyle}>
       {/* Hidden image for ALT text */}
  <img
    src={slides[index].img}
    alt={slides[index].alt}
    style={{
      position: "absolute",
      width: "1px",
      height: "1px",
      opacity: 0,
      pointerEvents: "none"
    }}
  />
      {/* Background image */}
      <div style={imageStyle} />

      {/* Gradient overlay */}
      <div style={gradientOverlay} />

      {/* Content */}
      <div style={contentStyle}>
        <h1 style={titleStyle}>{slides[index].title}</h1>
        <p style={textStyle}>{slides[index].text}</p>
        <button
          className="btn btn-gold"
          style={buttonStyle}
          onClick={scrollToDonate}
        >
          {slides[index].btn}
        </button>
      </div>
    </div>
  );
}
