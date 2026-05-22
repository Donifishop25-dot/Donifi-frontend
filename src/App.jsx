// src/App.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import * as XLSX from "xlsx";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import "./App.css";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import ReceiverForm from "./pages/ReceiverForm";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
// import About from "./pages/About"; // ✅ NEW

import { slugify } from "./utils/slugify";
import { useAuth } from "./context/AuthContext";

import { getReceivers } from "./api/api";

import { FaUserCircle } from "react-icons/fa";
import MobileTabs from "./components/MobileTabs";
import AdminDashboard from "./pages/AdminDashboard";
import Account from "./pages/Account";
import GlobalLoader from "./components/GlobalLoader";
import { useLoading } from "./context/LoadingContext";




/* ----------------------------------------------
   Lazy Image Loader
------------------------------------------------ */
const LazyImage = ({ src, alt, className, style, priority = false, onClick }) => {
  const imgRef = useRef(null);
  const [visibleSrc, setVisibleSrc] = useState(priority ? src : null);
  const DEFAULT_IMAGE = "/images/default.png";

  useEffect(() => {
    if (visibleSrc || !imgRef.current) return;
    let obs;

    if ("IntersectionObserver" in window) {
      obs = new IntersectionObserver(
        entries => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              setVisibleSrc(src);
              obs.disconnect();
            }
          });
        },
        { rootMargin: "200px" }
      );
      obs.observe(imgRef.current);
    } else {
      setVisibleSrc(src);
    }

    return () => obs && obs.disconnect();
  }, [src, visibleSrc]);

  return (
    <img
      ref={imgRef}
      src={visibleSrc || DEFAULT_IMAGE}
      alt={alt}
      className={className}
      style={style}
      loading={priority ? "eager" : "lazy"}
      onClick={onClick}
      onError={(e) => (e.target.src = DEFAULT_IMAGE)}
    />
  );
};

/* ----------------------------------------------
   Helpers
------------------------------------------------ */
const clean = (s = "") => String(s).trim().toLowerCase();

