const fs = require("fs");
const Papa = require("papaparse");

function readCSV(path) {
  const csv = fs.readFileSync(path, "utf8");
  return Papa.parse(csv, { header: true }).data;
}

const states = readCSV("./data/lgd-csv/states.csv");
const districts = readCSV("./data/lgd-csv/districts.csv");
const subdistricts = readCSV("./data/lgd-csv/subdistricts.csv");
const villagesTS = readCSV("./data/lgd-csv/villages_ts.csv");
const villagesAP = readCSV("./data/lgd-csv/villages_ap.csv");

const result = {};
const villageStates = ["36", "28"]; // Telangana, Andhra Pradesh

// ---------- STATES (ALL INDIA) ----------
states.forEach(s => {
  result[s.state_code] = {
    name: s.state_name_english,
    districts: {}
  };
});

// ---------- DISTRICTS (ALL INDIA) ----------
districts.forEach(d => {
  const state = result[d.state_code];
  if (!state) return;

  state.districts[d.district_code] = {
    name: d.district_name_english,
    mandals: {}
  };
});

// ---------- MANDALS (ALL INDIA) ----------
subdistricts.forEach(m => {
  const state = result[m.state_code];
  if (!state) return;

  const district = state.districts[m.district_code];
  if (!district) return;

  district.mandals[m.subdistrict_code] = {
    name: m.subdistrict_name_english,
    ...(villageStates.includes(m.state_code) ? { villages: [] } : {})
  };
});

// ---------- VILLAGES (ONLY TS + AP) ----------
[...villagesTS, ...villagesAP].forEach(v => {
  const state = result[v.stateCode];
  if (!state) return;

  const district = state.districts[v.districtCode];
  if (!district) return;

  const mandal = district.mandals[v.subdistrictCode];
  if (!mandal || !mandal.villages) return;

  mandal.villages.push({
    code: v.villageCode,
    name: v.villageNameEnglish
  });
});

// ---------- WRITE OUTPUT ----------
fs.mkdirSync("./public/lgd", { recursive: true });
fs.writeFileSync(
  "./public/lgd/lgd_all_states_ts_ap.json",
  JSON.stringify(result, null, 2)
);

console.log("✅ LGD JSON generated (ALL states + TS/AP villages)");
