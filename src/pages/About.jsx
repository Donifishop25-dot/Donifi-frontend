// src/pages/About.jsx
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../App.css";
import { Helmet } from "react-helmet-async";

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <div className="about-page">
      <Helmet>
  <title>Donifi – Connect. Contribute. Create Change.</title>
  <meta name="description" content="Discover real stories from real people who need your helping hand." />
</Helmet>


      {/* ----------------------------------------------------------
          HERO SECTION
      ----------------------------------------------------------- */}
      <section style={{ width: "100%", padding: "60px 0" }}>
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="row align-items-center" style={{ display: "flex", flexWrap: "wrap" }}>
            
            {/* LEFT TEXT */}
            <div className="col-lg-6" data-aos="fade-right" style={{ padding: "20px" }}>
              <h1 className="about-hero-title" style={{ fontSize: "38px", fontWeight: "700" }}>
                Every Small Action Creates a Big Change
              </h1>

              <p className="about-hero-subtitle mt-3" style={{ fontSize: "18px", color: "#444" }}>
                Donifi connects everyday shoppers with people who truly need help —
                without asking anyone to donate money.
              </p>

              <a
                href="#how-works-section"
                className="btn btn-gold px-4 py-2 mt-3"
                data-aos="zoom-in"
              >
                Learn How Donifi Works
              </a>
            </div>

            {/* RIGHT IMAGE */}
            <div className="col-lg-6 text-center" data-aos="fade-left" style={{ padding: "20px" }}>
              <img
                src="/images/about-hero.jpg"
                alt="About Donifi"
                className="section-image hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------
          OUR PURPOSE
      ----------------------------------------------------------- */}
      <section className="container about-purpose-section mt-5 pt-4 pb-4">
        <div className="row align-items-center">

          {/* TEXT */}
          <div className="col-lg-6 mb-4" data-aos="fade-right">
            <h2 className="section-heading">Our Purpose</h2>

            <p className="section-text mt-3">Donifi was built with a simple belief:</p>
            <p className="impact-line">“No one should struggle alone when a community can lift them.”</p>

            <p className="section-text mt-3">
              Many people want to help, but not everyone can afford to donate.
              At the same time, thousands of people are fighting for medical support,
              education fees, emergencies, and family struggles.
            </p>

            <p className="section-text mt-3">
              That’s why we created Donifi — a platform where your regular online
              shopping can become life-changing support for someone in need.
            </p>

            <ul className="about-list mt-3">
              <li>You shop normally — nothing extra is charged.</li>
              <li>The store pays us a small commission.</li>
              <li>We forward it to the person you choose.</li>
            </ul>

            <p className="section-text mt-3"><strong>You never pay anything extra.</strong></p>
          </div>

          {/* IMAGE */}
          <div className="col-lg-6" data-aos="fade-left">
            <img
              src="/images/about-who-we-help.jpg"
              className="section-image"
              alt="Who We Help"
            />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------
          HOW DONIFI WORKS
      ----------------------------------------------------------- */}
      <section id="how-works-section" className="how-it-works container text-center mt-5">
        <h2 className="section-heading mb-4">How Donifi Works</h2>

        {/* MOBILE CAROUSEL */}
        <div className="d-md-none">
          <div id="hiwCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">

              {/* CARDS */}
              {[1, 2, 3, 4, 5].map((num, index) => (
                <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={num}>
                  <div className="hiw-box p-4">
                    <div className="hiw-icon">{num}</div>
                    <h4 className="hiw-title">
                      {num === 1 && "Pick Someone to Support"}
                      {num === 2 && "Choose a Shopping Site"}
                      {num === 3 && "Shop Exactly Like You Always Do"}
                      {num === 4 && "After Your Order Is Completed"}
                      {num === 5 && "We Send That Commission"}
                    </h4>

                    <p>
                      {num === 1 && <>Open their card and read their story.<br />This tells us who should receive the support generated from your shopping.</>}
                      {num === 2 && <>Amazon, Flipkart, Myntra and more.<br />You're buying <strong>for yourself</strong>.</>}
                      {num === 3 && <>Same product. Same price. Same checkout.<br />No extra charges.</>}
                      {num === 4 && <>The shopping site pays us a small commission<br />for sending them a customer.</>}
                      {num === 5 && <>It goes to the person/NGO you selected.<br />Not from your wallet.<br />100% store commission.</>}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <button className="carousel-control-prev" type="button" data-bs-target="#hiwCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>

            <button className="carousel-control-next" type="button" data-bs-target="#hiwCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>

          <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>Swipe or use the arrows →</p>
        </div>

        {/* DESKTOP GRID */}
        <div className="d-none d-md-block">
          <div className="row g-4 justify-content-center">
            {[1, 2, 3].map((num) => (
              <div className="col-md-4" key={num}>
                <div className="hiw-box h-100">
                  <div className="hiw-icon">{num}</div>
                  <h4 className="hiw-title">
                    {num === 1 && "Pick Someone to Support"}
                    {num === 2 && "Choose a Shopping Site"}
                    {num === 3 && "Shop Exactly Like You Always Do"}
                  </h4>
                  <p>
                    {num === 1 && "Open their card and read their story. This tells us who should receive the support."}
                    {num === 2 && "Amazon, Flipkart, Myntra and more. You’re buying for yourself."}
                    {num === 3 && "Same product. Same price. No extra charges."}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 justify-content-center mt-1">
            {[4, 5].map((num) => (
              <div className="col-md-4" key={num}>
                <div className="hiw-box h-100">
                  <div className="hiw-icon">{num}</div>
                  <h4 className="hiw-title">
                    {num === 4 && "After Your Order Is Completed"}
                    {num === 5 && "We Send That Commission"}
                  </h4>
                  <p>
                    {num === 4 && "The shopping site pays us a small commission for sending them a customer."}
                    {num === 5 && "It goes to the person/NGO you selected. 100% from the store commission."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------
          WHO WE HELP (GRID)
      ----------------------------------------------------------- */}
      <section className="container about-who-section mt-5 pt-5">
        <div className="text-center" data-aos="fade-up">
          <h2 className="section-heading">Who We Help</h2>
          <p className="section-text mt-3">
            Donifi supports anyone facing genuine challenges:
          </p>
        </div>

        {/* GRID */}
        <div
          className="d-flex flex-wrap justify-content-center align-items-start mt-4"
          style={{ maxWidth: "1100px", margin: "0 auto" }}
        >

          {/* Icons */}
          {[
            { t: "Families in Crisis", i: "https://cdn-icons-png.flaticon.com/512/3021/3021872.png" },
            { t: "Medical Assistance", i: "https://cdn-icons-png.flaticon.com/512/2966/2966486.png" },
            { t: "Students", i: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png" },
            { t: "Seniors", i: "https://cdn-icons-png.flaticon.com/512/12631/12631672.png" },
            { t: "Daily-wage Workers", i: "https://cdn-icons-png.flaticon.com/512/921/921347.png" },
            { t: "Women in Hardship", i: "https://cdn-icons-png.flaticon.com/512/94/94749.png" },
            { t: "People Who Lost Jobs", i: "https://cdn-icons-png.flaticon.com/512/8774/8774591.png" },
            { t: "Orphans & NGOs", i: "https://cdn-icons-png.flaticon.com/512/9648/9648957.png" },
          ].map((item) => (
           <div key={item.t} className="help-item">

              <img src={item.i} style={{ width: "70px", marginBottom: "10px" }} alt={item.t} />
              <h5>{item.t}</h5>
            </div>
          ))}

        </div>

        <p className="section-text mt-4 text-center" data-aos="fade-up">
          If someone needs help — Donifi becomes a bridge between them and people like you.
        </p>
      </section>

     {/* ----------------------------------------------------------
    WHY PEOPLE TRUST US (UPDATED)
----------------------------------------------------------- */}
<section className="trust-section mt-5 pt-5 pb-5">
  <div className="container">

    <h2 className="section-heading mb-5 text-center" data-aos="fade-up">
      Why People Trust Donifi
    </h2>

    <div className="row align-items-center">

      {/* LEFT — POINTS */}
      <div className="col-lg-6" data-aos="fade-right">
        <div className="trust-points">
          {[
            "100% transparency — every profile is real.",
            "No hidden charges — ever.",
            "Your bill never increases.",
            "Real people. Real stories. Real impact.",
            "We verify every profile carefully.",
            "Your clicks genuinely help someone in need."
          ].map((text, i) => (
            <div key={i} className="trust-box shadow-sm">
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — IMAGE */}
      <div className="col-lg-6 text-center" data-aos="fade-left">
        <img
          src="/images/about-trust.jpg"
          alt="Trust & Transparency"
          className="trust-image"
        />
      </div>

    </div>
  </div>
</section>



      {/* ----------------------------------------------------------
          MISSION + VISION
      ----------------------------------------------------------- */}
      <section className="container mission-section mt-5 pt-5 pb-5">

        <div className="row g-4 align-items-center">

          {/* TEXT */}
          <div className="col-lg-6" data-aos="fade-right">
            <h2 className="section-heading">Our Mission</h2>
            <p className="section-text mt-3">
              To create India’s simplest and most transparent helping platform:
            </p>

            <ul className="about-list mt-3">
              <li>Anyone can support someone without spending money</li>
              <li>Needy people receive real support quickly</li>
              <li>Technology is used to create social good</li>
            </ul>

            <p className="section-text mt-3">
              We aim to build a community where kindness flows naturally.
            </p>
          </div>

          {/* IMAGE */}
          <div className="col-lg-6" data-aos="fade-left">
            <img
  src="/images/about-team.jpg"
  alt="Mission Team"
  className="section-image mission-img"
/>

          </div>
        </div>

        {/* VISION */}
        <div className="row mt-5 pt-4 align-items-center">

          <div className="col-lg-6 order-lg-2" data-aos="fade-left">
            <h2 className="section-heading">Our Vision</h2>
            <p className="section-text mt-3">A future where:</p>

            <ul className="about-list mt-3">
              <li>Every online purchase supports someone in need</li>
              <li>Every person with a struggle finds hope</li>
              <li>Helping becomes effortless and universal</li>
            </ul>
          </div>

          <div className="col-lg-6 order-lg-1" data-aos="fade-right">
            <img
              src="/images/about-unique.jpg"
              alt="Our Vision"
              className="section-image"
            />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------
          CTA
      ----------------------------------------------------------- */}
      <section className="cta-bottom text-center mt-5 pt-5 pb-5">
        <h2 className="cta-title" data-aos="fade-up">
          Start exploring real stories today.
        </h2>
        <p className="cta-subtitle mt-2 mb-3" data-aos="fade-up" data-aos-delay="150">
          Your one click can become someone’s happiness.
        </p>

        <a href="/" className="btn btn-gold px-4 py-2 mt-2" data-aos="zoom-in">
          Begin Your Impact
        </a>
      </section>

    </div>
  );
}