function resolveImagePath(imageUrl) {
  if (imageUrl && String(imageUrl).startsWith("http")) return imageUrl;
  return "/images/default.png";
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function normalizeKeys(obj) {
  const out = {};
  for (const key in obj) {
    const trimmed = String(key).trim();
    out[trimmed] = obj[key];
    out[trimmed.toLowerCase()] = obj[key];
  }
  return out;
}

/* ----------------------------------------------
   MAIN APP
------------------------------------------------ */
export default function App() {
  const [excelData, setExcelData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [locationFilter, setLocationFilter] = useState({
  state: "",
  district: "",
  mandal: "",
  village: ""
});
const isMobile = window.innerWidth < 992;
const { globalLoading, setGlobalLoading } = useLoading();



  /* ----------------------------------------------
     Process Firestore data
  ---------------------------------------------- */
  function processAndSetData(raw) {
    if (!Array.isArray(raw)) {
      setExcelData([]);
      return;
    }

    const cleaned = raw.filter(r =>
      Object.values(r).some(v => v !== undefined && v !== null && String(v).trim() !== "")
    );

    const mapped = cleaned.map((row, i) => {
      const r = normalizeKeys(row);
      const docId =row.ReceiverId ||row.receiverId ||row.id ||"";
      const name = r.name || `Receiver ${i + 1}`;

      return {
  id: docId,
  receiverId: docId,
  name,
  targetAmount: Number(r.targetamount || 0),
  // ✅ ADD THESE
  isApproved: r.isapproved === true || r.isapproved === "true",
  isDisabled: r.isdisabled === true || r.isdisabled === "true",
  problemDescription: r.problemdescription || "",
  address: r.address || "",
  phone: r.phone || "",
  state: r.state || "",
  district: r.district || "",
  mandal: r.mandal || "",
  village: r.village || "",

  imageFile: r.imageurl || r.imagefile || "",
  ImageResolved: resolveImagePath(r.imageurl || r.imagefile),

  upiId: r.upiid || "",
  qrCodeUrl: r.qrcodeurl || "",  

  views: Number(r.views || 0),

  slug: slugify(name),
  seoURL: `/product/${docId}/${slugify(name)}`
};

    });

    const uniqueMap = new Map();
    mapped.forEach(item => {
      const phoneKey = String(item.phone || "").trim();
      const key = phoneKey || `NO_PHONE_${item.id}`;
      if (!uniqueMap.has(key)) uniqueMap.set(key, item);
    });

    setExcelData(Array.from(uniqueMap.values()));
  }

  async function loadReceivers() {
  try {
    setGlobalLoading(true);   // 🔥 SHOW loader
    const data = await getReceivers();
    processAndSetData(data);
  } catch {
    setExcelData([]);
  } finally {
    setGlobalLoading(false); // ✅ HIDE loader
  }
}



  useEffect(() => { loadReceivers(); }, []);
  useEffect(() => { if (location.pathname === "/") loadReceivers(); }, [location.pathname]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm), 250);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // const filteredProducts = useMemo(() => {
  //   const q = clean(debouncedSearch);
  //   return excelData.filter(p =>
  //     !q ||
  //     (p.name || "").toLowerCase().includes(q) ||
  //     (p.problemDescription || "").toLowerCase().includes(q)
  //   );
  // }, [excelData, debouncedSearch]);

  const filteredProducts = useMemo(() => {
  const q = clean(debouncedSearch);

  return excelData.filter(p => {
    const matchesSearch =
      !q ||
      clean(p.name).includes(q) ||
      clean(p.problemDescription).includes(q);

    const matchesLocation =
      (!locationFilter.state ||
        clean(p.state) === clean(locationFilter.state)) &&
      (!locationFilter.district ||
        clean(p.district) === clean(locationFilter.district)) &&
      (!locationFilter.mandal ||
        clean(p.mandal) === clean(locationFilter.mandal)) &&
      (!locationFilter.village ||
        clean(p.village) === clean(locationFilter.village));

    return matchesSearch && matchesLocation;
  });
}, [excelData, debouncedSearch, locationFilter]);



  const productsPerPage = 100;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, currentPage]);

  const scrollToGrid = () => {
    const sec = document.getElementById("donor-grid-section");
    sec?.scrollIntoView({ behavior: "smooth" });
  };
