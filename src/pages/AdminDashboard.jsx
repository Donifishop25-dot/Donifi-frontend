import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import Cropper from "react-easy-crop";

//const API_BASE = "https://localhost:7251/api";
//const API_BASE = "https://api.donifi.shop/api";
const API_BASE = import.meta.env.VITE_API_URL;

const PAGE_SIZE = 15;

function computeStatus(prev, action) {
  switch (action) {
    case "approve":
      return {
        IsApproved: true,
        IsActive: true,
        IsDisabled: false
      };

    case "reject":
      return {
        IsApproved: false,
        IsActive: false,
        IsDisabled: false
      };

    case "disable":
      return {
        IsApproved: false,
        IsActive: false,
        IsDisabled: true
      };

    default:
      return prev;
  }
}


export default function AdminDashboard() {
  const { user } = useAuth();
const { setGlobalLoading } = useLoading();

  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [selected, setSelected] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingTarget, setEditingTarget] = useState(false);
const [newTarget, setNewTarget] = useState("");


  const [filter, setFilter] = useState("all"); // all | pending | approved | rejected | disabled
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [qrEditor, setQrEditor] = useState({
  open: false,
  src: null
});

const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  /* ================= LOAD ALL PROFILES ================= */
 useEffect(() => {
  async function loadAll() {
    setGlobalLoading(true);   // 🔥 SHOW global loader
    try {
      const res = await fetch(
        `${API_BASE}/admin/receivers/all`,
        { headers: { "X-User-Phone": user.phone } }
      );

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setAllProfiles(data);
    } catch {
      setErr("You are not authorized to view this page");
    } finally {
      setLoading(false);
      setGlobalLoading(false); // ✅ HIDE global loader
    }
  }

  loadAll();
}, [user]);


  /* ================= FILTER + SEARCH ================= */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return allProfiles.filter(p => {
      const matchesSearch =
        p.Name?.toLowerCase().includes(q) ||
        p.Phone?.includes(q);

      // 🔑 GLOBAL SEARCH (ignores tab)
      if (q) return matchesSearch;

      // 🔒 TAB FILTER
      if (filter === "all") return true;

      if (filter === "pending")
  return !p.IsApproved && p.IsActive && !p.IsDisabled;


      if (filter === "approved")
        return p.IsApproved && !p.IsDisabled;

      if (filter === "disabled")
        return p.IsDisabled;

      if (filter === "rejected")
        return !p.IsApproved && !p.IsActive && !p.IsDisabled;

      return true;
    });
  }, [allProfiles, filter, search]);

  /* ================= STATUS COUNTS ================= */
const counts = useMemo(() => {
  return {
    all: allProfiles.length,

    pending: allProfiles.filter(
      p => !p.IsApproved && p.IsActive && !p.IsDisabled
    ).length,

    approved: allProfiles.filter(
      p => p.IsApproved && !p.IsDisabled
    ).length,

    rejected: allProfiles.filter(
      p => !p.IsApproved && !p.IsActive && !p.IsDisabled
    ).length,

    disabled: allProfiles.filter(
      p => p.IsDisabled
    ).length
  };
}, [allProfiles]);


  /* ================= PAGINATION ================= */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedData = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= ADMIN ACTION ================= */
async function executeAdminAction() {
  if (!confirmAction || !selected) return;

  const actionType = confirmAction.type;
  const receiverId = selected.ReceiverId;

  setConfirmAction(null);
  setSelected(null);

  const statusUpdate = computeStatus({}, actionType);

  setAllProfiles(prev =>
    prev.map(p =>
      p.ReceiverId === receiverId
        ? { ...p, ...statusUpdate }
        : p
    )
  );

  setGlobalLoading(true);   // 🔥 SHOW loader
  try {
    await fetch(confirmAction.url, {
      method: "POST",
      headers: { "X-User-Phone": user.phone }
    });
  } catch (err) {
    console.error("Admin action failed", err);
  } finally {
    setGlobalLoading(false); // ✅ HIDE loader
  }
}

