// src/pages/ShopNow.jsx
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function ShopNow({ receiver }) {
  const { user } = useAuth();

  useEffect(() => {
    window.cId = "252762";
    const script = document.createElement("script");
    script.src =
      (document.location.protocol === "https:" ? "https://cdn0.cuelinks.com/js/" : "http://cdn0.cuelinks.com/js/") +
      "cuelinksv2.js";
    script.async = false;
    document.head.appendChild(script);
  }, []);

  const stores = [
    {
      name: "Amazon",
      field: "amazonClicks",
      url: "https://www.amazon.in",
      img: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
    },
    {
      name: "Flipkart",
      field: "flipkartClicks",
      url: "https://www.flipkart.com",
      img: "https://1000logos.net/wp-content/uploads/2021/02/Flipkart-logo.png"
    },
    {
      name: "Myntra",
      field: "myntraClicks",
      url: "https://www.myntra.com",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/65c5da9f878952603e370d03_Myntra-Logo_1.svg/2560px-65c5da9f878952603e370d03_Myntra-Logo_1.svg.png"
    }
  ];

  async function handleClick(store) {
    if (!user) return alert("Please login first.");

    // 🚀 SAFARI FIX: Open tab instantly before async calls
    const newTab = window.open(store.url, "_blank");

    // Analytics only after opening tab (Safari-safe)
    const clickedList = (receiver.clickedBy || "").split(",").filter(Boolean);

    if (!clickedList.includes(user.userId)) {
      try {
        const docId = receiver.id || receiver.receiverId;
        const rDoc = doc(db, "receivers", docId);

        updateDoc(rDoc, {
          [store.field]: increment(1),
          clickedBy: receiver.clickedBy
            ? `${receiver.clickedBy},${user.userId}`
            : user.userId
        });
      } catch (err) {
        console.error("Failed to record click:", err);
      }
    }
  }

  return (
    <div
      className="d-flex gap-4 flex-wrap"
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px"
      }}
    >
      {stores.map((s, index) => (
        <button
          key={index}
          onClick={() => handleClick(s)}
          style={{
            height: "110px",
            width: "110px",
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 6px 22px rgba(0,0,0,0.18)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            transition: "0.25s ease",
            border: "none"
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <img
            src={s.img}
            alt={s.name}
            style={{
              height: "70px",
              width: "70px",
              objectFit: "contain",
              filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.2))"
            }}
          />
        </button>
      ))}
    </div>
  );
}
