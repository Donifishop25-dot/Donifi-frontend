// src/pages/ReceiverForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createReceiverApi,
  getReceivers,
  getReceiverByPhoneApi,
  updateReceiverApi,
  deleteReceiverApi
} from "../api/api";

import ReceiverLocationFilter from "../components/ReceiverLocationFilter";
import { useLoading } from "../context/LoadingContext";


const CLOUD_NAME = "dcepa5hk9";
const UPLOAD_PRESET = "donifi_preset";
const UPI_REGEX = /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z]{2,64}$/;
const MAX_VIDEO_SIZE_MB = 20;      // 20 MB
const MAX_VIDEO_DURATION = 60;     // 60 seconds


export default function ReceiverForm() {
  const navigate = useNavigate();
const { setGlobalLoading } = useLoading(); 
  const imageInputRef = React.useRef(null);
const videoInputRef = React.useRef(null);
const aadhaarInputRef = React.useRef(null);
//const panInputRef = React.useRef(null);
const reasonInputRef = React.useRef(null);
const qrInputRef = React.useRef(null);
const closeBtnStyle = {
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  border: "none",
  background: "rgba(0,0,0,0.75)",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "600",
  cursor: "pointer",
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.45)"
};




  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
  name: "",
  gender: "Male",
  phone: "",
  email: "",
  problemDescription: "",
  address: "",
  state: "",
  district: "",
  mandal: "",
  village: "",
  targetAmount: "",
  upiId: "",
  imageFile: "",
  videoFile: "",
  aadhaarFile: "",
  //panFile: "",
  reasonProofFile: "",
  qrCodeFile: "",
  consent: false,
  phoneLookup: ""
});


  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageLocalPreview, setImageLocalPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
