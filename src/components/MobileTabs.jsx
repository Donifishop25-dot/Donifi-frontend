import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaHandHoldingHeart, FaInfoCircle, FaUser } from "react-icons/fa";

export default function MobileTabs() {
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  const tabStyle = (active) => ({
    flex: 1,
    textAlign: "center",
    textDecoration: "none",
    color: active ? "#1e88e5" : "#777",
    fontSize: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "4px",
    gap: "2px",
  });

  const outerWrapper = {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "55px", // ⭐ Like YouTube
    background: "#fff",
    borderTop: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 5000,
  };

  const iconSize = 22; // ⭐ YouTube uses ~22px

  return (
    <div style={outerWrapper} className="d-lg-none">

      {/* HOME */}
      <Link to="/" style={tabStyle(isActive("/"))}>
        <FaHome size={iconSize} />
        <span>Home</span>
      </Link>

      {/* DONATE */}
      <Link
        to="/"
        style={tabStyle(false)}
        onClick={() => {
          setTimeout(() => {
            document.getElementById("donor-grid-section")?.scrollIntoView({ behavior: "smooth" });
          }, 150);
        }}
      >
        <FaHandHoldingHeart size={iconSize} />
        <span>Donate</span>
      </Link>

      {/* ABOUT */}
      {/* <Link to="/about" style={tabStyle(isActive("/about"))}>
        <FaInfoCircle size={iconSize} />
        <span>About</span>
      </Link> */}

      {/* RECEIVER */}
      <Link to="/receiver" style={tabStyle(isActive("/receiver"))}>
        <FaUser size={iconSize} />
        <span>Beneficiary</span>
      </Link>

    </div>
  );
}
