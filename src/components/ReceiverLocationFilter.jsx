// import React, { useEffect, useState } from "react";

// export default function ReceiverLocationFilter({ onChange }) {
//   const [data, setData] = useState(null);

//   const [stateCode, setStateCode] = useState("");
//   const [districtCode, setDistrictCode] = useState("");
//   const [mandalCode, setMandalCode] = useState("");
//   const [villageCode, setVillageCode] = useState("");

//   useEffect(() => {
//     fetch("/lgd/lgd_all_states_ts_ap.json")
//       .then(res => res.json())
//       .then(setData)
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     if (!data || !onChange) return;

//     const state = data[stateCode]?.name || "";
//     const district =
//       data[stateCode]?.districts?.[districtCode]?.name || "";
//     const mandal =
//       data[stateCode]?.districts?.[districtCode]?.mandals?.[mandalCode]?.name ||
//       "";
//     const village =
//       data[stateCode]
//         ?.districts?.[districtCode]
//         ?.mandals?.[mandalCode]
//         ?.villages?.find(v => v.code === villageCode)?.name || "";

//     onChange({ state, district, mandal, village });
//   }, [stateCode, districtCode, mandalCode, villageCode, data]);

//   if (!data) return <p>Loading locations…</p>;

//   /* ONLY AP (28) + TS (36) */
//   const allowedStates = Object.entries(data).filter(
//     ([code]) => code === "28" || code === "36"
//   );

//   const districts =
//     stateCode ? Object.entries(data[stateCode].districts) : [];

//   const mandals =
//     districtCode
//       ? Object.entries(data[stateCode].districts[districtCode].mandals)
//       : [];

//   const villages =
//     mandalCode
//       ? data[stateCode].districts[districtCode].mandals[mandalCode].villages ||
//         []
//       : [];

//   return (
//     <div className="row g-2">
//       {/* STATE */}
//       <div className="col-md-3">
//         <select
//           className="form-select"
//           value={stateCode}
//           onChange={e => {
//             setStateCode(e.target.value);
//             setDistrictCode("");
//             setMandalCode("");
//             setVillageCode("");
//           }}
//         >
//           <option value="">Select State</option>
//           {allowedStates.map(([code, s]) => (
//             <option key={code} value={code}>
//               {s.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* DISTRICT */}
//       <div className="col-md-3">
//         <select
//           className="form-select"
//           disabled={!stateCode}
//           value={districtCode}
//           onChange={e => {
//             setDistrictCode(e.target.value);
//             setMandalCode("");
//             setVillageCode("");
//           }}
//         >
//           <option value="">Select District</option>
//           {districts.map(([code, d]) => (
//             <option key={code} value={code}>
//               {d.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* MANDAL */}
//       <div className="col-md-3">
//         <select
//           className="form-select"
//           disabled={!districtCode}
//           value={mandalCode}
//           onChange={e => {
//             setMandalCode(e.target.value);
//             setVillageCode("");
//           }}
//         >
//           <option value="">Select Mandal</option>
//           {mandals.map(([code, m]) => (
//             <option key={code} value={code}>
//               {m.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* VILLAGE */}
//       <div className="col-md-3">
//         <select
//           className="form-select"
//           disabled={!mandalCode}
//           value={villageCode}
//           onChange={e => setVillageCode(e.target.value)}
//         >
//           <option value="">Select Village</option>
//           {villages.map(v => (
//             <option key={v.code} value={v.code}>
//               {v.name}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }

// src/components/ReceiverLocationFilter.jsx
// // src/components/ReceiverLocationFilter.jsx
// import React, { useEffect, useState } from "react";

// export default function ReceiverLocationFilter({ onChange }) {
//   const [data, setData] = useState(null);

//   const [stateCode, setStateCode] = useState("");
//   const [districtCode, setDistrictCode] = useState("");
//   const [mandalCode, setMandalCode] = useState("");
//   const [villageCode, setVillageCode] = useState("");

//   useEffect(() => {
//     fetch("/lgd/lgd_all_states_ts_ap.json")
//       .then(res => res.json())
//       .then(setData)
//       .catch(console.error);
//   }, []);

//   useEffect(() => {
//     if (!data || !onChange) return;

