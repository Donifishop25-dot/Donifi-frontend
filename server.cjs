// server.cjs (Updated Clean Version)
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- PATHS ----------------
const PUBLIC_DIR = path.join(__dirname, "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");
const EXCEL_PATH = path.join(PUBLIC_DIR, "products.xlsx");

// Create folders
[PUBLIC_DIR, IMAGES_DIR].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ---------------- CLEAN HEADERS (ONLY REQUIRED FIELDS) ----------------
const HEADERS = [
  "receiverId",
  "name",
  "gender",
  "phone",
  "problemDescription",
  "address",
  "state",
  "imageFile",
  "createdAt",
  "consent",
];

// ---------------- CHECK IF EXCEL IS OPEN ----------------
function excelIsLocked() {
  try {
    XLSX.readFile(EXCEL_PATH);
    return false;
  } catch (err) {
    return err.message.includes("EBUSY");
  }
}

// ---------------- BLOCK IF EXCEL IS OPEN ----------------
function checkExcelBeforeUpload(req, res, next) {
  if (excelIsLocked()) {
    return res.status(500).json({ ok: false, message: "Server error. Please try again." });
  }
  next();
}

// ---------------- MULTER STORAGE ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_DIR);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanBase = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-_.]/g, "");

    cb(null, `${cleanBase}-temp-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// ---------------- ENSURE EXCEL EXISTS ----------------
function ensureExcel() {
  if (!fs.existsSync(EXCEL_PATH)) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([], { header: HEADERS });

    // Add header row
    XLSX.utils.sheet_add_aoa(ws, [HEADERS], { origin: "A1" });

    XLSX.utils.book_append_sheet(wb, ws, "Receivers");
    XLSX.writeFile(wb, EXCEL_PATH);
  }
}

// ---------------- WRITE TO EXCEL ----------------
function writeExcel(row) {
  try {
    ensureExcel();

    const wb = XLSX.readFile(EXCEL_PATH);
    const ws = wb.Sheets[wb.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

    rows.push(row);

    const newWs = XLSX.utils.json_to_sheet(rows, { header: HEADERS });
    const newWb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(newWb, newWs, "Receivers");
    XLSX.writeFile(newWb, EXCEL_PATH);

    return true;
  } catch (err) {
    console.error("Excel Write Error:", err);
    return false;
  }
}

// ---------------- RECEIVER REGISTER ROUTE ----------------
app.post(
  "/api/register-receiver",
  checkExcelBeforeUpload,
  upload.single("imageFile"),
  (req, res) => {
    const tempImage = req.file?.filename || "";

    // Final filename (remove -temp-timestamp)
    const finalImage = tempImage ? tempImage.replace(/-temp-\d+/, "") : "";

    const row = {
      receiverId: `R-${Date.now()}-${Math.floor(Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),

      // Only required fields
      name: req.body.name || "",
      gender: req.body.gender || "",
      phone: req.body.phone || "",
      problemDescription: req.body.problemDescription || "",
      address: req.body.address || "",
      state: req.body.state || "",
      imageFile: finalImage,
      consent:req.body.consent
    };

    const ok = writeExcel(row);

    if (!ok) {
      try { fs.unlinkSync(path.join(IMAGES_DIR, tempImage)); } catch {}
      return res.status(500).json({ ok: false, message: "Server error writing file." });
    }

    // Rename file to final name
    try {
      if (tempImage) {
        fs.renameSync(
          path.join(IMAGES_DIR, tempImage),
          path.join(IMAGES_DIR, finalImage)
        );
      }
    } catch {
      try { fs.unlinkSync(path.join(IMAGES_DIR, tempImage)); } catch {}
      return res.status(500).json({ ok: false, message: "Server error saving file." });
    }

    res.json({ ok: true, message: "Receiver Registered!", data: row });
  }
);

// ---------------- STATIC FILES ----------------
app.use("/", express.static(PUBLIC_DIR));

// ---------------- START SERVER ----------------
app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
