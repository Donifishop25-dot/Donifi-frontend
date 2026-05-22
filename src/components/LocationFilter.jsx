
// import React, { useEffect, useState } from "react";

// export default function LocationFilter() {
//   const [data, setData] = useState(null);

//   const [stateCode, setStateCode] = useState("");
//   const [districtCode, setDistrictCode] = useState("");
//   const [mandalCode, setMandalCode] = useState("");

//   useEffect(() => {
//     fetch("/lgd/lgd_all_states_ts_ap.json")
//       .then(res => res.json())
//       .then(json => setData(json))
//       .catch(err => {
//         console.error("Failed to load LGD JSON", err);
//       });
//   }, []);

//   if (!data) {
//     return <p className="text-center">Loading locations…</p>;
//   }

//   const states = Object.entries(data);

//   const districts =
//     stateCode && data[stateCode]
//       ? Object.entries(data[stateCode].districts)
//       : [];

//   const mandals =
//     stateCode && districtCode
//       ? Object.entries(
//           data[stateCode].districts[districtCode].mandals
//         )
//       : [];

//   const villages =
//   stateCode && districtCode && mandalCode
//     ? data[stateCode]
//         ?.districts?.[districtCode]
//         ?.mandals?.[mandalCode]
//         ?.villages ?? []
//     : [];

// const isVillageSupported = villages.length > 0;

//   return (
//     <div className="container mb-4">
//       <div className="row g-2">

//         {/* STATE */}
//         <div className="col-md-3">
//           <select
//             className="form-select"
//             value={stateCode}
//             onChange={e => {
//               setStateCode(e.target.value);
//               setDistrictCode("");
//               setMandalCode("");
//             }}
//           >
//             <option value="">Select State</option>
//             {states.map(([code, s]) => (
//               <option key={code} value={code}>
//                 {s.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* DISTRICT */}
//         <div className="col-md-3">
//           <select
//             className="form-select"
//             disabled={!stateCode}
//             value={districtCode}
//             onChange={e => {
//               setDistrictCode(e.target.value);
//               setMandalCode("");
//             }}
//           >
//             <option value="">Select District</option>
//             {districts.map(([code, d]) => (
//               <option key={code} value={code}>
//                 {d.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* MANDAL */}
//         <div className="col-md-3">
//           <select
//             className="form-select"
//             disabled={!districtCode}
//             value={mandalCode}
//             onChange={e => setMandalCode(e.target.value)}
//           >
//             <option value="">Select Mandal</option>
//             {mandals.map(([code, m]) => (
//               <option key={code} value={code}>
//                 {m.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* VILLAGE */}
// <div className="col-md-3">
//   <select
//     className="form-select"
//     disabled={!mandalCode || !isVillageSupported}
//     data-bs-toggle={
//       mandalCode && !isVillageSupported ? "tooltip" : undefined
//     }
//     data-bs-placement="top"
//     title={
//       mandalCode && !isVillageSupported
//         ? "Villages are currently available only for Telangana & Andhra Pradesh"
//         : ""
//     }
//   >
//     <option value="">Select Village</option>

//     {isVillageSupported &&
//       villages.map(v => (
//         <option key={v.code}>{v.name}</option>
//       ))}
//   </select>
// </div>


//       </div>
//     </div>
//   );
// }

// src/components/LocationFilter.jsx
// import React, { useEffect, useState } from "react";

// export default function LocationFilter() {
//   const [data, setData] = useState(null);

//   const [stateCode, setStateCode] = useState("");
//   const [districtCode, setDistrictCode] = useState("");
//   const [mandalCode, setMandalCode] = useState("");

//   useEffect(() => {
//     fetch("/lgd/lgd_all_states_ts_ap.json")
//       .then(res => res.json())
//       .then(json => setData(json))
//       .catch(err => {
//         console.error("Failed to load LGD JSON", err);
//       });
//   }, []);

//   if (!data) {
//     return <p className="text-center">Loading locations…</p>;
//   }

//   /* ✅ ONLY ANDHRA PRADESH (28) & TELANGANA (36) */
//   const allowedStates = Object.entries(data).filter(
//     ([code]) => code === "28" || code === "36"
//   );

//   const districts =
//     stateCode && data[stateCode]
//       ? Object.entries(data[stateCode].districts)
//       : [];

//   const mandals =
//     stateCode && districtCode
//       ? Object.entries(
//           data[stateCode].districts[districtCode].mandals
//         )
//       : [];

//   const villages =
//     stateCode && districtCode && mandalCode
//       ? data[stateCode]
//           ?.districts?.[districtCode]
//           ?.mandals?.[mandalCode]
//           ?.villages ?? []
//       : [];