const [aadhaarPreview, setAadhaarPreview] = useState(null);
//const [panPreview, setPanPreview] = useState(null);
const [reasonProofPreview, setReasonProofPreview] = useState(null);
const [qrPreview, setQrPreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [existingPhones, setExistingPhones] = useState([]);
  const [phoneExists, setPhoneExists] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [previewModal, setPreviewModal] = useState({
  open: false,
  src: null,
  type: "image" // image | video
});



  /* ================= SUCCESS MODAL ================= */
  const [successModal, setSuccessModal] = useState({
    show: false,
    message: "",
    redirect: null
  });

  /* ================= LOAD PHONES (API) ================= */
  useEffect(() => {
    async function loadPhones() {
      try {
        const data = await getReceivers();
        setExistingPhones(data.map(r => String(r.phone || "").trim()));
      } catch {}
    }
    loadPhones();
  }, []);

  /* ================= VALIDATION ================= */
  const validateForm = () => {
  if (!form.name.trim()) return "Full Name is required";

if (form.name.trim().length < 3)
  return "Full Name must be at least 3 characters";

if (form.name.trim().length > 30)
  return "Full Name cannot exceed 30 characters";

if (!/^[A-Za-z ]+$/.test(form.name))
  return "Name must contain only letters";

  if (!/^\d{10}$/.test(form.phone)) return "Phone must be 10 digits";

  if (!form.email.trim())
    return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    return "Enter a valid email";

  if (!form.targetAmount || Number(form.targetAmount) <= 0)
    return "Target amount is required";

  if (form.problemDescription.length < 15)
    return "Description must be at least 15 characters";

  if (!form.state || !form.district)
    return "Location is required";

  
    if (!form.imageFile) return "Image is required";
    if (!form.videoFile) return "Video proof is required";
    if (!form.aadhaarFile) return "Aadhaar is required";
    //if (!form.panFile) return "PAN is required";
    if (!form.reasonProofFile) return "Reason proof is required";
    if (!form.qrCodeFile) return "QR Code image is required";
  

  if (!form.upiId.trim()) return "UPI ID is required";
  if (!UPI_REGEX.test(form.upiId)) return "Invalid UPI ID";

  if (!form.consent) return "Consent is required";

  return null;
};


  /* ================= EDIT LOAD ================= */
  const loadUserForEdit = async () => {
    const phone = form.phoneLookup.trim();
    if (!/^\d{10}$/.test(phone)) {
      setSuccessModal({
        show: true,
        message: "Enter valid phone number!",
        redirect: null
      });
      return;
    }

    try {
      const data = await getReceiverByPhoneApi(phone);

      setEditMode(true);
      setEditingId(data.ReceiverId);
      setShowModal(false);

      setForm({
  ...form,

  // Personal
  name: data.Name || "",
  gender: data.Gender || "Male",
  phone: data.Phone || "",
  email: data.Email || "",

  // Financial
  targetAmount: data.TargetAmount || "",
  upiId: data.UpiId || "",

  // Problem & address
  problemDescription: data.ProblemDescription || "",
  address: data.Address || "",

  // Location
  state: data.State || "",
  district: data.District || "",
  mandal: data.Mandal || "",
  village: data.Village || "",

  // Files (URLs in edit mode)
  imageFile: data.ImageUrl || "",
  videoFile: data.VideoUrl || "",
  aadhaarFile: data.AadhaarUrl || "",
  //panFile: data.PanUrl || "",
  reasonProofFile: data.ReasonProofUrl || "",
  qrCodeFile: data.QrCodeUrl || "",
  consent: true
});



     setImageLocalPreview(data.ImageUrl || null);
     setVideoPreview(data.VideoUrl || null);
setAadhaarPreview(data.AadhaarUrl || null);
//setPanPreview(data.PanUrl || null);
setReasonProofPreview(data.ReasonProofUrl || null);
setQrPreview(data.QrCodeUrl || null);   

    }catch {
  setShowModal(false);
  setSuccessModal({
    show: true,
    message: "No record found!",
    redirect: null
  });
}

  };

  /* ================= IMAGE ================= */
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSuccessModal({
        show: true,
        message: "Only image files are allowed (JPG, PNG, WEBP)",
        redirect: null
      });
      return;
    }

    setForm({ ...form, imageFile: file });
    setImageLocalPreview(URL.createObjectURL(file));
  };

  /* ================= CLOUDINARY ================= */
 const uploadFile = async (file, type = "image") => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);

  const endpoint =
    type === "video"
      ? "video/upload"
      : "image/upload";

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${endpoint}`,
    { method: "POST", body: fd }
  );

  const data = await res.json();
  return data.secure_url;
};


  /* ================= SUBMIT ================= */
 const handleSubmit = async (e) => {
  e.preventDefault();

  const error = validateForm();
  if (error) {
    setSuccessModal({ show: true, message: error, redirect: null });
    return;
  }

  setSubmitting(true);
  setGlobalLoading(true);   // 🔥 SHOW LOADER
  try {
    const imageUrl =
      form.imageFile instanceof File
        ? await uploadFile(form.imageFile)
        : form.imageFile;

   const videoUrl =
  form.videoFile instanceof File
    ? await uploadFile(form.videoFile, "video")
    : form.videoFile;

const aadhaarUrl =
  form.aadhaarFile instanceof File
    ? await uploadFile(form.aadhaarFile)
    : form.aadhaarFile;

const reasonProofUrl =
  form.reasonProofFile instanceof File
    ? await uploadFile(form.reasonProofFile)
    : form.reasonProofFile;

const qrCodeUrl =
  form.qrCodeFile instanceof File
    ? await uploadFile(form.qrCodeFile)
    : form.qrCodeFile;
    
    const payload = {
      name: form.name,
      gender: form.gender,
      phone: form.phone,
      email: form.email,
      problemDescription: form.problemDescription,
      address: form.address,
      state: form.state,
      district: form.district,
      mandal: form.mandal,
      village: form.village,
      upiId: form.upiId,
      targetAmount: Number(form.targetAmount),
      imageUrl,
      videoUrl,
      aadhaarUrl,
      //panUrl,
      reasonProofUrl,
      qrCodeUrl 
    };

    editMode
      ? await updateReceiverApi(editingId, payload)
      : await createReceiverApi(payload);

    setSuccessModal({
      show: true,
      message: "Submitted successfully. Verification may take time.",
      redirect: "/"
    });
  } catch (e) {
    setSuccessModal({
      show: true,
      message: e.message || "Failed",
      redirect: null
    });
  } finally {
    setSubmitting(false);
    setGlobalLoading(false);   // ✅ HIDE LOADER
  }
};


  /* ================= DELETE ================= */
  const deleteReceiver = async () => {
    try {
      await deleteReceiverApi(editingId);
      setSuccessModal({
        show: true,
        message: "Profile deleted successfully!",
        redirect: "/"
      });
    } catch {
      setSuccessModal({
        show: true,
        message: "Error deleting profile!",
        redirect: null
      });
    }
  };

  /* ================= JSX (UNCHANGED) ================= */
  return (
    <div className="receiver-form-wrapper">

      {/* SUCCESS MODAL */}
      {successModal.show && (
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
        borderRadius: "14px",
        width: "90%",
        maxWidth: "380px",
        textAlign: "center",
        boxShadow: "0 6px 30px rgba(0,0,0,0.3)"
      }}
    >
      <h4 className="mb-3">{successModal.message}</h4>

      <button
        className="btn btn-gold w-100"
        onClick={() => {
          if (successModal.redirect) {
            navigate(successModal.redirect);
            window.location.reload();
          } else {
            setSuccessModal({ show: false, message: "", redirect: null });
          }
        }}
      >
        OK
      </button>
    </div>
  </div>
)}


      {/* DELETE CONFIRM */}
      {confirmDelete && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 3500
    }}
  >
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "380px",
        textAlign: "center",
        boxShadow: "0 4px 25px rgba(0,0,0,0.3)"
      }}
    >
      <h4 className="mb-3" style={{ color: "#b40000" }}>
        Are you sure?
      </h4>

      <p className="mb-4">
        This action will permanently delete your profile.
      </p>

      <div className="d-flex gap-3">
        <button
          className="btn btn-outline-secondary w-50"
          onClick={() => setConfirmDelete(false)}
        >
          Cancel
        </button>

        <button
          className="btn btn-gold w-50"
          onClick={() => {
            setConfirmDelete(false);
            deleteReceiver();   // ✅ delete only after confirmation
          }}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}

{previewModal.open && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 5000
    }}
    onClick={() => setPreviewModal({ open: false, src: null, type: "image" })}
  >
    <div
      style={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* CLOSE BUTTON */}
      <button
  style={{
    position: "fixed",
    top: "20px",
    right: "20px",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(0,0,0,0.85)",
    color: "#fff",
    fontSize: "20px",
    fontWeight: "600",
    cursor: "pointer",
    zIndex: 6000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 16px rgba(0,0,0,0.6)"
  }}
  onClick={() =>
    setPreviewModal({ open: false, src: null, type: "image" })
  }
>
  ✕
</button>


      {/* IMAGE */}
      {previewModal.type === "image" && (
        <img
          src={previewModal.src}
          className="img-fluid rounded"
          style={{ maxHeight: "85vh" }}
        />
      )}

      {/* VIDEO */}
      {previewModal.type === "video" && (
        <video
          src={previewModal.src}
          controls
          autoPlay
          className="rounded"
          style={{ maxHeight: "85vh", maxWidth: "100%" }}
        />
      )}
    </div>
  </div>
)}

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            onClick={() => (editMode ? window.location.reload() : navigate("/"))}
            className="btn btn-light"
          >
            ← Back
          </button>

          <h2 className="fw-bold mb-0">
            {editMode ? "Edit Your Details" : "Beneficiary Registration"}
          </h2>
        </div>

        {!editMode && (
          <span
  style={{ cursor: "pointer", fontSize: "22px" }}
  onClick={() => {
    setForm(prev => ({ ...prev, phoneLookup: "" }));
    setShowModal(true);
  }}
>
  ✏️
</span>

        )}
      </div>

      {/* EDIT MODAL */}
      {showModal && (
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
      zIndex: 2000
    }}
  >
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        width: "90%",
        maxWidth: "420px",
        boxShadow: "0 5px 25px rgba(0,0,0,0.25)"
      }}
    >

            <h4 className="text-center mb-3">Edit Your Profile</h4>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter phone number"
              maxLength={10}
              value={form.phoneLookup}
              onChange={(e) =>
                setForm({ ...form, phoneLookup: e.target.value })
              }
            />

            <button
              className="btn btn-gold w-100 mb-2"
              onClick={loadUserForEdit}
            >
              Load Details
            </button>

            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MAIN FORM */}
      <div className="card form-modern p-4 p-md-5 rounded-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3 g-md-4">
<div className="col-12 mt-4">
  <h5 className="fw-semibold text-muted border-bottom pb-2">
    Personal Details
  </h5>
</div>

            {/* NAME */}
            <div className="col-md-6">
              <label>Full Name *</label>
              <input
  className="form-control"
  minLength={3}
  maxLength={30}
  value={form.name}
  onChange={(e) =>
    /^[A-Za-z ]*$/.test(e.target.value) &&
    setForm({ ...form, name: e.target.value })
  }
/>

            </div>

            {/* GENDER */}
            <div className="col-md-6">
              <label>Gender</label>
              <select
                className="form-select"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* PHONE */}
            <div className="col-md-6">
              <label>Phone *</label>
              <input
                className="form-control"
                maxLength={10}
                value={form.phone}
                onChange={(e) => {
                  const only = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, phone: only });
                  if (!editMode) {
                    const exists = existingPhones.includes(only.trim());
                    setPhoneExists(exists);
                  }
                }}
              />
              {!editMode && phoneExists && (
                <small className="text-danger">
                  Phone number already exists
                </small>
              )}
            </div>
            {/* EMAIL */}
<div className="col-md-6">
  <label>Email *</label>
  <input
    type="email"
    className="form-control"
    value={form.email}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
  />
</div>

{/* TARGET */}
<div className="col-md-6">
  <label>Target Amount *</label>
  <input
    type="number"
    className="form-control"
    value={form.targetAmount}
    onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
  />
</div>

{/* VIDEO */}
<div className="col-md-6">
  <label>Video Proof *</label>
  <input
  ref={videoInputRef}
  type="file"
  className="form-control"
  accept="video/mp4,video/webm"
  onChange={(e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1️⃣ Size check
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_VIDEO_SIZE_MB) {
      setSuccessModal({
        show: true,
        message: `Video must be less than ${MAX_VIDEO_SIZE_MB} MB`,
        redirect: null
      });
      return;
    }

    // 2️⃣ Duration check
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);

      if (video.duration > MAX_VIDEO_DURATION) {
        setSuccessModal({
          show: true,
          message: `Video duration must be under ${MAX_VIDEO_DURATION} seconds`,
          redirect: null
        });
        return;
      }

      // ✅ Passed all checks
      setForm({ ...form, videoFile: file });
      setVideoPreview(URL.createObjectURL(file));
    };

    video.src = URL.createObjectURL(file);
  }}
/>


  {videoPreview && (
  <div style={{ position: "relative" }}>
    {/* REMOVE */}
    <button
      type="button"
      onClick={() => {
  setVideoPreview(null);
  setForm({ ...form, videoFile: "" });

  if (videoInputRef.current) {
    videoInputRef.current.value = "";
  }
}}

      style={closeBtnStyle}

    >
      ✕
    </button>

    {/* PREVIEW */}
    <video
      src={videoPreview}
      controls
      className="img-fluid mt-2 rounded"
      style={{ maxHeight: "250px", cursor: "zoom-in" }}
      onClick={() =>
        setPreviewModal({
          open: true,
          src: videoPreview,
          type: "video"
        })
      }
    />
  </div>
)}

</div>


{/* DOCUMENTS */}
<div className="col-12 mt-4">
  <h5 className="fw-semibold text-muted border-bottom pb-2">
    Identity & Documents
  </h5>
</div>

<div className="col-md-6">
  <label>Aadhaar *</label>
  <input
  ref={aadhaarInputRef}
  type="file"
  className="form-control"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSuccessModal({
        show: true,
        message: "Only image files are allowed for Aadhaar",
        redirect: null
      });
      return;
    }

    setForm({ ...form, aadhaarFile: file });
    setAadhaarPreview(URL.createObjectURL(file));
  }}
/>


  {aadhaarPreview && (
  <div style={{ position: "relative", display: "inline-block" }}>
    {/* REMOVE */}
    <button
      type="button"
      onClick={() => {
  setAadhaarPreview(null);
  setForm({ ...form, aadhaarFile: "" });

  if (aadhaarInputRef.current) {
    aadhaarInputRef.current.value = "";
  }
}}

      style={closeBtnStyle}

    >
      ✕
    </button>

    {/* PREVIEW */}
    <img
      src={aadhaarPreview}
      className="img-fluid mt-2 rounded"
      style={{ maxHeight: "250px", cursor: "zoom-in" }}
      onClick={() =>
        setPreviewModal({
          open: true,
          src: aadhaarPreview,
          type: "image"
        })
      }
    />
  </div>
)}


</div>


{/* <div className="col-md-6">
  <label>PAN *</label>
  <input
  ref={panInputRef}
  type="file"
  className="form-control"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSuccessModal({
        show: true,
        message: "Only image files are allowed for PAN",
        redirect: null
      });
      return;
    }

    setForm({ ...form, panFile: file });
    setPanPreview(URL.createObjectURL(file));
  }}
/>


  {panPreview && (
  <div style={{ position: "relative", display: "inline-block" }}>
    <button
      type="button"
      onClick={() => {
  setPanPreview(null);
  setForm({ ...form, panFile: "" });

  if (panInputRef.current) {
    panInputRef.current.value = "";
  }
}}

      style={closeBtnStyle}

    >
      ✕
    </button>

    <img
      src={panPreview}
      className="img-fluid mt-2 rounded"
      style={{ maxHeight: "250px", cursor: "zoom-in" }}
      onClick={() =>
        setPreviewModal({
          open: true,
          src: panPreview,
          type: "image"
        })
      }
    />
  </div>
)}


</div> */}

<div className="col-md-6">
  <label>Reason Proof *</label>
  <input
  ref={reasonInputRef}
  type="file"
  className="form-control"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSuccessModal({
        show: true,
        message: "Only image files are allowed for Reason Proof",
        redirect: null
      });
      return;
    }

    setForm({ ...form, reasonProofFile: file });
    setReasonProofPreview(URL.createObjectURL(file));
  }}
/>


 {reasonProofPreview && (
  <div style={{ position: "relative", display: "inline-block" }}>
    <button
      type="button"
      onClick={() => {
  setReasonProofPreview(null);
  setForm({ ...form, reasonProofFile: "" });

  if (reasonInputRef.current) {
    reasonInputRef.current.value = "";
  }
}}

      style={closeBtnStyle}

    >
      ✕
    </button>

    <img
      src={reasonProofPreview}
      className="img-fluid mt-2 rounded"
      style={{ maxHeight: "250px", cursor: "zoom-in" }}
      onClick={() =>
        setPreviewModal({
          open: true,
          src: reasonProofPreview,
          type: "image"
        })
      }
    />
  </div>
)}


</div>


            {/* UPI */}
            <div className="col-md-6">
              <label>UPI ID *</label>
              <input
                className="form-control"
                value={form.upiId}
                onChange={(e) =>
  setForm({ ...form, upiId: e.target.value.replace(/\s/g, "") })
}

                placeholder="name@upi"
              />
            </div>
            <div className="col-md-6">
  <label>QR Code Image *</label>
  <input
    ref={qrInputRef}
    type="file"
    className="form-control"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setSuccessModal({
          show: true,
          message: "Only image files are allowed for QR Code",
          redirect: null
        });
        return;
      }

      setForm({ ...form, qrCodeFile: file });
      setQrPreview(URL.createObjectURL(file));
    }}
  />

  {qrPreview && (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => {
          setQrPreview(null);
          setForm({ ...form, qrCodeFile: "" });

          if (qrInputRef.current) {
            qrInputRef.current.value = "";
          }
        }}
        style={closeBtnStyle}
      >
        ✕
      </button>

      <img
        src={qrPreview}
        className="img-fluid mt-2 rounded"
        style={{ maxHeight: "250px", cursor: "zoom-in" }}
        onClick={() =>
          setPreviewModal({
            open: true,
            src: qrPreview,
            type: "image"
          })
        }
      />
    </div>
  )}
</div>
<div className="col-12 mt-4">
  <h5 className="fw-semibold text-muted border-bottom pb-2">
    Problem & Address Details
  </h5>
</div>

            {/* PROBLEM */}
            <div className="col-12">
              <label>Problem Description *</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.problemDescription}
                onChange={(e) =>
                  setForm({ ...form, problemDescription: e.target.value })
                }
              />
            </div>

            {/* ADDRESS */}
            <div className="col-md-8">
              <label>Address *</label>
              <textarea
                className="form-control"
                rows={2}
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>

             {/* location */}
            <div className="col-12">
              <label className="fw-semibold">Location *</label>
              <ReceiverLocationFilter
  value={{
    state: form.state,
    district: form.district,
    mandal: form.mandal,
    village: form.village
  }}
  onChange={(loc) =>
    setForm((prev) => ({
      ...prev,
      state: loc.state,
      district: loc.district,
      mandal: loc.mandal,
      village: loc.village
    }))
  }
/>

            </div>

            {/* IMAGE */}
            <div className="col-md-6">
              <label>Upload Image *</label>
              <input
  ref={imageInputRef}
  type="file"
  className="form-control"
  accept="image/*"
  onChange={handleImageSelect}
/>

              {imageLocalPreview && (
  <div style={{ position: "relative", display: "inline-block" }}>
    {/* REMOVE */}
    <button
      type="button"
      onClick={() => {
  setImageLocalPreview(null);
  setForm({ ...form, imageFile: "" });

  if (imageInputRef.current) {
    imageInputRef.current.value = "";
  }
}}

      style={closeBtnStyle}

    >
      ✕
    </button>

    {/* PREVIEW */}
    <img
      src={imageLocalPreview}
      className="img-fluid mt-2 rounded"
      style={{ maxHeight: "250px", cursor: "zoom-in" }}
      onClick={() =>
        setPreviewModal({
          open: true,
          src: imageLocalPreview,
          type: "image"
        })
      }
    />
  </div>
)}

            </div>

            {/* CONSENT */}
            <div className="col-12 mt-3">
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={form.consent}
                  onChange={(e) =>
                    setForm({ ...form, consent: e.target.checked })
                  }
                />
                <span className="ms-2">
                  I confirm the above information is true *
                </span>
              </label>
            </div>

            {/* SUBMIT + DELETE */}
            <div className="col-12 mt-3 d-flex gap-3">
              <button
                className="btn btn-gold px-4"
                disabled={submitting || (!editMode && phoneExists)}
                type="submit"
              >
                {submitting ? "Please wait..." : editMode ? "Update" : "Submit"}
              </button>

              {editMode && (
                <button
                  type="button"
                  // onClick={deleteReceiver}
                  onClick={() => setConfirmDelete(true)}

                  className="btn btn-gold px-4"
                  style={{
                    border: "2px solid #b40000",
                    padding: "6px 20px",
                    fontWeight: "600",
                    borderRadius: "6px"
                  }}
                >
                  Delete Profile
                </button>
              )}
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