//     const state = data[stateCode]?.name || "";
//     const district =
//       data[stateCode]?.districts?.[districtCode]?.name || "";
//     const mandal =
//       data[stateCode]?.districts?.[districtCode]?.mandals?.[mandalCode]?.name ||
//       "";
//     const village =
//       data[stateCode]
//         ?.districts?.[districtCode]
//         ?.mandals?.[mandalCode]
//         ?.villages?.find(v => v.code === villageCode)?.name || "";

//     onChange({ state, district, mandal, village });
//   }, [stateCode, districtCode, mandalCode, villageCode, data, onChange]);

//   if (!data) return <p>Loading locations…</p>;

//   /* ONLY AP (28) + TS (36) */
//   const allowedStates = Object.entries(data).filter(
//     ([code]) => code === "28" || code === "36"
//   );

//   const districts =
//     stateCode ? Object.entries(data[stateCode].districts) : [];

//   const mandals =
//     districtCode
//       ? Object.entries(data[stateCode].districts[districtCode].mandals)
//       : [];

//   const villages =
//     mandalCode
//       ? data[stateCode].districts[districtCode].mandals[mandalCode].villages ||
//         []
//       : [];

//   return (
//     <div className="row g-3">
//       {/* STATE */}
//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           value={stateCode}
//           onChange={e => {
//             setStateCode(e.target.value);
//             setDistrictCode("");
//             setMandalCode("");
//             setVillageCode("");
//           }}
//         >
//           <option value="">Select State</option>
//           {allowedStates.map(([code, s]) => (
//             <option key={code} value={code}>
//               {s.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* DISTRICT */}
//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           disabled={!stateCode}
//           value={districtCode}
//           onChange={e => {
//             setDistrictCode(e.target.value);
//             setMandalCode("");
//             setVillageCode("");
//           }}
//         >
//           <option value="">Select District</option>
//           {districts.map(([code, d]) => (
//             <option key={code} value={code}>
//               {d.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* MANDAL */}
//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           disabled={!districtCode}
//           value={mandalCode}
//           onChange={e => {
//             setMandalCode(e.target.value);
//             setVillageCode("");
//           }}
//         >
//           <option value="">Select Mandal</option>
//           {mandals.map(([code, m]) => (
//             <option key={code} value={code}>
//               {m.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* VILLAGE */}
//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           disabled={!mandalCode}
//           value={villageCode}
//           onChange={e => setVillageCode(e.target.value)}
//         >
//           <option value="">Select Village</option>
//           {villages.map(v => (
//             <option key={v.code} value={v.code}>
//               {v.name}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }
// src/components/ReceiverLocationFilter.jsx
// import React, { useEffect, useState } from "react";

// export default function ReceiverLocationFilter({ onChange }) {
//   const [data, setData] = useState(null);

//   const [stateCode, setStateCode] = useState("");
//   const [districtCode, setDistrictCode] = useState("");
//   const [mandalCode, setMandalCode] = useState("");
//   const [villageCode, setVillageCode] = useState("");

//   useEffect(() => {
//     fetch("/lgd/lgd_all_states_ts_ap.json")
//       .then(res => res.json())
//       .then(setData)
//       .catch(console.error);
//   }, []);

//   if (!data) return <p>Loading locations…</p>;

//   const emitChange = (
//     s = stateCode,
//     d = districtCode,
//     m = mandalCode,
//     v = villageCode
//   ) => {
//     const state = data[s]?.name || "";
//     const district = data[s]?.districts?.[d]?.name || "";
//     const mandal =
//       data[s]?.districts?.[d]?.mandals?.[m]?.name || "";
//     const village =
//       data[s]
//         ?.districts?.[d]
//         ?.mandals?.[m]
//         ?.villages?.find(x => x.code === v)?.name || "";

//     onChange({ state, district, mandal, village });
//   };

//   const allowedStates = Object.entries(data).filter(
//     ([code]) => code === "28" || code === "36"
//   );

//   const districts =
//     stateCode ? Object.entries(data[stateCode].districts) : [];

//   const mandals =
//     districtCode
//       ? Object.entries(data[stateCode].districts[districtCode].mandals)
//       : [];

//   const villages =
//     mandalCode
//       ? data[stateCode].districts[districtCode].mandals[mandalCode].villages ||
//         []
//       : [];