const menuItemStyle = {
  padding: "12px 14px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500
};

  return (
    <div className="app-wrapper">
      <ScrollToTop />
      <GlobalLoader show={globalLoading} />


      {/* HEADER */}
      <header className="donifi-header fixed-top">
        <div className="donifi-header-inner header-container">


          <div className="donifi-logo" onClick={() => navigate("/")}>
            <img src="/logo.png" alt="Donifi Logo" className="donifi-logo-img" />
          </div>

          <div className="donifi-search">
            <input
              type="text"
              className="donifi-search-input"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                scrollToGrid();
              }}
            />
            <FaSearch className="donifi-search-icon" />
          </div>

          <div
            className="donifi-menu-toggle d-lg-none"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <FaTimes size={22} /> : <FaBars size={22} />}
          </div>

          <nav
            className="donifi-nav d-none d-lg-flex"
            style={{ marginLeft: "70px", marginRight: "40px", gap: "32px", alignItems: "center" }}
          >
            <Link className="donifi-nav-link" to="/">Home</Link>

            <Link
              className="donifi-nav-link"
              to="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
                setTimeout(scrollToGrid, 150);
              }}
            >
              Donate
            </Link>

            {/* ✅ NEW ABOUT LINK */}
            {/* <Link className="donifi-nav-link" to="/about">
              About
            </Link> */}

            <Link className="donifi-nav-link" to="/receiver">Beneficiary</Link>

            {!user && <Link className="donifi-nav-link" to="/login">Login</Link>}

            {/* {user && (
              <FaUserCircle
                size={32}
                color="#1e88e5"
                style={{ cursor: "pointer" }}
                onClick={() => setShowLogoutModal(true)}
              />
            )} */}
            {user && (
  <div style={{ position: "relative" }}>
    {/* <FaUserCircle
  size={32}
  color="#1e88e5"
  style={{ cursor: "pointer" }}
  onClick={() => {
    if (isMobile) {
      navigate("/account");   // ✅ mobile behavior
    } else {
      setShowProfileMenu(prev => !prev); // ✅ desktop dropdown
    }
  }}
/> */}
<FaUserCircle
  size={32}
  color="#1e88e5"
  style={{ cursor: "pointer" }}
  onClick={() => {
    if (isMobile) {
      if (user?.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/account");
      }
    } else {
      setShowProfileMenu(prev => !prev);
    }
  }}
/>


    {showProfileMenu && (
      <div
        style={{
          position: "absolute",
          top: "42px",
          right: 0,
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          width: "180px",
          zIndex: 4000,
          overflow: "hidden"
        }}
      >
        {user.role === "ADMIN" ? (
          <div
            style={menuItemStyle}
            onClick={() => {
              setShowProfileMenu(false);
              navigate("/admin");
            }}
          >
            🛠 Admin Dashboard
          </div>
        ) : (
          <div
            style={menuItemStyle}
            onClick={() => {
              setShowProfileMenu(false);
              navigate("/account");
            }}
          >
            👤 Guest User
          </div>
        )}

        <div style={{ height: 1, background: "#eee" }} />

        <div
          style={{ ...menuItemStyle, color: "#c00" }}
          onClick={() => {
            setShowProfileMenu(false);
            setShowLogoutModal(true);
          }}
        >
          🚪 Logout
        </div>
      </div>
    )}
  </div>
)}

          </nav>
        </div>

        {/* MOBILE MENU */}
        {showMobileMenu && (
          <div className="donifi-mobile-menu d-lg-none">
            <Link
              to="/"
              onClick={() => {
                setShowMobileMenu(false);
                navigate("/");
              }}
            >
              Home
            </Link>

            <Link
              to="/"
              onClick={() => {
                setShowMobileMenu(false);
                navigate("/");
                setTimeout(scrollToGrid, 150);
              }}
            >
              Donate
            </Link>

            {/* ✅ NEW ABOUT LINK IN MOBILE */}
            {/* <Link
              to="/about"
              onClick={() => {
                setShowMobileMenu(false);
                navigate("/about");
              }}
            >
              About
            </Link> */}

            <Link to="/receiver" onClick={() => setShowMobileMenu(false)}>
  Beneficiary
</Link>


            {!user && (
              <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                Login
              </Link>
            )}

            {user && (
  <>
    {/* ✅ VIEW PROFILE */}
    {/* <span
      onClick={() => {
        setShowMobileMenu(false);
        navigate("/account");
      }}
      style={{
        cursor: "pointer",
        padding: "10px 0",
        display: "block",
        fontWeight: 600
      }}
    >
      👤 View Profile
    </span> */}
    
<span
  onClick={() => {
    setShowMobileMenu(false);

    if (user?.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/account");
    }
  }}
  style={{
    cursor: "pointer",
    padding: "10px 0",
    display: "block",
    fontWeight: 600
  }}
>
  {user?.role === "ADMIN" ? "🛠️ Admin Dashboard" : "👤 View Profile"}
</span>

    {/* LOGOUT */}
    <span
      onClick={() => {
        setShowMobileMenu(false);
        setShowLogoutModal(true);
      }}
      style={{
        cursor: "pointer",
        padding: "10px 0",
        display: "block",
        fontWeight: 600,
        color: "#c00"
      }}
    >
    Logout
    </span>
  </>
)}

          </div>
        )}

        {/* LOGOUT MODAL */}
        {showLogoutModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.55)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 3000
            }}
          >
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "15px",
                width: "90%",
                maxWidth: "380px",
                boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
                textAlign: "center"
              }}
            >
              <h4 className="mb-3">Do you want to logout?</h4>

              <button
                className="btn btn-gold w-100 mb-2"
                onClick={() => {
                  logout();
                  setShowLogoutModal(false);
                  navigate("/");
                }}
              >
                Yes, Logout
              </button>

              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ROUTES */}
      <main className="main-content" style={{ paddingTop: 86 }}>
        <Routes>
          <Route
  path="/"
  element={
    <Home
      excelData={excelData}
      currentProducts={currentProducts}
      totalPages={totalPages}
      currentPage={currentPage}
      paginate={(p) => setCurrentPage(p)}
      onLocationChange={(loc) => {
        setCurrentPage(1);        // reset pagination
        setLocationFilter(loc);  // apply filter
      }}
    />
  }
