//const API_BASE = "https://localhost:7251/api";
//const API_BASE = "https://api.donifi.shop/api";
const API_BASE = import.meta.env.VITE_API_URL;


/* ================= GET ALL RECEIVERS ================= */
export async function getReceivers() {
  const res = await fetch(`${API_BASE}/receivers`);
  if (!res.ok) throw new Error("Failed to load receivers");
  return res.json();
}

/* ================= CREATE RECEIVER ================= */
export async function createReceiverApi(payload) {
  const res = await fetch(`${API_BASE}/receivers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create receiver");
  }

  return res.json();
}

/* ================= GET RECEIVER BY PHONE (EDIT) ================= */
export async function getReceiverByPhoneApi(phone) {
  const res = await fetch(`${API_BASE}/receivers/by-phone/${phone}`);

  if (!res.ok) {
    throw new Error("No record found");
  }

  return res.json();
}

/* ================= UPDATE RECEIVER ================= */
export async function updateReceiverApi(id, payload) {
  const res = await fetch(`${API_BASE}/receivers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update receiver");
  }

  return res.json();
}

/* ================= DELETE RECEIVER ================= */
export async function deleteReceiverApi(id) {
  const res = await fetch(`${API_BASE}/receivers/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete receiver");
  }

  return true;
}
/* ================= INCREMENT RECEIVER VIEW ================= */
export async function incrementReceiverViewApi(id, viewerPhone) {
  await fetch(`${API_BASE}/receivers/${id}/view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ viewerPhone })
  });
}


/* ================= LOGIN ================= */
export async function loginWithPhoneApi(payload) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Login failed");
  }

  return res.json();
}
/* ================= RECORD DONATION ================= */
export async function recordDonationApi(id, payload) {
  const res = await fetch(`${API_BASE}/receivers/${id}/donate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("Failed to record donation");
  }

  return res.json();
}
export async function hasDonatedApi(phone) {
  const res = await fetch(`${API_BASE}/receivers/has-donated/${phone}`);
  if (!res.ok) throw new Error("Failed to check donation");
  return res.json();
}