//   return (
//     <div className="row g-3">
//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           value={stateCode}
//           onChange={e => {
//             const v = e.target.value;
//             setStateCode(v);
//             setDistrictCode("");
//             setMandalCode("");
//             setVillageCode("");
//             emitChange(v, "", "", "");
//           }}
//         >
//           <option value="">Select State</option>
//           {allowedStates.map(([code, s]) => (
//             <option key={code} value={code}>{s.name}</option>
//           ))}
//         </select>
//       </div>

//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           disabled={!stateCode}
//           value={districtCode}
//           onChange={e => {
//             const v = e.target.value;
//             setDistrictCode(v);
//             setMandalCode("");
//             setVillageCode("");
//             emitChange(stateCode, v, "", "");
//           }}
//         >
//           <option value="">Select District</option>
//           {districts.map(([code, d]) => (
//             <option key={code} value={code}>{d.name}</option>
//           ))}
//         </select>
//       </div>

//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           disabled={!districtCode}
//           value={mandalCode}
//           onChange={e => {
//             const v = e.target.value;
//             setMandalCode(v);
//             setVillageCode("");
//             emitChange(stateCode, districtCode, v, "");
//           }}
//         >
//           <option value="">Select Mandal</option>
//           {mandals.map(([code, m]) => (
//             <option key={code} value={code}>{m.name}</option>
//           ))}
//         </select>
//       </div>

//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           disabled={!mandalCode}
//           value={villageCode}
//           onChange={e => {
//             const v = e.target.value;
//             setVillageCode(v);
//             emitChange(stateCode, districtCode, mandalCode, v);
//           }}
//         >
//           <option value="">Select Village</option>
//           {villages.map(v => (
//             <option key={v.code} value={v.code}>{v.name}</option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }
// src/components/ReceiverLocationFilter.jsx
// import React, { useEffect, useState } from "react";

// export default function ReceiverLocationFilter({ onChange }) {
//   const [data, setData] = useState(null);

//   const [stateCode, setStateCode] = useState("");
//   const [districtCode, setDistrictCode] = useState("");
//   const [mandalCode, setMandalCode] = useState("");
//   const [villageCode, setVillageCode] = useState("");

//   useEffect(() => {
//     fetch("/lgd/lgd_all_states_ts_ap.json")
//       .then(res => res.json())
//       .then(setData)
//       .catch(console.error);
//   }, []);

//   if (!data) return <p>Loading locations…</p>;

//   const emitChange = (
//     s = stateCode,
//     d = districtCode,
//     m = mandalCode,
//     v = villageCode
//   ) => {
//     const state = data[s]?.name || "";
//     const district = data[s]?.districts?.[d]?.name || "";
//     const mandal =
//       data[s]?.districts?.[d]?.mandals?.[m]?.name || "";
//     const village =
//       data[s]
//         ?.districts?.[d]
//         ?.mandals?.[m]
//         ?.villages?.find(x => x.code === v)?.name || "";

//     onChange({ state, district, mandal, village });
//   };

//   const allowedStates = Object.entries(data).filter(
//     ([code]) => code === "28" || code === "36"
//   );

//   const districts =
//     stateCode ? Object.entries(data[stateCode].districts) : [];

//   const mandals =
//     districtCode
//       ? Object.entries(data[stateCode].districts[districtCode].mandals)
//       : [];

//   const villages =
//     mandalCode
//       ? data[stateCode].districts[districtCode].mandals[mandalCode].villages ||
//         []
//       : [];

//   return (
//     <div className="row g-3">
//       {/* STATE */}
//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           value={stateCode}
//           onChange={e => {
//             const v = e.target.value;
//             setStateCode(v);
//             setDistrictCode("");
//             setMandalCode("");
//             setVillageCode("");
//             emitChange(v, "", "", "");
//           }}
//         >
//           <option value="">Select State</option>
//           {allowedStates.map(([code, s]) => (
//             <option key={`state-${code}`} value={code}>
//               {s.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* DISTRICT */}
//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           disabled={!stateCode}
//           value={districtCode}
//           onChange={e => {
//             const v = e.target.value;
//             setDistrictCode(v);
//             setMandalCode("");
//             setVillageCode("");
//             emitChange(stateCode, v, "", "");
//           }}
//         >
//           <option value="">Select District</option>
//           {districts.map(([code, d]) => (
//             <option key={`${stateCode}-${code}`} value={code}>
//               {d.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* MANDAL */}
//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           disabled={!districtCode}
//           value={mandalCode}
//           onChange={e => {
//             const v = e.target.value;
//             setMandalCode(v);
//             setVillageCode("");
//             emitChange(stateCode, districtCode, v, "");
//           }}
//         >
//           <option value="">Select Mandal</option>
//           {mandals.map(([code, m]) => (
//             <option key={`${districtCode}-${code}`} value={code}>
//               {m.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* VILLAGE */}
//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           disabled={!mandalCode}
//           value={villageCode}
//           onChange={e => {
//             const v = e.target.value;
//             setVillageCode(v);
//             emitChange(stateCode, districtCode, mandalCode, v);
//           }}
//         >
//           <option value="">Select Village</option>
//           {villages.map(v => (
//             <option
//               key={`${mandalCode}-${v.code}`}
//               value={v.code}
//             >
//               {v.name}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }

// // src/components/ReceiverLocationFilter.jsx
// import React, { useEffect, useState } from "react";

// export default function ReceiverLocationFilter({ onChange }) {
//   const [data, setData] = useState(null);

//   const [stateCode, setStateCode] = useState("");
//   const [districtCode, setDistrictCode] = useState("");
//   const [mandalCode, setMandalCode] = useState("");
//   const [villageCode, setVillageCode] = useState("");

//   useEffect(() => {
//     fetch("/lgd/lgd_all_states_ts_ap.json")
//       .then(res => res.json())
//       .then(setData)
//       .catch(console.error);
//   }, []);

//   if (!data) return <p>Loading locations…</p>;

//   const emitChange = (
//     s = stateCode,
//     d = districtCode,
//     m = mandalCode,
//     v = villageCode
//   ) => {
//     const state = data[s]?.name || "";
//     const district = data[s]?.districts?.[d]?.name || "";
//     const mandal =
//       data[s]?.districts?.[d]?.mandals?.[m]?.name || "";
//     const village =
//       data[s]
//         ?.districts?.[d]
//         ?.mandals?.[m]
//         ?.villages?.find(x => x.code === v)?.name || "";

//     onChange({ state, district, mandal, village });
//   };

//   const allowedStates = Object.entries(data).filter(
//     ([code]) => code === "28" || code === "36"
//   );

//   const districts =
//     stateCode ? Object.entries(data[stateCode].districts) : [];

//   const mandals =
//     districtCode
//       ? Object.entries(data[stateCode].districts[districtCode].mandals)
//       : [];

//   const villages =
//     mandalCode
//       ? data[stateCode].districts[districtCode].mandals[mandalCode].villages ||
//         []
//       : [];

//   return (
//     <div className="row g-3">
//       {/* STATE */}
//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           value={stateCode}
//           onChange={e => {
//             const v = e.target.value;
//             setStateCode(v);
//             setDistrictCode("");
//             setMandalCode("");
//             setVillageCode("");
//             emitChange(v, "", "", "");
//           }}
//         >
//           <option value="">Select State</option>
//           {allowedStates.map(([code, s], idx) => (
//             <option key={`state-${code}-${idx}`} value={code}>
//               {s.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* DISTRICT */}
//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           disabled={!stateCode}
//           value={districtCode}
//           onChange={e => {
//             const v = e.target.value;
//             setDistrictCode(v);
//             setMandalCode("");
//             setVillageCode("");
//             emitChange(stateCode, v, "", "");
//           }}
//         >
//           <option value="">Select District</option>
//           {districts.map(([code, d], idx) => (
//             <option
//               key={`${stateCode}-${code}-${idx}`}
//               value={code}
//             >
//               {d.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* MANDAL */}
//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           disabled={!districtCode}
//           value={mandalCode}
//           onChange={e => {
//             const v = e.target.value;
//             setMandalCode(v);
//             setVillageCode("");
//             emitChange(stateCode, districtCode, v, "");
//           }}
//         >
//           <option value="">Select Mandal</option>
//           {mandals.map(([code, m], idx) => (
//             <option
//               key={`${districtCode}-${code}-${idx}`}
//               value={code}
//             >
//               {m.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* VILLAGE */}
//       <div className="col-12 col-md-6">
//         <select
//           className="form-select location-select"
//           disabled={!mandalCode}
//           value={villageCode}
//           onChange={e => {
//             const v = e.target.value;
//             setVillageCode(v);
//             emitChange(stateCode, districtCode, mandalCode, v);
//           }}
//         >
//           <option value="">Select Village</option>
//           {villages.map((v, idx) => (
//             <option
//               key={`${mandalCode}-${v.code}-${idx}`}
//               value={v.code}
//             >
//               {v.name}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }
// src/components/ReceiverLocationFilter.jsx
import React, { useEffect, useState } from "react";