/>


          <Route path="/receiver" element={<ReceiverForm />} />
          <Route path="/login" element={<Login isMenuOpen={showMobileMenu} />}
/>

          {/* <Route path="/about" element={<About />} /> ✅ NEW ROUTE */}
          <Route
  path="/admin"
  element={
    <ProtectedRoute role="ADMIN">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

          <Route
            path="/product/:id/:slug"
            element={
              <ProtectedRoute>
                <ProductDetail excelData={excelData} />
              </ProtectedRoute>
            }
          />
          <Route
  path="/account"
  element={
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  }
/>

        </Routes>
      </main>

       {/* MOBILE BOTTOM NAVIGATION */}
      <MobileTabs />

      {/* FOOTER */}
      <footer className="footer-modern" >
        <div className="container py-5">
          <div className="row g-4">

            {/* LEFT */}
            <div className="col-md-4">
              <img src="/logo.png" alt="Donifi" className="footer-logo" />
              <p className="mt-3 text-light">
                A platform connecting those who can help with those who need help.
              </p>
            </div>

            {/* QUICK LINKS */}
            <div className="col-md-2">
              <h6>Quick Links</h6>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/" onClick={scrollToGrid}>Donate</Link></li>
                {/* <li><Link to="/about">About</Link></li> ✅ NEW */}
                <li><Link to="/receiver">Beneficiary</Link></li>

                {/* <li>
                  <Link
                    to="/"
                    onClick={() => {
                      navigate("/");
                      setTimeout(() => {
                        const faqSec = document.getElementById("faqs-section");
                        faqSec?.scrollIntoView({ behavior: "smooth" });
                      }, 200);
                    }}
                  >
                    FAQs
                  </Link>
                </li> */}
              </ul>
            </div>

            {/* SUPPORT */}
            {/* <div className="col-md-3">
              <h6>Support</h6>
              <ul className="footer-links">
                <li
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("/about"); 
                  }}
                >
                  About Donifi
                </li>
              </ul>
            </div> */}

          </div>
        </div>
{/* DISCLAIMER */}
<div
  style={{
    background: "rgba(255,255,255,0.04)",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    padding: "18px 0"
  }}
>
  <div className="container">
    <p
      style={{
        margin: 0,
        fontSize: "0.9rem",
        lineHeight: 1.6,
        color: "rgba(255,255,255,0.85)",
        textAlign: "center"
      }}
    >
      <strong style={{ color: "#ffffff", fontWeight: 600 }}>
        Disclaimer:
      </strong>{" "}
      All profiles displayed on Donifi are manually reviewed and verified before
      being made public. Donifi serves only as a platform to connect supporters
      with beneficiaries and does not directly handle or distribute funds. Users
      are encouraged to make informed decisions before offering support.
    </p>
  </div>
</div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Donifi — All Rights Reserved Powered By Repodata Systems
        </div>
      </footer>
    </div>
  );
}