/* ================= QR CROP UTILITY ================= */

async function getCroppedImg(imageSrc, crop) {
  const image = new Image();

  // 🔥 THIS FIXES THE ERROR
  image.crossOrigin = "anonymous";

  image.src = imageSrc;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg");
  });
}

/* ================= UPLOAD CROPPED QR ================= */

async function uploadCroppedQr(blob) {
  const fd = new FormData();
  fd.append("file", blob);
  fd.append("upload_preset", "donifi_preset");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dcepa5hk9/image/upload",
    { method: "POST", body: fd }
  );

  const data = await res.json();

  await fetch(
    `${API_BASE}/admin/receivers/${selected.ReceiverId}/update-qr`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Phone": user.phone
      },
      body: JSON.stringify({
        qrCodeUrl: data.secure_url
      })
    }
  );

  // Update UI instantly
  setSelected(prev => ({
    ...prev,
    QrCodeUrl: data.secure_url
  }));

  setAllProfiles(prev =>
    prev.map(p =>
      p.ReceiverId === selected.ReceiverId
        ? { ...p, QrCodeUrl: data.secure_url }
        : p
    )
  );
}

  if (loading) return <p className="text-center mt-5">Loading admin data…</p>;
  if (err) return <p className="text-danger text-center mt-5">{err}</p>;

  return (
    <div className="container mb-5">

      <h2 className="fw-bold mb-1">Admin Console</h2>
      <p className="text-muted mb-4">
        Manage and verify beneficiary profiles
      </p>

      {/* FILTER + SEARCH BAR */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        {/* TABS */}
        <div className="d-flex gap-2 flex-wrap">
  {["all", "pending", "approved", "rejected", "disabled"].map(t => (
    <button
      key={t}
      className={`btn btn-sm ${
        filter === t ? "btn-primary" : "btn-outline-secondary"
      }`}
      onClick={() => {
        setFilter(t);
        setPage(1);
      }}
    >
      {t.toUpperCase()}{" "}
      <span
        className={`badge ms-1 ${
          filter === t ? "bg-light text-dark" : "bg-secondary"
        }`}
      >
        {counts[t]}
      </span>
    </button>
  ))}
</div>


        {/* SEARCH (RIGHT) */}
        <div className="position-relative w-100 w-md-auto" style={{ maxWidth: "280px" }}>

          <input
            className="form-control"
            placeholder="Search profiles"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ paddingLeft: "36px", height: "38px" }}
          />
          <span
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888",
              pointerEvents: "none"
            }}
          >
            🔍
          </span>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Profile</th>
              <th>Location</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {pagedData.map(p => (
              <tr
                key={p.ReceiverId}
                style={{
                  opacity: p.IsDisabled ? 0.4 : 1,
                  background: p.IsDisabled ? "#f2f2f2" : "transparent"
                }}
              >
                <td>
                  <div className="fw-semibold">{p.Name}</div>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    {p.Phone}
                  </div>
                </td>

                <td style={{ fontSize: 14 }}>
                  {p.Village || "-"} <br />
                  <span style={{ color: "#777" }}>
                    {p.District}, {p.State}
                  </span>
                </td>

                <td style={{ fontSize: 14 }}>
                  {new Date(p.CreatedAt).toLocaleDateString()}
                </td>

                <td>
                  {p.IsDisabled ? (
                    <span className="badge bg-dark">Disabled</span>
                  ) : p.IsApproved ? (
                    <span className="badge bg-success">Approved</span>
                  ) : !p.IsActive ? (
                    <span className="badge bg-danger">Rejected</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Pending</span>
                  )}
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setSelected(p)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Prev
        </button>

        <span style={{ fontSize: 14 }}>
          Page {page} of {totalPages}
        </span>

        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>

      {/* ================= PROFILE REVIEW MODAL ================= */}
      {selected && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 4000
    }}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        width: "95%",
        maxWidth: "1000px",
        maxHeight: "90vh",
        overflowY: "auto"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <h4 className="fw-bold">Profile Review</h4>
        <button
  className="btn btn-sm btn-outline-secondary"
  onClick={() => {
    setSelected(null);
    setEditingTarget(false);
    setNewTarget("");
  }}
>
  Close
</button>

      </div>

     <div className="row g-0 flex-column flex-md-row">

        {/* LEFT PANEL */}
        <div
          className="col-md-4"
          style={{
            padding: "24px",
            borderRight: "1px solid #eee",
            background: "#fafafa"
          }}
        >
          <img
            src={selected.ImageUrl || "/images/default.png"}
            className="img-fluid rounded mb-3"
            alt="Beneficiary"
          />

          <h5 className="fw-bold">{selected.Name}</h5>
          <div style={{ fontSize: 14, color: "#666" }}>
            {selected.Phone}
          </div>

          <div className="mt-3">
            {selected.IsDisabled ? (
              <span className="badge bg-dark">Disabled</span>
            ) : selected.IsApproved ? (
              <span className="badge bg-success">Approved</span>
            ) : !selected.IsActive ? (
              <span className="badge bg-danger">Rejected</span>
            ) : (
              <span className="badge bg-warning text-dark">Pending</span>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-md-8" style={{ padding: "24px" }}>
          {/* BASIC INFO */}
          <h6 className="fw-bold mb-2">Basic Details</h6>
          <p><strong>Name:</strong> {selected.Name}</p>
          <p><strong>Phone:</strong> {selected.Phone}</p>
          <p><strong>Email:</strong> {selected.Email}</p>

          <hr />
         
<h6 className="fw-bold mb-2">Fund Details</h6>
<p><strong>Target Amount:</strong></p>

<div className="d-flex gap-2 align-items-center">
  <input
    type="number"
    className="form-control"
    style={{ maxWidth: "200px" }}
    value={editingTarget ? newTarget : selected.TargetAmount}
    disabled={!editingTarget}
    onChange={(e) => setNewTarget(e.target.value)}
  />

  {!editingTarget ? (
    <button
      className="btn btn-sm btn-outline-primary"
      onClick={() => {
        setEditingTarget(true);
        setNewTarget(selected.TargetAmount);
      }}
    >
      Edit
    </button>
  ) : (
    <>
      <button
        className="btn btn-sm btn-success"
        onClick={async () => {
          if (!newTarget || Number(newTarget) <= 0) return;

          setGlobalLoading(true);
          try {
            await fetch(
              `${API_BASE}/admin/receivers/${selected.ReceiverId}/target`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-User-Phone": user.phone
                },
                body: JSON.stringify({
                  targetAmount: Number(newTarget)
                })
              }
            );

            // 🔄 Update UI instantly
            setAllProfiles(prev =>
              prev.map(p =>
                p.ReceiverId === selected.ReceiverId
                  ? { ...p, TargetAmount: Number(newTarget) }
                  : p
              )
            );

            setSelected(prev => ({
              ...prev,
              TargetAmount: Number(newTarget)
            }));

            setEditingTarget(false);
          } finally {
            setGlobalLoading(false);
          }
        }}
      >
        Save
      </button>

      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={() => setEditingTarget(false)}
      >
        Cancel
      </button>
    </>
  )}
</div>

          <hr />

          {/* PROBLEM */}
          <h6 className="fw-bold mb-2">Problem Description</h6>
          <p>{selected.ProblemDescription}</p>

          <hr />

          {/* ADDRESS */}
          <h6 className="fw-bold mb-2">Address</h6>
          <p>
            {selected.Address}<br />
            {selected.Village}, {selected.Mandal}<br />
            {selected.District}, {selected.State}
          </p>

          <hr />

          {/* PAYMENT */}
          <h6 className="fw-bold mb-2">Payment Details</h6>
          <p>
            <strong>UPI ID:</strong>{" "}
            {selected.UpiId ? selected.UpiId : "Not provided"}
          </p>

          <hr />
          
          <hr />

<h6 className="fw-bold mb-2">QR Code</h6>

{selected.QrCodeUrl ? (
  <div style={{ maxWidth: "250px" }}>
    <img
      src={selected.QrCodeUrl}
      alt="QR Code"
      className="img-fluid rounded shadow-sm"
      style={{
        border: "1px solid #ddd",
        padding: "6px",
        background: "#fff",
        cursor: "pointer"
      }}
      onClick={() =>
        setQrEditor({
          open: true,
          src: selected.QrCodeUrl
        })
      }
    />

    <button
      className="btn btn-sm btn-outline-primary mt-2"
      onClick={() =>
        setQrEditor({
          open: true,
          src: selected.QrCodeUrl
        })
      }
    >
      ✂ Crop QR
    </button>
  </div>
) : (
  <p className="text-muted">QR not uploaded</p>
)}
<hr />
<h6 className="fw-bold mb-2">Verification Proofs</h6>

<p>
  <a href={selected.VideoUrl} target="_blank" rel="noreferrer">
    ▶ View Video Proof
  </a>
</p>

<p>
  <a href={selected.AadhaarUrl} target="_blank" rel="noreferrer">
    📄 Aadhaar Document
  </a>
</p>

{/* <p>
  <a href={selected.PanUrl} target="_blank" rel="noreferrer">
    📄 PAN Document
  </a>
</p> */}

<p>
  <a href={selected.ReasonProofUrl} target="_blank" rel="noreferrer">
    📄 Reason Proof
  </a>
</p>


          {/* ADMIN ACTIONS */}
          <h6 className="fw-bold mb-2">Admin Actions</h6>

          <div className="d-flex gap-3">
            <button
              className="btn btn-success"
              onClick={() =>
                setConfirmAction({
                  type: "approve",
                  title: "Approve Profile",
                  message: "Approve this profile and make it public?",
                  url: `${API_BASE}/admin/receivers/${selected.ReceiverId}/approve`
                })
              }
            >
              Approve
            </button>

            <button
              className="btn btn-outline-danger"
              onClick={() =>
                setConfirmAction({
                  type: "reject",
                  title: "Reject Profile",
                  message: "Reject this profile? This cannot be undone.",
                  url: `${API_BASE}/admin/receivers/${selected.ReceiverId}/reject`
                })
              }
            >
              Reject
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() =>
                setConfirmAction({
                  type: "disable",
                  title: "Disable Profile",
                  message: "Disable this profile? It will be hidden from users.",
                  url: `${API_BASE}/admin/receivers/${selected.ReceiverId}/disable`
                })
              }
            >
              Disable
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{qrEditor.open && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 6000
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "16px",
        width: "90%",
        maxWidth: "600px"
      }}
    >
      <h5 className="fw-bold mb-3">Crop QR Code</h5>

      <div style={{ position: "relative", height: "350px" }}>
        <Cropper
          image={qrEditor.src}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(croppedArea, croppedPixels) =>
            setCroppedAreaPixels(croppedPixels)
          }
        />
      </div>

      <div className="mt-3 d-flex justify-content-between align-items-center">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
        />

        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => setQrEditor({ open: false, src: null })}
          >
            Cancel
          </button>

          <button
            className="btn btn-success"
            onClick={async () => {
              const croppedBlob = await getCroppedImg(
                qrEditor.src,
                croppedAreaPixels
              );

              await uploadCroppedQr(croppedBlob);

              setQrEditor({ open: false, src: null });
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      {/* ================= CONFIRMATION MODAL ================= */}
      {confirmAction && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 5000
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "24px",
              width: "90%",
              maxWidth: "420px"
            }}
          >
            <h5 className="fw-bold mb-2">{confirmAction.title}</h5>
            <p>{confirmAction.message}</p>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </button>

              <button
                className={`btn ${
                  confirmAction.type === "approve"
                    ? "btn-success"
                    : confirmAction.type === "reject"
                    ? "btn-danger"
                    : "btn-secondary"
                }`}
                onClick={executeAdminAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
