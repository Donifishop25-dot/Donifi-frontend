import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { loginWithPhoneApi } from "../api/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user from cookie
  useEffect(() => {
    const saved = Cookies.get("donifi_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        Cookies.remove("donifi_user");
      }
    }
    setLoading(false);
  }, []);

async function loginWithPhone(phone) {
  const data = await loginWithPhoneApi({ phone });

  const userObj = {
    userId: data.UserId || data.userId,
    phone: data.Phone || data.phone,
    //name: data.Name || "User",
    name: data.Name || null,
    email: data.Email || "",
    role: data.Role || "USER"
  };

  Cookies.set("donifi_user", JSON.stringify(userObj), {
    expires: 365,
    sameSite: "Lax"
  });

  setUser(userObj);
  return userObj;
}


  function logout() {
    Cookies.remove("donifi_user");
    setUser(null);
  }

  return (
  <AuthContext.Provider value={{ user, setUser, loading, loginWithPhone, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