//   const isVillageSupported = villages.length > 0;

//   return (
//     <div className="container mb-4">
//       <div className="row g-2">

//         {/* STATE */}
//         <div className="col-md-3">
//           <select
//             className="form-select"
//             value={stateCode}
//             onChange={e => {
//               setStateCode(e.target.value);
//               setDistrictCode("");
//               setMandalCode("");
//             }}
//           >
//             <option value="">Select State</option>
//             {allowedStates.map(([code, s]) => (
//               <option key={code} value={code}>
//                 {s.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* DISTRICT */}
//         <div className="col-md-3">
//           <select
//             className="form-select"
//             disabled={!stateCode}
//             value={districtCode}
//             onChange={e => {
//               setDistrictCode(e.target.value);
//               setMandalCode("");
//             }}
//           >
//             <option value="">Select District</option>
//             {districts.map(([code, d]) => (
//               <option key={code} value={code}>
//                 {d.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* MANDAL */}
//         <div className="col-md-3">
//           <select
//             className="form-select"
//             disabled={!districtCode}
//             value={mandalCode}
//             onChange={e => setMandalCode(e.target.value)}
//           >
//             <option value="">Select Mandal</option>
//             {mandals.map(([code, m]) => (
//               <option key={code} value={code}>
//                 {m.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* VILLAGE */}
//         <div className="col-md-3">
//           <select
//             className="form-select"
//             disabled={!mandalCode || !isVillageSupported}
//             data-bs-toggle={
//               mandalCode && !isVillageSupported ? "tooltip" : undefined
//             }
//             data-bs-placement="top"
//             title={
//               mandalCode && !isVillageSupported
//                 ? "Villages are currently available only for Telangana & Andhra Pradesh"
//                 : ""
//             }
//           >
//             <option value="">Select Village</option>

//             {isVillageSupported &&
//               villages.map(v => (
//                 <option key={v.code} value={v.code}>
//                   {v.name}
//                 </option>
//               ))}
//           </select>
//         </div>

//       </div>
//     </div>
//   );
// }
// src/components/LocationFilter.jsx
import React, { useEffect, useState } from "react";

export default function LocationFilter({ onChange }) {
  const [data, setData] = useState(null);

  const [stateCode, setStateCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [mandalCode, setMandalCode] = useState("");
  const [villageCode, setVillageCode] = useState("");

  useEffect(() => {
    fetch("/lgd/lgd_all_states_ts_ap.json")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Failed to load LGD JSON", err));
  }, []);

  if (!data) return <p className="text-center">Loading locations…</p>;

  /* ✅ Only AP (28) & Telangana (36) */
  const allowedStates = Object.entries(data).filter(
    ([code]) => code === "28" || code === "36"
  );

  const districts =
    stateCode ? Object.entries(data[stateCode].districts) : [];

  const mandals =
    districtCode
      ? Object.entries(data[stateCode].districts[districtCode].mandals)
      : [];

  const villages =
    mandalCode
      ? data[stateCode]
          ?.districts?.[districtCode]
          ?.mandals?.[mandalCode]
          ?.villages ?? []
      : [];

  const emitChange = (s, d, m, v) => {
    onChange?.({
      state: data[s]?.name || "",
      district: data[s]?.districts?.[d]?.name || "",
      mandal: data[s]?.districts?.[d]?.mandals?.[m]?.name || "",
      village:
        data[s]?.districts?.[d]?.mandals?.[m]?.villages?.find(
          x => x.code === v
        )?.name || ""
    });
  };

  return (
    <div className="row g-2">
      {/* STATE */}
      <div className="col-md-3">
        <select
          className="form-select"
          value={stateCode}
          onChange={e => {
            const v = e.target.value;
            setStateCode(v);
            setDistrictCode("");
            setMandalCode("");
            setVillageCode("");
            emitChange(v, "", "", "");
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
      <div className="col-md-3">
        <select
          className="form-select"
          disabled={!stateCode}
          value={districtCode}
          onChange={e => {
            const v = e.target.value;
            setDistrictCode(v);
            setMandalCode("");
            setVillageCode("");
            emitChange(stateCode, v, "", "");
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
      <div className="col-md-3">
        <select
          className="form-select"
          disabled={!districtCode}
          value={mandalCode}
          onChange={e => {
            const v = e.target.value;
            setMandalCode(v);
            setVillageCode("");
            emitChange(stateCode, districtCode, v, "");
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
      <div className="col-md-3">
        <select
          className="form-select"
          disabled={!mandalCode}
          value={villageCode}
          onChange={e => {
            const v = e.target.value;
            setVillageCode(v);
            emitChange(stateCode, districtCode, mandalCode, v);
          }}
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