export default function ReceiverLocationFilter({ value, onChange }) {
  const [data, setData] = useState(null);

  const [stateCode, setStateCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [mandalCode, setMandalCode] = useState("");
  const [villageCode, setVillageCode] = useState("");

  /* ================= LOAD JSON ================= */
  useEffect(() => {
    fetch("/lgd/lgd_all_states_ts_ap.json")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  /* ================= EDIT MODE: NAME → CODE ================= */
  useEffect(() => {
    if (!data || !value?.state) return;

    // STATE
    const sEntry = Object.entries(data).find(
      ([, s]) => s.name === value.state
    );
    if (!sEntry) return;

    const [sCode, sData] = sEntry;
    setStateCode(sCode);

    // DISTRICT
    const dEntry = Object.entries(sData.districts || {}).find(
      ([, d]) => d.name === value.district
    );
    if (!dEntry) return;

    const [dCode, dData] = dEntry;
    setDistrictCode(dCode);

    // MANDAL
    const mEntry = Object.entries(dData.mandals || {}).find(
      ([, m]) => m.name === value.mandal
    );
    if (!mEntry) return;

    const [mCode, mData] = mEntry;
    setMandalCode(mCode);

    // VILLAGE
    const vEntry = (mData.villages || []).find(
      v => v.name === value.village
    );
    if (vEntry) setVillageCode(vEntry.code);
  }, [data, value]);

  /* ================= EMIT CHANGE ================= */
  useEffect(() => {
    if (!data) return;

    const state = data[stateCode]?.name || "";
    const district =
      data[stateCode]?.districts?.[districtCode]?.name || "";
    const mandal =
      data[stateCode]?.districts?.[districtCode]?.mandals?.[mandalCode]
        ?.name || "";
    const village =
      data[stateCode]
        ?.districts?.[districtCode]
        ?.mandals?.[mandalCode]
        ?.villages?.find(v => v.code === villageCode)?.name || "";

    onChange({ state, district, mandal, village });
  }, [stateCode, districtCode, mandalCode, villageCode, data]);

  if (!data) return <p>Loading locations…</p>;

  const allowedStates = Object.entries(data).filter(
    ([code]) => code === "28" || code === "36"
  );

  const districts = stateCode
    ? Object.entries(data[stateCode].districts)
    : [];

  const mandals = districtCode
    ? Object.entries(data[stateCode].districts[districtCode].mandals)
    : [];

  const villages = mandalCode
    ? data[stateCode].districts[districtCode].mandals[mandalCode].villages || []
    : [];

  return (
    <div className="row g-3">
      {/* STATE */}
      <div className="col-12 col-md-6">
        <select
          className="form-select location-select"
          value={stateCode}
          onChange={e => {
            setStateCode(e.target.value);
            setDistrictCode("");
            setMandalCode("");
            setVillageCode("");
          }}
        >
          <option value="">Select State</option>
          {allowedStates.map(([code, s]) => (
            <option key={code} value={code}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* DISTRICT */}
      <div className="col-12 col-md-6">
        <select
          className="form-select location-select"
          disabled={!stateCode}
          value={districtCode}
          onChange={e => {
            setDistrictCode(e.target.value);
            setMandalCode("");
            setVillageCode("");
          }}
        >
          <option value="">Select District</option>
          {districts.map(([code, d]) => (
            <option key={code} value={code}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* MANDAL */}
      <div className="col-12 col-md-6">
        <select
          className="form-select location-select"
          disabled={!districtCode}
          value={mandalCode}
          onChange={e => {
            setMandalCode(e.target.value);
            setVillageCode("");
          }}
        >
          <option value="">Select Mandal</option>
          {mandals.map(([code, m]) => (
            <option key={code} value={code}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* VILLAGE */}
      <div className="col-12 col-md-6">
        <select
          className="form-select location-select"
          disabled={!mandalCode}
          value={villageCode}
          onChange={e => setVillageCode(e.target.value)}
        >
          <option value="">Select Village</option>
          {villages.map(v => (
            <option key={v.code} value={v.code}>
              {v.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
