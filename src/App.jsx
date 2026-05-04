import { useState, useEffect, useRef } from "react";

// ─── THEME & GLOBAL STYLES ───────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --navy: #0a1628;
      --navy-2: #0f2044;
      --navy-3: #1a3a6e;
      --blue: #1e56d9;
      --blue-light: #4a7fee;
      --cyan: #00c8e0;
      --cyan-dim: #00c8e022;
      --green: #00d68f;
      --green-dim: #00d68f20;
      --amber: #ffb800;
      --amber-dim: #ffb80020;
      --red: #ff4757;
      --red-dim: #ff475720;
      --purple: #8b5cf6;
      --purple-dim: #8b5cf620;
      --text: #e2eaff;
      --text-2: #8fa4cc;
      --text-3: #4a6080;
      --border: #1e3a5f;
      --border-2: #0f2a4a;
      --card: #0d1f3c;
      --card-2: #0a1830;
      --sidebar-w: 240px;
      --header-h: 56px;
      --bottom-nav-h: 60px;
    }

    /* ── RESPONSIVE OVERRIDES ── */
    @media (max-width: 1024px) {
      :root { --sidebar-w: 64px; }
    }
    @media (max-width: 640px) {
      :root { --sidebar-w: 0px; --header-h: 50px; }
    }

    body {
      font-family: 'IBM Plex Sans', sans-serif;
      background: var(--navy);
      color: var(--text);
      overflow: hidden;
      -webkit-text-size-adjust: 100%;
      touch-action: manipulation;
    }

    /* Scrollbars */
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: var(--navy-2); }
    ::-webkit-scrollbar-thumb { background: var(--navy-3); border-radius: 3px; }

    button { cursor: pointer; font-family: inherit; -webkit-tap-highlight-color: transparent; }
    input, select, textarea { font-family: inherit; -webkit-appearance: none; }
    .mono { font-family: 'IBM Plex Mono', monospace; }

    /* ── MOBILE BOTTOM NAV ── */
    .bottom-nav {
      display: none;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: var(--bottom-nav-h);
      background: var(--card-2);
      border-top: 1px solid var(--border);
      z-index: 200;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .bottom-nav::-webkit-scrollbar { display: none; }
    .bottom-nav-inner {
      display: flex;
      align-items: stretch;
      height: 100%;
      min-width: max-content;
      padding: 0 4px;
    }
    @media (max-width: 640px) {
      .bottom-nav { display: block; }
      .desktop-sidebar { display: none !important; }
      .main-content-area { padding-bottom: var(--bottom-nav-h) !important; }
    }

    /* ── TABLET ICON SIDEBAR ── */
    @media (min-width: 641px) and (max-width: 1024px) {
      .sidebar-label { display: none !important; }
      .sidebar-badge { display: none !important; }
      .sidebar-logo-text { display: none !important; }
      .sidebar-user-name { display: none !important; }
    }

    /* ── RESPONSIVE TABLES ── */
    @media (max-width: 900px) {
      .resp-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .resp-hide-sm { display: none !important; }
    }
    @media (max-width: 640px) {
      .resp-hide-xs { display: none !important; }
      .resp-full-xs { width: 100% !important; max-width: 100% !important; }
      .resp-p-xs { padding: 10px 12px !important; }
      .resp-grid-1 { grid-template-columns: 1fr !important; }
      .resp-grid-2 { grid-template-columns: 1fr 1fr !important; }
      .resp-font-sm { font-size: 11px !important; }
    }

    /* ── TOUCH TARGETS ── */
    @media (max-width: 1024px) {
      button { min-height: 36px; }
      input, select { min-height: 36px; font-size: 16px !important; }
    }

    /* ── MODAL RESPONSIVE ── */
    @media (max-width: 640px) {
      .resp-modal {
        width: 100% !important;
        max-width: 100% !important;
        height: 100% !important;
        max-height: 100% !important;
        border-radius: 0 !important;
        margin: 0 !important;
      }
      .resp-modal-inner {
        position: fixed !important;
        inset: 0 !important;
        border-radius: 0 !important;
      }
    }

    /* ── MOBILE DRAWER OVERLAY ── */
    .mobile-drawer-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      z-index: 300;
    }
    .mobile-drawer {
      position: fixed;
      top: 0; left: 0; bottom: 0;
      width: 260px;
      background: var(--card-2);
      border-right: 1px solid var(--border);
      z-index: 301;
      display: flex;
      flex-direction: column;
      transform: translateX(-100%);
      transition: transform 0.25s ease;
    }
    .mobile-drawer.open { transform: translateX(0); }
    @media (max-width: 640px) {
      .mobile-drawer-overlay.open { display: block; }
    }

    /* ── PREVENT BODY SCROLL WHEN DRAWER OPEN ── */
    body.drawer-open { overflow: hidden; }

    /* ── STAT CARDS RESPONSIVE ── */
    @media (max-width: 640px) {
      .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .stat-grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
    }

    /* ── HEADER RESPONSIVE ── */
    @media (max-width: 640px) {
      .header-search { display: none !important; }
      .header-status { display: none !important; }
    }

    /* Safe area for notched phones */
    @supports (padding: env(safe-area-inset-bottom)) {
      .bottom-nav { padding-bottom: env(safe-area-inset-bottom); height: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom)); }
      .main-content-area { padding-bottom: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom)) !important; }
    }
  `}</style>
);

// ─── RESPONSIVE HOOKS ────────────────────────────────────────────────────────
const useIsMobile = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return { isMobile: w <= 640, isTablet: w > 640 && w <= 1024, isDesktop: w > 1024, width: w };
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const PATIENTS = [
  { id: "P001", name: "Margaret Chen", dob: "1962-03-15", gender: "F", mrn: "MRN-2024-001", phone: "555-0101", insurance: "BlueCross #BC789012", allergies: ["Penicillin", "Sulfa"], bloodType: "A+", pcp: "Dr. Sarah Ellison", status: "Inpatient", room: "3B-412", admitDate: "2025-02-28", diagnosis: "Pneumonia" },
  { id: "P002", name: "James Whitfield", dob: "1948-07-22", gender: "M", mrn: "MRN-2024-002", phone: "555-0102", insurance: "Medicare #MED456789", allergies: ["Aspirin"], bloodType: "O-", pcp: "Dr. Marcus Rivera", status: "Ambulatory", room: null, admitDate: null, diagnosis: "Type 2 Diabetes" },
  { id: "P003", name: "Sofia Ramirez", dob: "1985-11-08", gender: "F", mrn: "MRN-2024-003", phone: "555-0103", insurance: "Aetna #AE334455", allergies: [], bloodType: "B+", pcp: "Dr. Sarah Ellison", status: "Inpatient", room: "2C-208", admitDate: "2025-03-01", diagnosis: "Post-op Hip Replacement" },
  { id: "P004", name: "Robert Nakamura", dob: "1971-05-30", gender: "M", mrn: "MRN-2024-004", phone: "555-0104", insurance: "United #UN998877", allergies: ["Codeine", "Latex"], bloodType: "AB+", pcp: "Dr. Marcus Rivera", status: "Discharged", room: null, admitDate: "2025-02-20", diagnosis: "Appendectomy" },
  { id: "P005", name: "Diane Okafor", dob: "1990-09-14", gender: "F", mrn: "MRN-2024-005", phone: "555-0105", insurance: "Cigna #CI112233", allergies: ["Ibuprofen"], bloodType: "O+", pcp: "Dr. Lisa Park", status: "Scheduled", room: null, admitDate: null, diagnosis: "Routine Checkup" },
];

const VITALS_DATA = {
  P001: [{ date: "2025-03-05 08:00", bp: "138/88", hr: 92, temp: 101.4, spo2: 94, rr: 22, wt: 142 }, { date: "2025-03-05 14:00", bp: "134/82", hr: 88, temp: 100.8, spo2: 95, rr: 20, wt: 142 }, { date: "2025-03-06 08:00", bp: "128/76", hr: 84, temp: 99.2, spo2: 97, rr: 18, wt: 142 }],
  P002: [{ date: "2025-03-06 10:00", bp: "142/90", hr: 78, temp: 98.6, spo2: 98, rr: 16, wt: 198 }],
  P003: [{ date: "2025-03-01 18:00", bp: "118/72", hr: 76, temp: 98.8, spo2: 99, rr: 14, wt: 135 }, { date: "2025-03-02 08:00", bp: "120/74", hr: 78, temp: 98.6, spo2: 99, rr: 14, wt: 135 }],
};

const MEDS_DATA = {
  P001: [
    { id: "RX001", drug: "Azithromycin", dose: "500mg", route: "IV", freq: "Q24H", start: "2025-02-28", status: "Active", prescriber: "Dr. Ellison", indication: "Pneumonia" },
    { id: "RX002", drug: "Ceftriaxone", dose: "1g", route: "IV", freq: "Q12H", start: "2025-02-28", status: "Active", prescriber: "Dr. Ellison", indication: "Pneumonia" },
    { id: "RX003", drug: "Albuterol", dose: "2.5mg", route: "NEB", freq: "Q4H PRN", start: "2025-02-28", status: "Active", prescriber: "Dr. Ellison", indication: "Bronchospasm" },
  ],
  P002: [
    { id: "RX004", drug: "Metformin", dose: "1000mg", route: "PO", freq: "BID", start: "2024-06-01", status: "Active", prescriber: "Dr. Rivera", indication: "DM Type 2" },
    { id: "RX005", drug: "Lisinopril", dose: "10mg", route: "PO", freq: "QD", start: "2024-06-01", status: "Active", prescriber: "Dr. Rivera", indication: "HTN" },
  ],
  P003: [
    { id: "RX006", drug: "Oxycodone/APAP", dose: "5/325mg", route: "PO", freq: "Q4-6H PRN", start: "2025-03-01", status: "Active", prescriber: "Dr. Ellison", indication: "Post-op pain" },
    { id: "RX007", drug: "Enoxaparin", dose: "40mg", route: "SQ", freq: "QD", start: "2025-03-01", status: "Active", prescriber: "Dr. Ellison", indication: "DVT prophylaxis" },
    { id: "RX008", drug: "Cefazolin", dose: "1g", route: "IV", freq: "Q8H", start: "2025-03-01", status: "Discontinued", prescriber: "Dr. Ellison", indication: "Surgical prophylaxis" },
  ],
};

const LAB_DATA = {
  P001: [
    { id: "L001", test: "CBC with Differential", ordered: "2025-02-28 08:30", resulted: "2025-02-28 10:15", status: "Final", orderedBy: "Dr. Ellison", results: [{ name: "WBC", value: "14.2", unit: "K/uL", ref: "4.5-11.0", flag: "H" }, { name: "RBC", value: "4.1", unit: "M/uL", ref: "4.2-5.8", flag: "L" }, { name: "HGB", value: "12.4", unit: "g/dL", ref: "13.5-17.5", flag: "L" }, { name: "HCT", value: "37.2", unit: "%", ref: "41-53", flag: "L" }, { name: "PLT", value: "312", unit: "K/uL", ref: "150-400", flag: "" }] },
    { id: "L002", test: "BMP", ordered: "2025-02-28 08:30", resulted: "2025-02-28 10:20", status: "Final", orderedBy: "Dr. Ellison", results: [{ name: "Sodium", value: "138", unit: "mEq/L", ref: "136-145", flag: "" }, { name: "Potassium", value: "3.8", unit: "mEq/L", ref: "3.5-5.1", flag: "" }, { name: "Creatinine", value: "1.1", unit: "mg/dL", ref: "0.7-1.3", flag: "" }, { name: "BUN", value: "22", unit: "mg/dL", ref: "7-25", flag: "" }, { name: "Glucose", value: "108", unit: "mg/dL", ref: "70-99", flag: "H" }] },
    { id: "L003", test: "Procalcitonin", ordered: "2025-03-05 08:00", resulted: "2025-03-05 09:45", status: "Final", orderedBy: "Dr. Ellison", results: [{ name: "Procalcitonin", value: "2.4", unit: "ng/mL", ref: "<0.1", flag: "H" }] },
    { id: "L004", test: "Blood Culture x2", ordered: "2025-02-28 09:00", resulted: null, status: "Pending", orderedBy: "Dr. Ellison", results: [] },
  ],
  P002: [
    { id: "L005", test: "HbA1c", ordered: "2025-03-06 10:00", resulted: "2025-03-06 11:30", status: "Final", orderedBy: "Dr. Rivera", results: [{ name: "HbA1c", value: "7.8", unit: "%", ref: "<7.0", flag: "H" }] },
    { id: "L006", test: "CMP", ordered: "2025-03-06 10:00", resulted: "2025-03-06 11:45", status: "Final", orderedBy: "Dr. Rivera", results: [{ name: "Glucose", value: "142", unit: "mg/dL", ref: "70-99", flag: "H" }, { name: "BUN", value: "18", unit: "mg/dL", ref: "7-25", flag: "" }, { name: "Creatinine", value: "0.9", unit: "mg/dL", ref: "0.7-1.3", flag: "" }] },
  ],
};

const RADIOLOGY_DATA = {
  P001: [
    { id: "R001", study: "Chest X-Ray PA/Lateral", ordered: "2025-02-28 08:35", performed: "2025-02-28 11:00", status: "Final", modality: "XR", orderedBy: "Dr. Ellison", radiologist: "Dr. Patel", impression: "Bilateral infiltrates consistent with pneumonia. No pleural effusion. No pneumothorax.", findings: "Bilateral patchy airspace opacities, right > left. Cardiac silhouette within normal limits. No acute osseous abnormality." },
    { id: "R002", study: "CT Chest w/o Contrast", ordered: "2025-03-01 09:00", performed: "2025-03-01 14:30", status: "Final", modality: "CT", orderedBy: "Dr. Ellison", radiologist: "Dr. Patel", impression: "Multifocal pneumonia. No pulmonary embolism on limited evaluation.", findings: "Consolidation in right lower lobe and left lower lobe. Ground glass opacities bilaterally. No pleural effusion." },
  ],
  P003: [
    { id: "R003", study: "Hip X-Ray L AP/Lateral", ordered: "2025-03-01 16:00", performed: "2025-03-01 17:00", status: "Final", modality: "XR", orderedBy: "Dr. Ellison", radiologist: "Dr. Kim", impression: "Total hip arthroplasty left side. Hardware in good position. No acute complication.", findings: "Left total hip arthroplasty with femoral stem and acetabular component in appropriate position. No hardware failure or periprosthetic fracture identified." },
  ],
};

const NOTES_DATA = {
  P001: [
    { id: "N001", type: "H&P", author: "Dr. Ellison", role: "Attending Physician", date: "2025-02-28 09:30", signed: true, content: "CHIEF COMPLAINT: Cough, fever, shortness of breath x 5 days\n\nHPI: Ms. Chen is a 63-year-old female with PMH of HTN and mild asthma who presents with worsening cough productive of yellow-green sputum, fever to 102°F, and dyspnea on exertion for 5 days. She reports associated chills, night sweats, and decreased appetite. Denies chest pain, hemoptysis, or leg swelling.\n\nPAST MEDICAL HISTORY:\n- Hypertension (diagnosed 2018)\n- Mild persistent asthma\n- GERD\n\nMEDICATIONS: Lisinopril 10mg daily, Fluticasone inhaler, Famotidine 20mg daily\n\nALLERGIES: Penicillin (rash), Sulfa (GI intolerance)\n\nPHYSICAL EXAM:\nVitals: T 101.4°F, BP 138/88, HR 92, RR 22, SpO2 94% on RA\nGeneral: Ill-appearing, diaphoretic\nRespiratory: Decreased breath sounds bilateral bases, dullness to percussion right base, crackles bilateral\nCardiac: RRR, no murmurs\n\nASSESSMENT & PLAN:\n1. Community-acquired pneumonia - severity score PORT Class III\n   - IV Ceftriaxone + Azithromycin\n   - Supplemental oxygen to maintain SpO2 >95%\n   - Blood cultures x2, respiratory culture\n   - Chest X-ray\n2. Asthma exacerbation - Albuterol nebulization Q4H PRN\n3. HTN - Continue home Lisinopril" },
    { id: "N002", type: "Nursing Note", author: "RN Jennifer Torres", role: "Registered Nurse", date: "2025-02-28 14:00", signed: true, content: "Patient is alert and oriented x3. Received per report from ED. IV access x2 established (18g R antecubital, 20g L hand). IV antibiotics initiated per order. O2 via nasal cannula at 2L/min with SpO2 94-96%. Patient tolerating fluids. Appetite poor. Teaching provided regarding medication purpose and respiratory precautions. Call light within reach. Side rails up x2." },
    { id: "N003", type: "Progress Note", author: "Dr. Ellison", role: "Attending Physician", date: "2025-03-06 08:45", signed: true, content: "SUBJECTIVE: Patient reports improved cough, fever resolved overnight. Still some mild dyspnea with ambulation but significantly better than admission.\n\nOBJECTIVE:\nVitals: T 99.2°F, BP 128/76, HR 84, RR 18, SpO2 97% on RA\nExam: Improved breath sounds bilaterally, decreased crackles\nLabs: WBC trending down from 14.2 → 11.8, Procalcitonin 0.8\n\nASSESSMENT: CAP - improving on IV antibiotics\n\nPLAN:\n- Transition to PO Azithromycin 500mg daily today\n- Continue monitoring\n- Target discharge tomorrow if continues to improve\n- Discharge planning initiated with case management" },
  ],
  P002: [
    { id: "N004", type: "Office Visit Note", author: "Dr. Rivera", role: "Attending Physician", date: "2025-03-06 10:30", signed: true, content: "SUBJECTIVE: Mr. Whitfield presents for 3-month diabetes follow-up. Reports checking blood sugars at home 2x/day, fasting glucose typically 130-160. Diet adherent about 70%. Walking 20 min/day. Denies hypoglycemia, polyuria, or vision changes.\n\nOBJECTIVE:\nVitals: BP 142/90, HR 78, Wt 198 lbs\nHbA1c today: 7.8% (up from 7.4% three months ago)\nFoot exam: Intact sensation bilateral, pulses palpable\n\nASSESSMENT:\n1. Type 2 DM - suboptimally controlled, HbA1c trending up\n2. HTN - borderline control\n\nPLAN:\n1. Increase Metformin to 1000mg BID (from 500mg BID)\n2. Refer to diabetes education program\n3. Nutrition counseling referral\n4. Increase Lisinopril to 20mg daily\n5. Return in 3 months, HbA1c at that visit" },
  ],
};

const APPOINTMENTS = [
  { id: "APT001", patientId: "P005", patientName: "Diane Okafor", date: "2025-03-07", time: "09:00", type: "New Patient", provider: "Dr. Lisa Park", dept: "Internal Medicine", status: "Confirmed", reason: "Annual physical" },
  { id: "APT002", patientId: "P002", patientName: "James Whitfield", date: "2025-03-07", time: "10:30", type: "Follow-up", provider: "Dr. Marcus Rivera", dept: "Endocrinology", status: "Confirmed", reason: "Diabetes management" },
  { id: "APT003", patientId: "P004", patientName: "Robert Nakamura", date: "2025-03-07", time: "14:00", type: "Post-op", provider: "Dr. Sarah Ellison", dept: "Surgery", status: "Pending", reason: "Post-appendectomy check" },
  { id: "APT004", patientId: "P005", patientName: "Diane Okafor", date: "2025-03-10", time: "11:00", type: "Lab", provider: "Lab Services", dept: "Laboratory", status: "Scheduled", reason: "Routine labs" },
  { id: "APT005", patientId: "P002", patientName: "James Whitfield", date: "2025-03-14", time: "09:30", type: "Follow-up", provider: "Dr. Marcus Rivera", dept: "Endocrinology", status: "Scheduled", reason: "BP check" },
];

const BILLING_DATA = {
  P001: { charges: [{ code: "99233", desc: "Subsequent Inpatient Visit - High", qty: 6, unit: 185.00, total: 1110.00, date: "2025-03-01" }, { code: "71046", desc: "Chest X-ray 2 views", qty: 1, unit: 320.00, total: 320.00, date: "2025-02-28" }, { code: "74177", desc: "CT Chest w/o contrast", qty: 1, unit: 1850.00, total: 1850.00, date: "2025-03-01" }, { code: "J0690", desc: "Ceftriaxone 500mg IV", qty: 12, unit: 42.00, total: 504.00, date: "2025-02-28" }, { code: "J0456", desc: "Azithromycin 500mg IV", qty: 6, unit: 38.00, total: 228.00, date: "2025-02-28" }, { code: "99221", desc: "Initial Inpatient H&P", qty: 1, unit: 320.00, total: 320.00, date: "2025-02-28" }], insurance: "BlueCross #BC789012", totalCharges: 4332.00, insuranceAdj: 1732.80, patientResp: 866.40, paidAmt: 0, status: "Pending" },
  P002: { charges: [{ code: "99213", desc: "Office Visit - Established", qty: 1, unit: 165.00, total: 165.00, date: "2025-03-06" }, { code: "83036", desc: "HbA1c", qty: 1, unit: 45.00, total: 45.00, date: "2025-03-06" }, { code: "80048", desc: "CMP", qty: 1, unit: 52.00, total: 52.00, date: "2025-03-06" }], insurance: "Medicare #MED456789", totalCharges: 262.00, insuranceAdj: 105.00, patientResp: 31.40, paidAmt: 31.40, status: "Paid" },
};

// ─── UTILITY ──────────────────────────────────────────────────────────────────
const statusColor = (s) => ({ Inpatient:"--amber", Ambulatory:"--cyan", Discharged:"--text-3", Scheduled:"--purple", Active:"--green", Discontinued:"--red", Final:"--green", Pending:"--amber", Confirmed:"--green", "H":"--red", "L":"--cyan", "":"--text-2" })[s] || "--text-2";
const flagStyle = (f) => f === "H" ? { color: "#ff4757", fontWeight: 700 } : f === "L" ? { color: "#00c8e0", fontWeight: 700 } : {};
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "--";
const calcAge = (dob) => Math.floor((Date.now() - new Date(dob)) / 31557600000);

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    bed: "M2 4v16M2 8h18a2 2 0 0 1 2 2v6H2 M6 8v-4",
    pill: "M10.5 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7 M16 19h6 M19 16v6",
    flask: "M9 3h6l1 9H8L9 3z M6.5 12C6.5 12 4 16 4 18a6 6 0 0 0 12 0c0-2-2.5-6-2.5-6",
    radio: "M5 12.5C5 12.5 4 10 4 7a8 8 0 0 1 16 0c0 3-1 5.5-1 5.5 M12 19a7 7 0 0 1-7-7 M12 19a7 7 0 0 0 7-7",
    xray: "M8 2h8l4 4v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6l4-4z M9 9h6 M9 13h6 M9 17h4",
    notes: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    billing: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z M12 6v6l4 2",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
    alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
    check: "M20 6L9 17l-5-5",
    plus: "M12 5v14M5 12h14",
    search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
    heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    door: "M13 2H3a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h18V4a2 2 0 0 0-2-2h-6z M13 2v20 M9 12h.01",
    activity: "M22 12h-4l-3 9L9 3l-3 9H2",
    file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
    edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    printer: "M6 9V2h12v7 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v8H6z",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
    info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8v4 M12 16h.01",
    arrow_right: "M5 12h14M12 5l7 7-7 7",
    close: "M18 6L6 18M6 6l12 12",
    save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8",
    discharge: "M16 16l4 4M20 16l-4 4 M8 12H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16"
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {(icons[name] || "").split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : "M" + d} />
      ))}
    </svg>
  );
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
const Badge = ({ label, variant = "default" }) => {
  const colors = {
    Inpatient: { bg: "#ffb80018", color: "#ffb800", border: "#ffb80040" },
    Ambulatory: { bg: "#00c8e018", color: "#00c8e0", border: "#00c8e040" },
    Discharged: { bg: "#4a608018", color: "#8fa4cc", border: "#4a608040" },
    Scheduled: { bg: "#8b5cf618", color: "#8b5cf6", border: "#8b5cf640" },
    Active: { bg: "#00d68f18", color: "#00d68f", border: "#00d68f40" },
    Discontinued: { bg: "#ff475718", color: "#ff4757", border: "#ff475740" },
    Final: { bg: "#00d68f18", color: "#00d68f", border: "#00d68f40" },
    Pending: { bg: "#ffb80018", color: "#ffb800", border: "#ffb80040" },
    Confirmed: { bg: "#00d68f18", color: "#00d68f", border: "#00d68f40" },
    Paid: { bg: "#00d68f18", color: "#00d68f", border: "#00d68f40" },
    default: { bg: "#1e3a5f18", color: "#8fa4cc", border: "#1e3a5f40" },
  };
  const c = colors[label] || colors.default;
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
const Card = ({ children, style, className }) => (
  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, ...style }} className={className}>
    {children}
  </div>
);

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title, action }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--cyan)", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
      <Icon name={icon} size={14} />
      {title}
    </div>
    {action}
  </div>
);

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
const Login = ({ onLogin }) => {
  const [user, setUser] = useState("dr.ellison");
  const [pass, setPass] = useState("password");
  const [role, setRole] = useState("physician");
  const roles = [
    { id: "physician", label: "Physician", color: "#4a7fee" },
    { id: "nurse", label: "Nurse", color: "#00d68f" },
    { id: "pharmacist", label: "Pharmacist", color: "#8b5cf6" },
    { id: "billing", label: "Billing", color: "#ffb800" },
  ];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #060e1e 0%, #0a1628 50%, #0d1f3c 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 20%, #1e56d920 0%, transparent 50%), radial-gradient(circle at 80% 80%, #00c8e015 0%, transparent 50%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--cyan), transparent)" }} />
      <div style={{ position: "relative", width: 420, padding: "48px 40px", background: "rgba(13,31,60,0.95)", border: "1px solid var(--border)", borderRadius: 12, backdropFilter: "blur(20px)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, var(--blue), var(--cyan))", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="heart" size={18} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>MedCore <span style={{ color: "var(--cyan)" }}>EMR</span></span>
          </div>
          <p style={{ color: "var(--text-2)", fontSize: 13 }}>Enterprise Medical Records System v4.2</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 6, display: "block", fontWeight: 500 }}>USERNAME</label>
          <input value={user} onChange={e => setUser(e.target.value)} style={{ width: "100%", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 14px", color: "var(--text)", fontSize: 14, outline: "none" }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 6, display: "block", fontWeight: 500 }}>PASSWORD</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} style={{ width: "100%", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 14px", color: "var(--text)", fontSize: 14, outline: "none" }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 8, display: "block", fontWeight: 500 }}>LOGIN AS</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {roles.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${role === r.id ? r.color : "var(--border)"}`, background: role === r.id ? r.color + "20" : "var(--navy-2)", color: role === r.id ? r.color : "var(--text-2)", fontSize: 13, fontWeight: 500, transition: "all .15s" }}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => onLogin({ username: user, role })} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, var(--blue), var(--blue-light))", border: "none", borderRadius: 6, color: "#fff", fontSize: 14, fontWeight: 600, letterSpacing: "0.02em" }}>
          Sign In to MedCore EMR
        </button>
        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-3)", marginTop: 16 }}>HIPAA Compliant · End-to-End Encrypted · Audit Logged</p>
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ active, onNav, user, mobileOpen, onMobileClose }) => {
  const { isMobile, isTablet } = useIsMobile();
  const navItems = [
    { id: "dashboard",  icon: "home",     label: "Dashboard" },
    { id: "patients",   icon: "users",    label: "Patients" },
    { id: "emergency",  icon: "activity", label: "Emergency Room", badge: "ER" },
    { id: "scheduling", icon: "calendar", label: "Scheduling" },
    { id: "ambulatory", icon: "activity", label: "Ambulatory" },
    { id: "inpatient",  icon: "bed",      label: "Inpatient" },
    { id: "pharmacy",   icon: "pill",     label: "Pharmacy" },
    { id: "laboratory", icon: "flask",    label: "Laboratory" },
    { id: "radiology",  icon: "xray",     label: "Radiology" },
    { id: "notes",      icon: "notes",    label: "Clinical Notes" },
    { id: "discharge",  icon: "door",     label: "Discharge" },
    { id: "billing",    icon: "billing",  label: "Billing" },
  ];

  const handleNav = (id) => { onNav(id); if (isMobile) onMobileClose(); };

  const navBtn = (item, compact=false) => {
    const isActive = active === item.id;
    const isER = item.id === "emergency";
    const activeColor = isER ? "#e5343a" : "var(--cyan)";
    return (
      <button key={item.id} onClick={() => handleNav(item.id)}
        title={compact ? item.label : undefined}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: compact ? 0 : 10, justifyContent: compact ? "center" : "flex-start", padding: compact ? "11px 0" : "9px 18px", background: isActive ? (isER ? "linear-gradient(90deg,#e5343a20,transparent)" : "linear-gradient(90deg,#1e56d920,transparent)") : "transparent", color: isActive ? activeColor : "var(--text-2)", border: "none", borderLeft: compact ? "none" : (isActive ? `2px solid ${activeColor}` : "2px solid transparent"), fontSize: 13, fontWeight: isActive ? 600 : 400, cursor: "pointer", textAlign: "left", transition: "all .15s", position: "relative" }}>
        <Icon name={item.icon} size={compact ? 18 : 15} />
        {!compact && <span className="sidebar-label">{item.label}</span>}
        {!compact && item.badge && <span className="sidebar-badge" style={{ marginLeft:"auto", background:"#e5343a", color:"#fff", borderRadius:3, padding:"1px 6px", fontSize:9, fontWeight:700 }}>{item.badge}</span>}
        {compact && item.badge && <span style={{ position:"absolute", top:6, right:8, width:6, height:6, borderRadius:"50%", background:"#e5343a" }}/>}
        {compact && isActive && <span style={{ position:"absolute", left:0, top:"20%", bottom:"20%", width:2, background:activeColor, borderRadius:"0 2px 2px 0" }}/>}
      </button>
    );
  };

  // ── MOBILE BOTTOM NAV ──
  if (isMobile) {
    // show first 6 most important items in bottom bar
    const primary = navItems.slice(0, 6);
    return (
      <>
        {/* Drawer overlay */}
        <div className={`mobile-drawer-overlay ${mobileOpen ? "open" : ""}`} onClick={onMobileClose}/>
        {/* Full drawer */}
        <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
          <div style={{ padding:"16px 18px", borderBottom:"1px solid var(--border-2)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:28, height:28, background:"linear-gradient(135deg,var(--blue),var(--cyan))", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="heart" size={13}/></div>
              <div>
                <div style={{ fontSize:13, fontWeight:700 }}>MedCore <span style={{ color:"var(--cyan)" }}>EMR</span></div>
                <div style={{ fontSize:9, color:"var(--text-3)", letterSpacing:"0.05em" }}>ENTERPRISE v4.2</div>
              </div>
            </div>
            <button onClick={onMobileClose} style={{ background:"none", border:"none", color:"var(--text-2)", fontSize:20, padding:"4px 8px" }}>✕</button>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"6px 0" }}>
            {navItems.map(item => navBtn(item, false))}
          </div>
          <div style={{ padding:"12px 18px", borderTop:"1px solid var(--border-2)", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{user.username.slice(0,2).toUpperCase()}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600 }}>{user.username}</div>
              <div style={{ fontSize:10, color:"var(--text-3)", textTransform:"capitalize" }}>{user.role}</div>
            </div>
          </div>
        </div>
        {/* Bottom tab bar */}
        <nav className="bottom-nav">
          <div className="bottom-nav-inner">
            {primary.map(item => {
              const isActive = active === item.id;
              const isER = item.id === "emergency";
              const ac = isER ? "#e5343a" : "var(--cyan)";
              return (
                <button key={item.id} onClick={() => handleNav(item.id)}
                  style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, padding:"6px 14px", background:"none", border:"none", color:isActive ? ac : "var(--text-3)", borderTop:`2px solid ${isActive ? ac : "transparent"}`, fontSize:9, fontWeight:isActive?700:400, minWidth:56, cursor:"pointer", transition:"all .12s", whiteSpace:"nowrap" }}>
                  <Icon name={item.icon} size={18}/>
                  <span style={{ fontSize:9 }}>{item.id === "emergency" ? "ER" : item.label.split(" ")[0]}</span>
                  {item.badge && isActive && <span style={{ position:"absolute", top:8, width:5, height:5, borderRadius:"50%", background:"#e5343a" }}/>}
                </button>
              );
            })}
            {/* "More" button opens drawer */}
            <button onClick={() => onMobileClose === onMobileClose && document.dispatchEvent(new CustomEvent("openDrawer"))}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, padding:"6px 14px", background:"none", border:"none", color:"var(--text-3)", borderTop:"2px solid transparent", fontSize:9, fontWeight:400, minWidth:56, cursor:"pointer" }}
              onClick={() => { document.dispatchEvent(new CustomEvent("openDrawer")); }}>
              <span style={{ fontSize:18, lineHeight:1 }}>⋯</span>
              <span style={{ fontSize:9 }}>More</span>
            </button>
          </div>
        </nav>
      </>
    );
  }

  // ── TABLET ICON SIDEBAR ──
  if (isTablet) {
    return (
      <div className="desktop-sidebar" style={{ width:64, minHeight:"100vh", background:"var(--card-2)", borderRight:"1px solid var(--border-2)", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"14px 0", borderBottom:"1px solid var(--border-2)", display:"flex", justifyContent:"center" }}>
          <div style={{ width:28, height:28, background:"linear-gradient(135deg,var(--blue),var(--cyan))", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="heart" size={13}/></div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"6px 0" }}>
          {navItems.map(item => navBtn(item, true))}
        </div>
        <div style={{ padding:"10px 0", borderTop:"1px solid var(--border-2)", display:"flex", justifyContent:"center" }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>{user.username.slice(0,2).toUpperCase()}</div>
        </div>
      </div>
    );
  }

  // ── DESKTOP FULL SIDEBAR ──
  return (
    <div className="desktop-sidebar" style={{ width:"var(--sidebar-w)", minHeight:"100vh", background:"var(--card-2)", borderRight:"1px solid var(--border-2)", display:"flex", flexDirection:"column", flexShrink:0 }}>
      <div style={{ padding:"16px 18px", borderBottom:"1px solid var(--border-2)", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:30, height:30, background:"linear-gradient(135deg,var(--blue),var(--cyan))", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Icon name="heart" size={14}/></div>
        <div className="sidebar-logo-text">
          <div style={{ fontSize:13, fontWeight:700, lineHeight:1.2 }}>MedCore <span style={{ color:"var(--cyan)" }}>EMR</span></div>
          <div style={{ fontSize:10, color:"var(--text-3)", letterSpacing:"0.05em" }}>ENTERPRISE v4.2</div>
        </div>
      </div>
      <div style={{ padding:"8px 0", flex:1, overflowY:"auto" }}>
        {navItems.map(item => navBtn(item, false))}
      </div>
      <div style={{ padding:"12px 18px", borderTop:"1px solid var(--border-2)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{user.username.slice(0,2).toUpperCase()}</div>
          <div className="sidebar-user-name">
            <div style={{ fontSize:12, fontWeight:600 }}>{user.username}</div>
            <div style={{ fontSize:10, color:"var(--text-3)", textTransform:"capitalize" }}>{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ onNav, onPatient }) => {
  const stats = [
    { label: "Inpatient Census", value: 2, icon: "bed", color: "#ffb800", sub: "2 beds occupied" },
    { label: "Today's Appointments", value: 3, icon: "calendar", color: "#00c8e0", sub: "2 confirmed" },
    { label: "Pending Labs", value: 1, icon: "flask", color: "#8b5cf6", sub: "Awaiting results" },
    { label: "Pending Discharge", value: 1, icon: "door", color: "#00d68f", sub: "Ready for D/C" },
  ];
  const alerts = [
    { patient: "Margaret Chen", msg: "Critical lab: Procalcitonin 2.4 ng/mL", severity: "high", time: "2h ago" },
    { patient: "James Whitfield", msg: "HbA1c 7.8% - above target", severity: "med", time: "3h ago" },
    { patient: "Sofia Ramirez", msg: "Pain score 7/10 - assess PRN medication", severity: "med", time: "4h ago" },
  ];
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Clinical Dashboard</h1>
        <p style={{ color: "var(--text-2)", fontSize: 13 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: s.color + "20", color: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.icon} size={17} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, marginBottom: 4, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)" }}>{s.sub}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionHeader icon="bell" title="Clinical Alerts" />
          <div style={{ padding: "8px 0" }}>
            {alerts.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px 18px", borderBottom: i < alerts.length - 1 ? "1px solid var(--border-2)" : "none", alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.severity === "high" ? "var(--red)" : "var(--amber)", marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.patient}</div>
                  <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>{a.msg}</div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)", whiteSpace: "nowrap" }}>{a.time}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader icon="users" title="Active Inpatients" />
          <div style={{ padding: "8px 0" }}>
            {PATIENTS.filter(p => p.status === "Inpatient").map((p, i) => (
              <div key={i} onClick={() => onPatient(p)} style={{ display: "flex", gap: 12, padding: "12px 18px", borderBottom: i === 0 ? "1px solid var(--border-2)" : "none", alignItems: "center", cursor: "pointer" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {p.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-2)" }}>Room {p.room} · {p.diagnosis}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>Admit {fmtDate(p.admitDate)}</div>
                  <Badge label="Inpatient" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── PATIENT LIST ─────────────────────────────────────────────────────────────
const PatientList = ({ onPatient }) => {
  const [search, setSearch] = useState("");
  const filtered = PATIENTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.mrn.includes(search));
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>Patient Registry</h1>
          <p style={{ color: "var(--text-2)", fontSize: 13 }}>{PATIENTS.length} registered patients</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 14px" }}>
            <Icon name="search" size={14} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or MRN..." style={{ background: "transparent", border: "none", color: "var(--text)", fontSize: 13, outline: "none", width: 200 }} />
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600 }}>
            <Icon name="plus" size={14} /> New Patient
          </button>
        </div>
      </div>
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Patient", "MRN", "DOB / Age", "Provider", "Status", "Diagnosis", ""].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} onClick={() => onPatient(p)} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border-2)" : "none", cursor: "pointer", transition: "background .1s" }} onMouseEnter={e => e.currentTarget.style.background = "#1e56d910"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {p.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-3)" }}>{p.gender === "M" ? "Male" : "Female"}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--cyan)", fontFamily: "monospace" }}>{p.mrn}</td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-2)" }}>{fmtDate(p.dob)} · {calcAge(p.dob)}y</td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-2)" }}>{p.pcp}</td>
                <td style={{ padding: "12px 16px" }}><Badge label={p.status} /></td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-2)" }}>{p.diagnosis}</td>
                <td style={{ padding: "12px 16px" }}>
                  <button style={{ padding: "5px 12px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text-2)", fontSize: 12 }}>View Chart</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ─── PATIENT CHART (Main tabbed view) ─────────────────────────────────────────
const PatientChart = ({ patient, user, onBack }) => {
  const [tab, setTab] = useState("overview");
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("Progress Note");
  const [newVital, setNewVital] = useState({ bp: "", hr: "", temp: "", spo2: "", rr: "" });
  const [showVitalForm, setShowVitalForm] = useState(false);
  const [newOrder, setNewOrder] = useState({ drug: "", dose: "", route: "PO", freq: "" });
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [notes, setNotes] = useState(NOTES_DATA[patient.id] || []);
  const [vitals, setVitals] = useState(VITALS_DATA[patient.id] || []);
  const [meds, setMeds] = useState(MEDS_DATA[patient.id] || []);

  const tabs = [
    { id: "overview", icon: "user", label: "Overview" },
    { id: "vitals", icon: "activity", label: "Vitals" },
    { id: "orders", icon: "pill", label: "Medications" },
    { id: "labs", icon: "flask", label: "Labs" },
    { id: "radiology", icon: "xray", label: "Radiology" },
    { id: "notes", icon: "notes", label: "Notes" },
    { id: "billing", icon: "billing", label: "Billing" },
  ];

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes(prev => [{
      id: "N" + Date.now(), type: noteType, author: user.username, role: user.role === "physician" ? "Attending Physician" : "Registered Nurse",
      date: new Date().toISOString().slice(0, 16).replace("T", " "), signed: true, content: newNote
    }, ...prev]);
    setNewNote("");
  };

  const addVital = () => {
    setVitals(prev => [{ date: new Date().toISOString().slice(0, 16).replace("T", " "), ...newVital, wt: "-" }, ...prev]);
    setNewVital({ bp: "", hr: "", temp: "", spo2: "", rr: "" });
    setShowVitalForm(false);
  };

  const addOrder = () => {
    if (!newOrder.drug) return;
    setMeds(prev => [{ id: "RX" + Date.now(), ...newOrder, start: new Date().toISOString().slice(0, 10), status: "Active", prescriber: user.username, indication: "New order" }, ...prev]);
    setNewOrder({ drug: "", dose: "", route: "PO", freq: "" });
    setShowOrderForm(false);
  };

  const billing = BILLING_DATA[patient.id];
  const labs = LAB_DATA[patient.id] || [];
  const rads = RADIOLOGY_DATA[patient.id] || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Patient Header */}
      <div style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "12px 24px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 12px", color: "var(--text-2)", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            ← Back
          </button>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, var(--blue), var(--cyan))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>
            {patient.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 17, fontWeight: 700 }}>{patient.name}</span>
              <Badge label={patient.status} />
              {patient.allergies.length > 0 && <span style={{ background: "#ff475720", color: "#ff4757", border: "1px solid #ff475740", borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>⚠ ALLERGIES</span>}
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>
              <span>{patient.mrn}</span>
              <span>DOB: {fmtDate(patient.dob)} ({calcAge(patient.dob)}y {patient.gender})</span>
              <span>Blood: {patient.bloodType}</span>
              {patient.room && <span>Room: <strong style={{ color: "var(--amber)" }}>{patient.room}</strong></span>}
              <span>PCP: {patient.pcp}</span>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button style={{ padding: "7px 14px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", fontSize: 12 }}>
              <Icon name="printer" size={13} />
            </button>
          </div>
        </div>
        {patient.allergies.length > 0 && (
          <div style={{ marginTop: 10, padding: "6px 12px", background: "#ff475710", border: "1px solid #ff475730", borderRadius: 6, fontSize: 12, color: "#ff4757", display: "flex", gap: 8, alignItems: "center" }}>
            <Icon name="alert" size={13} /> <strong>ALLERGIES:</strong> {patient.allergies.join(", ")}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ background: "var(--card-2)", borderBottom: "1px solid var(--border)", display: "flex", gap: 2, padding: "0 24px", flexShrink: 0, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 16px", background: "transparent", border: "none", borderBottom: tab === t.id ? "2px solid var(--cyan)" : "2px solid transparent", color: tab === t.id ? "var(--cyan)" : "var(--text-2)", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap", marginBottom: -1 }}>
            <Icon name={t.icon} size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionHeader icon="user" title="Demographics" />
              <div style={{ padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
                {[["Full Name", patient.name], ["Date of Birth", fmtDate(patient.dob)], ["Age", calcAge(patient.dob) + " years"], ["Gender", patient.gender === "M" ? "Male" : "Female"], ["Blood Type", patient.bloodType], ["Phone", patient.phone], ["Insurance", patient.insurance], ["Primary Care", patient.pcp]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 13, color: "var(--text)" }}>{v}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionHeader icon="activity" title="Admission Info" />
              <div style={{ padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
                {[["Status", patient.status], ["Admit Date", fmtDate(patient.admitDate) || "N/A"], ["Room", patient.room || "N/A"], ["Diagnosis", patient.diagnosis], ["Attending", patient.pcp]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 13, color: "var(--text)" }}>{v}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionHeader icon="pill" title="Active Medications" />
              <div style={{ padding: "8px 0" }}>
                {(MEDS_DATA[patient.id] || []).filter(m => m.status === "Active").slice(0, 5).map((m, i, arr) => (
                  <div key={m.id} style={{ padding: "10px 18px", borderBottom: i < arr.length - 1 ? "1px solid var(--border-2)" : "none", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.drug}</div>
                      <div style={{ fontSize: 11, color: "var(--text-2)" }}>{m.dose} {m.route} {m.freq}</div>
                    </div>
                    <Badge label="Active" />
                  </div>
                ))}
                {!(MEDS_DATA[patient.id] || []).length && <div style={{ padding: 18, fontSize: 13, color: "var(--text-3)" }}>No active medications</div>}
              </div>
            </Card>
            <Card>
              <SectionHeader icon="flask" title="Recent Labs" />
              <div style={{ padding: "8px 0" }}>
                {(LAB_DATA[patient.id] || []).slice(0, 4).map((l, i, arr) => (
                  <div key={l.id} style={{ padding: "10px 18px", borderBottom: i < arr.length - 1 ? "1px solid var(--border-2)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{l.test}</div>
                      <div style={{ fontSize: 11, color: "var(--text-3)" }}>{l.resulted || "Pending"}</div>
                    </div>
                    <Badge label={l.status} />
                  </div>
                ))}
                {!labs.length && <div style={{ padding: 18, fontSize: 13, color: "var(--text-3)" }}>No lab orders</div>}
              </div>
            </Card>
          </div>
        )}

        {/* VITALS TAB */}
        {tab === "vitals" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div />
              <button onClick={() => setShowVitalForm(!showVitalForm)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--green)", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600 }}>
                <Icon name="plus" size={13} /> Record Vitals
              </button>
            </div>
            {showVitalForm && (
              <Card style={{ padding: 18, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--cyan)" }}>New Vital Signs Entry</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 12 }}>
                  {[["BP", "bp", "e.g. 120/80"], ["HR (bpm)", "hr", "e.g. 72"], ["Temp (°F)", "temp", "e.g. 98.6"], ["SpO2 (%)", "spo2", "e.g. 98"], ["RR (br/min)", "rr", "e.g. 16"]].map(([label, field, ph]) => (
                    <div key={field}>
                      <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>{label}</div>
                      <input value={newVital[field]} onChange={e => setNewVital(v => ({ ...v, [field]: e.target.value }))} placeholder={ph} style={{ width: "100%", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 10px", color: "var(--text)", fontSize: 13, outline: "none" }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={addVital} style={{ padding: "7px 16px", background: "var(--green)", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600 }}>Save Vitals</button>
                  <button onClick={() => setShowVitalForm(false)} style={{ padding: "7px 16px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", fontSize: 13 }}>Cancel</button>
                </div>
              </Card>
            )}
            <Card>
              <SectionHeader icon="activity" title="Vital Signs Trend" />
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {["Date/Time", "BP", "HR", "Temp", "SpO2", "RR", "Weight"].map(h => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vitals.map((v, i) => (
                      <tr key={i} style={{ borderBottom: i < vitals.length - 1 ? "1px solid var(--border-2)" : "none" }}>
                        <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--text-2)", fontFamily: "monospace" }}>{v.date}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 500 }}>{v.bp}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, color: parseInt(v.hr) > 100 ? "var(--red)" : parseInt(v.hr) < 60 ? "var(--cyan)" : "var(--text)" }}>{v.hr}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, color: parseFloat(v.temp) > 100.4 ? "var(--red)" : "var(--text)" }}>{v.temp}°F</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, color: parseInt(v.spo2) < 95 ? "var(--red)" : parseInt(v.spo2) < 98 ? "var(--amber)" : "var(--green)" }}>{v.spo2}%</td>
                        <td style={{ padding: "10px 16px", fontSize: 13 }}>{v.rr}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, color: "var(--text-2)" }}>{v.wt} {v.wt !== "-" ? "lbs" : ""}</td>
                      </tr>
                    ))}
                    {!vitals.length && <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>No vitals recorded</td></tr>}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* MEDICATIONS TAB */}
        {tab === "orders" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div />
              {(user.role === "physician" || user.role === "pharmacist") && (
                <button onClick={() => setShowOrderForm(!showOrderForm)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600 }}>
                  <Icon name="plus" size={13} /> New Order
                </button>
              )}
            </div>
            {showOrderForm && (
              <Card style={{ padding: 18, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--cyan)" }}>New Medication Order</div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", gap: 12, marginBottom: 12 }}>
                  {[["Drug Name", "drug", "text", "e.g. Amoxicillin"], ["Dose", "dose", "text", "e.g. 500mg"], ["Frequency", "freq", "text", "e.g. Q8H"]].map(([label, field, type, ph]) => (
                    <div key={field}>
                      <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>{label}</div>
                      <input value={newOrder[field]} onChange={e => setNewOrder(o => ({ ...o, [field]: e.target.value }))} placeholder={ph} style={{ width: "100%", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 10px", color: "var(--text)", fontSize: 13, outline: "none" }} />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>Route</div>
                    <select value={newOrder.route} onChange={e => setNewOrder(o => ({ ...o, route: e.target.value }))} style={{ width: "100%", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 10px", color: "var(--text)", fontSize: 13, outline: "none" }}>
                      {["PO", "IV", "SQ", "IM", "NEB", "TOP", "SL"].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={addOrder} style={{ padding: "7px 16px", background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600 }}>Submit Order</button>
                  <button onClick={() => setShowOrderForm(false)} style={{ padding: "7px 16px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", fontSize: 13 }}>Cancel</button>
                </div>
              </Card>
            )}
            <Card>
              <SectionHeader icon="pill" title="Medication Orders" />
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Drug", "Dose / Route", "Frequency", "Start Date", "Status", "Prescriber", "Indication"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {meds.map((m, i) => (
                    <tr key={m.id} style={{ borderBottom: i < meds.length - 1 ? "1px solid var(--border-2)" : "none", opacity: m.status === "Discontinued" ? 0.5 : 1 }}>
                      <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 600 }}>{m.drug}</td>
                      <td style={{ padding: "10px 16px", fontSize: 13 }}>{m.dose} <span style={{ color: "var(--cyan)" }}>{m.route}</span></td>
                      <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--text-2)" }}>{m.freq}</td>
                      <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--text-3)", fontFamily: "monospace" }}>{m.start}</td>
                      <td style={{ padding: "10px 16px" }}><Badge label={m.status} /></td>
                      <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--text-2)" }}>{m.prescriber}</td>
                      <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--text-3)" }}>{m.indication}</td>
                    </tr>
                  ))}
                  {!meds.length && <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: "var(--text-3)" }}>No medication orders</td></tr>}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* LABS TAB */}
        {tab === "labs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {labs.map(l => (
              <Card key={l.id}>
                <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--purple-dim)", color: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="flask" size={15} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{l.test}</div>
                      <div style={{ fontSize: 12, color: "var(--text-2)" }}>Ordered: {l.ordered} · By: {l.orderedBy}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>{l.resulted || "Pending result"}</div>
                    <Badge label={l.status} />
                  </div>
                </div>
                {l.results.length > 0 && (
                  <div style={{ padding: "0 18px 8px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          {["Test", "Result", "Units", "Reference Range", "Flag"].map(h => (
                            <th key={h} style={{ padding: "8px 8px", textAlign: "left", fontSize: 10, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid var(--border-2)" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {l.results.map((r, ri) => (
                          <tr key={ri}>
                            <td style={{ padding: "7px 8px", fontSize: 13 }}>{r.name}</td>
                            <td style={{ padding: "7px 8px", fontSize: 13, fontWeight: 600, ...flagStyle(r.flag) }}>{r.value}</td>
                            <td style={{ padding: "7px 8px", fontSize: 12, color: "var(--text-2)" }}>{r.unit}</td>
                            <td style={{ padding: "7px 8px", fontSize: 12, color: "var(--text-3)" }}>{r.ref}</td>
                            <td style={{ padding: "7px 8px" }}>{r.flag && <span style={{ fontSize: 11, fontWeight: 700, color: r.flag === "H" ? "var(--red)" : "var(--cyan)", background: r.flag === "H" ? "var(--red-dim)" : "var(--cyan-dim)", padding: "2px 6px", borderRadius: 3 }}>{r.flag}</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {l.status === "Pending" && <div style={{ padding: "12px 18px", fontSize: 13, color: "var(--text-3)", fontStyle: "italic" }}>Results pending...</div>}
              </Card>
            ))}
            {!labs.length && <Card style={{ padding: 40, textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>No lab orders for this patient</Card>}
          </div>
        )}

        {/* RADIOLOGY TAB */}
        {tab === "radiology" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {rads.map(r => (
              <Card key={r.id}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--amber-dim)", color: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="xray" size={15} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{r.study}</div>
                      <div style={{ fontSize: 12, color: "var(--text-2)" }}>
                        <span style={{ background: "var(--amber-dim)", color: "var(--amber)", borderRadius: 4, padding: "1px 6px", fontSize: 11, fontWeight: 600, marginRight: 8 }}>{r.modality}</span>
                        Ordered: {r.ordered} · Performed: {r.performed}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ fontSize: 12, color: "var(--text-2)" }}>Read by: {r.radiologist}</div>
                    <Badge label={r.status} />
                  </div>
                </div>
                <div style={{ padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--cyan)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>IMPRESSION</div>
                    <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7 }}>{r.impression}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>FINDINGS</div>
                    <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>{r.findings}</div>
                  </div>
                </div>
              </Card>
            ))}
            {!rads.length && <Card style={{ padding: 40, textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>No radiology orders for this patient</Card>}
          </div>
        )}

        {/* NOTES TAB */}
        {tab === "notes" && (
          <div>
            <Card style={{ padding: 18, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--cyan)", marginBottom: 12 }}>Add Clinical Note</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                {["Progress Note", "Nursing Note", "Consult", "Procedure Note", "Discharge Summary"].map(t => (
                  <button key={t} onClick={() => setNoteType(t)} style={{ padding: "5px 12px", background: noteType === t ? "var(--blue)" : "var(--navy-2)", border: `1px solid ${noteType === t ? "var(--blue)" : "var(--border)"}`, borderRadius: 5, color: noteType === t ? "#fff" : "var(--text-2)", fontSize: 12, fontWeight: noteType === t ? 600 : 400 }}>
                    {t}
                  </button>
                ))}
              </div>
              <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Enter clinical note..." rows={6} style={{ width: "100%", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 14px", color: "var(--text)", fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.7 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button onClick={addNote} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", background: "var(--blue)", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600 }}>
                  <Icon name="save" size={13} /> Sign & Save Note
                </button>
              </div>
            </Card>
            {notes.map((n, i) => (
              <Card key={n.id} style={{ marginBottom: 12 }}>
                <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ background: "var(--blue)", color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{n.type}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{n.author}</span>
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>{n.role}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "monospace" }}>{n.date}</span>
                    {n.signed && <span style={{ background: "var(--green-dim)", color: "var(--green)", border: "1px solid var(--green)30", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>✓ Signed</span>}
                  </div>
                </div>
                <pre style={{ padding: "16px 18px", fontSize: 13, color: "var(--text)", lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "'IBM Plex Sans', sans-serif" }}>{n.content}</pre>
              </Card>
            ))}
            {!notes.length && <Card style={{ padding: 40, textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>No clinical notes on record</Card>}
          </div>
        )}

        {/* BILLING TAB */}
        {tab === "billing" && billing && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 16 }}>
              {[["Total Charges", "$" + billing.totalCharges.toLocaleString("en-US", { minimumFractionDigits: 2 }), "#ffb800"], ["Insurance Adjustment", "-$" + billing.insuranceAdj.toLocaleString("en-US", { minimumFractionDigits: 2 }), "#ff4757"], ["Patient Responsibility", "$" + billing.patientResp.toLocaleString("en-US", { minimumFractionDigits: 2 }), "#8b5cf6"], ["Amount Paid", "$" + billing.paidAmt.toLocaleString("en-US", { minimumFractionDigits: 2 }), "#00d68f"]].map(([label, value, color]) => (
                <Card key={label} style={{ padding: 18 }}>
                  <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
                </Card>
              ))}
            </div>
            <Card style={{ marginBottom: 16 }}>
              <SectionHeader icon="billing" title="Charge Detail" action={<Badge label={billing.status} />} />
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Code", "Description", "Date", "Qty", "Unit Price", "Total"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {billing.charges.map((c, i) => (
                    <tr key={c.code + i} style={{ borderBottom: i < billing.charges.length - 1 ? "1px solid var(--border-2)" : "none" }}>
                      <td style={{ padding: "10px 16px", fontSize: 12, fontFamily: "monospace", color: "var(--cyan)" }}>{c.code}</td>
                      <td style={{ padding: "10px 16px", fontSize: 13 }}>{c.desc}</td>
                      <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--text-3)" }}>{c.date}</td>
                      <td style={{ padding: "10px 16px", fontSize: 13 }}>{c.qty}</td>
                      <td style={{ padding: "10px 16px", fontSize: 13 }}>${c.unit.toFixed(2)}</td>
                      <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 600 }}>${c.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "2px solid var(--border)" }}>
                    <td colSpan={5} style={{ padding: "10px 16px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>TOTAL CHARGES</td>
                    <td style={{ padding: "10px 16px", fontSize: 14, fontWeight: 700, color: "var(--amber)" }}>${billing.totalCharges.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Card style={{ padding: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--cyan)", marginBottom: 10 }}>Insurance Information</div>
                <div style={{ fontSize: 13, color: "var(--text-2)" }}>{billing.insurance}</div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 6 }}>Adjustment rate: {((billing.insuranceAdj / billing.totalCharges) * 100).toFixed(1)}%</div>
              </Card>
              <Card style={{ padding: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--cyan)", marginBottom: 10 }}>Payment Summary</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: "var(--text-2)" }}>Balance Due</span>
                  <span style={{ fontWeight: 700, color: billing.paidAmt >= billing.patientResp ? "var(--green)" : "var(--amber)" }}>
                    ${(billing.patientResp - billing.paidAmt).toFixed(2)}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>Status: <Badge label={billing.status} /></div>
              </Card>
            </div>
          </div>
        )}
        {tab === "billing" && !billing && <Card style={{ padding: 40, textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>No billing records for this patient</Card>}
      </div>
    </div>
  );
};

// ─── SCHEDULING ───────────────────────────────────────────────────────────────
// ─── SCHEDULING MASTER DATA ───────────────────────────────────────────────────
const PROVIDERS_LIST = [
  // Internal Medicine
  { id: "PR001", name: "Dr. Sarah Ellison", credential: "MD, FACP", dept: "Internal Medicine", specialty: "General Internal Medicine", npi: "1234567890", schedule: ["Mon","Tue","Wed","Thu","Fri"], slots: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","14:00","14:30","15:00","15:30","16:00"], color: "#4a7fee", accepting: true },
  { id: "PR002", name: "Dr. Marcus Rivera", credential: "MD, FACE", dept: "Endocrinology", specialty: "Endocrinology & Metabolism", npi: "1234567891", schedule: ["Mon","Tue","Thu","Fri"], slots: ["09:00","09:30","10:00","10:30","11:00","13:00","13:30","14:00","14:30"], color: "#00c8e0", accepting: true },
  { id: "PR003", name: "Dr. Lisa Park", credential: "MD", dept: "Internal Medicine", specialty: "General Internal Medicine", npi: "1234567892", schedule: ["Mon","Wed","Fri"], slots: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30"], color: "#00d68f", accepting: true },
  { id: "PR004", name: "Dr. James Thornton", credential: "MD, FACS", dept: "Surgery", specialty: "General Surgery", npi: "1234567893", schedule: ["Tue","Wed","Thu"], slots: ["07:00","07:30","08:00","12:00","12:30","13:00","13:30"], color: "#ffb800", accepting: true },
  { id: "PR005", name: "Dr. Angela Mercer", credential: "MD, FACC", dept: "Cardiology", specialty: "Interventional Cardiology", npi: "1234567894", schedule: ["Mon","Tue","Wed","Thu","Fri"], slots: ["08:00","08:30","09:00","09:30","10:00","10:30","13:00","13:30","14:00"], color: "#ff4757", accepting: true },
  { id: "PR006", name: "Dr. Kevin Walsh", credential: "MD", dept: "Cardiology", specialty: "General Cardiology / Echocardiography", npi: "1234567895", schedule: ["Mon","Wed","Fri"], slots: ["09:00","09:30","10:00","10:30","11:00","14:00","14:30","15:00"], color: "#ff6b81", accepting: false },
  { id: "PR007", name: "Dr. Priya Nair", credential: "MD, FAAN", dept: "Neurology", specialty: "General Neurology", npi: "1234567896", schedule: ["Mon","Tue","Thu"], slots: ["08:30","09:00","09:30","10:00","10:30","11:00","13:30","14:00","14:30"], color: "#8b5cf6", accepting: true },
  { id: "PR008", name: "Dr. Thomas Abernathy", credential: "MD, PhD", dept: "Neurology", specialty: "Epilepsy & Neurophysiology", npi: "1234567897", schedule: ["Tue","Thu"], slots: ["09:00","09:30","10:00","10:30","11:00","11:30"], color: "#7c3aed", accepting: true },
  { id: "PR009", name: "Dr. Fatima Al-Hassan", credential: "MD, FACOG", dept: "OB/GYN", specialty: "Obstetrics & Gynecology", npi: "1234567898", schedule: ["Mon","Tue","Wed","Thu","Fri"], slots: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","13:00","13:30","14:00","14:30","15:00"], color: "#ec4899", accepting: true },
  { id: "PR010", name: "Dr. Samuel Oduya", credential: "MD, FAAP", dept: "Pediatrics", specialty: "General Pediatrics", npi: "1234567899", schedule: ["Mon","Tue","Wed","Thu","Fri"], slots: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30"], color: "#f59e0b", accepting: true },
  { id: "PR011", name: "Dr. Mei-Ling Chen", credential: "MD", dept: "Pediatrics", specialty: "Pediatric Cardiology", npi: "1234567800", schedule: ["Mon","Wed","Fri"], slots: ["09:00","09:30","10:00","10:30","11:00"], color: "#fbbf24", accepting: true },
  { id: "PR012", name: "Dr. Robert Caldwell", credential: "MD, FAAOS", dept: "Orthopedics", specialty: "Orthopedic Surgery – Joints", npi: "1234567801", schedule: ["Mon","Tue","Wed","Thu"], slots: ["07:30","08:00","08:30","09:00","09:30","10:00","13:00","13:30","14:00"], color: "#10b981", accepting: true },
  { id: "PR013", name: "Dr. Nina Vasquez", credential: "MD", dept: "Orthopedics", specialty: "Sports Medicine & Spine", npi: "1234567802", schedule: ["Tue","Thu","Fri"], slots: ["09:00","09:30","10:00","10:30","11:00","14:00","14:30","15:00"], color: "#34d399", accepting: true },
  { id: "PR014", name: "Dr. Ethan Burke", credential: "MD, FCCP", dept: "Pulmonology", specialty: "Pulmonary & Critical Care", npi: "1234567803", schedule: ["Mon","Tue","Wed","Thu","Fri"], slots: ["08:00","08:30","09:00","09:30","10:00","10:30","13:00","13:30","14:00"], color: "#06b6d4", accepting: true },
  { id: "PR015", name: "Dr. Amara Diallo", credential: "MD, FASM", dept: "Rheumatology", specialty: "Rheumatology & Immunology", npi: "1234567804", schedule: ["Mon","Wed","Fri"], slots: ["09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30"], color: "#f97316", accepting: true },
  { id: "PR016", name: "Dr. Christopher Lee", credential: "MD, FASN", dept: "Nephrology", specialty: "Nephrology & Hypertension", npi: "1234567805", schedule: ["Tue","Thu"], slots: ["08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30"], color: "#3b82f6", accepting: true },
  { id: "PR017", name: "Dr. Olumide Adeyemi", credential: "MD, FAGA", dept: "Gastroenterology", specialty: "Gastroenterology & Hepatology", npi: "1234567806", schedule: ["Mon","Tue","Wed","Thu"], slots: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","13:30","14:00","14:30"], color: "#84cc16", accepting: true },
  { id: "PR018", name: "Dr. Sandra Kim", credential: "MD, FACS", dept: "Ophthalmology", specialty: "Ophthalmology & Retina", npi: "1234567807", schedule: ["Mon","Tue","Thu","Fri"], slots: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30"], color: "#a3e635", accepting: true },
  { id: "PR019", name: "Dr. Hassan Osei", credential: "MD, FACS", dept: "ENT", specialty: "Otolaryngology (ENT)", npi: "1234567808", schedule: ["Mon","Wed","Fri"], slots: ["09:00","09:30","10:00","10:30","11:00","14:00","14:30","15:00"], color: "#fb923c", accepting: true },
  { id: "PR020", name: "Dr. Yuki Tanaka", credential: "MD, FAAD", dept: "Dermatology", specialty: "Dermatology & Dermatopathology", npi: "1234567809", schedule: ["Mon","Tue","Wed","Thu","Fri"], slots: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00"], color: "#e879f9", accepting: true },
  { id: "PR021", name: "Dr. Grace Obi", credential: "MD, MPH", dept: "Oncology", specialty: "Medical Oncology & Hematology", npi: "1234567810", schedule: ["Mon","Tue","Wed","Thu","Fri"], slots: ["09:00","09:30","10:00","10:30","11:00","13:00","13:30","14:00","14:30","15:00"], color: "#f43f5e", accepting: true },
  { id: "PR022", name: "Dr. Ivan Petrova", credential: "MD, FAPA", dept: "Psychiatry", specialty: "General Psychiatry", npi: "1234567811", schedule: ["Mon","Tue","Wed","Thu"], slots: ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30"], color: "#6366f1", accepting: true },
  { id: "PR023", name: "NP Jennifer Torres", credential: "NP-C", dept: "Internal Medicine", specialty: "Nurse Practitioner – Primary Care", npi: "1234567812", schedule: ["Mon","Tue","Wed","Thu","Fri"], slots: ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00"], color: "#4a7fee", accepting: true },
  { id: "PR024", name: "PA Michael Reyes", credential: "PA-C", dept: "Surgery", specialty: "Physician Assistant – Surgery", npi: "1234567813", schedule: ["Mon","Tue","Wed","Thu","Fri"], slots: ["08:00","08:30","09:00","09:30","10:00","13:00","13:30","14:00","14:30"], color: "#ffb800", accepting: true },
];

const DEPARTMENTS_LIST = [
  { id: "D01", name: "Internal Medicine", code: "INT-MED", location: "Building A, Floor 2", phone: "555-0200", color: "#4a7fee" },
  { id: "D02", name: "Cardiology", code: "CARDIO", location: "Heart Center, Floor 3", phone: "555-0201", color: "#ff4757" },
  { id: "D03", name: "Endocrinology", code: "ENDO", location: "Building B, Floor 1", phone: "555-0202", color: "#00c8e0" },
  { id: "D04", name: "Neurology", code: "NEURO", location: "Neuro Center, Floor 4", phone: "555-0203", color: "#8b5cf6" },
  { id: "D05", name: "OB/GYN", code: "OBGYN", location: "Women's Pavilion, Floor 1", phone: "555-0204", color: "#ec4899" },
  { id: "D06", name: "Pediatrics", code: "PEDS", location: "Children's Wing, Floor 2", phone: "555-0205", color: "#f59e0b" },
  { id: "D07", name: "Orthopedics", code: "ORTHO", location: "Building C, Floor 1", phone: "555-0206", color: "#10b981" },
  { id: "D08", name: "Surgery", code: "SURG", location: "Surgical Suites, Floor 5", phone: "555-0207", color: "#ffb800" },
  { id: "D09", name: "Pulmonology", code: "PULM", location: "Building A, Floor 3", phone: "555-0208", color: "#06b6d4" },
  { id: "D10", name: "Rheumatology", code: "RHEUM", location: "Building B, Floor 2", phone: "555-0209", color: "#f97316" },
  { id: "D11", name: "Nephrology", code: "NEPH", location: "Building A, Floor 4", phone: "555-0210", color: "#3b82f6" },
  { id: "D12", name: "Gastroenterology", code: "GI", location: "Digestive Health Center, Floor 2", phone: "555-0211", color: "#84cc16" },
  { id: "D13", name: "Ophthalmology", code: "OPHTHO", location: "Eye Center, Floor 1", phone: "555-0212", color: "#a3e635" },
  { id: "D14", name: "ENT", code: "ENT", location: "Building C, Floor 2", phone: "555-0213", color: "#fb923c" },
  { id: "D15", name: "Dermatology", code: "DERM", location: "Building B, Floor 3", phone: "555-0214", color: "#e879f9" },
  { id: "D16", name: "Oncology", code: "ONC", location: "Cancer Center, Floor 1", phone: "555-0215", color: "#f43f5e" },
  { id: "D17", name: "Psychiatry", code: "PSYCH", location: "Behavioral Health, Floor 3", phone: "555-0216", color: "#6366f1" },
  { id: "D18", name: "Laboratory", code: "LAB", location: "Main Lab, Floor B1", phone: "555-0217", color: "#00d68f" },
  { id: "D19", name: "Radiology", code: "RAD", location: "Imaging Center, Floor B2", phone: "555-0218", color: "#ffb800" },
  { id: "D20", name: "Physical Therapy", code: "PT", location: "Rehab Center, Floor 1", phone: "555-0219", color: "#34d399" },
  { id: "D21", name: "Urgent Care", code: "UC", location: "Main Entrance, Floor 1", phone: "555-0220", color: "#ff4757" },
  { id: "D22", name: "Pain Management", code: "PAIN", location: "Building D, Floor 2", phone: "555-0221", color: "#f97316" },
];

const VISIT_REASON_TYPES = {
  "New Patient Visit": [
    "New Patient — Complete Evaluation",
    "New Patient — Consultation Only",
    "New Patient — Second Opinion",
    "New Patient — Pre-operative Evaluation",
    "New Patient — Transfer of Care",
    "New Patient — Sports Physical",
    "New Patient — Employment Physical",
  ],
  "Follow-up / Return Visit": [
    "Follow-up — Chronic Disease Management",
    "Follow-up — Post-operative Check",
    "Follow-up — Lab/Imaging Results Review",
    "Follow-up — Medication Management",
    "Follow-up — Wound Check",
    "Follow-up — Hospital Discharge Follow-up",
    "Follow-up — Referral Follow-up",
  ],
  "Preventive / Wellness": [
    "Annual Wellness Visit (AWV)",
    "Preventive Physical Exam",
    "Well-Child Visit",
    "Immunization / Vaccine Only",
    "Pap Smear / GYN Exam",
    "Mammogram Screening",
    "Colorectal Cancer Screening Consult",
    "Cardiovascular Risk Assessment",
    "Osteoporosis Screening",
  ],
  "Acute / Urgent": [
    "Acute Illness — Respiratory",
    "Acute Illness — GI / Abdominal Pain",
    "Acute Illness — Urinary / Renal",
    "Acute Illness — Musculoskeletal / Injury",
    "Acute Illness — Skin / Dermatology",
    "Acute Illness — Ear / Eye / Throat",
    "Acute Pain — Uncontrolled",
    "Fever / Infection Evaluation",
    "Urgent Chest Pain (Non-Emergency)",
    "Urgent Shortness of Breath",
    "Urgent Headache / Neurological",
    "Fall Evaluation",
  ],
  "Procedure / Treatment": [
    "Procedure — Injection (Joint / Trigger Point)",
    "Procedure — Biopsy",
    "Procedure — IV Infusion Therapy",
    "Procedure — Wound Care / Debridement",
    "Procedure — Laceration Repair",
    "Procedure — Cast / Splint Application",
    "Procedure — Colonoscopy Prep Consult",
    "Procedure — Catheter Care",
    "Procedure — EKG / Stress Test",
    "Procedure — Spirometry / PFT",
    "Procedure — Echocardiogram",
    "Procedure — Ultrasound-guided Aspiration",
  ],
  "Mental Health": [
    "Psychiatric Evaluation — Initial",
    "Psychiatric Evaluation — Follow-up",
    "Medication Management — Psych",
    "Therapy — Individual (CBT)",
    "Anxiety / Depression Assessment",
    "Substance Use / Addiction Consult",
    "Behavioral Health Crisis Evaluation",
    "ADHD Evaluation",
  ],
  "Chronic Disease Management": [
    "Diabetes Management",
    "Hypertension Management",
    "Heart Failure Management",
    "COPD / Asthma Management",
    "CKD / Renal Disease Management",
    "Thyroid Disease Follow-up",
    "Hyperlipidemia / Cholesterol Review",
    "Obesity / Weight Management",
    "Rheumatoid Arthritis Follow-up",
    "Cancer Surveillance",
    "HIV / Infectious Disease Follow-up",
  ],
  "Telehealth": [
    "Telehealth — New Patient Video Visit",
    "Telehealth — Follow-up Video Visit",
    "Telehealth — Medication Refill Review",
    "Telehealth — Lab Result Consultation",
    "Telehealth — Mental Health Video Visit",
    "Telehealth — Post-Discharge Check-in",
  ],
  "Pre-operative / Post-operative": [
    "Pre-operative Clearance — Medical",
    "Pre-operative Clearance — Cardiac",
    "Pre-operative Clearance — Pulmonary",
    "Post-operative Wound Check",
    "Post-operative Complication Evaluation",
    "Post-operative Physical Therapy Consult",
  ],
};

const VISIT_TYPES = [
  "New Patient", "Follow-up", "Urgent / Same-Day", "Annual Wellness", "Telehealth",
  "Pre-operative", "Post-operative", "Procedure", "Consultation", "Lab Only", "Referral"
];

const APPT_STATUSES = ["Scheduled", "Confirmed", "Arrived", "In Room", "With Provider", "Checkout", "Completed", "Cancelled", "No Show", "Rescheduled"];

// ─── SCHEDULING (EPIC-STYLE) ──────────────────────────────────────────────────
const Scheduling = ({ appointments, setAppointments }) => {
  const appts = appointments || APPOINTMENTS;
  const setAppts = setAppointments || (() => {});
  const [view, setView] = useState("schedule"); // schedule | new | providers | departments
  const [step, setStep] = useState(1); // 1=patient 2=visit 3=provider 4=slot 5=confirm
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchProv, setSearchProv] = useState("");
  const [selectedAppt, setSelectedAppt] = useState(null);

  const [form, setForm] = useState({
    patientName: "", patientMRN: "", patientDOB: "", patientPhone: "",
    visitType: "Follow-up", dept: "", provider: "", providerObj: null,
    reasonCategory: "", reason: "", date: "", time: "",
    insurance: "", notes: "", priority: "Routine",
    status: "Scheduled", interpreter: false, wheelchairAccess: false,
  });

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const resetForm = () => {
    setForm({ patientName: "", patientMRN: "", patientDOB: "", patientPhone: "", visitType: "Follow-up", dept: "", provider: "", providerObj: null, reasonCategory: "", reason: "", date: "", time: "", insurance: "", notes: "", priority: "Routine", status: "Scheduled", interpreter: false, wheelchairAccess: false });
    setStep(1);
  };

  const bookAppointment = () => {
    if (!form.patientName || !form.date || !form.time || !form.provider) return;
    const newAppt = {
      id: "APT" + Date.now(), patientId: "P_NEW",
      patientName: form.patientName, date: form.date, time: form.time,
      type: form.visitType, provider: form.provider, dept: form.dept,
      reason: form.reason || form.reasonCategory, status: form.status,
      priority: form.priority, notes: form.notes,
    };
    setAppts(prev => [...prev, newAppt]);
    resetForm();
    setView("schedule");
  };

  const filteredAppts = appts.filter(a => {
    const deptMatch = filterDept === "All" || a.dept === filterDept;
    const statusMatch = filterStatus === "All" || a.status === filterStatus;
    return deptMatch && statusMatch;
  });

  const filteredProviders = PROVIDERS_LIST.filter(p =>
    (filterDept === "All" || p.dept === filterDept) &&
    (p.name.toLowerCase().includes(searchProv.toLowerCase()) || p.specialty.toLowerCase().includes(searchProv.toLowerCase()))
  );

  const inputStyle = { width: "100%", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, padding: "7px 10px", color: "var(--text)", fontSize: 13, outline: "none" };
  const labelStyle = { fontSize: 11, color: "var(--text-3)", marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 };
  const selectStyle = { ...inputStyle };

  // ── STATUS COLOR MAP ──
  const sColor = {
    Scheduled: "#8b5cf6", Confirmed: "#00d68f", Arrived: "#00c8e0",
    "In Room": "#4a7fee", "With Provider": "#ffb800", Checkout: "#00c8e0",
    Completed: "#00d68f", Cancelled: "#ff4757", "No Show": "#ff4757", Rescheduled: "#ffb800"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* ── TOP TOOLBAR (Epic-style) ── */}
      <div style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "0 20px", display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
        {[
          { id: "schedule", label: "Schedule" },
          { id: "new", label: "New Appointment" },
          { id: "providers", label: "Providers" },
          { id: "departments", label: "Departments" },
        ].map(tab => (
          <button key={tab.id} onClick={() => { setView(tab.id); if (tab.id === "new") { resetForm(); } }}
            style={{ padding: "12px 18px", background: "transparent", border: "none", borderBottom: view === tab.id ? "2px solid var(--cyan)" : "2px solid transparent", color: view === tab.id ? "var(--cyan)" : "var(--text-2)", fontSize: 13, fontWeight: view === tab.id ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap", marginBottom: -1 }}>
            {tab.label}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", padding: "8px 0" }}>
          <span style={{ fontSize: 12, color: "var(--text-3)" }}>{today}</span>
          <button onClick={() => { setView("new"); resetForm(); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "var(--blue)", border: "none", borderRadius: 5, color: "#fff", fontSize: 12, fontWeight: 600 }}>
            <Icon name="plus" size={12} /> New Appointment
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ══════════════════════════════════
            VIEW: SCHEDULE
        ══════════════════════════════════ */}
        {view === "schedule" && (
          <div style={{ padding: "0" }}>
            {/* Filter Bar */}
            <div style={{ display: "flex", gap: 12, padding: "12px 20px", background: "var(--card-2)", borderBottom: "1px solid var(--border)", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, padding: "5px 10px" }}>
                <Icon name="search" size={13} />
                <input placeholder="Search patient or provider..." style={{ background: "transparent", border: "none", color: "var(--text)", fontSize: 12, outline: "none", width: 180 }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase" }}>Dept:</span>
                <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, padding: "5px 8px", color: "var(--text)", fontSize: 12, outline: "none" }}>
                  <option value="All">All Departments</option>
                  {DEPARTMENTS_LIST.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase" }}>Status:</span>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, padding: "5px 8px", color: "var(--text)", fontSize: 12, outline: "none" }}>
                  <option value="All">All Statuses</option>
                  {APPT_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                {["Today", "Tomorrow", "This Week"].map(t => (
                  <button key={t} style={{ padding: "4px 10px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text-2)", fontSize: 11, cursor: "pointer" }}>{t}</button>
                ))}
              </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0, borderBottom: "1px solid var(--border)" }}>
              {[["Total", appts.length, "#4a7fee"], ["Confirmed", appts.filter(a => a.status === "Confirmed").length, "#00d68f"], ["Pending", appts.filter(a => a.status === "Scheduled" || a.status === "Pending").length, "#8b5cf6"], ["Completed", appts.filter(a => a.status === "Completed").length, "#00d68f"], ["Cancelled", appts.filter(a => a.status === "Cancelled").length, "#ff4757"], ["No Show", appts.filter(a => a.status === "No Show").length, "#ff4757"]].map(([label, count, color], i) => (
                <div key={label} style={{ padding: "12px 16px", background: "var(--card-2)", borderRight: i < 5 ? "1px solid var(--border)" : "none", cursor: "pointer" }} onClick={() => setFilterStatus(label === "Total" ? "All" : label)}>
                  <div style={{ fontSize: 20, fontWeight: 700, color }}>{count}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Appointments Table */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--card-2)", borderBottom: "1px solid var(--border)" }}>
                  {["", "Patient", "MRN", "Date", "Time", "Visit Type", "Reason for Visit", "Provider", "Department", "Priority", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, color: "var(--text-3)", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAppts.map((a, i) => {
                  const provObj = PROVIDERS_LIST.find(p => p.name === a.provider);
                  return (
                    <tr key={a.id} onClick={() => setSelectedAppt(selectedAppt?.id === a.id ? null : a)}
                      style={{ borderBottom: "1px solid var(--border-2)", background: selectedAppt?.id === a.id ? "#1e56d915" : "transparent", cursor: "pointer", transition: "background .1s" }}
                      onMouseEnter={e => { if (selectedAppt?.id !== a.id) e.currentTarget.style.background = "#1e3a5f20"; }}
                      onMouseLeave={e => { if (selectedAppt?.id !== a.id) e.currentTarget.style.background = "transparent"; }}>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ width: 3, height: 32, borderRadius: 2, background: provObj?.color || "var(--blue)" }} />
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{a.patientName}</div>
                        <div style={{ fontSize: 10, color: "var(--text-3)" }}>{PATIENTS.find(p => p.id === a.patientId)?.dob ? calcAge(PATIENTS.find(p => p.id === a.patientId)?.dob) + "y" : ""}</div>
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 11, color: "var(--cyan)", fontFamily: "monospace" }}>{PATIENTS.find(p => p.id === a.patientId)?.mrn || "—"}</td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: "var(--text-2)", whiteSpace: "nowrap" }}>{fmtDate(a.date)}</td>
                      <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>{a.time}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ background: "var(--purple-dim)", color: "var(--purple)", borderRadius: 3, padding: "2px 7px", fontSize: 11, fontWeight: 600 }}>{a.type}</span>
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: "var(--text)", maxWidth: 200 }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.reason}</div>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {provObj && <div style={{ width: 6, height: 6, borderRadius: "50%", background: provObj.color, flexShrink: 0 }} />}
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600 }}>{a.provider}</div>
                            {provObj && <div style={{ fontSize: 10, color: "var(--text-3)" }}>{provObj.credential}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: "var(--text-2)" }}>
                        {(() => { const d = DEPARTMENTS_LIST.find(x => x.name === a.dept); return d ? <span style={{ background: d.color + "18", color: d.color, borderRadius: 3, padding: "2px 6px", fontSize: 11, fontWeight: 600 }}>{d.name}</span> : a.dept; })()}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        {a.priority === "Urgent" ? <span style={{ background: "var(--red-dim)", color: "var(--red)", borderRadius: 3, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>URGENT</span>
                          : <span style={{ fontSize: 11, color: "var(--text-3)" }}>Routine</span>}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{ background: (sColor[a.status] || "#8b5cf6") + "18", color: sColor[a.status] || "#8b5cf6", border: `1px solid ${(sColor[a.status] || "#8b5cf6")}35`, borderRadius: 4, padding: "3px 8px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
                          {a.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button style={{ padding: "3px 8px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 3, color: "var(--text-2)", fontSize: 11, cursor: "pointer" }}>Edit</button>
                          <button style={{ padding: "3px 8px", background: "var(--red-dim)", border: "1px solid var(--red)30", borderRadius: 3, color: "var(--red)", fontSize: 11, cursor: "pointer" }}>Cancel</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredAppts.length === 0 && (
                  <tr><td colSpan={12} style={{ padding: "40px", textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>No appointments match the selected filters.</td></tr>
                )}
              </tbody>
            </table>

            {/* Selected Appointment Detail Panel */}
            {selectedAppt && (
              <div style={{ margin: "0 20px 20px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--cyan)" }}>Appointment Detail — {selectedAppt.patientName}</div>
                  <button onClick={() => setSelectedAppt(null)} style={{ background: "none", border: "none", color: "var(--text-3)", fontSize: 16, cursor: "pointer" }}>✕</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px 24px" }}>
                  {[["Visit Type", selectedAppt.type], ["Date", fmtDate(selectedAppt.date)], ["Time", selectedAppt.time], ["Provider", selectedAppt.provider], ["Department", selectedAppt.dept], ["Reason", selectedAppt.reason], ["Status", selectedAppt.status], ["Priority", selectedAppt.priority || "Routine"]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{k}</div>
                      <div style={{ fontSize: 13 }}>{v || "—"}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button style={{ padding: "6px 14px", background: "var(--blue)", border: "none", borderRadius: 5, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Check In</button>
                  <button style={{ padding: "6px 14px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", fontSize: 12, cursor: "pointer" }}>Reschedule</button>
                  <button style={{ padding: "6px 14px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", fontSize: 12, cursor: "pointer" }}>Print</button>
                  <button style={{ padding: "6px 14px", background: "var(--red-dim)", border: "1px solid var(--red)30", borderRadius: 5, color: "var(--red)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Cancel Appt</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════
            VIEW: NEW APPOINTMENT (Multi-step)
        ══════════════════════════════════ */}
        {view === "new" && (
          <div style={{ padding: "20px 24px", maxWidth: 860 }}>
            {/* Step Progress */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
              {[["1", "Patient"], ["2", "Visit Info"], ["3", "Provider"], ["4", "Date & Time"], ["5", "Confirm"]].map(([num, label], i) => (
                <div key={num} style={{ display: "flex", alignItems: "center" }}>
                  <div onClick={() => step > i + 1 && setStep(i + 1)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: step > i + 1 ? "pointer" : "default" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i + 1 ? "var(--green)" : step === i + 1 ? "var(--blue)" : "var(--navy-2)", border: `2px solid ${step > i + 1 ? "var(--green)" : step === i + 1 ? "var(--blue)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: step > i + 1 ? "#000" : step === i + 1 ? "#fff" : "var(--text-3)", flexShrink: 0 }}>
                      {step > i + 1 ? "✓" : num}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? "var(--text)" : "var(--text-3)", whiteSpace: "nowrap" }}>{label}</span>
                  </div>
                  {i < 4 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? "var(--green)" : "var(--border)", margin: "0 12px", minWidth: 30 }} />}
                </div>
              ))}
            </div>

            <Card style={{ padding: "22px 24px" }}>
              {/* STEP 1 — Patient */}
              {step === 1 && (
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Step 1 — Patient Information</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 20 }}>Search for an existing patient or enter new patient details.</div>
                  <div style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 14px", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="search" size={14} />
                    <input placeholder="Search by Patient Name, MRN, or Date of Birth..." style={{ background: "transparent", border: "none", color: "var(--text)", fontSize: 13, outline: "none", width: "100%" }} />
                    <span style={{ fontSize: 11, color: "var(--text-3)", border: "1px solid var(--border)", borderRadius: 3, padding: "2px 6px" }}>F2</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>— or enter manually —</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    {[["Full Name *", "patientName", "text", "Last, First Middle"], ["MRN", "patientMRN", "text", "e.g. MRN-2024-006"], ["Date of Birth", "patientDOB", "date", ""], ["Phone Number", "patientPhone", "text", "555-0100"]].map(([label, field, type, ph]) => (
                      <div key={field}>
                        <label style={labelStyle}>{label}</label>
                        <input type={type} value={form[field]} placeholder={ph} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} style={inputStyle} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={labelStyle}>Insurance</label>
                    <input value={form.insurance} placeholder="e.g. BlueCross BlueShield #BC123456" onChange={e => setForm(f => ({ ...f, insurance: e.target.value }))} style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                      <input type="checkbox" checked={form.interpreter} onChange={e => setForm(f => ({ ...f, interpreter: e.target.checked }))} /> Interpreter Needed
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                      <input type="checkbox" checked={form.wheelchairAccess} onChange={e => setForm(f => ({ ...f, wheelchairAccess: e.target.checked }))} /> Wheelchair / Accessibility
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => form.patientName && setStep(2)} disabled={!form.patientName} style={{ padding: "8px 20px", background: form.patientName ? "var(--blue)" : "var(--navy-2)", border: "none", borderRadius: 5, color: form.patientName ? "#fff" : "var(--text-3)", fontSize: 13, fontWeight: 600, cursor: form.patientName ? "pointer" : "not-allowed" }}>
                      Next: Visit Info →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 — Visit Info */}
              {step === 2 && (
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Step 2 — Visit Information</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 20 }}>Select the visit type, reason category, and specific reason for the appointment.</div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
                    <div>
                      <label style={labelStyle}>Visit Type *</label>
                      <select value={form.visitType} onChange={e => setForm(f => ({ ...f, visitType: e.target.value }))} style={selectStyle}>
                        {VISIT_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Priority</label>
                      <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} style={selectStyle}>
                        {["Routine", "Urgent", "ASAP", "Elective"].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Reason Category *</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {Object.keys(VISIT_REASON_TYPES).map(cat => (
                        <button key={cat} onClick={() => setForm(f => ({ ...f, reasonCategory: cat, reason: "" }))}
                          style={{ padding: "8px 10px", background: form.reasonCategory === cat ? "var(--blue)" : "var(--navy-2)", border: `1px solid ${form.reasonCategory === cat ? "var(--blue)" : "var(--border)"}`, borderRadius: 6, color: form.reasonCategory === cat ? "#fff" : "var(--text-2)", fontSize: 12, fontWeight: form.reasonCategory === cat ? 600 : 400, cursor: "pointer", textAlign: "left", lineHeight: 1.3 }}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.reasonCategory && (
                    <div style={{ marginBottom: 14 }}>
                      <label style={labelStyle}>Specific Reason for Visit *</label>
                      <select value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} style={selectStyle}>
                        <option value="">— Select reason —</option>
                        {VISIT_REASON_TYPES[form.reasonCategory].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  )}

                  <div style={{ marginBottom: 18 }}>
                    <label style={labelStyle}>Additional Notes</label>
                    <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Enter any special instructions, chief complaint, or additional context..." style={{ ...inputStyle, resize: "vertical" }} />
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setStep(1)} style={{ padding: "8px 16px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", fontSize: 13, cursor: "pointer" }}>← Back</button>
                    <button onClick={() => form.reason && setStep(3)} disabled={!form.reason} style={{ padding: "8px 20px", background: form.reason ? "var(--blue)" : "var(--navy-2)", border: "none", borderRadius: 5, color: form.reason ? "#fff" : "var(--text-3)", fontSize: 13, fontWeight: 600, cursor: form.reason ? "pointer" : "not-allowed" }}>
                      Next: Select Provider →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 — Provider */}
              {step === 3 && (
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Step 3 — Select Provider & Department</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>Choose the department first, then select an available provider.</div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Filter by Department</label>
                      <select value={form.dept} onChange={e => { setForm(f => ({ ...f, dept: e.target.value, provider: "", providerObj: null })); }} style={selectStyle}>
                        <option value="">— All Departments —</option>
                        {DEPARTMENTS_LIST.map(d => <option key={d.id} value={d.name}>{d.name} ({d.code})</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Search Provider</label>
                      <div style={{ position: "relative" }}>
                        <input value={searchProv} onChange={e => setSearchProv(e.target.value)} placeholder="Name or specialty..." style={{ ...inputStyle, paddingLeft: 30 }} />
                        <div style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }}><Icon name="search" size={13} /></div>
                      </div>
                    </div>
                  </div>

                  <div style={{ maxHeight: 340, overflowY: "auto", border: "1px solid var(--border)", borderRadius: 6 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead style={{ position: "sticky", top: 0 }}>
                        <tr style={{ background: "var(--card-2)", borderBottom: "1px solid var(--border)" }}>
                          {["", "Provider", "Credential", "Department", "Specialty", "Schedule Days", "Accepting"].map(h => (
                            <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, color: "var(--text-3)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(form.dept ? PROVIDERS_LIST.filter(p => p.dept === form.dept) : PROVIDERS_LIST).filter(p => !searchProv || p.name.toLowerCase().includes(searchProv.toLowerCase()) || p.specialty.toLowerCase().includes(searchProv.toLowerCase())).map((p, i, arr) => (
                          <tr key={p.id} onClick={() => setForm(f => ({ ...f, provider: p.name, dept: p.dept, providerObj: p }))}
                            style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border-2)" : "none", background: form.provider === p.name ? "#1e56d920" : "transparent", cursor: "pointer", transition: "background .1s" }}
                            onMouseEnter={e => { if (form.provider !== p.name) e.currentTarget.style.background = "#1e3a5f20"; }}
                            onMouseLeave={e => { if (form.provider !== p.name) e.currentTarget.style.background = "transparent"; }}>
                            <td style={{ padding: "10px 12px", width: 32 }}>
                              <div style={{ width: 10, height: 10, borderRadius: "50%", background: form.provider === p.name ? "var(--green)" : "var(--navy-2)", border: `2px solid ${form.provider === p.name ? "var(--green)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {form.provider === p.name && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#000" }} />}
                              </div>
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#000", flexShrink: 0 }}>
                                  {p.name.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()}
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                              </div>
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: 11, color: "var(--text-3)" }}>{p.credential}</td>
                            <td style={{ padding: "10px 12px" }}>
                              <span style={{ fontSize: 11, background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 3, padding: "2px 6px", color: "var(--text-2)" }}>{p.dept}</span>
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: 12, color: "var(--text-2)", maxWidth: 180 }}>
                              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.specialty}</div>
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                {["Mon","Tue","Wed","Thu","Fri"].map(d => (
                                  <span key={d} style={{ fontSize: 10, padding: "1px 4px", borderRadius: 3, background: p.schedule.includes(d) ? "var(--green-dim)" : "var(--navy-2)", color: p.schedule.includes(d) ? "var(--green)" : "var(--text-3)", fontWeight: p.schedule.includes(d) ? 600 : 400 }}>{d.slice(0,1)}</span>
                                ))}
                              </div>
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              {p.accepting ? <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>✓ Yes</span> : <span style={{ fontSize: 11, color: "var(--red)" }}>✗ No</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {form.provider && (
                    <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--green-dim)", border: "1px solid var(--green)30", borderRadius: 6, fontSize: 13, color: "var(--green)", display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon name="check" size={14} /> Selected: <strong>{form.provider}</strong> — {form.dept}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button onClick={() => setStep(2)} style={{ padding: "8px 16px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", fontSize: 13, cursor: "pointer" }}>← Back</button>
                    <button onClick={() => form.provider && setStep(4)} disabled={!form.provider} style={{ padding: "8px 20px", background: form.provider ? "var(--blue)" : "var(--navy-2)", border: "none", borderRadius: 5, color: form.provider ? "#fff" : "var(--text-3)", fontSize: 13, fontWeight: 600, cursor: form.provider ? "pointer" : "not-allowed" }}>
                      Next: Date & Time →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4 — Date & Time */}
              {step === 4 && (
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Step 4 — Date & Time</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 18 }}>Select an available appointment slot for <strong style={{ color: "var(--text)" }}>{form.provider}</strong>.</div>

                  <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
                    <div>
                      <label style={labelStyle}>Appointment Date</label>
                      <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value, time: "" }))} style={inputStyle} />
                      {form.providerObj && (
                        <div style={{ marginTop: 12 }}>
                          <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Provider Schedule</div>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                              <span key={d} style={{ padding: "3px 7px", borderRadius: 4, background: form.providerObj.schedule.includes(d) ? "var(--green-dim)" : "var(--navy-2)", color: form.providerObj.schedule.includes(d) ? "var(--green)" : "var(--text-3)", fontSize: 11, fontWeight: form.providerObj.schedule.includes(d) ? 600 : 400 }}>{d}</span>
                            ))}
                          </div>
                          <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-3)" }}>NPI: {form.providerObj.npi}</div>
                          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{form.dept} · {form.providerObj.credential}</div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Available Time Slots</label>
                      {form.providerObj ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                          {form.providerObj.slots.map(slot => {
                            const taken = appts.some(a => a.provider === form.provider && a.date === form.date && a.time === slot);
                            return (
                              <button key={slot} onClick={() => !taken && setForm(f => ({ ...f, time: slot }))} disabled={taken}
                                style={{ padding: "9px 6px", borderRadius: 6, border: `1px solid ${form.time === slot ? "var(--green)" : taken ? "var(--border-2)" : "var(--border)"}`, background: form.time === slot ? "var(--green-dim)" : taken ? "var(--navy-2)" : "var(--navy-2)", color: form.time === slot ? "var(--green)" : taken ? "var(--text-3)" : "var(--text)", fontSize: 13, fontWeight: form.time === slot ? 700 : 400, cursor: taken ? "not-allowed" : "pointer", opacity: taken ? 0.4 : 1, position: "relative" }}>
                                {slot}
                                {taken && <div style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", fontSize: 8, color: "var(--text-3)" }}>booked</div>}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, color: "var(--text-3)", padding: 20 }}>No provider selected. Go back and select a provider.</div>
                      )}
                      {form.time && (
                        <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--green-dim)", border: "1px solid var(--green)30", borderRadius: 5, fontSize: 13, color: "var(--green)" }}>
                          ✓ Selected: <strong>{form.date} at {form.time}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                    <button onClick={() => setStep(3)} style={{ padding: "8px 16px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", fontSize: 13, cursor: "pointer" }}>← Back</button>
                    <button onClick={() => form.date && form.time && setStep(5)} disabled={!form.date || !form.time} style={{ padding: "8px 20px", background: form.date && form.time ? "var(--blue)" : "var(--navy-2)", border: "none", borderRadius: 5, color: form.date && form.time ? "#fff" : "var(--text-3)", fontSize: 13, fontWeight: 600, cursor: form.date && form.time ? "pointer" : "not-allowed" }}>
                      Next: Confirm →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5 — Confirm */}
              {step === 5 && (
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Step 5 — Review & Confirm</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 18 }}>Please verify all appointment details before booking.</div>

                  <div style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 18 }}>
                    <div style={{ background: "var(--blue)", padding: "10px 16px", fontSize: 13, fontWeight: 700 }}>Appointment Summary</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                      {[
                        ["Patient", form.patientName], ["MRN", form.patientMRN || "—"], ["Date of Birth", form.patientDOB || "—"], ["Phone", form.patientPhone || "—"],
                        ["Visit Type", form.visitType], ["Priority", form.priority], ["Reason Category", form.reasonCategory], ["Reason for Visit", form.reason],
                        ["Provider", form.provider], ["Department", form.dept], ["Date", fmtDate(form.date)], ["Time", form.time],
                        ["Insurance", form.insurance || "—"], ["Interpreter", form.interpreter ? "Yes" : "No"], ["Wheelchair Access", form.wheelchairAccess ? "Yes" : "No"], ["Status", "Scheduled"],
                      ].map(([label, value], idx) => (
                        <div key={label} style={{ padding: "10px 16px", borderBottom: idx < 14 ? "1px solid var(--border-2)" : "none", borderRight: idx % 2 === 0 ? "1px solid var(--border-2)" : "none" }}>
                          <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{label}</div>
                          <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{value}</div>
                        </div>
                      ))}
                    </div>
                    {form.notes && (
                      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-2)" }}>
                        <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Notes</div>
                        <div style={{ fontSize: 13, color: "var(--text-2)" }}>{form.notes}</div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setStep(4)} style={{ padding: "8px 16px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", fontSize: 13, cursor: "pointer" }}>← Back</button>
                    <button onClick={bookAppointment} style={{ padding: "9px 24px", background: "var(--green)", border: "none", borderRadius: 5, color: "#000", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                      <Icon name="check" size={14} /> Confirm & Book Appointment
                    </button>
                    <button onClick={() => { resetForm(); setView("schedule"); }} style={{ padding: "8px 16px", background: "var(--navy-2)", border: "1px solid var(--red)30", borderRadius: 5, color: "var(--red)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════
            VIEW: PROVIDERS DIRECTORY
        ══════════════════════════════════ */}
        {view === "providers" && (
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, padding: "6px 10px", flex: 1, maxWidth: 280 }}>
                <Icon name="search" size={13} />
                <input value={searchProv} onChange={e => setSearchProv(e.target.value)} placeholder="Search provider or specialty..." style={{ background: "transparent", border: "none", color: "var(--text)", fontSize: 12, outline: "none", width: "100%" }} />
              </div>
              <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, padding: "6px 10px", color: "var(--text)", fontSize: 12, outline: "none" }}>
                <option value="All">All Departments</option>
                {DEPARTMENTS_LIST.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginLeft: "auto" }}>
                {filteredProviders.length} providers
              </div>
            </div>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--card-2)", borderBottom: "1px solid var(--border)" }}>
                    {["Provider", "Credentials", "Department", "Specialty", "NPI", "Schedule", "Slots/Day", "Accepting New"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: "var(--text-3)", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProviders.map((p, i, arr) => (
                    <tr key={p.id} style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border-2)" : "none" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#1e3a5f15"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000", flexShrink: 0 }}>
                            {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 11, color: "var(--text-3)", fontFamily: "monospace" }}>{p.credential}</td>
                      <td style={{ padding: "11px 14px" }}>
                        {(() => { const d = DEPARTMENTS_LIST.find(x => x.name === p.dept); return d ? <span style={{ background: d.color + "18", color: d.color, borderRadius: 3, padding: "2px 6px", fontSize: 11, fontWeight: 600 }}>{d.code}</span> : p.dept; })()}
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: "var(--text-2)", maxWidth: 200 }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.specialty}</div>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 11, color: "var(--cyan)", fontFamily: "monospace" }}>{p.npi}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", gap: 2 }}>
                          {["M","T","W","Th","F"].map((d, di) => {
                            const full = ["Mon","Tue","Wed","Thu","Fri"][di];
                            return <span key={d} style={{ fontSize: 10, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 3, background: p.schedule.includes(full) ? "var(--green-dim)" : "var(--navy-2)", color: p.schedule.includes(full) ? "var(--green)" : "var(--text-3)", fontWeight: 600 }}>{d}</span>;
                          })}
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, color: "var(--text-2)" }}>{p.slots.length}</td>
                      <td style={{ padding: "11px 14px" }}>
                        {p.accepting
                          ? <span style={{ background: "var(--green-dim)", color: "var(--green)", borderRadius: 4, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>✓ Accepting</span>
                          : <span style={{ background: "var(--red-dim)", color: "var(--red)", borderRadius: 4, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>✗ Not Accepting</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            VIEW: DEPARTMENTS DIRECTORY
        ══════════════════════════════════ */}
        {view === "departments" && (
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
              {[["Total Departments", DEPARTMENTS_LIST.length, "#4a7fee"], ["Total Providers", PROVIDERS_LIST.length, "#00c8e0"], ["Accepting New Patients", PROVIDERS_LIST.filter(p => p.accepting).length, "#00d68f"]].map(([label, val, color]) => (
                <div key={label} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "16px 18px" }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color, marginBottom: 4 }}>{val}</div>
                  <div style={{ fontSize: 12, color: "var(--text-2)" }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {DEPARTMENTS_LIST.map(dept => {
                const deptProviders = PROVIDERS_LIST.filter(p => p.dept === dept.name);
                return (
                  <div key={dept.id} style={{ background: "var(--card)", border: `1px solid ${dept.color}30`, borderLeft: `3px solid ${dept.color}`, borderRadius: 8, padding: "16px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{dept.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{dept.location}</div>
                      </div>
                      <span style={{ background: dept.color + "18", color: dept.color, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{dept.code}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Phone</div>
                        <div style={{ fontSize: 12, color: "var(--cyan)", fontFamily: "monospace" }}>{dept.phone}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Providers</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: dept.color }}>{deptProviders.length}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Accepting</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--green)" }}>{deptProviders.filter(p => p.accepting).length}</div>
                      </div>
                    </div>
                    {deptProviders.length > 0 && (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {deptProviders.map(p => (
                          <span key={p.id} style={{ fontSize: 11, background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 3, padding: "2px 7px", color: p.accepting ? "var(--text)" : "var(--text-3)" }}>
                            {p.name.replace("Dr. ", "").replace("NP ", "").replace("PA ", "")} {p.accepting ? "" : "✗"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ─── AMBULATORY (EPIC-STYLE) ──────────────────────────────────────────────────
const CHECKIN_WORKFLOW = ["Scheduled", "Arrived", "Checked In", "Rooming", "With Provider", "Checkout", "Completed"];
const VISIT_FLOW_COLOR = {
  Scheduled: "#8b5cf6", Arrived: "#00c8e0", "Checked In": "#4a7fee",
  Rooming: "#ffb800", "With Provider": "#1e56d9", Checkout: "#00d68f", Completed: "#00d68f",
  Confirmed: "#00d68f", "No Show": "#ff4757", Cancelled: "#ff4757",
};

const CheckInModal = ({ appt, patient, onClose, onConfirm }) => {
  const [vitals, setVitals] = useState({ bp: "", hr: "", temp: "", spo2: "", rr: "", wt: "", ht: "", pain: "0" });
  const [chiefComplaint, setChiefComplaint] = useState(appt?.reason || "");
  const [verifiedInsurance, setVerifiedInsurance] = useState(false);
  const [verifiedDemographics, setVerifiedDemographics] = useState(false);
  const [verifiedAllergies, setVerifiedAllergies] = useState(false);
  const [verifiedMeds, setVerifiedMeds] = useState(false);
  const [step, setStep] = useState(1); // 1=verify 2=vitals 3=summary

  const inp = { background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, padding: "7px 10px", color: "var(--text)", fontSize: 13, outline: "none", width: "100%" };
  const canProceed1 = verifiedInsurance && verifiedDemographics && verifiedAllergies && verifiedMeds;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, width: 680, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Modal Header */}
        <div style={{ background: "var(--blue)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Patient Check-In</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{patient ? patient.name : appt?.patientName} — {appt?.time} {appt?.type}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 4, color: "#fff", padding: "4px 10px", cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>

        {/* Step progress */}
        <div style={{ display: "flex", background: "var(--card-2)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          {[["1", "Verify Info"], ["2", "Record Vitals"], ["3", "Complete Check-In"]].map(([n, label], i) => (
            <div key={n} style={{ flex: 1, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, borderRight: i < 2 ? "1px solid var(--border)" : "none", background: step === i + 1 ? "var(--navy-2)" : "transparent" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: step > i + 1 ? "var(--green)" : step === i + 1 ? "var(--blue)" : "var(--navy-2)", border: `2px solid ${step > i + 1 ? "var(--green)" : step === i + 1 ? "var(--blue)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: step > i + 1 ? "#000" : "#fff", flexShrink: 0 }}>
                {step > i + 1 ? "✓" : n}
              </div>
              <span style={{ fontSize: 12, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? "var(--text)" : "var(--text-3)" }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {/* STEP 1: Verify Patient Info */}
          {step === 1 && (
            <div>
              {/* Patient Banner */}
              <div style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px", marginBottom: 18, display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
                  {(patient?.name || appt?.patientName || "?").split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{patient?.name || appt?.patientName}</div>
                  <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>
                    {patient?.mrn || "MRN: —"} · DOB: {patient ? fmtDate(patient.dob) : "—"} · {patient ? calcAge(patient.dob) + "y " + patient.gender : ""} · Blood: {patient?.bloodType || "—"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-2)" }}>Insurance: {patient?.insurance || appt?.insurance || "—"}</div>
                </div>
                {patient?.allergies?.length > 0 && (
                  <div style={{ background: "var(--red-dim)", border: "1px solid var(--red)30", borderRadius: 5, padding: "6px 10px", fontSize: 11, color: "var(--red)", fontWeight: 600 }}>
                    ⚠ ALLERGIES<br /><span style={{ fontWeight: 400 }}>{patient.allergies.join(", ")}</span>
                  </div>
                )}
              </div>

              {/* Appointment Info */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
                {[["Provider", appt?.provider || "—"], ["Department", appt?.dept || "—"], ["Visit Type", appt?.type || "—"], ["Scheduled Time", appt?.time || "—"], ["Reason", appt?.reason || "—"], ["Priority", appt?.priority || "Routine"]].map(([k, v]) => (
                  <div key={k} style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 3 }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Verification Checklist */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--cyan)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>Verification Checklist</div>
                <div style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                  {[
                    ["Insurance / Eligibility Verified", verifiedInsurance, setVerifiedInsurance, "Confirm insurance card scanned and eligibility checked"],
                    ["Demographics Confirmed", verifiedDemographics, setVerifiedDemographics, "Address, phone, emergency contact up-to-date"],
                    ["Allergies Reviewed", verifiedAllergies, setVerifiedAllergies, "Patient confirmed allergy list is accurate"],
                    ["Medication List Reviewed", verifiedMeds, setVerifiedMeds, "Current medications verified with patient"],
                  ].map(([label, checked, setter, desc], i) => (
                    <div key={label} onClick={() => setter(!checked)} style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: i < 3 ? "1px solid var(--border)" : "none", cursor: "pointer", background: checked ? "var(--green-dim)" : "transparent", transition: "background .15s" }}
                      onMouseEnter={e => { if (!checked) e.currentTarget.style.background = "#1e3a5f20"; }}
                      onMouseLeave={e => { if (!checked) e.currentTarget.style.background = "transparent"; }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, background: checked ? "var(--green)" : "var(--navy-2)", border: `2px solid ${checked ? "var(--green)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        {checked && <span style={{ color: "#000", fontSize: 11, fontWeight: 700 }}>✓</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: checked ? 600 : 400, color: checked ? "var(--green)" : "var(--text)" }}>{label}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)" }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {!canProceed1 && <div style={{ fontSize: 11, color: "var(--amber)", marginTop: 6 }}>⚠ Complete all verification items to proceed</div>}
              </div>

              {/* Chief Complaint */}
              <div>
                <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 5 }}>Chief Complaint / Reason for Today's Visit</div>
                <textarea value={chiefComplaint} onChange={e => setChiefComplaint(e.target.value)} rows={3}
                  placeholder="Patient's own words for today's visit..."
                  style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
              </div>
            </div>
          )}

          {/* STEP 2: Record Vitals */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Record Vital Signs</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 18 }}>Enter current vital signs. Fields left blank will be recorded as "not obtained".</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 18 }}>
                {[
                  ["Blood Pressure", "bp", "text", "e.g. 120/80", "mmHg"],
                  ["Heart Rate", "hr", "number", "e.g. 72", "bpm"],
                  ["Temperature", "temp", "number", "e.g. 98.6", "°F"],
                  ["SpO2", "spo2", "number", "e.g. 98", "%"],
                  ["Respiratory Rate", "rr", "number", "e.g. 16", "br/min"],
                  ["Weight", "wt", "number", "e.g. 165", "lbs"],
                  ["Height", "ht", "number", "e.g. 68", "inches"],
                  ["Pain Score", "pain", "number", "0–10", "/10"],
                ].map(([label, field, type, ph, unit]) => {
                  const val = vitals[field];
                  const isAbnormal = (field === "hr" && val && (val > 100 || val < 60)) || (field === "spo2" && val && val < 95) || (field === "temp" && val && parseFloat(val) > 100.4) || (field === "bp" && val && (parseInt(val) > 140 || parseInt(val) < 90)) || (field === "pain" && val && parseInt(val) >= 7);
                  return (
                    <div key={field}>
                      <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 5, display: "flex", justifyContent: "space-between" }}>
                        <span>{label}</span><span style={{ color: "var(--text-3)", fontWeight: 400 }}>{unit}</span>
                      </div>
                      <div style={{ position: "relative" }}>
                        <input type={type} value={val} onChange={e => setVitals(v => ({ ...v, [field]: e.target.value }))} placeholder={ph}
                          style={{ ...inp, border: `1px solid ${isAbnormal ? "var(--red)" : "var(--border)"}`, paddingRight: isAbnormal ? 32 : 10 }} />
                        {isAbnormal && <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "var(--red)", fontSize: 14 }}>⚠</span>}
                      </div>
                      {isAbnormal && <div style={{ fontSize: 10, color: "var(--red)", marginTop: 2 }}>Value outside normal range</div>}
                    </div>
                  );
                })}
              </div>
              {/* BMI auto-calc */}
              {vitals.wt && vitals.ht && (
                <div style={{ background: "var(--cyan-dim)", border: "1px solid var(--cyan)30", borderRadius: 6, padding: "10px 14px", fontSize: 13, color: "var(--cyan)" }}>
                  📊 BMI: <strong>{((parseFloat(vitals.wt) * 703) / (parseFloat(vitals.ht) ** 2)).toFixed(1)}</strong>
                  {" "}— {((parseFloat(vitals.wt) * 703) / (parseFloat(vitals.ht) ** 2)) < 18.5 ? "Underweight" : ((parseFloat(vitals.wt) * 703) / (parseFloat(vitals.ht) ** 2)) < 25 ? "Normal weight" : ((parseFloat(vitals.wt) * 703) / (parseFloat(vitals.ht) ** 2)) < 30 ? "Overweight" : "Obese"}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Summary / Complete */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Check-In Summary</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ padding: "9px 14px", background: "var(--blue)", fontSize: 12, fontWeight: 700 }}>Patient</div>
                  <div style={{ padding: 14 }}>
                    {[["Name", patient?.name || appt?.patientName], ["MRN", patient?.mrn || "—"], ["DOB", patient ? fmtDate(patient.dob) : "—"], ["Insurance", patient?.insurance || "—"]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 12 }}>
                        <span style={{ color: "var(--text-3)" }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ padding: "9px 14px", background: "var(--blue)", fontSize: 12, fontWeight: 700 }}>Appointment</div>
                  <div style={{ padding: 14 }}>
                    {[["Provider", appt?.provider], ["Dept", appt?.dept], ["Time", appt?.time], ["Type", appt?.type]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 12 }}>
                        <span style={{ color: "var(--text-3)" }}>{k}</span><span style={{ fontWeight: 500 }}>{v || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ padding: "9px 14px", background: "#1a3a6e", fontSize: 12, fontWeight: 700 }}>Vital Signs</div>
                  <div style={{ padding: 14 }}>
                    {[["BP", vitals.bp ? vitals.bp + " mmHg" : "Not obtained"], ["HR", vitals.hr ? vitals.hr + " bpm" : "Not obtained"], ["Temp", vitals.temp ? vitals.temp + " °F" : "Not obtained"], ["SpO2", vitals.spo2 ? vitals.spo2 + "%" : "Not obtained"], ["RR", vitals.rr ? vitals.rr + " br/min" : "Not obtained"], ["Weight", vitals.wt ? vitals.wt + " lbs" : "Not obtained"], ["Pain", vitals.pain + "/10"]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                        <span style={{ color: "var(--text-3)" }}>{k}</span>
                        <span style={{ fontWeight: 500, color: v === "Not obtained" ? "var(--text-3)" : v.includes("⚠") ? "var(--red)" : "var(--text)" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ padding: "9px 14px", background: "#1a3a6e", fontSize: 12, fontWeight: 700 }}>Chief Complaint</div>
                  <div style={{ padding: 14 }}>
                    <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{chiefComplaint || "Not documented"}</div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--green-dim)", border: "1px solid var(--green)30", borderRadius: 6, fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                ✓ Ready to complete check-in. Status will update to "Checked In" and patient will appear in today's encounter list.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, background: "var(--card-2)" }}>
          <button onClick={onClose} style={{ padding: "7px 16px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <div style={{ display: "flex", gap: 8 }}>
            {step > 1 && <button onClick={() => setStep(s => s - 1)} style={{ padding: "7px 14px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", fontSize: 13, cursor: "pointer" }}>← Back</button>}
            {step < 3 && (
              <button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !canProceed1}
                style={{ padding: "8px 20px", background: step === 1 && !canProceed1 ? "var(--navy-2)" : "var(--blue)", border: "none", borderRadius: 5, color: step === 1 && !canProceed1 ? "var(--text-3)" : "#fff", fontSize: 13, fontWeight: 600, cursor: step === 1 && !canProceed1 ? "not-allowed" : "pointer" }}>
                Next →
              </button>
            )}
            {step === 3 && (
              <button onClick={() => onConfirm({ vitals, chiefComplaint })} style={{ padding: "8px 22px", background: "var(--green)", border: "none", borderRadius: 5, color: "#000", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="check" size={14} /> Complete Check-In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Ambulatory = ({ onPatient, appointments, onUpdateAppt, onAddAppt, patientFlow, setPatientFlow }) => {
  const allAppts = appointments || APPOINTMENTS;
  const [activeTab, setActiveTab] = useState("tracking");
  const [filterProvider, setFilterProvider] = useState("All");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatusTab, setFilterStatusTab] = useState("All");
  const [selectedEncounterId, setSelectedEncounterId] = useState(null);
  const [checkInAppt, setCheckInAppt] = useState(null);
  const [checkedInVitals, setCheckedInVitals] = useState({});
  const [localStatuses, setLocalStatuses] = useState({});
  const [toast, setToast] = useState(null);
  const [roomStatuses, setRoomStatuses] = useState({
    R1: "Occupied", R2: "Ready", R3: "Cleaning", R4: "Occupied",
    R5: "Ready", R6: "Ready", R7: "Occupied", R8: "Ready",
  });
  // Orders panel state
  const [orderPatient, setOrderPatient] = useState(null);   // appt object for order context
  const [orderPanel, setOrderPanel] = useState(false);
  const [orderCategory, setOrderCategory] = useState("Lab");
  const [placedOrders, setPlacedOrders] = useState([]);     // local optimistic orders list
  const [orderForms, setOrderForms] = useState({
    Lab:  { test: "", urgency: "Routine", indication: "" },
    Medication: { drug: "", dose: "", route: "Oral", freq: "Daily", indication: "", prn: false },
    Radiology: { modality: "XR", study: "Chest PA & Lateral", urgency: "Routine", contrast: "No Contrast", indication: "" },
    Referral: { specialty: "", provider: "", reason: "", priority: "Routine", notes: "" },
    Procedure: { name: "", indication: "", scheduledDate: "", location: "Outpatient", notes: "" },
    Other: { type: "", description: "", notes: "" },
  });

  // Show ALL outpatient appointments (demo data uses fixed dates)
  const todayAppts = allAppts.filter(a =>
    !["Cancelled", "No Show"].includes(localStatuses[a.id] || a.status) || true
  ).filter(a => {
    const s = localStatuses[a.id] || a.status;
    return ["Scheduled", "Confirmed", "Arrived", "Checked In", "Rooming",
      "With Provider", "Checkout", "Completed", "Pending"].includes(s);
  });

  const getStatus = (appt) => localStatuses[appt.id] || appt.status;

  const updateStatus = (apptId, newStatus) => {
    setLocalStatuses(prev => ({ ...prev, [apptId]: newStatus }));
    if (onUpdateAppt) onUpdateAppt(apptId, newStatus);
    showToast(`✓ Status updated to "${newStatus}"`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCheckInConfirm = (appt, data) => {
    setCheckedInVitals(prev => ({ ...prev, [appt.id]: data.vitals }));
    updateStatus(appt.id, "Checked In");
    setCheckInAppt(null);
    showToast(`✓ ${appt.patientName} checked in successfully`);
  };

  const getPatientForAppt = (appt) => PATIENTS.find(p => p.id === appt.patientId);

  // Compute stats off effective status
  const getEffectiveCount = (statuses) =>
    todayAppts.filter(a => statuses.includes(getStatus(a))).length;

  const stats = {
    scheduled:    getEffectiveCount(["Scheduled", "Confirmed", "Pending"]),
    arrived:      getEffectiveCount(["Arrived"]),
    checkedIn:    getEffectiveCount(["Checked In"]),
    withProvider: getEffectiveCount(["Rooming", "With Provider"]),
    checkout:     getEffectiveCount(["Checkout"]),
    completed:    getEffectiveCount(["Completed"]),
    cancelled:    todayAppts.filter(a => ["Cancelled","No Show"].includes(getStatus(a))).length,
    total:        todayAppts.length,
  };

  const providers = [...new Set(allAppts.map(a => a.provider).filter(Boolean))];
  const depts    = [...new Set(allAppts.map(a => a.dept).filter(Boolean))];

  const filteredAppts = todayAppts.filter(a => {
    const provMatch   = filterProvider === "All" || a.provider === filterProvider;
    const deptMatch   = filterDept     === "All" || a.dept     === filterDept;
    const statusMatch = filterStatusTab=== "All" || getStatus(a) === filterStatusTab;
    return provMatch && deptMatch && statusMatch;
  });

  const statusActions = {
    "Scheduled":     [["✓ Arrived",   "Arrived",        "#00c8e0"], ["No Show",  "No Show",   "#ff4757"], ["Cancel", "Cancelled", "#ff4757"]],
    "Confirmed":     [["✓ Arrived",   "Arrived",        "#00c8e0"], ["No Show",  "No Show",   "#ff4757"], ["Cancel", "Cancelled", "#ff4757"]],
    "Pending":       [["✓ Arrived",   "Arrived",        "#00c8e0"], ["No Show",  "No Show",   "#ff4757"]],
    "Arrived":       [["Check In ▶", "CHECK_IN_MODAL",  "#1e56d9"]],
    "Checked In":    [["→ Room",      "Rooming",        "#ffb800"], ["◀ Waiting","Arrived",   "#00c8e0"]],
    "Rooming":       [["MD Ready",    "With Provider",  "#1e56d9"], ["◀ Back",   "Checked In","#8b5cf6"]],
    "With Provider": [["→ Checkout",  "Checkout",       "#00d68f"]],
    "Checkout":      [["✓ Complete",  "Completed",      "#00d68f"]],
    "Completed":     [],
    "Cancelled":     [],
    "No Show":       [],
  };

  // Room config
  const ROOMS = [
    { id: "R1", name: "Exam 1",      type: "exam" },
    { id: "R2", name: "Exam 2",      type: "exam" },
    { id: "R3", name: "Exam 3",      type: "exam" },
    { id: "R4", name: "Exam 4",      type: "exam" },
    { id: "R5", name: "Exam 5",      type: "exam" },
    { id: "R6", name: "Exam 6",      type: "exam" },
    { id: "R7", name: "Procedure 1", type: "procedure" },
    { id: "R8", name: "Procedure 2", type: "procedure" },
  ];
  // Assign occupied rooms to patients who are Rooming/With Provider
  const roomOccupants = todayAppts.filter(a => ["Rooming","With Provider"].includes(getStatus(a)));
  const roomColor = { Occupied: "#ffb800", Ready: "#00d68f", Cleaning: "#8b5cf6" };

  const cycleRoom = (roomId) => {
    setRoomStatuses(prev => {
      const cycle = { Ready: "Occupied", Occupied: "Cleaning", Cleaning: "Ready" };
      return { ...prev, [roomId]: cycle[prev[roomId]] || "Ready" };
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position: "fixed", top: 70, right: 24, zIndex: 9999, background: "#0f2044", border: "1px solid var(--green)", color: "var(--green)", padding: "11px 20px", borderRadius: 7, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 24px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>✓</span> {toast}
        </div>
      )}

      {/* ── CHECK-IN MODAL ── */}
      {checkInAppt && (
        <CheckInModal
          appt={checkInAppt}
          patient={getPatientForAppt(checkInAppt)}
          onClose={() => setCheckInAppt(null)}
          onConfirm={(data) => handleCheckInConfirm(checkInAppt, data)}
        />
      )}

      {/* ══════════════════════════════════════
          TOP HEADER BAR  (Epic-style)
      ══════════════════════════════════════ */}
      <div style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "0 20px", display: "flex", alignItems: "center", gap: 0, height: 48, flexShrink: 0 }}>
        <div style={{ marginRight: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>Ambulatory</div>
          <div style={{ fontSize: 10, color: "var(--text-3)", lineHeight: 1 }}>Outpatient Visit Management</div>
        </div>
        {/* Tab strip */}
        {[
          ["tracking",   "Patient Tracking"],
          ["schedule",   "Today's Schedule"],
          ["rooms",      "Room Board"],
          ["encounters", "Encounter List"],
          ["orders",     "Orders"],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{ height: 48, padding: "0 18px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === id ? "var(--cyan)" : "transparent"}`, color: activeTab === id ? "var(--cyan)" : "var(--text-2)", fontSize: 13, fontWeight: activeTab === id ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap", marginBottom: -1 }}>
            {label}
            {id === "tracking" && stats.arrived > 0 &&
              <span style={{ marginLeft: 6, background: "var(--cyan)", color: "#000", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{stats.arrived}</span>}
            {id === "orders" && placedOrders.length > 0 &&
              <span style={{ marginLeft: 6, background: "var(--amber)", color: "#000", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{placedOrders.length}</span>}
          </button>
        ))}
        {/* Right side controls */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <select value={filterProvider} onChange={e => setFilterProvider(e.target.value)}
            style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 8px", color: "var(--text)", fontSize: 11, outline: "none" }}>
            <option value="All">All Providers</option>
            {providers.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
            style={{ background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 8px", color: "var(--text)", fontSize: 11, outline: "none" }}>
            <option value="All">All Depts</option>
            {depts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button
            onClick={() => {
              setActiveTab("orders");
              setOrderPanel(true);
            }}
            style={{ padding: "5px 13px", background: "var(--blue)", border: "none", borderRadius: 4, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            ＋ New Order
          </button>
          <button
            onClick={() => {
              const walkin = {
                id: "APT_WI_" + Date.now(), patientId: "P_WALKIN",
                patientName: "Walk-In Patient",
                date: new Date().toISOString().slice(0,10),
                time: new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false}),
                type: "Urgent / Same-Day", provider: "Dr. Lisa Park",
                dept: "Internal Medicine", reason: "Walk-in – unscheduled",
                status: "Arrived", priority: "Urgent",
              };
              if (onAddAppt) onAddAppt(walkin);
              showToast("Walk-in patient added — ready to check in");
            }}
            style={{ padding: "5px 12px", background: "var(--amber)", border: "none", borderRadius: 4, color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            + Walk-In
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          STATUS TICKER  (7 buckets)
      ══════════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", background: "var(--card-2)", borderBottom: "2px solid var(--border)", flexShrink: 0 }}>
        {[
          ["Scheduled",     stats.scheduled,    "#8b5cf6"],
          ["Arrived",       stats.arrived,       "#00c8e0"],
          ["Checked In",    stats.checkedIn,     "#4a7fee"],
          ["With Provider", stats.withProvider,  "#ffb800"],
          ["Checkout",      stats.checkout,      "#00d68f"],
          ["Completed",     stats.completed,     "#00d68f"],
          ["Cancelled",     stats.cancelled,     "#ff4757"],
          ["Total Appts",   stats.total,         "var(--text-2)"],
        ].map(([label, count, color], i) => (
          <div key={label}
            onClick={() => setFilterStatusTab(filterStatusTab === label ? "All" : label)}
            style={{ padding: "9px 0", textAlign: "center", borderRight: i < 7 ? "1px solid var(--border)" : "none", cursor: "pointer", background: filterStatusTab === label ? color + "15" : "transparent", borderBottom: filterStatusTab === label ? `2px solid ${color}` : "2px solid transparent", transition: "all .15s" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: 9, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.04em", marginTop: 2, textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════
          TAB CONTENT
      ══════════════════════════════════════ */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ─────────────────────────────────
            TAB: PATIENT TRACKING
        ───────────────────────────────── */}
        {activeTab === "tracking" && (
          <div>
            {filteredAppts.length === 0 && (
              <div style={{ padding: 48, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
                <div style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 6 }}>No appointments match your current filters.</div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>Try "All Providers" and "All Depts", or check the Scheduling module to add appointments.</div>
              </div>
            )}

            {/* Render by workflow order */}
            {["Arrived", "Checked In", "Rooming", "With Provider", "Checkout",
              "Scheduled", "Confirmed", "Pending", "Completed", "No Show", "Cancelled"].map(statusGroup => {
              const group = filteredAppts.filter(a => getStatus(a) === statusGroup);
              if (group.length === 0) return null;
              const sgColor = VISIT_FLOW_COLOR[statusGroup] || "#4a6080";
              const isActive = ["Arrived","Checked In","Rooming","With Provider","Checkout"].includes(statusGroup);

              return (
                <div key={statusGroup}>
                  {/* Status section header */}
                  <div style={{ padding: "7px 20px", background: isActive ? sgColor + "18" : "var(--card-2)", borderTop: "1px solid var(--border)", borderBottom: `1px solid ${sgColor}30`, display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 2 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: sgColor, boxShadow: isActive ? `0 0 8px ${sgColor}` : "none" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: sgColor, textTransform: "uppercase", letterSpacing: "0.09em" }}>{statusGroup}</span>
                    <span style={{ fontSize: 11, color: "var(--text-3)" }}>— {group.length} patient{group.length !== 1 ? "s" : ""}</span>
                    {statusGroup === "Arrived" && (
                      <span style={{ marginLeft: 8, fontSize: 11, color: "var(--cyan)", fontStyle: "italic" }}>
                        ← Click "Check In ▶" to start the check-in workflow
                      </span>
                    )}
                  </div>

                  {/* Patient rows */}
                  {group.map(appt => {
                    const patient = getPatientForAppt(appt);
                    const provObj = PROVIDERS_LIST.find(p => p.name === appt.provider);
                    const vitalsOnFile = checkedInVitals[appt.id];
                    const actions = statusActions[getStatus(appt)] || [];
                    const isExpanded = selectedEncounterId === appt.id;
                    const deptObj = DEPARTMENTS_LIST.find(d => d.name === appt.dept);

                    return (
                      <div key={appt.id} style={{ borderBottom: "1px solid var(--border-2)" }}>
                        {/* Main row */}
                        <div style={{ display: "flex", alignItems: "stretch", background: isExpanded ? "#1e56d910" : "transparent", transition: "background .12s" }}>
                          {/* Color stripe */}
                          <div style={{ width: 4, flexShrink: 0, background: sgColor, opacity: isActive ? 1 : 0.4 }} />

                          {/* Time column */}
                          <div style={{ width: 64, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px 0", borderRight: "1px solid var(--border-2)" }}>
                            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, fontWeight: 600, color: isActive ? "var(--cyan)" : "var(--text-2)" }}>{appt.time}</div>
                            <div style={{ fontSize: 9, color: "var(--text-3)", marginTop: 2 }}>{fmtDate(appt.date)}</div>
                          </div>

                          {/* Patient info */}
                          <div style={{ flex: 1, padding: "10px 14px", minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                              {/* Avatar */}
                              <div style={{ width: 30, height: 30, borderRadius: "50%", background: provObj?.color || "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000", flexShrink: 0 }}>
                                {(patient?.name || appt.patientName).split(" ").map(n=>n[0]).join("").slice(0,2)}
                              </div>
                              {/* Name — clickable to chart */}
                              <span onClick={() => patient && onPatient(patient)}
                                style={{ fontSize: 14, fontWeight: 700, cursor: patient ? "pointer" : "default", color: patient ? "var(--cyan)" : "var(--text)", textDecoration: patient ? "underline" : "none", textDecorationStyle: "dotted" }}>
                                {patient?.name || appt.patientName}
                              </span>
                              {patient?.mrn && <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-3)", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 3, padding: "0 5px" }}>{patient.mrn}</span>}
                              {patient && <span style={{ fontSize: 11, color: "var(--text-2)" }}>{calcAge(patient.dob)}y {patient.gender}</span>}
                              {appt.priority === "Urgent" && <span style={{ background: "var(--red-dim)", color: "var(--red)", borderRadius: 3, padding: "1px 7px", fontSize: 11, fontWeight: 700, border: "1px solid var(--red)40" }}>⚡ URGENT</span>}
                              {patient?.allergies?.length > 0 && <span style={{ background: "var(--red-dim)", color: "var(--red)", borderRadius: 3, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>⚠ {patient.allergies.join(", ")}</span>}
                            </div>
                            {/* Appointment details row */}
                            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-2)", flexWrap: "wrap" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{ background: "var(--purple-dim)", color: "var(--purple)", borderRadius: 3, padding: "1px 6px", fontSize: 11, fontWeight: 600 }}>{appt.type}</span>
                              </span>
                              <span>🩺 {appt.provider}{provObj ? ` · ${provObj.credential}` : ""}</span>
                              {deptObj && <span style={{ background: deptObj.color + "15", color: deptObj.color, borderRadius: 3, padding: "1px 6px", fontSize: 11, fontWeight: 600 }}>{deptObj.code}</span>}
                              {appt.reason && <span style={{ color: "var(--text-3)" }}>"{appt.reason}"</span>}
                            </div>
                            {/* Vitals chips (if checked in) */}
                            {vitalsOnFile && (
                              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                                {[["BP",vitalsOnFile.bp,""],["HR",vitalsOnFile.hr,"bpm"],["T",vitalsOnFile.temp,"°F"],["SpO2",vitalsOnFile.spo2,"%"],["Pain",vitalsOnFile.pain,"/10"],["Wt",vitalsOnFile.wt,"lb"]].filter(([,v])=>v).map(([lbl,val,unit])=>{
                                  const abnormal = (lbl==="HR"&&(val>100||val<60)) || (lbl==="SpO2"&&val<95) || (lbl==="T"&&parseFloat(val)>100.4) || (lbl==="Pain"&&parseInt(val)>=7);
                                  return (
                                    <span key={lbl} style={{ background: abnormal ? "var(--red-dim)" : "var(--navy-2)", border: `1px solid ${abnormal ? "var(--red)50" : "var(--border)"}`, borderRadius: 4, padding: "2px 8px", fontSize: 11, color: abnormal ? "var(--red)" : "var(--text)", fontFamily: "monospace" }}>
                                      {lbl}: <strong>{val}{unit}</strong>{abnormal ? " ⚠" : ""}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Action buttons + expand */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", flexShrink: 0 }}>
                            {actions.map(([label, targetStatus, color]) => (
                              <button key={label}
                                onClick={() => targetStatus === "CHECK_IN_MODAL" ? setCheckInAppt(appt) : updateStatus(appt.id, targetStatus)}
                                style={{ padding: "6px 13px", background: color + "18", border: `1px solid ${color}45`, borderRadius: 5, color, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "background .12s" }}
                                onMouseEnter={e => e.currentTarget.style.background = color + "35"}
                                onMouseLeave={e => e.currentTarget.style.background = color + "18"}>
                                {label}
                              </button>
                            ))}
                            <div style={{ width: 1, height: 28, background: "var(--border)", margin: "0 2px" }} />
                            {patient && (
                              <button onClick={() => onPatient(patient)}
                                style={{ padding: "5px 11px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text-2)", fontSize: 12, cursor: "pointer" }}>
                                Chart →
                              </button>
                            )}
                            <button onClick={() => setSelectedEncounterId(isExpanded ? null : appt.id)}
                              style={{ padding: "5px 8px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text-3)", fontSize: 12, cursor: "pointer" }}>
                              {isExpanded ? "▲" : "▼"}
                            </button>
                          </div>
                        </div>

                        {/* ── Expanded detail panel ── */}
                        {isExpanded && (
                          <div style={{ background: "var(--card-2)", borderTop: "1px solid var(--border)", padding: "16px 20px 16px 72px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                              {/* Demographics */}
                              <div>
                                <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, paddingBottom: 4, borderBottom: "1px solid var(--border)" }}>Demographics</div>
                                {patient ? [
                                  ["DOB", fmtDate(patient.dob)],
                                  ["Age/Sex", `${calcAge(patient.dob)}y ${patient.gender === "F" ? "Female" : "Male"}`],
                                  ["Blood Type", patient.bloodType],
                                  ["Phone", patient.phone],
                                  ["Insurance", patient.insurance],
                                  ["PCP", patient.pcp],
                                ].map(([k,v]) => (
                                  <div key={k} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12 }}>
                                    <span style={{ color: "var(--text-3)", minWidth: 70 }}>{k}</span>
                                    <span style={{ color: "var(--text)" }}>{v}</span>
                                  </div>
                                )) : <div style={{ fontSize: 12, color: "var(--text-3)" }}>Patient not linked to chart</div>}
                              </div>
                              {/* Allergies & Meds */}
                              <div>
                                <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, paddingBottom: 4, borderBottom: "1px solid var(--border)" }}>Allergies</div>
                                {patient ? (patient.allergies.length > 0
                                  ? patient.allergies.map(a => (
                                    <div key={a} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5, fontSize: 12, color: "var(--red)" }}>
                                      <span style={{ fontSize: 10 }}>⚠</span>{a}
                                    </div>
                                  ))
                                  : <div style={{ fontSize: 12, color: "var(--green)" }}>✓ No Known Drug Allergies</div>
                                ) : <div style={{ fontSize: 12, color: "var(--text-3)" }}>—</div>}
                              </div>
                              {/* Visit */}
                              <div>
                                <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, paddingBottom: 4, borderBottom: "1px solid var(--border)" }}>Visit Details</div>
                                {[
                                  ["Appt ID",  appt.id],
                                  ["Type",     appt.type],
                                  ["Provider", appt.provider],
                                  ["Dept",     appt.dept],
                                  ["Reason",   appt.reason || "—"],
                                  ["Priority", appt.priority || "Routine"],
                                ].map(([k,v]) => (
                                  <div key={k} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12 }}>
                                    <span style={{ color: "var(--text-3)", minWidth: 60 }}>{k}</span>
                                    <span style={{ color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
                                  </div>
                                ))}
                              </div>
                              {/* Vitals */}
                              <div>
                                <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, paddingBottom: 4, borderBottom: "1px solid var(--border)" }}>Vital Signs</div>
                                {vitalsOnFile ? [
                                  ["BP", vitalsOnFile.bp, "mmHg"],
                                  ["HR", vitalsOnFile.hr, "bpm"],
                                  ["Temp", vitalsOnFile.temp, "°F"],
                                  ["SpO2", vitalsOnFile.spo2, "%"],
                                  ["RR", vitalsOnFile.rr, "br/min"],
                                  ["Weight", vitalsOnFile.wt, "lbs"],
                                  ["Pain", vitalsOnFile.pain, "/10"],
                                ].map(([k,v,u]) => {
                                  const abnormal = (k==="HR"&&v&&(v>100||v<60)) || (k==="SpO2"&&v&&v<95) || (k==="Temp"&&v&&parseFloat(v)>100.4) || (k==="Pain"&&v&&parseInt(v)>=7);
                                  return (
                                    <div key={k} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12 }}>
                                      <span style={{ color: "var(--text-3)", minWidth: 50 }}>{k}</span>
                                      <span style={{ color: abnormal ? "var(--red)" : v ? "var(--text)" : "var(--text-3)", fontWeight: abnormal ? 600 : 400 }}>
                                        {v ? `${v} ${u}` : "—"}{abnormal ? " ⚠" : ""}
                                      </span>
                                    </div>
                                  );
                                }) : (
                                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                                    Not yet recorded.
                                    {["Checked In","Rooming","With Provider"].includes(getStatus(appt)) && (
                                      <button onClick={() => setCheckInAppt(appt)}
                                        style={{ display: "block", marginTop: 8, padding: "5px 10px", background: "var(--amber)", border: "none", borderRadius: 4, color: "#000", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                                        Record Vitals
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Row of quick actions */}
                            <div style={{ display: "flex", gap: 8, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                              {patient && <button onClick={() => onPatient(patient)} style={{ padding: "6px 14px", background: "var(--blue)", border: "none", borderRadius: 5, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📋 Open Full Chart</button>}
                              {getStatus(appt) === "Arrived" && (
                                <button onClick={() => setCheckInAppt(appt)} style={{ padding: "6px 14px", background: "var(--cyan)", border: "none", borderRadius: 5, color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✓ Check In Patient</button>
                              )}
                              <button style={{ padding: "6px 14px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", fontSize: 12, cursor: "pointer" }}>📝 Add Note</button>
                              <button style={{ padding: "6px 14px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", fontSize: 12, cursor: "pointer" }}>🖨 Print Facesheet</button>
                              <button style={{ padding: "6px 14px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", fontSize: 12, cursor: "pointer" }}>💊 Medication Rec</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* ─────────────────────────────────
            TAB: TODAY'S SCHEDULE
        ───────────────────────────────── */}
        {activeTab === "schedule" && (
          <div>
            {/* Column header */}
            <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 140px 180px 160px 110px 130px 200px", background: "var(--card-2)", borderBottom: "1px solid var(--border)", padding: "8px 0", position: "sticky", top: 0, zIndex: 2 }}>
              {["Time","Patient","Visit Type","Reason","Provider","Dept","Status","Actions"].map((h,i) => (
                <div key={h} style={{ padding: "0 12px", fontSize: 10, color: "var(--text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</div>
              ))}
            </div>

            {[...filteredAppts].sort((a,b) => (a.time > b.time ? 1 : -1)).map((appt, i, arr) => {
              const patient = getPatientForAppt(appt);
              const status = getStatus(appt);
              const sc = VISIT_FLOW_COLOR[status] || "#8b5cf6";
              const provObj = PROVIDERS_LIST.find(p => p.name === appt.provider);
              const deptObj = DEPARTMENTS_LIST.find(d => d.name === appt.dept);
              return (
                <div key={appt.id}
                  style={{ display: "grid", gridTemplateColumns: "64px 1fr 140px 180px 160px 110px 130px 200px", borderBottom: "1px solid var(--border-2)", alignItems: "center", transition: "background .1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1e3a5f15"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ padding: "11px 12px", fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "var(--cyan)" }}>{appt.time}</div>
                  <div style={{ padding: "11px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: provObj?.color || "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#000", flexShrink: 0 }}>
                        {(patient?.name||appt.patientName).split(" ").map(n=>n[0]).join("").slice(0,2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{patient?.name || appt.patientName}</div>
                        {patient && <div style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "monospace" }}>{patient.mrn} · {calcAge(patient.dob)}y {patient.gender}</div>}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "11px 12px" }}>
                    <span style={{ background: "var(--purple-dim)", color: "var(--purple)", borderRadius: 3, padding: "2px 7px", fontSize: 11, fontWeight: 600 }}>{appt.type}</span>
                  </div>
                  <div style={{ padding: "11px 12px", fontSize: 12, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{appt.reason}</div>
                  <div style={{ padding: "11px 12px" }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{appt.provider}</div>
                    {provObj && <div style={{ fontSize: 10, color: "var(--text-3)" }}>{provObj.credential}</div>}
                  </div>
                  <div style={{ padding: "11px 12px" }}>
                    {deptObj ? <span style={{ background: deptObj.color+"15", color: deptObj.color, borderRadius: 3, padding: "2px 6px", fontSize: 11, fontWeight: 600 }}>{deptObj.code}</span>
                      : <span style={{ fontSize: 11, color: "var(--text-3)" }}>{appt.dept}</span>}
                  </div>
                  <div style={{ padding: "11px 12px" }}>
                    <span style={{ background: sc+"18", color: sc, border: `1px solid ${sc}35`, borderRadius: 4, padding: "3px 8px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{status}</span>
                  </div>
                  <div style={{ padding: "11px 12px", display: "flex", gap: 5 }}>
                    {["Scheduled","Confirmed","Pending"].includes(status) && (
                      <button onClick={() => updateStatus(appt.id,"Arrived")} style={{ padding: "4px 9px", background: "var(--cyan)20", border: "1px solid var(--cyan)40", borderRadius: 4, color: "var(--cyan)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Arrived</button>
                    )}
                    {status === "Arrived" && (
                      <button onClick={() => setCheckInAppt(appt)} style={{ padding: "4px 9px", background: "var(--blue)", border: "none", borderRadius: 4, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Check In</button>
                    )}
                    {status === "Checked In" && (
                      <button onClick={() => updateStatus(appt.id,"Rooming")} style={{ padding: "4px 9px", background: "var(--amber)20", border: "1px solid var(--amber)40", borderRadius: 4, color: "var(--amber)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>→ Room</button>
                    )}
                    {status === "Rooming" && (
                      <button onClick={() => updateStatus(appt.id,"With Provider")} style={{ padding: "4px 9px", background: "var(--blue)20", border: "1px solid var(--blue)60", borderRadius: 4, color: "var(--blue-light)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>MD Ready</button>
                    )}
                    {status === "With Provider" && (
                      <button onClick={() => updateStatus(appt.id,"Checkout")} style={{ padding: "4px 9px", background: "var(--green)20", border: "1px solid var(--green)40", borderRadius: 4, color: "var(--green)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Checkout</button>
                    )}
                    {status === "Checkout" && (
                      <button onClick={() => updateStatus(appt.id,"Completed")} style={{ padding: "4px 9px", background: "var(--green)", border: "none", borderRadius: 4, color: "#000", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Complete</button>
                    )}
                    {patient && <button onClick={() => onPatient(patient)} style={{ padding: "4px 9px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text-2)", fontSize: 11, cursor: "pointer" }}>Chart</button>}
                  </div>
                </div>
              );
            })}
            {filteredAppts.length === 0 && (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>No appointments match filters.</div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────
            TAB: ROOM BOARD
        ───────────────────────────────── */}
        {activeTab === "rooms" && (
          <div style={{ padding: 20 }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
              {[
                ["Ready",    ROOMS.filter(r=>roomStatuses[r.id]==="Ready").length,    "#00d68f"],
                ["Occupied", ROOMS.filter(r=>roomStatuses[r.id]==="Occupied").length, "#ffb800"],
                ["Cleaning", ROOMS.filter(r=>roomStatuses[r.id]==="Cleaning").length, "#8b5cf6"],
                ["Total",    ROOMS.length,                                              "#4a7fee"],
              ].map(([label,val,color])=>(
                <div key={label} style={{ background: "var(--card)", border: `1px solid ${color}30`, borderRadius: 8, padding: "14px 18px" }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color, marginBottom: 3 }}>{val}</div>
                  <div style={{ fontSize: 12, color: "var(--text-2)" }}>{label} Rooms</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {ROOMS.map((room, ri) => {
                const status = roomStatuses[room.id];
                const rc = roomColor[status] || "#4a6080";
                // Find occupant from patients currently Rooming or With Provider
                const occupant = roomOccupants[ri] || null;
                const occupantPatient = occupant ? getPatientForAppt(occupant) : null;
                return (
                  <div key={room.id} style={{ background: "var(--card)", border: `2px solid ${rc}35`, borderTop: `3px solid ${rc}`, borderRadius: 10, padding: 18, position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{room.name}</div>
                        <div style={{ fontSize: 10, color: "var(--text-3)", textTransform: "uppercase" }}>{room.type}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: rc, boxShadow: `0 0 8px ${rc}` }} />
                        <span style={{ background: rc+"20", color: rc, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{status}</span>
                      </div>
                    </div>
                    {status === "Occupied" && occupant ? (
                      <div style={{ background: "var(--navy-2)", borderRadius: 6, padding: "10px 12px", marginBottom: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{occupantPatient?.name || occupant.patientName}</div>
                        <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 2 }}>{occupant.provider}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>Since {occupant.time} · {getStatus(occupant)}</div>
                      </div>
                    ) : status === "Occupied" ? (
                      <div style={{ background: "var(--navy-2)", borderRadius: 6, padding: "10px 12px", marginBottom: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Room in use</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>Provider session active</div>
                      </div>
                    ) : status === "Cleaning" ? (
                      <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 12, fontStyle: "italic" }}>Being cleaned / prepared...</div>
                    ) : (
                      <div style={{ fontSize: 12, color: "var(--green)", marginBottom: 12, fontWeight: 600 }}>✓ Available for patient</div>
                    )}
                    <button onClick={() => cycleRoom(room.id)}
                      style={{ width: "100%", padding: "7px", background: rc+"18", border: `1px solid ${rc}35`, borderRadius: 6, color: rc, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      {status === "Ready" ? "Assign Patient" : status === "Occupied" ? "Mark for Cleaning" : "Mark Ready"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────
            TAB: ENCOUNTER LIST
        ───────────────────────────────── */}
        {activeTab === "encounters" && (
          <div style={{ padding: "0" }}>
            <div style={{ padding: "10px 20px", background: "var(--card-2)", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text-2)" }}>
              All checked-in and in-progress encounters. Vitals recorded during check-in appear here.
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--card-2)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0 }}>
                  {["Patient","MRN","Time","Visit Type","Reason","Provider","Vital Signs","Status","Actions"].map(h=>(
                    <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:10, color:"var(--text-3)", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todayAppts
                  .filter(a => ["Checked In","Rooming","With Provider","Checkout","Completed"].includes(getStatus(a)))
                  .sort((a,b) => a.time > b.time ? 1 : -1)
                  .map((appt, i, arr) => {
                    const patient = getPatientForAppt(appt);
                    const vitals = checkedInVitals[appt.id];
                    const status = getStatus(appt);
                    const sc = VISIT_FLOW_COLOR[status] || "#8b5cf6";
                    return (
                      <tr key={appt.id} style={{ borderBottom: "1px solid var(--border-2)" }}
                        onMouseEnter={e=>e.currentTarget.style.background="#1e3a5f15"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{ padding:"10px 14px" }}>
                          <div style={{ fontSize:13, fontWeight:600 }}>{patient?.name || appt.patientName}</div>
                          {patient?.allergies?.length > 0 && <div style={{ fontSize:10, color:"var(--red)" }}>⚠ {patient.allergies.join(", ")}</div>}
                        </td>
                        <td style={{ padding:"10px 14px", fontSize:11, color:"var(--cyan)", fontFamily:"monospace" }}>{patient?.mrn || "—"}</td>
                        <td style={{ padding:"10px 14px", fontSize:13, fontWeight:600, fontFamily:"monospace", color:"var(--text-2)" }}>{appt.time}</td>
                        <td style={{ padding:"10px 14px" }}>
                          <span style={{ background:"var(--purple-dim)", color:"var(--purple)", borderRadius:3, padding:"2px 7px", fontSize:11, fontWeight:600 }}>{appt.type}</span>
                        </td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:"var(--text-2)", maxWidth:160 }}>
                          <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{appt.reason}</div>
                        </td>
                        <td style={{ padding:"10px 14px" }}>
                          <div style={{ fontSize:12, fontWeight:600 }}>{appt.provider}</div>
                          <div style={{ fontSize:10, color:"var(--text-3)" }}>{appt.dept}</div>
                        </td>
                        <td style={{ padding:"10px 14px" }}>
                          {vitals ? (
                            <div style={{ fontSize:11, lineHeight:1.6 }}>
                              {vitals.bp&&<div style={{ color:"var(--text-2)" }}>BP <strong>{vitals.bp}</strong></div>}
                              {vitals.hr&&<div style={{ color: vitals.hr>100||vitals.hr<60?"var(--red)":"var(--text-2)" }}>HR <strong>{vitals.hr} bpm</strong></div>}
                              {vitals.temp&&<div style={{ color: parseFloat(vitals.temp)>100.4?"var(--red)":"var(--text-2)" }}>T <strong>{vitals.temp}°F</strong></div>}
                              {vitals.spo2&&<div style={{ color: vitals.spo2<95?"var(--red)":"var(--text-2)" }}>SpO2 <strong>{vitals.spo2}%</strong></div>}
                            </div>
                          ) : (
                            <span style={{ fontSize:11, color:"var(--text-3)" }}>Not recorded</span>
                          )}
                        </td>
                        <td style={{ padding:"10px 14px" }}>
                          <span style={{ background:sc+"18", color:sc, border:`1px solid ${sc}35`, borderRadius:4, padding:"3px 8px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>{status}</span>
                        </td>
                        <td style={{ padding:"10px 14px" }}>
                          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                            {patient && <button onClick={()=>onPatient(patient)} style={{ padding:"4px 10px", background:"var(--blue)", border:"none", borderRadius:4, color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer" }}>Chart</button>}
                            {status==="With Provider" && <button onClick={()=>updateStatus(appt.id,"Checkout")} style={{ padding:"4px 10px", background:"var(--green-dim)", border:"1px solid var(--green)30", borderRadius:4, color:"var(--green)", fontSize:11, cursor:"pointer" }}>Checkout</button>}
                            {status==="Checkout" && <button onClick={()=>updateStatus(appt.id,"Completed")} style={{ padding:"4px 10px", background:"var(--green)", border:"none", borderRadius:4, color:"#000", fontSize:11, fontWeight:700, cursor:"pointer" }}>Complete</button>}
                            {status==="Checked In" && !vitals && <button onClick={()=>setCheckInAppt(appt)} style={{ padding:"4px 10px", background:"var(--amber-dim)", border:"1px solid var(--amber)40", borderRadius:4, color:"var(--amber)", fontSize:11, fontWeight:600, cursor:"pointer" }}>+ Vitals</button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                {todayAppts.filter(a=>["Checked In","Rooming","With Provider","Checkout","Completed"].includes(getStatus(a))).length === 0 && (
                  <tr><td colSpan={9} style={{ padding:40, textAlign:"center", color:"var(--text-3)", fontSize:13 }}>
                    No active encounters yet.<br />
                    <span style={{ fontSize:12 }}>Mark a patient as Arrived in the Tracking tab, then click "Check In ▶" to begin.</span>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ─────────────────────────────────
            TAB: ORDERS
        ───────────────────────────────── */}
        {activeTab === "orders" && (() => {
          const AMB_LAB_TESTS = ["CBC with Differential","Comprehensive Metabolic Panel","Basic Metabolic Panel","Lipid Panel","HbA1c","TSH","Urinalysis","Blood Culture x2","PT/INR","aPTT","Troponin I","BNP","Procalcitonin","CRP","COVID-19 PCR","Influenza A/B","Urine Pregnancy Test","PSA","Vitamin D","Vitamin B12"];
          const AMB_MEDS = ["Amoxicillin","Azithromycin","Lisinopril","Metformin","Atorvastatin","Omeprazole","Albuterol","Metoprolol","Amlodipine","Levothyroxine","Prednisone","Ibuprofen","Acetaminophen","Ondansetron","Ciprofloxacin","Doxycycline","Gabapentin","Sertraline","Hydrochlorothiazide","Furosemide"];
          const AMB_RAD = { XR:["Chest PA & Lateral","Abdomen AP","Spine Lumbar","Knee AP & Lateral","Hip AP & Lateral"], CT:["Head without contrast","Chest without contrast","Abdomen/Pelvis with contrast","CTA Chest (PE Protocol)"], MRI:["Brain without contrast","Spine Lumbar","Knee"], US:["Abdomen Complete","Pelvis","RUQ Gallbladder","Renal","Thyroid","Carotid Doppler","Lower Extremity DVT"] };
          const SPECIALTIES = ["Cardiology","Endocrinology","Gastroenterology","Nephrology","Neurology","Oncology","Orthopedics","Pulmonology","Rheumatology","Dermatology","Ophthalmology","ENT","Psychiatry","Urology","Vascular Surgery"];
          const PROCEDURES = ["ECG / 12-Lead","Spirometry / PFTs","Holter Monitor (24hr)","Echocardiogram","Stress Test (Exercise)","Colonoscopy Referral","Upper Endoscopy","Skin Biopsy","Joint Injection","Lumbar Puncture","Bone Density (DEXA)","Sleep Study Referral","Nerve Conduction Study","Wound Care","IV Infusion Therapy"];

          const inp2 = { width:"100%", background:"var(--navy-2)", border:"1px solid var(--border)", borderRadius:5, padding:"7px 10px", color:"var(--text)", fontSize:13, outline:"none" };
          const lbl2 = { fontSize:10, color:"var(--text-3)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4, display:"block" };

          const categoryMeta = {
            Lab:       { icon:"🔬", color:"#00c8e0", label:"Laboratory" },
            Medication:{ icon:"💊", color:"#00d68f", label:"Medication" },
            Radiology: { icon:"🩻", color:"#8b5cf6", label:"Radiology" },
            Referral:  { icon:"👨‍⚕️", color:"#4a7fee", label:"Referral" },
            Procedure: { icon:"🩺", color:"#ffb800", label:"Procedure" },
            Other:     { icon:"📋", color:"#4a6080", label:"Other" },
          };

          const placeOrder = () => {
            const appt = orderPatient || todayAppts.find(a => ["Checked In","Rooming","With Provider"].includes(getStatus(a)));
            const pid = appt?.patientId;
            const f = orderForms[orderCategory];
            let desc = "", cpt = "99213", fee = 0;
            if (orderCategory==="Lab") { desc=f.test; cpt="85025"; fee=52; }
            else if (orderCategory==="Medication") { desc=`${f.drug} ${f.dose} ${f.route} ${f.freq}${f.prn?" PRN":""}`; cpt="J0_AMB"; fee=45; }
            else if (orderCategory==="Radiology") { desc=`${f.modality} ${f.study}`; cpt="71046"; fee={"XR":185,"CT":1250,"MRI":1850,"US":650}[f.modality]||300; }
            else if (orderCategory==="Referral") { desc=`Referral → ${f.specialty}${f.provider?` (${f.provider})`:""}`; cpt="99241"; fee=85; }
            else if (orderCategory==="Procedure") { desc=f.name; cpt="93000"; fee=120; }
            else { desc=f.description; cpt="99099"; fee=0; }

            if (!desc) return;

            const newOrder = {
              id: "AMB_ORD_"+Date.now(),
              category: orderCategory,
              description: desc,
              urgency: f.urgency||"Routine",
              indication: f.indication||f.reason||f.notes||"",
              status: "Ordered",
              orderedAt: new Date().toISOString(),
              patientId: pid,
              patientName: appt?.patientName || "—",
              provider: appt?.provider || "Ordering Provider",
              apptId: appt?.id,
              cpt, fee,
            };
            setPlacedOrders(prev => [newOrder, ...prev]);
            // Write into patientFlow for billing / downstream modules
            if (pid && setPatientFlow) {
              setPatientFlow(prev => ({
                ...prev,
                [pid]: {
                  ...(prev?.[pid]||{}),
                  orders: [...(prev?.[pid]?.orders||[]), newOrder],
                  billingCharges: [...(prev?.[pid]?.billingCharges||buildDefaultBilling(pid)), {
                    id: "BC_"+Date.now(), cpt, desc, qty:1, unitFee:fee, total:fee,
                    date: new Date().toISOString().slice(0,10), category: orderCategory, status:"Pending"
                  }],
                }
              }));
            }
            // Reset form for this category
            const resetMap = {
              Lab: { test:"", urgency:"Routine", indication:"" },
              Medication: { drug:"", dose:"", route:"Oral", freq:"Daily", indication:"", prn:false },
              Radiology: { modality:"XR", study:"Chest PA & Lateral", urgency:"Routine", contrast:"No Contrast", indication:"" },
              Referral: { specialty:"", provider:"", reason:"", priority:"Routine", notes:"" },
              Procedure: { name:"", indication:"", scheduledDate:"", location:"Outpatient", notes:"" },
              Other: { type:"", description:"", notes:"" },
            };
            setOrderForms(prev => ({...prev, [orderCategory]: resetMap[orderCategory]}));
            showToast(`✓ ${categoryMeta[orderCategory].label} order placed: ${desc}`);
            setOrderPanel(false);
          };

          const groupedOrders = placedOrders.reduce((acc, o) => {
            if (!acc[o.category]) acc[o.category] = [];
            acc[o.category].push(o);
            return acc;
          }, {});

          // Also pull orders from patientFlow
          const flowOrders = patientFlow
            ? Object.values(patientFlow).flatMap(f => (f.orders||[]).filter(o => o.apptId && todayAppts.some(a => a.id===o.apptId)))
            : [];
          const allOrdersDisplay = [...placedOrders, ...flowOrders.filter(fo => !placedOrders.some(po => po.id===fo.id))];

          return (
            <div style={{ display:"flex", height:"100%", minHeight:500 }}>

              {/* ── LEFT: Order Entry Panel ── */}
              <div style={{ width: orderPanel ? 420 : 0, flexShrink:0, overflow:"hidden", transition:"width .2s", borderRight: orderPanel?"1px solid var(--border)":"none", background:"var(--card)", display:"flex", flexDirection:"column" }}>
                {orderPanel && (
                  <>
                    {/* Panel header */}
                    <div style={{ padding:"12px 16px", background:"var(--blue)", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700 }}>Place Order</div>
                        {orderPatient && <div style={{ fontSize:11, opacity:.85, marginTop:2 }}>{orderPatient.patientName} · {orderPatient.time}</div>}
                      </div>
                      <button onClick={()=>setOrderPanel(false)} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:4, color:"#fff", padding:"3px 10px", cursor:"pointer", fontSize:13 }}>✕</button>
                    </div>

                    {/* Patient selector (if no orderPatient) */}
                    {!orderPatient && (
                      <div style={{ padding:"10px 14px", background:"var(--card-2)", borderBottom:"1px solid var(--border)", flexShrink:0 }}>
                        <label style={lbl2}>Patient for this order</label>
                        <select onChange={e => {
                          const appt = todayAppts.find(a => a.id===e.target.value);
                          setOrderPatient(appt||null);
                        }} style={inp2}>
                          <option value="">— Select patient —</option>
                          {todayAppts.filter(a=>["Checked In","Rooming","With Provider","Arrived"].includes(getStatus(a))).map(a => (
                            <option key={a.id} value={a.id}>{a.patientName} ({a.time} — {getStatus(a)})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Order category tabs */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4, padding:"10px 14px", background:"var(--card-2)", borderBottom:"1px solid var(--border)", flexShrink:0 }}>
                      {Object.entries(categoryMeta).map(([cat, meta]) => (
                        <button key={cat} onClick={()=>setOrderCategory(cat)}
                          style={{ padding:"5px 11px", background: orderCategory===cat ? meta.color+"25":"var(--navy-2)", border:`1px solid ${orderCategory===cat ? meta.color+"60":"var(--border)"}`, borderRadius:5, color: orderCategory===cat ? meta.color : "var(--text-2)", fontSize:12, fontWeight: orderCategory===cat ? 700:400, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                          <span>{meta.icon}</span>{cat}
                        </button>
                      ))}
                    </div>

                    {/* Order form */}
                    <div style={{ flex:1, overflowY:"auto", padding:16 }}>

                      {/* LAB */}
                      {orderCategory==="Lab" && (
                        <div>
                          <div style={{ fontSize:12, color:"var(--text-3)", marginBottom:12 }}>Select a lab test and urgency level.</div>
                          <div style={{ marginBottom:12 }}>
                            <label style={lbl2}>Urgency</label>
                            <div style={{ display:"flex", gap:6 }}>
                              {["Routine","STAT","ASAP"].map(u=>(
                                <button key={u} onClick={()=>setOrderForms(p=>({...p,Lab:{...p.Lab,urgency:u}}))}
                                  style={{ flex:1, padding:"7px", background: orderForms.Lab.urgency===u ? (u==="STAT"?"var(--red)":u==="ASAP"?"var(--amber)":"var(--blue)") : "var(--navy-2)", border:`1px solid ${orderForms.Lab.urgency===u?(u==="STAT"?"var(--red)":u==="ASAP"?"var(--amber)":"var(--blue)"):"var(--border)"}`, borderRadius:5, color: orderForms.Lab.urgency===u?"#fff":"var(--text-2)", fontSize:12, fontWeight:700, cursor:"pointer" }}>{u}</button>
                              ))}
                            </div>
                          </div>
                          <div style={{ marginBottom:12 }}>
                            <label style={lbl2}>Test *</label>
                            <div style={{ maxHeight:220, overflowY:"auto", border:"1px solid var(--border)", borderRadius:6, overflow:"hidden" }}>
                              {AMB_LAB_TESTS.map(t=>(
                                <div key={t} onClick={()=>setOrderForms(p=>({...p,Lab:{...p.Lab,test:t}}))}
                                  style={{ padding:"8px 12px", fontSize:12, cursor:"pointer", background: orderForms.Lab.test===t?"var(--cyan)18":"transparent", color: orderForms.Lab.test===t?"var(--cyan)":"var(--text-2)", borderBottom:"1px solid var(--border-2)", fontWeight: orderForms.Lab.test===t?700:400 }}
                                  onMouseEnter={e=>e.currentTarget.style.background=orderForms.Lab.test===t?"var(--cyan)18":"#1e3a5f20"}
                                  onMouseLeave={e=>e.currentTarget.style.background=orderForms.Lab.test===t?"var(--cyan)18":"transparent"}>
                                  {orderForms.Lab.test===t && "✓ "}{t}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div><label style={lbl2}>Clinical Indication</label><input value={orderForms.Lab.indication} onChange={e=>setOrderForms(p=>({...p,Lab:{...p.Lab,indication:e.target.value}}))} placeholder="Reason for ordering..." style={inp2}/></div>
                        </div>
                      )}

                      {/* MEDICATION */}
                      {orderCategory==="Medication" && (
                        <div>
                          <div style={{ fontSize:12, color:"var(--text-3)", marginBottom:12 }}>Order will be sent to pharmacy for verification.</div>
                          <div style={{ marginBottom:12 }}>
                            <label style={lbl2}>Medication *</label>
                            <input list="amb-med-list" value={orderForms.Medication.drug} onChange={e=>setOrderForms(p=>({...p,Medication:{...p.Medication,drug:e.target.value}}))} placeholder="Type or select medication..." style={inp2}/>
                            <datalist id="amb-med-list">{AMB_MEDS.map(m=><option key={m} value={m}/>)}</datalist>
                          </div>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                            <div><label style={lbl2}>Dose</label><input value={orderForms.Medication.dose} onChange={e=>setOrderForms(p=>({...p,Medication:{...p.Medication,dose:e.target.value}}))} placeholder="e.g. 500mg" style={inp2}/></div>
                            <div><label style={lbl2}>Route</label><select value={orderForms.Medication.route} onChange={e=>setOrderForms(p=>({...p,Medication:{...p.Medication,route:e.target.value}}))} style={inp2}>{["Oral","IV","IM","SQ","Topical","Inhaled","SL"].map(r=><option key={r}>{r}</option>)}</select></div>
                            <div><label style={lbl2}>Frequency</label><select value={orderForms.Medication.freq} onChange={e=>setOrderForms(p=>({...p,Medication:{...p.Medication,freq:e.target.value}}))} style={inp2}>{["Once","Daily","BID","TID","QID","Q4H","Q6H","Q8H","Q12H","PRN","Stat"].map(r=><option key={r}>{r}</option>)}</select></div>
                          </div>
                          <label style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, fontSize:13, cursor:"pointer" }}><input type="checkbox" checked={orderForms.Medication.prn} onChange={e=>setOrderForms(p=>({...p,Medication:{...p.Medication,prn:e.target.checked}}))}/> PRN (as needed)</label>
                          <div><label style={lbl2}>Indication</label><input value={orderForms.Medication.indication} onChange={e=>setOrderForms(p=>({...p,Medication:{...p.Medication,indication:e.target.value}}))} placeholder="Reason for medication..." style={inp2}/></div>
                        </div>
                      )}

                      {/* RADIOLOGY */}
                      {orderCategory==="Radiology" && (
                        <div>
                          <div style={{ marginBottom:12 }}>
                            <label style={lbl2}>Urgency</label>
                            <div style={{ display:"flex", gap:6 }}>
                              {["Routine","STAT","ASAP"].map(u=>(
                                <button key={u} onClick={()=>setOrderForms(p=>({...p,Radiology:{...p.Radiology,urgency:u}}))}
                                  style={{ flex:1, padding:"7px", background: orderForms.Radiology.urgency===u?(u==="STAT"?"var(--red)":u==="ASAP"?"var(--amber)":"var(--blue)"):"var(--navy-2)", border:"1px solid var(--border)", borderRadius:5, color: orderForms.Radiology.urgency===u?"#fff":"var(--text-2)", fontSize:12, fontWeight:700, cursor:"pointer" }}>{u}</button>
                              ))}
                            </div>
                          </div>
                          <div style={{ marginBottom:12 }}>
                            <label style={lbl2}>Modality</label>
                            <div style={{ display:"flex", gap:6 }}>
                              {["XR","CT","MRI","US"].map(m=>{
                                const mc = {XR:"#4a7fee",CT:"#00c8e0",MRI:"#8b5cf6",US:"#00d68f"}[m];
                                return <button key={m} onClick={()=>setOrderForms(p=>({...p,Radiology:{...p.Radiology,modality:m,study:(AMB_RAD[m]||[])[0]||""}}))}
                                  style={{ flex:1, padding:"7px", background: orderForms.Radiology.modality===m?mc+"25":"var(--navy-2)", border:`1px solid ${orderForms.Radiology.modality===m?mc+"60":"var(--border)"}`, borderRadius:5, color: orderForms.Radiology.modality===m?mc:"var(--text-2)", fontSize:12, fontWeight:700, cursor:"pointer" }}>{m}</button>;
                              })}
                            </div>
                          </div>
                          <div style={{ marginBottom:12 }}>
                            <label style={lbl2}>Study *</label>
                            <div style={{ maxHeight:160, overflowY:"auto", border:"1px solid var(--border)", borderRadius:6, overflow:"hidden" }}>
                              {(AMB_RAD[orderForms.Radiology.modality]||[]).map(s=>(
                                <div key={s} onClick={()=>setOrderForms(p=>({...p,Radiology:{...p.Radiology,study:s}}))}
                                  style={{ padding:"8px 12px", fontSize:12, cursor:"pointer", background: orderForms.Radiology.study===s?"var(--purple)18":"transparent", color: orderForms.Radiology.study===s?"var(--purple)":"var(--text-2)", borderBottom:"1px solid var(--border-2)", fontWeight: orderForms.Radiology.study===s?700:400 }}
                                  onMouseEnter={e=>e.currentTarget.style.background=orderForms.Radiology.study===s?"var(--purple)18":"#1e3a5f20"}
                                  onMouseLeave={e=>e.currentTarget.style.background=orderForms.Radiology.study===s?"var(--purple)18":"transparent"}>
                                  {orderForms.Radiology.study===s && "✓ "}{s}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div style={{ marginBottom:12 }}><label style={lbl2}>Contrast</label><select value={orderForms.Radiology.contrast} onChange={e=>setOrderForms(p=>({...p,Radiology:{...p.Radiology,contrast:e.target.value}}))} style={inp2}>{["No Contrast","With Contrast","With & Without Contrast"].map(o=><option key={o}>{o}</option>)}</select></div>
                          <div><label style={lbl2}>Clinical Indication</label><input value={orderForms.Radiology.indication} onChange={e=>setOrderForms(p=>({...p,Radiology:{...p.Radiology,indication:e.target.value}}))} placeholder="e.g. Rule out pneumonia..." style={inp2}/></div>
                        </div>
                      )}

                      {/* REFERRAL */}
                      {orderCategory==="Referral" && (
                        <div>
                          <div style={{ marginBottom:12 }}>
                            <label style={lbl2}>Specialty *</label>
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, maxHeight:200, overflowY:"auto" }}>
                              {SPECIALTIES.map(s=>(
                                <div key={s} onClick={()=>setOrderForms(p=>({...p,Referral:{...p.Referral,specialty:s}}))}
                                  style={{ padding:"7px 10px", fontSize:12, cursor:"pointer", background: orderForms.Referral.specialty===s?"var(--blue)25":"var(--navy-2)", color: orderForms.Referral.specialty===s?"var(--cyan)":"var(--text-2)", border:`1px solid ${orderForms.Referral.specialty===s?"var(--cyan)40":"var(--border)"}`, borderRadius:5, fontWeight: orderForms.Referral.specialty===s?700:400 }}
                                  onMouseEnter={e=>e.currentTarget.style.background=orderForms.Referral.specialty===s?"var(--blue)25":"#1e3a5f20"}
                                  onMouseLeave={e=>e.currentTarget.style.background=orderForms.Referral.specialty===s?"var(--blue)25":"var(--navy-2)"}>
                                  {orderForms.Referral.specialty===s?"✓ ":""}{s}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div style={{ marginBottom:12 }}><label style={lbl2}>Specific Provider (optional)</label><select value={orderForms.Referral.provider} onChange={e=>setOrderForms(p=>({...p,Referral:{...p.Referral,provider:e.target.value}}))} style={inp2}><option value="">— Any in specialty —</option>{PROVIDERS_LIST.map(p=><option key={p.id} value={p.name}>{p.name} ({p.specialty})</option>)}</select></div>
                          <div style={{ marginBottom:12 }}>
                            <label style={lbl2}>Priority</label>
                            <div style={{ display:"flex", gap:6 }}>
                              {["Routine","Urgent","ASAP"].map(u=>(
                                <button key={u} onClick={()=>setOrderForms(p=>({...p,Referral:{...p.Referral,priority:u}}))}
                                  style={{ flex:1, padding:"7px", background: orderForms.Referral.priority===u?(u==="Urgent"?"var(--red)":u==="ASAP"?"var(--amber)":"var(--blue)"):"var(--navy-2)", border:"1px solid var(--border)", borderRadius:5, color: orderForms.Referral.priority===u?"#fff":"var(--text-2)", fontSize:12, fontWeight:700, cursor:"pointer" }}>{u}</button>
                              ))}
                            </div>
                          </div>
                          <div><label style={lbl2}>Reason for Referral *</label><textarea value={orderForms.Referral.reason} onChange={e=>setOrderForms(p=>({...p,Referral:{...p.Referral,reason:e.target.value}}))} rows={3} placeholder="Clinical reason for this referral..." style={{...inp2,resize:"vertical"}}/></div>
                        </div>
                      )}

                      {/* PROCEDURE */}
                      {orderCategory==="Procedure" && (
                        <div>
                          <div style={{ marginBottom:12 }}>
                            <label style={lbl2}>Procedure *</label>
                            <div style={{ maxHeight:200, overflowY:"auto", border:"1px solid var(--border)", borderRadius:6, overflow:"hidden" }}>
                              {PROCEDURES.map(proc=>(
                                <div key={proc} onClick={()=>setOrderForms(p=>({...p,Procedure:{...p.Procedure,name:proc}}))}
                                  style={{ padding:"8px 12px", fontSize:12, cursor:"pointer", background: orderForms.Procedure.name===proc?"var(--amber)18":"transparent", color: orderForms.Procedure.name===proc?"var(--amber)":"var(--text-2)", borderBottom:"1px solid var(--border-2)", fontWeight: orderForms.Procedure.name===proc?700:400 }}
                                  onMouseEnter={e=>e.currentTarget.style.background=orderForms.Procedure.name===proc?"var(--amber)18":"#1e3a5f20"}
                                  onMouseLeave={e=>e.currentTarget.style.background=orderForms.Procedure.name===proc?"var(--amber)18":"transparent"}>
                                  {orderForms.Procedure.name===proc?"✓ ":""}{proc}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                            <div><label style={lbl2}>Scheduled Date</label><input type="date" value={orderForms.Procedure.scheduledDate} onChange={e=>setOrderForms(p=>({...p,Procedure:{...p.Procedure,scheduledDate:e.target.value}}))} style={inp2}/></div>
                            <div><label style={lbl2}>Location</label><select value={orderForms.Procedure.location} onChange={e=>setOrderForms(p=>({...p,Procedure:{...p.Procedure,location:e.target.value}}))} style={inp2}>{["Outpatient","Same Day Surgery","Hospital","Office"].map(o=><option key={o}>{o}</option>)}</select></div>
                          </div>
                          <div><label style={lbl2}>Clinical Indication</label><textarea value={orderForms.Procedure.indication} onChange={e=>setOrderForms(p=>({...p,Procedure:{...p.Procedure,indication:e.target.value}}))} rows={2} placeholder="Reason for procedure..." style={{...inp2,resize:"vertical"}}/></div>
                        </div>
                      )}

                      {/* OTHER */}
                      {orderCategory==="Other" && (
                        <div>
                          <div style={{ marginBottom:12 }}><label style={lbl2}>Order Type</label><input value={orderForms.Other.type} onChange={e=>setOrderForms(p=>({...p,Other:{...p.Other,type:e.target.value}}))} placeholder="e.g. Social Work Consult, Dietitian, PT/OT..." style={inp2}/></div>
                          <div style={{ marginBottom:12 }}><label style={lbl2}>Description *</label><textarea value={orderForms.Other.description} onChange={e=>setOrderForms(p=>({...p,Other:{...p.Other,description:e.target.value}}))} rows={3} placeholder="Order details..." style={{...inp2,resize:"vertical"}}/></div>
                          <div><label style={lbl2}>Additional Notes</label><textarea value={orderForms.Other.notes} onChange={e=>setOrderForms(p=>({...p,Other:{...p.Other,notes:e.target.value}}))} rows={2} placeholder="Additional instructions..." style={{...inp2,resize:"vertical"}}/></div>
                        </div>
                      )}
                    </div>

                    {/* Place order footer */}
                    <div style={{ padding:"12px 16px", borderTop:"1px solid var(--border)", background:"var(--card-2)", flexShrink:0, display:"flex", gap:8 }}>
                      <button onClick={placeOrder}
                        style={{ flex:1, padding:"9px", background:`${categoryMeta[orderCategory].color}`, border:"none", borderRadius:5, color:"#000", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                        {categoryMeta[orderCategory].icon} Place {orderCategory} Order
                      </button>
                      <button onClick={()=>setOrderPanel(false)} style={{ padding:"9px 14px", background:"var(--navy-2)", border:"1px solid var(--border)", borderRadius:5, color:"var(--text-2)", fontSize:13, cursor:"pointer" }}>Cancel</button>
                    </div>
                  </>
                )}
              </div>

              {/* ── RIGHT: Orders List ── */}
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                {/* Orders toolbar */}
                <div style={{ padding:"10px 16px", background:"var(--card-2)", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ fontSize:12, color:"var(--text-2)", fontWeight:600 }}>Today's Orders</span>
                    <span style={{ fontSize:11, color:"var(--text-3)" }}>({allOrdersDisplay.length} total)</span>
                    {Object.entries(categoryMeta).map(([cat,meta])=>{
                      const count = allOrdersDisplay.filter(o=>o.category===cat).length;
                      if (!count) return null;
                      return <span key={cat} style={{ background:meta.color+"18", color:meta.color, border:`1px solid ${meta.color}35`, borderRadius:10, padding:"1px 8px", fontSize:11, fontWeight:600 }}>{meta.icon} {cat}: {count}</span>;
                    })}
                  </div>
                  <button onClick={()=>{setOrderPanel(true);setOrderPatient(null);}}
                    style={{ padding:"6px 14px", background:"var(--blue)", border:"none", borderRadius:5, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                    ＋ New Order
                  </button>
                </div>

                {/* Quick-launch order buttons */}
                {!orderPanel && (
                  <div style={{ padding:"10px 16px", background:"var(--card)", borderBottom:"1px solid var(--border)", display:"flex", gap:8, flexShrink:0, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, color:"var(--text-3)", alignSelf:"center" }}>Quick order:</span>
                    {[["🔬 CBC","Lab","CBC with Differential"],["🔬 BMP","Lab","Basic Metabolic Panel"],["🩻 CXR","Radiology","Chest PA & Lateral"],["💊 Med","Medication",""],["👨‍⚕️ Referral","Referral",""],["🩺 ECG","Procedure","ECG / 12-Lead"]].map(([label, cat, preset])=>(
                      <button key={label} onClick={()=>{
                        setOrderCategory(cat);
                        if (cat==="Lab" && preset) setOrderForms(p=>({...p,Lab:{...p.Lab,test:preset}}));
                        if (cat==="Radiology" && preset) setOrderForms(p=>({...p,Radiology:{...p.Radiology,study:preset}}));
                        if (cat==="Procedure" && preset) setOrderForms(p=>({...p,Procedure:{...p.Procedure,name:preset}}));
                        setOrderPanel(true); setOrderPatient(null);
                      }}
                        style={{ padding:"5px 12px", background:"var(--navy-2)", border:"1px solid var(--border)", borderRadius:5, color:"var(--text-2)", fontSize:12, cursor:"pointer" }}
                        onMouseEnter={e=>{e.currentTarget.style.background="#1e3a5f40";e.currentTarget.style.color="var(--text)";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="var(--navy-2)";e.currentTarget.style.color="var(--text-2)";}}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Order list */}
                <div style={{ flex:1, overflowY:"auto" }}>
                  {allOrdersDisplay.length === 0 && (
                    <div style={{ padding:48, textAlign:"center" }}>
                      <div style={{ fontSize:32, marginBottom:12 }}>📋</div>
                      <div style={{ fontSize:14, color:"var(--text-2)", marginBottom:6 }}>No orders placed yet for today.</div>
                      <div style={{ fontSize:12, color:"var(--text-3)", marginBottom:16 }}>Use the "＋ New Order" button or Quick Order shortcuts above to place lab, medication, imaging, referral, or procedure orders.</div>
                      <button onClick={()=>{setOrderPanel(true);setOrderPatient(null);}} style={{ padding:"8px 20px", background:"var(--blue)", border:"none", borderRadius:5, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>＋ Place First Order</button>
                    </div>
                  )}
                  {Object.entries(categoryMeta).map(([cat, meta]) => {
                    const catOrders = allOrdersDisplay.filter(o => o.category===cat);
                    if (catOrders.length === 0) return null;
                    return (
                      <div key={cat}>
                        <div style={{ padding:"7px 16px", background:meta.color+"10", borderTop:"1px solid var(--border)", borderBottom:`1px solid ${meta.color}25`, display:"flex", alignItems:"center", gap:8, position:"sticky", top:0, zIndex:2 }}>
                          <span style={{ fontSize:14 }}>{meta.icon}</span>
                          <span style={{ fontSize:11, fontWeight:700, color:meta.color, textTransform:"uppercase", letterSpacing:"0.08em" }}>{meta.label} Orders</span>
                          <span style={{ fontSize:11, color:"var(--text-3)" }}>({catOrders.length})</span>
                        </div>
                        {catOrders.map((ord, i) => {
                          const statusColor = { Ordered:"#ffb800", Verified:"#00c8e0", Resulted:"#00d68f", Completed:"#00d68f", Cancelled:"#ff4757" }[ord.status]||"#ffb800";
                          const patient = PATIENTS.find(p=>p.id===ord.patientId);
                          return (
                            <div key={ord.id} style={{ display:"flex", borderBottom:"1px solid var(--border-2)", alignItems:"center" }}
                              onMouseEnter={e=>e.currentTarget.style.background="#1e3a5f12"}
                              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                              <div style={{ width:4, background:meta.color, flexShrink:0, alignSelf:"stretch" }}/>
                              <div style={{ flex:1, padding:"11px 14px" }}>
                                <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:4, flexWrap:"wrap" }}>
                                  <span style={{ fontSize:13, fontWeight:700 }}>{ord.description}</span>
                                  {ord.urgency==="STAT" && <span style={{ background:"var(--red-dim)", color:"var(--red)", borderRadius:3, padding:"1px 6px", fontSize:11, fontWeight:700, border:"1px solid var(--red)40" }}>⚡ STAT</span>}
                                  {ord.urgency==="ASAP" && <span style={{ background:"var(--amber-dim)", color:"var(--amber)", borderRadius:3, padding:"1px 6px", fontSize:11, fontWeight:700 }}>ASAP</span>}
                                  <span style={{ background:statusColor+"18", color:statusColor, border:`1px solid ${statusColor}35`, borderRadius:4, padding:"1px 8px", fontSize:11, fontWeight:600 }}>{ord.status}</span>
                                </div>
                                <div style={{ display:"flex", gap:14, fontSize:11, color:"var(--text-3)", flexWrap:"wrap" }}>
                                  {ord.patientName && <span>👤 {ord.patientName}</span>}
                                  {ord.provider && <span>🩺 {ord.provider}</span>}
                                  {ord.indication && <span>📝 {ord.indication}</span>}
                                  <span>🕐 {new Date(ord.orderedAt).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</span>
                                  {ord.fee>0 && <span style={{ color:"var(--green)", fontFamily:"monospace" }}>CPT {ord.cpt} · ${ord.fee}</span>}
                                </div>
                              </div>
                              <div style={{ padding:"0 12px", display:"flex", gap:5, flexShrink:0 }}>
                                {ord.status==="Ordered" && (
                                  <button onClick={()=>setPlacedOrders(prev=>prev.map(o=>o.id===ord.id?{...o,status:"Completed"}:o))}
                                    style={{ padding:"4px 9px", background:"var(--green-dim)", border:"1px solid var(--green)35", borderRadius:4, color:"var(--green)", fontSize:11, fontWeight:600, cursor:"pointer" }}>
                                    ✓ Complete
                                  </button>
                                )}
                                <button onClick={()=>setPlacedOrders(prev=>prev.map(o=>o.id===ord.id?{...o,status:"Cancelled"}:o))}
                                  style={{ padding:"4px 9px", background:"var(--navy-2)", border:"1px solid var(--border)", borderRadius:4, color:"var(--text-3)", fontSize:11, cursor:"pointer" }}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};
// ─── INPATIENT ────────────────────────────────────────────────────────────────
// ─── SHARED PATIENT JOURNEY STATE (lifted to App) ────────────────────────────
// Passed as props: patientFlow, setPatientFlow
// Shape per patient id:
// { admitStatus, room, labs:[], meds:[], rads:[], notes:[], orders:[], dischargeInfo, billingCharges:[] }

// ─── CPT / CHARGE CODE MASTER ─────────────────────────────────────────────────
const CPT_MASTER = {
  // E&M
  "99221": { desc: "Initial Inpatient H&P – Low", fee: 245.00, category: "E&M" },
  "99222": { desc: "Initial Inpatient H&P – Moderate", fee: 310.00, category: "E&M" },
  "99223": { desc: "Initial Inpatient H&P – High", fee: 380.00, category: "E&M" },
  "99231": { desc: "Subsequent Inpatient Visit – Low", fee: 135.00, category: "E&M" },
  "99232": { desc: "Subsequent Inpatient Visit – Mod", fee: 165.00, category: "E&M" },
  "99233": { desc: "Subsequent Inpatient Visit – High", fee: 195.00, category: "E&M" },
  "99238": { desc: "Hospital Discharge Day – <30 min", fee: 155.00, category: "E&M" },
  "99239": { desc: "Hospital Discharge Day – >30 min", fee: 220.00, category: "E&M" },
  "99213": { desc: "Office Visit Established – Mod", fee: 165.00, category: "E&M" },
  "99214": { desc: "Office Visit Established – High", fee: 215.00, category: "E&M" },
  "99215": { desc: "Office Visit New – High", fee: 265.00, category: "E&M" },
  // Labs
  "85025": { desc: "CBC with Differential", fee: 38.00, category: "Lab" },
  "80048": { desc: "Basic Metabolic Panel (BMP)", fee: 42.00, category: "Lab" },
  "80053": { desc: "Comprehensive Metabolic Panel", fee: 52.00, category: "Lab" },
  "83036": { desc: "Hemoglobin A1c", fee: 45.00, category: "Lab" },
  "86590": { desc: "Procalcitonin", fee: 68.00, category: "Lab" },
  "87040": { desc: "Blood Culture", fee: 75.00, category: "Lab" },
  "84443": { desc: "TSH", fee: 56.00, category: "Lab" },
  "82565": { desc: "Creatinine", fee: 28.00, category: "Lab" },
  "82947": { desc: "Glucose", fee: 22.00, category: "Lab" },
  // Radiology
  "71046": { desc: "Chest X-Ray PA & Lateral", fee: 185.00, category: "Radiology" },
  "74177": { desc: "CT Abdomen/Pelvis w/contrast", fee: 1250.00, category: "Radiology" },
  "71250": { desc: "CT Chest w/o contrast", fee: 980.00, category: "Radiology" },
  "73502": { desc: "Hip X-Ray AP & Lateral", fee: 165.00, category: "Radiology" },
  "93306": { desc: "Echocardiogram", fee: 850.00, category: "Radiology" },
  "70553": { desc: "MRI Brain w & w/o contrast", fee: 1850.00, category: "Radiology" },
  // Medications/Procedures
  "J0690": { desc: "Ceftriaxone 500mg IV", fee: 42.00, category: "Pharmacy" },
  "J0456": { desc: "Azithromycin 500mg IV", fee: 38.00, category: "Pharmacy" },
  "J2175": { desc: "Meperidine HCl 100mg", fee: 28.00, category: "Pharmacy" },
  "J7030": { desc: "NS 1000mL IV", fee: 85.00, category: "Pharmacy" },
  "J1650": { desc: "Enoxaparin 40mg SQ", fee: 78.00, category: "Pharmacy" },
  "99232_room": { desc: "Room & Board – Med/Surg", fee: 2800.00, category: "Facility" },
  "99232_icu": { desc: "Room & Board – ICU", fee: 4200.00, category: "Facility" },
};

// Default billing data per patient built from their history
const buildDefaultBilling = (patientId) => {
  const base = {
    P001: [
      { cpt: "99221", qty: 1, date: "2025-02-28" },
      { cpt: "99233", qty: 6, date: "2025-02-28" },
      { cpt: "99238", qty: 1, date: "2025-03-07" },
      { cpt: "85025", qty: 2, date: "2025-02-28" },
      { cpt: "80048", qty: 2, date: "2025-02-28" },
      { cpt: "86590", qty: 1, date: "2025-03-05" },
      { cpt: "87040", qty: 2, date: "2025-02-28" },
      { cpt: "71046", qty: 1, date: "2025-02-28" },
      { cpt: "71250", qty: 1, date: "2025-03-01" },
      { cpt: "J0690", qty: 12, date: "2025-02-28" },
      { cpt: "J0456", qty: 6, date: "2025-02-28" },
      { cpt: "J7030", qty: 5, date: "2025-02-28" },
      { cpt: "99232_room", qty: 7, date: "2025-02-28" },
    ],
    P002: [
      { cpt: "99213", qty: 1, date: "2025-03-06" },
      { cpt: "83036", qty: 1, date: "2025-03-06" },
      { cpt: "80053", qty: 1, date: "2025-03-06" },
    ],
    P003: [
      { cpt: "99221", qty: 1, date: "2025-03-01" },
      { cpt: "99233", qty: 4, date: "2025-03-01" },
      { cpt: "85025", qty: 2, date: "2025-03-01" },
      { cpt: "73502", qty: 1, date: "2025-03-01" },
      { cpt: "J1650", qty: 4, date: "2025-03-01" },
      { cpt: "J0690", qty: 8, date: "2025-03-01" },
      { cpt: "99232_room", qty: 6, date: "2025-03-01" },
    ],
    P004: [{ cpt: "99213", qty: 1, date: "2025-03-07" }],
    P005: [{ cpt: "99215", qty: 1, date: "2025-03-07" }],
  };
  return (base[patientId] || []).map(item => {
    const cpt = CPT_MASTER[item.cpt];
    return { id: item.cpt + "_" + item.date, cpt: item.cpt, desc: cpt?.desc || "Service", qty: item.qty, unitFee: cpt?.fee || 0, total: (cpt?.fee || 0) * item.qty, date: item.date, category: cpt?.category || "Other", status: "Billed" };
  });
};

// ─── INPATIENT ────────────────────────────────────────────────────────────────
const InpatientOrderPanel = ({ patient, patientFlow, setPatientFlow, onClose, showToast }) => {
  const [orderCategory, setOrderCategory] = useState("Medication");
  const [placedOrders, setPlacedOrders] = useState(() => patientFlow?.[patient?.id]?.orders || []);

  const [forms, setForms] = useState({
    Medication: { drug:"", dose:"", route:"IV", freq:"Q8H", indication:"", prn:false, startDate:new Date().toISOString().slice(0,10), duration:"", urgency:"Routine" },
    Lab:        { test:"", urgency:"Routine", indication:"", collectTime:"ASAP" },
    Radiology:  { modality:"XR", study:"Chest AP Portable", urgency:"Routine", contrast:"No Contrast", indication:"" },
    Consult:    { specialty:"", provider:"", reason:"", priority:"Routine", notes:"" },
    Nursing:    { order:"", frequency:"", instructions:"" },
    Diet:       { diet:"Regular", texture:"Regular", fluids:"Unrestricted", supplements:"", notes:"" },
    Activity:   { level:"Ad lib", restrictions:"", assistDevice:"None", fallPrecautions:false, seizurePrecautions:false, dvtProphylaxis:false },
    Procedure:  { name:"", indication:"", scheduledDate:"", site:"Bedside", notes:"" },
  });

  const IP_MEDS = ["Vancomycin","Piperacillin-Tazobactam","Cefazolin","Metronidazole","Ciprofloxacin","Heparin","Enoxaparin","Furosemide","Metoprolol","Lisinopril","Insulin Regular","Insulin Glargine","Morphine","Hydromorphone","Lorazepam","Ondansetron","Pantoprazole","Potassium Chloride","Magnesium Sulfate","Sodium Chloride 0.9%","Dextrose 5%","Albumin","Methylprednisolone","Dexamethasone","Acetaminophen","Ibuprofen","Aspirin","Clopidogrel","Amiodarone","Digoxin"];
  const IP_LABS = {
    Hematology: ["CBC with Differential","CBC without Differential","PT/INR","aPTT","D-Dimer","Fibrinogen","Type & Screen","Type & Crossmatch"],
    Chemistry:  ["Basic Metabolic Panel","Comprehensive Metabolic Panel","Magnesium","Phosphorus","Lactate","ABG","Ammonia","Uric Acid","LDH"],
    Cardiac:    ["Troponin I","BNP/NT-proBNP","CK-MB","Lipid Panel"],
    Infectious: ["Blood Culture x2","Urine Culture","Sputum Culture","Procalcitonin","CRP","COVID-19 PCR","Influenza A/B","HIV Screen","C. diff Toxin"],
    Endocrine:  ["HbA1c","TSH","Free T4","Cortisol","Insulin"],
    Urine:      ["Urinalysis with Micro","Urine Culture","Urine Electrolytes","Urine Protein/Creatinine"],
  };
  const IP_RAD = { XR:["Chest AP Portable","Abdomen AP","KUB","Pelvis AP"], CT:["Head without contrast","Chest without contrast","Chest with contrast","Abdomen/Pelvis with contrast","CTA Chest PE Protocol","CT Angiography"], MRI:["Brain with & without","Brain without","Spine Cervical","Spine Lumbar","Cardiac MRI"], US:["Abdomen Complete","Cardiac Echo","Renal","RUQ","Lower Extremity DVT","IVC Filter Check"] };
  const SPECIALTIES = ["Cardiology","Pulmonology","Nephrology","Gastroenterology","Infectious Disease","Neurology","Hematology/Oncology","Endocrinology","Rheumatology","Surgery","Orthopedics","Urology","Psychiatry","Palliative Care","Case Management","Social Work","Physical Therapy","Occupational Therapy","Speech Therapy","Nutrition/Dietitian","Pharmacy","Wound Care","Vascular Surgery","Interventional Radiology"];
  const NURSING_ORDERS = ["Vital signs Q4H","Vital signs Q8H","Continuous cardiac monitoring","Pulse oximetry continuous","Daily weights","Strict I&O","Foley catheter insertion","Foley catheter removal","IV access — peripheral","PICC line care","Wound dressing change","Fall precautions","Aspiration precautions","Restraint order","Blood glucose checks AC/HS","O2 therapy — titrate to SpO2 >94%","Incentive spirometry Q1H while awake","DVT compression stockings","Repositioning Q2H","NPO after midnight","Remove all lines — discharge prep"];
  const IP_PROCS = ["Lumbar Puncture","Thoracentesis","Paracentesis","Arterial Line Insertion","Central Line Insertion","PICC Placement","Bronchoscopy","EGD (Upper Endoscopy)","Colonoscopy","Cardiac Cardioversion","Intubation / Airway Management","Chest Tube Insertion","Wound Debridement","Bone Marrow Biopsy","Skin Biopsy","Joint Aspiration","Cystoscopy","Percutaneous Drainage"];

  const categoryMeta = {
    Medication: { icon:"💊", color:"#00d68f", label:"Medication" },
    Lab:        { icon:"🔬", color:"#00c8e0", label:"Lab" },
    Radiology:  { icon:"🩻", color:"#8b5cf6", label:"Radiology" },
    Consult:    { icon:"👨‍⚕️", color:"#4a7fee", label:"Consult" },
    Nursing:    { icon:"🩺", color:"#ffb800", label:"Nursing" },
    Diet:       { icon:"🍽️", color:"#00d68f", label:"Diet" },
    Activity:   { icon:"🏃", color:"#ff8c00", label:"Activity" },
    Procedure:  { icon:"⚕️", color:"#ff4757", label:"Procedure" },
  };

  const inp = { width:"100%", background:"var(--navy-3,#0d1e36)", border:"1px solid var(--border)", borderRadius:5, padding:"7px 10px", color:"var(--text)", fontSize:12, outline:"none" };
  const lbl = { fontSize:10, color:"var(--text-3)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3, display:"block" };
  const urg3 = (field, cat) => (
    <div style={{ display:"flex", gap:5 }}>
      {["Routine","STAT","ASAP"].map(u => {
        const active = forms[cat][field] === u;
        const uc = u==="STAT"?"#ff4757":u==="ASAP"?"#ffb800":"#4a7fee";
        return <button key={u} onClick={()=>setForms(p=>({...p,[cat]:{...p[cat],[field]:u}}))}
          style={{ flex:1, padding:"6px", background: active?uc+"25":"var(--navy-3,#0d1e36)", border:`1px solid ${active?uc+"70":"var(--border)"}`, borderRadius:4, color:active?uc:"var(--text-3)", fontSize:11, fontWeight:700, cursor:"pointer" }}>{u}</button>;
      })}
    </div>
  );

  const allOrders = patientFlow?.[patient?.id]?.orders || [];

  const placeOrder = () => {
    const f = forms[orderCategory];
    let desc="", cpt="99213", fee=0;
    if (orderCategory==="Medication") { desc=`${f.drug} ${f.dose} ${f.route} ${f.freq}${f.prn?" PRN":""}`; cpt="J_IP"; fee=65; }
    else if (orderCategory==="Lab") { desc=f.test; cpt="85025"; fee=52; }
    else if (orderCategory==="Radiology") { desc=`${f.modality} — ${f.study}`; fee={"XR":185,"CT":1250,"MRI":1850,"US":650}[f.modality]||300; cpt="71046"; }
    else if (orderCategory==="Consult") { desc=`Consult: ${f.specialty}${f.provider?" — "+f.provider:""}`; cpt="99241"; fee=185; }
    else if (orderCategory==="Nursing") { desc=f.order; cpt="99_NUR"; fee=0; }
    else if (orderCategory==="Diet") { desc=`Diet: ${f.diet}${f.texture!=="Regular"?" / "+f.texture:""}${f.fluids!=="Unrestricted"?" / Fluids: "+f.fluids:""}`; cpt="99_DIET"; fee=0; }
    else if (orderCategory==="Activity") { desc=`Activity: ${f.level}${f.dvtProphylaxis?" + DVT Ppx":""}${f.fallPrecautions?" + Fall Ppx":""}`; cpt="99_ACT"; fee=0; }
    else if (orderCategory==="Procedure") { desc=f.name; cpt="99_PROC"; fee=280; }

    if (!desc || desc.trim()===" " ) return;

    const ord = {
      id:"IP_ORD_"+Date.now(), category:orderCategory,
      description:desc, urgency:f.urgency||"Routine",
      indication:f.indication||f.reason||f.notes||"",
      status:"Active", orderedAt:new Date().toISOString(),
      patientId:patient.id, patientName:patient.name,
      cpt, fee,
    };

    setPatientFlow?.(prev => {
      const cur = prev?.[patient.id] || {};
      const charges = cur.billingCharges || buildDefaultBilling(patient.id);
      return {
        ...prev,
        [patient.id]: {
          ...cur,
          orders: [...(cur.orders||[]), ord],
          billingCharges: fee > 0 ? [...charges, { id:"BC_"+Date.now(), cpt, desc, qty:1, unitFee:fee, total:fee, date:new Date().toISOString().slice(0,10), category:orderCategory, status:"Pending" }] : charges,
        }
      };
    });

    // Reset this category's form
    const resets = {
      Medication:{ drug:"", dose:"", route:"IV", freq:"Q8H", indication:"", prn:false, startDate:new Date().toISOString().slice(0,10), duration:"", urgency:"Routine" },
      Lab:{ test:"", urgency:"Routine", indication:"", collectTime:"ASAP" },
      Radiology:{ modality:"XR", study:"Chest AP Portable", urgency:"Routine", contrast:"No Contrast", indication:"" },
      Consult:{ specialty:"", provider:"", reason:"", priority:"Routine", notes:"" },
      Nursing:{ order:"", frequency:"", instructions:"" },
      Diet:{ diet:"Regular", texture:"Regular", fluids:"Unrestricted", supplements:"", notes:"" },
      Activity:{ level:"Ad lib", restrictions:"", assistDevice:"None", fallPrecautions:false, seizurePrecautions:false, dvtProphylaxis:false },
      Procedure:{ name:"", indication:"", scheduledDate:"", site:"Bedside", notes:"" },
    };
    setForms(p=>({...p,[orderCategory]:resets[orderCategory]}));
    showToast(`✓ ${categoryMeta[orderCategory].label} order placed: ${desc}`);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", pointerEvents:"none" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ flex:1, background:"rgba(0,0,0,0.45)", pointerEvents:"auto" }}/>
      {/* Panel */}
      <div style={{ width:860, background:"var(--card)", borderLeft:"1px solid var(--border)", display:"flex", flexDirection:"column", pointerEvents:"auto", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#0a2a6e,#1e56d9)", padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700 }}>CPOE — Physician Order Entry</div>
            <div style={{ fontSize:12, opacity:.85, marginTop:2, display:"flex", gap:12 }}>
              <span>{patient.name}</span>
              <span style={{ opacity:.7 }}>{patient.mrn}</span>
              <span>{calcAge(patient.dob)}y {patient.gender}</span>
              <span>Room {patient.room}</span>
              {patient.allergies.length>0 && <span style={{ color:"#ffa0aa", fontWeight:700 }}>⚠ {patient.allergies.join(", ")}</span>}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:5, color:"#fff", padding:"5px 14px", cursor:"pointer", fontSize:13, fontWeight:600 }}>✕ Close</button>
        </div>

        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

          {/* LEFT — Category + Form */}
          <div style={{ width:480, borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", overflow:"hidden" }}>

            {/* Category pills */}
            <div style={{ padding:"10px 14px", background:"var(--card-2)", borderBottom:"1px solid var(--border)", display:"flex", flexWrap:"wrap", gap:5, flexShrink:0 }}>
              {Object.entries(categoryMeta).map(([cat,meta])=>(
                <button key={cat} onClick={()=>setOrderCategory(cat)}
                  style={{ padding:"5px 11px", background:orderCategory===cat?meta.color+"22":"var(--navy-2)", border:`1px solid ${orderCategory===cat?meta.color+"55":"var(--border)"}`, borderRadius:5, color:orderCategory===cat?meta.color:"var(--text-3)", fontSize:11, fontWeight:orderCategory===cat?700:400, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                  {meta.icon} {cat}
                </button>
              ))}
            </div>

            {/* Form */}
            <div style={{ flex:1, overflowY:"auto", padding:16 }}>

              {/* ─── MEDICATION ─── */}
              {orderCategory==="Medication" && (
                <div>
                  <div style={{ marginBottom:12 }}>
                    <label style={lbl}>Medication *</label>
                    <input list="ip-med-list" value={forms.Medication.drug} onChange={e=>setForms(p=>({...p,Medication:{...p.Medication,drug:e.target.value}}))} placeholder="Type or select..." style={inp}/>
                    <datalist id="ip-med-list">{IP_MEDS.map(m=><option key={m} value={m}/>)}</datalist>
                  </div>
                  {forms.Medication.drug && patient.allergies.some(a=>forms.Medication.drug.toLowerCase().includes(a.toLowerCase())) && (
                    <div style={{ background:"var(--red-dim)", border:"1px solid var(--red)40", borderRadius:5, padding:"8px 12px", marginBottom:12, fontSize:12, color:"var(--red)", fontWeight:700 }}>⚠ Allergy Alert — Patient has documented allergy that may match this medication</div>
                  )}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                    <div><label style={lbl}>Dose</label><input value={forms.Medication.dose} onChange={e=>setForms(p=>({...p,Medication:{...p.Medication,dose:e.target.value}}))} placeholder="e.g. 1g, 500mg" style={inp}/></div>
                    <div><label style={lbl}>Route</label><select value={forms.Medication.route} onChange={e=>setForms(p=>({...p,Medication:{...p.Medication,route:e.target.value}}))} style={inp}>{["IV","IV Piggyback","IV Push","Oral","IM","SQ","Topical","Inhaled","SL","Enteral/NG"].map(r=><option key={r}>{r}</option>)}</select></div>
                    <div><label style={lbl}>Frequency</label><select value={forms.Medication.freq} onChange={e=>setForms(p=>({...p,Medication:{...p.Medication,freq:e.target.value}}))} style={inp}>{["Once","Daily","BID","TID","QID","Q4H","Q6H","Q8H","Q12H","Q24H","PRN","Continuous","Stat","Weekly"].map(r=><option key={r}>{r}</option>)}</select></div>
                    <div><label style={lbl}>Duration</label><input value={forms.Medication.duration} onChange={e=>setForms(p=>({...p,Medication:{...p.Medication,duration:e.target.value}}))} placeholder="e.g. 7 days, Until DC" style={inp}/></div>
                  </div>
                  <label style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, fontSize:12, cursor:"pointer" }}><input type="checkbox" checked={forms.Medication.prn} onChange={e=>setForms(p=>({...p,Medication:{...p.Medication,prn:e.target.checked}}))}/>PRN (as needed)</label>
                  <div style={{ marginBottom:10 }}><label style={lbl}>Urgency</label>{urg3("urgency","Medication")}</div>
                  <div><label style={lbl}>Indication</label><input value={forms.Medication.indication} onChange={e=>setForms(p=>({...p,Medication:{...p.Medication,indication:e.target.value}}))} placeholder="Clinical indication..." style={inp}/></div>
                </div>
              )}

              {/* ─── LAB ─── */}
              {orderCategory==="Lab" && (
                <div>
                  <div style={{ marginBottom:10 }}><label style={lbl}>Urgency</label>{urg3("urgency","Lab")}</div>
                  <div style={{ marginBottom:10 }}><label style={lbl}>Collection Time</label><select value={forms.Lab.collectTime} onChange={e=>setForms(p=>({...p,Lab:{...p.Lab,collectTime:e.target.value}}))} style={inp}>{["ASAP","Next Draw","Tomorrow AM","Timed: 06:00","Timed: 08:00","Specific Date"].map(o=><option key={o}>{o}</option>)}</select></div>
                  <div style={{ marginBottom:10 }}>
                    <label style={lbl}>Test *</label>
                    <div style={{ maxHeight:300, overflowY:"auto", border:"1px solid var(--border)", borderRadius:6, overflow:"hidden" }}>
                      {Object.entries(IP_LABS).map(([cat, tests])=>(
                        <div key={cat}>
                          <div style={{ padding:"5px 12px", background:"var(--navy-2)", fontSize:10, fontWeight:700, color:"var(--cyan)", textTransform:"uppercase", letterSpacing:"0.06em", position:"sticky", top:0 }}>{cat}</div>
                          {tests.map(t=>(
                            <div key={t} onClick={()=>setForms(p=>({...p,Lab:{...p.Lab,test:t}}))}
                              style={{ padding:"7px 12px", fontSize:12, cursor:"pointer", background:forms.Lab.test===t?"var(--cyan)18":"transparent", color:forms.Lab.test===t?"var(--cyan)":"var(--text-2)", borderBottom:"1px solid var(--border-2)", fontWeight:forms.Lab.test===t?700:400 }}
                              onMouseEnter={e=>e.currentTarget.style.background=forms.Lab.test===t?"var(--cyan)18":"#1e3a5f20"}
                              onMouseLeave={e=>e.currentTarget.style.background=forms.Lab.test===t?"var(--cyan)18":"transparent"}>
                              {forms.Lab.test===t?"✓ ":""}{t}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div><label style={lbl}>Indication</label><input value={forms.Lab.indication} onChange={e=>setForms(p=>({...p,Lab:{...p.Lab,indication:e.target.value}}))} placeholder="Clinical indication..." style={inp}/></div>
                </div>
              )}

              {/* ─── RADIOLOGY ─── */}
              {orderCategory==="Radiology" && (
                <div>
                  <div style={{ marginBottom:10 }}><label style={lbl}>Urgency</label>{urg3("urgency","Radiology")}</div>
                  <div style={{ marginBottom:10 }}>
                    <label style={lbl}>Modality</label>
                    <div style={{ display:"flex", gap:6 }}>
                      {["XR","CT","MRI","US"].map(m=>{
                        const mc={XR:"#4a7fee",CT:"#00c8e0",MRI:"#8b5cf6",US:"#00d68f"}[m];
                        return <button key={m} onClick={()=>setForms(p=>({...p,Radiology:{...p.Radiology,modality:m,study:(IP_RAD[m]||[])[0]||""}}))}
                          style={{ flex:1, padding:"7px", background:forms.Radiology.modality===m?mc+"22":"var(--navy-3,#0d1e36)", border:`1px solid ${forms.Radiology.modality===m?mc+"60":"var(--border)"}`, borderRadius:4, color:forms.Radiology.modality===m?mc:"var(--text-3)", fontSize:11, fontWeight:700, cursor:"pointer" }}>{m}</button>;
                      })}
                    </div>
                  </div>
                  <div style={{ marginBottom:10 }}>
                    <label style={lbl}>Study *</label>
                    <div style={{ maxHeight:180, overflowY:"auto", border:"1px solid var(--border)", borderRadius:6, overflow:"hidden" }}>
                      {(IP_RAD[forms.Radiology.modality]||[]).map(s=>(
                        <div key={s} onClick={()=>setForms(p=>({...p,Radiology:{...p.Radiology,study:s}}))}
                          style={{ padding:"8px 12px", fontSize:12, cursor:"pointer", background:forms.Radiology.study===s?"var(--purple)18":"transparent", color:forms.Radiology.study===s?"var(--purple)":"var(--text-2)", borderBottom:"1px solid var(--border-2)", fontWeight:forms.Radiology.study===s?700:400 }}
                          onMouseEnter={e=>e.currentTarget.style.background=forms.Radiology.study===s?"var(--purple)18":"#1e3a5f20"}
                          onMouseLeave={e=>e.currentTarget.style.background=forms.Radiology.study===s?"var(--purple)18":"transparent"}>
                          {forms.Radiology.study===s?"✓ ":""}{s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom:10 }}><label style={lbl}>Contrast</label><select value={forms.Radiology.contrast} onChange={e=>setForms(p=>({...p,Radiology:{...p.Radiology,contrast:e.target.value}}))} style={inp}>{["No Contrast","With Contrast","With & Without Contrast","Oral Contrast Only"].map(o=><option key={o}>{o}</option>)}</select></div>
                  {forms.Radiology.contrast!=="No Contrast" && patient.allergies.some(a=>a.toLowerCase().includes("contrast")) && (
                    <div style={{ background:"var(--red-dim)", border:"1px solid var(--red)40", borderRadius:5, padding:"8px 12px", marginBottom:10, fontSize:12, color:"var(--red)", fontWeight:700 }}>⚠ Contrast allergy on file</div>
                  )}
                  <div><label style={lbl}>Clinical Indication</label><input value={forms.Radiology.indication} onChange={e=>setForms(p=>({...p,Radiology:{...p.Radiology,indication:e.target.value}}))} placeholder="e.g. Evaluate for pneumonia..." style={inp}/></div>
                </div>
              )}

              {/* ─── CONSULT ─── */}
              {orderCategory==="Consult" && (
                <div>
                  <div style={{ marginBottom:10 }}>
                    <label style={lbl}>Specialty / Service *</label>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, maxHeight:220, overflowY:"auto" }}>
                      {SPECIALTIES.map(s=>(
                        <div key={s} onClick={()=>setForms(p=>({...p,Consult:{...p.Consult,specialty:s}}))}
                          style={{ padding:"6px 10px", fontSize:11, cursor:"pointer", background:forms.Consult.specialty===s?"var(--blue)22":"var(--navy-2)", color:forms.Consult.specialty===s?"var(--cyan)":"var(--text-2)", border:`1px solid ${forms.Consult.specialty===s?"var(--cyan)40":"var(--border)"}`, borderRadius:4, fontWeight:forms.Consult.specialty===s?700:400 }}
                          onMouseEnter={e=>e.currentTarget.style.background=forms.Consult.specialty===s?"var(--blue)22":"#1e3a5f20"}
                          onMouseLeave={e=>e.currentTarget.style.background=forms.Consult.specialty===s?"var(--blue)22":"var(--navy-2)"}>
                          {forms.Consult.specialty===s?"✓ ":""}{s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                    <div><label style={lbl}>Specific Provider</label><select value={forms.Consult.provider} onChange={e=>setForms(p=>({...p,Consult:{...p.Consult,provider:e.target.value}}))} style={inp}><option value="">— Any —</option>{PROVIDERS_LIST.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
                    <div><label style={lbl}>Priority</label>
                      <div style={{ display:"flex", gap:5 }}>
                        {["Routine","Urgent","Emergent"].map(u=>{
                          const active=forms.Consult.priority===u;
                          const uc=u==="Emergent"?"#ff4757":u==="Urgent"?"#ffb800":"#4a7fee";
                          return <button key={u} onClick={()=>setForms(p=>({...p,Consult:{...p.Consult,priority:u}}))}
                            style={{ flex:1, padding:"6px", background:active?uc+"25":"var(--navy-3,#0d1e36)", border:`1px solid ${active?uc+"70":"var(--border)"}`, borderRadius:4, color:active?uc:"var(--text-3)", fontSize:11, fontWeight:700, cursor:"pointer" }}>{u}</button>;
                        })}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom:10 }}><label style={lbl}>Reason for Consult *</label><textarea value={forms.Consult.reason} onChange={e=>setForms(p=>({...p,Consult:{...p.Consult,reason:e.target.value}}))} rows={3} placeholder="Clinical question / reason..." style={{...inp,resize:"vertical"}}/></div>
                  <div><label style={lbl}>Additional Notes</label><textarea value={forms.Consult.notes} onChange={e=>setForms(p=>({...p,Consult:{...p.Consult,notes:e.target.value}}))} rows={2} placeholder="Additional context..." style={{...inp,resize:"vertical"}}/></div>
                </div>
              )}

              {/* ─── NURSING ─── */}
              {orderCategory==="Nursing" && (
                <div>
                  <div style={{ marginBottom:10 }}>
                    <label style={lbl}>Nursing Order *</label>
                    <div style={{ maxHeight:260, overflowY:"auto", border:"1px solid var(--border)", borderRadius:6, overflow:"hidden" }}>
                      {NURSING_ORDERS.map(o=>(
                        <div key={o} onClick={()=>setForms(p=>({...p,Nursing:{...p.Nursing,order:o}}))}
                          style={{ padding:"8px 12px", fontSize:12, cursor:"pointer", background:forms.Nursing.order===o?"var(--amber)18":"transparent", color:forms.Nursing.order===o?"var(--amber)":"var(--text-2)", borderBottom:"1px solid var(--border-2)", fontWeight:forms.Nursing.order===o?700:400 }}
                          onMouseEnter={e=>e.currentTarget.style.background=forms.Nursing.order===o?"var(--amber)18":"#1e3a5f20"}
                          onMouseLeave={e=>e.currentTarget.style.background=forms.Nursing.order===o?"var(--amber)18":"transparent"}>
                          {forms.Nursing.order===o?"✓ ":""}{o}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div><label style={lbl}>Additional Instructions</label><textarea value={forms.Nursing.instructions} onChange={e=>setForms(p=>({...p,Nursing:{...p.Nursing,instructions:e.target.value}}))} rows={2} placeholder="Specify parameters, exceptions, or additional info..." style={{...inp,resize:"vertical"}}/></div>
                </div>
              )}

              {/* ─── DIET ─── */}
              {orderCategory==="Diet" && (
                <div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                    <div><label style={lbl}>Diet Type</label><select value={forms.Diet.diet} onChange={e=>setForms(p=>({...p,Diet:{...p.Diet,diet:e.target.value}}))} style={inp}>{["Regular","Low Sodium (<2g)","Low Fat / Cardiac","Diabetic (ADA)","Renal (Low K/Phos)","Hepatic","Clear Liquid","Full Liquid","Soft / Mechanical Soft","Pureed","NPO","NPO after Midnight","Tube Feeds","TPN"].map(o=><option key={o}>{o}</option>)}</select></div>
                    <div><label style={lbl}>Texture</label><select value={forms.Diet.texture} onChange={e=>setForms(p=>({...p,Diet:{...p.Diet,texture:e.target.value}}))} style={inp}>{["Regular","Soft","Minced & Moist","Pureed","Liquid Only"].map(o=><option key={o}>{o}</option>)}</select></div>
                    <div><label style={lbl}>Fluid Restriction</label><select value={forms.Diet.fluids} onChange={e=>setForms(p=>({...p,Diet:{...p.Diet,fluids:e.target.value}}))} style={inp}>{["Unrestricted","1000 mL/day","1500 mL/day","2000 mL/day","Thickened Liquids","Thin Liquids Only","NPO"].map(o=><option key={o}>{o}</option>)}</select></div>
                    <div><label style={lbl}>Supplements</label><input value={forms.Diet.supplements} onChange={e=>setForms(p=>({...p,Diet:{...p.Diet,supplements:e.target.value}}))} placeholder="e.g. Ensure TID" style={inp}/></div>
                  </div>
                  <div><label style={lbl}>Notes</label><input value={forms.Diet.notes} onChange={e=>setForms(p=>({...p,Diet:{...p.Diet,notes:e.target.value}}))} placeholder="Additional dietary notes..." style={inp}/></div>
                </div>
              )}

              {/* ─── ACTIVITY ─── */}
              {orderCategory==="Activity" && (
                <div>
                  <div style={{ marginBottom:10 }}>
                    <label style={lbl}>Activity Level</label>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                      {["Ad lib","Up with assist","Bed rest with BRP","Strict bed rest","Chair only","Ambulate TID","Ambulate with PT"].map(lvl=>(
                        <div key={lvl} onClick={()=>setForms(p=>({...p,Activity:{...p.Activity,level:lvl}}))}
                          style={{ padding:"7px 10px", fontSize:12, cursor:"pointer", background:forms.Activity.level===lvl?"var(--orange,#ff8c00)22":"var(--navy-2)", color:forms.Activity.level===lvl?"var(--orange,#ff8c00)":"var(--text-2)", border:`1px solid ${forms.Activity.level===lvl?"var(--orange,#ff8c00)50":"var(--border)"}`, borderRadius:4, fontWeight:forms.Activity.level===lvl?700:400 }}>
                          {forms.Activity.level===lvl?"✓ ":""}{lvl}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom:10 }}><label style={lbl}>Assistive Device</label><select value={forms.Activity.assistDevice} onChange={e=>setForms(p=>({...p,Activity:{...p.Activity,assistDevice:e.target.value}}))} style={inp}>{["None","Cane","Walker","Wheelchair","Crutches","Gait Belt","2-Person Assist"].map(o=><option key={o}>{o}</option>)}</select></div>
                  <div style={{ marginBottom:10 }}>
                    <label style={lbl}>Precautions</label>
                    {[["fallPrecautions","Fall Precautions"],["seizurePrecautions","Seizure Precautions"],["dvtProphylaxis","DVT Prophylaxis (SCDs)"]].map(([field,label])=>(
                      <label key={field} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, fontSize:12, cursor:"pointer" }}>
                        <input type="checkbox" checked={forms.Activity[field]} onChange={e=>setForms(p=>({...p,Activity:{...p.Activity,[field]:e.target.checked}}))}/>
                        {label}
                      </label>
                    ))}
                  </div>
                  <div><label style={lbl}>Restrictions / Special Instructions</label><textarea value={forms.Activity.restrictions} onChange={e=>setForms(p=>({...p,Activity:{...p.Activity,restrictions:e.target.value}}))} rows={2} placeholder="e.g. No weight bearing right leg, non-contact..." style={{...inp,resize:"vertical"}}/></div>
                </div>
              )}

              {/* ─── PROCEDURE ─── */}
              {orderCategory==="Procedure" && (
                <div>
                  <div style={{ marginBottom:10 }}>
                    <label style={lbl}>Procedure *</label>
                    <div style={{ maxHeight:220, overflowY:"auto", border:"1px solid var(--border)", borderRadius:6, overflow:"hidden" }}>
                      {IP_PROCS.map(proc=>(
                        <div key={proc} onClick={()=>setForms(p=>({...p,Procedure:{...p.Procedure,name:proc}}))}
                          style={{ padding:"8px 12px", fontSize:12, cursor:"pointer", background:forms.Procedure.name===proc?"var(--red)18":"transparent", color:forms.Procedure.name===proc?"var(--red)":"var(--text-2)", borderBottom:"1px solid var(--border-2)", fontWeight:forms.Procedure.name===proc?700:400 }}
                          onMouseEnter={e=>e.currentTarget.style.background=forms.Procedure.name===proc?"var(--red)18":"#1e3a5f20"}
                          onMouseLeave={e=>e.currentTarget.style.background=forms.Procedure.name===proc?"var(--red)18":"transparent"}>
                          {forms.Procedure.name===proc?"✓ ":""}{proc}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                    <div><label style={lbl}>Site / Location</label><select value={forms.Procedure.site} onChange={e=>setForms(p=>({...p,Procedure:{...p.Procedure,site:e.target.value}}))} style={inp}>{["Bedside","OR","IR Suite","Endoscopy Suite","ICU","Procedure Room"].map(o=><option key={o}>{o}</option>)}</select></div>
                    <div><label style={lbl}>Scheduled Date</label><input type="date" value={forms.Procedure.scheduledDate} onChange={e=>setForms(p=>({...p,Procedure:{...p.Procedure,scheduledDate:e.target.value}}))} style={inp}/></div>
                  </div>
                  <div><label style={lbl}>Clinical Indication</label><textarea value={forms.Procedure.indication} onChange={e=>setForms(p=>({...p,Procedure:{...p.Procedure,indication:e.target.value}}))} rows={2} placeholder="Reason for procedure..." style={{...inp,resize:"vertical"}}/></div>
                </div>
              )}
            </div>

            {/* Place order button */}
            <div style={{ padding:"12px 16px", borderTop:"1px solid var(--border)", background:"var(--card-2)", flexShrink:0, display:"flex", gap:8 }}>
              <button onClick={placeOrder}
                style={{ flex:1, padding:"10px", background:categoryMeta[orderCategory].color, border:"none", borderRadius:5, color:"#000", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                {categoryMeta[orderCategory].icon} Place {categoryMeta[orderCategory].label} Order
              </button>
            </div>
          </div>

          {/* RIGHT — Active order list */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"10px 14px", background:"var(--card-2)", borderBottom:"1px solid var(--border)", fontSize:12, fontWeight:700, flexShrink:0, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span>Active Orders <span style={{ color:"var(--text-3)", fontWeight:400 }}>({allOrders.length})</span></span>
              <div style={{ display:"flex", gap:8 }}>
                {Object.entries(categoryMeta).map(([cat,meta])=>{
                  const c = allOrders.filter(o=>o.category===cat).length;
                  return c>0 ? <span key={cat} style={{ background:meta.color+"18", color:meta.color, border:`1px solid ${meta.color}35`, borderRadius:10, padding:"1px 7px", fontSize:10, fontWeight:700 }}>{meta.icon} {c}</span> : null;
                })}
              </div>
            </div>

            <div style={{ flex:1, overflowY:"auto" }}>
              {allOrders.length===0 && (
                <div style={{ padding:32, textAlign:"center", color:"var(--text-3)", fontSize:13 }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>📋</div>
                  No orders placed yet for this patient.<br/>
                  <span style={{ fontSize:11 }}>Use the form on the left to place medication, lab, imaging, consult, nursing, diet, activity, or procedure orders.</span>
                </div>
              )}
              {Object.entries(categoryMeta).map(([cat, meta]) => {
                const catOrders = allOrders.filter(o=>o.category===cat);
                if (catOrders.length===0) return null;
                return (
                  <div key={cat}>
                    <div style={{ padding:"6px 14px", background:meta.color+"12", borderBottom:`1px solid ${meta.color}22`, display:"flex", alignItems:"center", gap:7, position:"sticky", top:0 }}>
                      <span>{meta.icon}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:meta.color, textTransform:"uppercase", letterSpacing:"0.08em" }}>{meta.label}</span>
                      <span style={{ fontSize:10, color:"var(--text-3)" }}>({catOrders.length})</span>
                    </div>
                    {catOrders.map((ord,i)=>{
                      const sc = ord.status==="Active"?meta.color:ord.status==="Discontinued"?"#ff4757":"#4a6080";
                      return (
                        <div key={ord.id} style={{ padding:"10px 14px", borderBottom:"1px solid var(--border-2)", display:"flex", gap:10, alignItems:"flex-start" }}
                          onMouseEnter={e=>e.currentTarget.style.background="#1e3a5f12"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <div style={{ width:3, borderRadius:2, background:sc, alignSelf:"stretch", flexShrink:0 }}/>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", gap:7, alignItems:"center", flexWrap:"wrap", marginBottom:3 }}>
                              <span style={{ fontSize:12, fontWeight:700 }}>{ord.description}</span>
                              {ord.urgency==="STAT" && <span style={{ background:"var(--red-dim)", color:"var(--red)", borderRadius:3, padding:"0px 6px", fontSize:10, fontWeight:700 }}>STAT</span>}
                              {ord.urgency==="ASAP" && <span style={{ background:"var(--amber-dim)", color:"var(--amber)", borderRadius:3, padding:"0px 6px", fontSize:10, fontWeight:700 }}>ASAP</span>}
                              <span style={{ background:sc+"18", color:sc, border:`1px solid ${sc}30`, borderRadius:3, padding:"0px 6px", fontSize:10, fontWeight:600 }}>{ord.status}</span>
                            </div>
                            <div style={{ fontSize:10, color:"var(--text-3)" }}>
                              {new Date(ord.orderedAt).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                              {ord.indication && " · " + ord.indication}
                              {ord.fee>0 && <span style={{ color:"var(--green-dim)", marginLeft:6 }}>CPT {ord.cpt} · ${ord.fee}</span>}
                            </div>
                          </div>
                          <div style={{ display:"flex", gap:4, flexShrink:0 }}>
                            {ord.status==="Active" && <button onClick={()=>{
                              setPatientFlow?.(prev=>({...prev,[patient.id]:{...prev[patient.id],orders:(prev[patient.id]?.orders||[]).map(o=>o.id===ord.id?{...o,status:"Discontinued"}:o)}}));
                            }} style={{ padding:"3px 8px", background:"var(--red-dim)", border:"1px solid var(--red)35", borderRadius:3, color:"var(--red)", fontSize:10, fontWeight:600, cursor:"pointer" }}>D/C</button>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Inpatient = ({ onPatient, patientFlow, setPatientFlow }) => {
  const inPatients = PATIENTS.filter(p => p.status === "Inpatient");
  const [activePatient, setActivePatient] = useState(null);
  const [activeTab, setActiveTab] = useState("census");
  const [orderPatient, setOrderPatient] = useState(null);
  const [toast, setToast] = useState(null);
  const [admitForm, setAdmitForm] = useState({ patientId: "", room: "", unit: "Med/Surg", attending: "", diagnosis: "", admitType: "Inpatient", code: "Full", diet: "Regular", activity: "Ad lib", fallRisk: "Low" });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // Bed map
  const UNITS = {
    "Med/Surg": ["3B-401","3B-402","3B-403","3B-404","3B-405","3B-406","3B-407","3B-408","3B-409","3B-410","3B-411","3B-412","3B-413","3B-414"],
    "ICU":      ["ICU-01","ICU-02","ICU-03","ICU-04","ICU-05","ICU-06"],
    "PCU":      ["PCU-01","PCU-02","PCU-03","PCU-04"],
    "Obs":      ["OBS-01","OBS-02","OBS-03","OBS-04","OBS-05"],
  };
  const occupiedRooms = inPatients.map(p => p.room);
  const [selectedUnit, setSelectedUnit] = useState("Med/Surg");
  const unitRooms = UNITS[selectedUnit] || [];

  const getPatientInRoom = (room) => inPatients.find(p => p.room === room);

  const inp = { width: "100%", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, padding: "7px 10px", color: "var(--text)", fontSize: 13, outline: "none" };
  const lbl = { fontSize: 10, color: "var(--text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, display: "block" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {toast && <div style={{ position: "fixed", top: 70, right: 24, zIndex: 9999, background: "#0f2044", border: "1px solid var(--green)", color: "var(--green)", padding: "11px 20px", borderRadius: 7, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>{toast}</div>}

      {/* CPOE Order Panel overlay */}
      {orderPatient && (
        <InpatientOrderPanel
          patient={orderPatient}
          patientFlow={patientFlow}
          setPatientFlow={setPatientFlow}
          onClose={() => setOrderPatient(null)}
          showToast={showToast}
        />
      )}

      {/* Top toolbar */}
      <div style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "0 20px", display: "flex", alignItems: "center", height: 48, flexShrink: 0 }}>
        <div style={{ marginRight: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Inpatient Census</div>
          <div style={{ fontSize: 10, color: "var(--text-3)" }}>Active Admissions & Bed Management</div>
        </div>
        {[["census","Census"],["bedboard","Bed Board"],["admit","Admit Patient"]].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{ height:48, padding:"0 18px", background:"none", border:"none", borderBottom:`2px solid ${activeTab===id?"var(--cyan)":"transparent"}`, color:activeTab===id?"var(--cyan)":"var(--text-2)", fontSize:13, fontWeight:activeTab===id?600:400, cursor:"pointer", marginBottom:-1 }}>{label}</button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", gap:10, fontSize:12, color:"var(--text-2)" }}>
          <span>🛏 Occupied: <strong style={{color:"var(--amber)"}}>{inPatients.length}</strong></span>
          <span>✅ Available: <strong style={{color:"var(--green)"}}>{Object.values(UNITS).flat().length - inPatients.length}</strong></span>
        </div>
      </div>

      {/* Stat bar */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", background:"var(--card-2)", borderBottom:"1px solid var(--border)", flexShrink:0 }}>
        {[["Total Beds",Object.values(UNITS).flat().length,"#4a7fee"],["Occupied",inPatients.length,"#ffb800"],["Available",Object.values(UNITS).flat().length-inPatients.length,"#00d68f"],["Med/Surg",UNITS["Med/Surg"].length,"#8b5cf6"],["ICU",UNITS["ICU"].length,"#ff4757"],["Observation",UNITS["Obs"].length,"#00c8e0"]].map(([label,val,color],i)=>(
          <div key={label} style={{ padding:"10px 0", textAlign:"center", borderRight:i<5?"1px solid var(--border)":"none" }}>
            <div style={{ fontSize:20, fontWeight:700, color }}>{val}</div>
            <div style={{ fontSize:10, color:"var(--text-3)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em", marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ flex:1, overflowY:"auto" }}>

        {/* CENSUS TAB */}
        {activeTab === "census" && (
          <div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"var(--card-2)", borderBottom:"1px solid var(--border)", position:"sticky", top:0 }}>
                  {["","Room","Patient","MRN","Age/Sex","Attending","Diagnosis","Admit Date","LOS","Code","Diet","Fall Risk","Actions"].map(h=>(
                    <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:10, color:"var(--text-3)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inPatients.map((p,i)=>{
                  const los = Math.floor((Date.now()-new Date(p.admitDate))/86400000);
                  return (
                    <tr key={p.id} style={{ borderBottom:"1px solid var(--border-2)" }} onMouseEnter={e=>e.currentTarget.style.background="#1e3a5f15"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"10px 12px", width:4 }}><div style={{ width:3, height:36, borderRadius:2, background:"var(--amber)" }}/></td>
                      <td style={{ padding:"10px 12px" }}><span style={{ background:"var(--amber-dim)", color:"var(--amber)", borderRadius:5, padding:"3px 10px", fontSize:13, fontWeight:700 }}>{p.room}</span></td>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,var(--blue),var(--cyan))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>{p.name.split(" ").map(n=>n[0]).join("")}</div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700, cursor:"pointer", color:"var(--cyan)" }} onClick={()=>onPatient(p)}>{p.name}</div>
                            {p.allergies.length>0&&<div style={{ fontSize:10, color:"var(--red)" }}>⚠ {p.allergies.join(", ")}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"10px 12px", fontSize:11, color:"var(--cyan)", fontFamily:"monospace" }}>{p.mrn}</td>
                      <td style={{ padding:"10px 12px", fontSize:12, color:"var(--text-2)" }}>{calcAge(p.dob)}y {p.gender}</td>
                      <td style={{ padding:"10px 12px", fontSize:12 }}>{p.pcp}</td>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ fontSize:12, fontWeight:600 }}>{p.diagnosis}</div>
                        <div style={{ fontSize:10, color:"var(--text-3)" }}>{p.insurance}</div>
                      </td>
                      <td style={{ padding:"10px 12px", fontSize:12, color:"var(--text-2)", fontFamily:"monospace" }}>{fmtDate(p.admitDate)}</td>
                      <td style={{ padding:"10px 12px" }}><span style={{ background: los>5?"var(--red-dim)":los>3?"var(--amber-dim)":"var(--green-dim)", color:los>5?"var(--red)":los>3?"var(--amber)":"var(--green)", borderRadius:4, padding:"2px 8px", fontSize:12, fontWeight:700 }}>{los}d</span></td>
                      <td style={{ padding:"10px 12px" }}><span style={{ background:"var(--green-dim)", color:"var(--green)", borderRadius:3, padding:"2px 6px", fontSize:11, fontWeight:600 }}>Full</span></td>
                      <td style={{ padding:"10px 12px", fontSize:11, color:"var(--text-2)" }}>Regular</td>
                      <td style={{ padding:"10px 12px" }}><span style={{ background:"var(--amber-dim)", color:"var(--amber)", borderRadius:3, padding:"2px 6px", fontSize:11, fontWeight:600 }}>Low</span></td>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ display:"flex", gap:5 }}>
                          <button onClick={()=>onPatient(p)} style={{ padding:"4px 10px", background:"var(--blue)", border:"none", borderRadius:4, color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer" }}>Chart</button>
                          <button onClick={()=>setOrderPatient(p)}
                            style={{ padding:"4px 10px", background:"var(--green-dim)", border:"1px solid var(--green)40", borderRadius:4, color:"var(--green)", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                            ⚕ Orders
                            {(patientFlow?.[p.id]?.orders||[]).length > 0 &&
                              <span style={{ background:"var(--green)", color:"#000", borderRadius:8, padding:"0 5px", fontSize:10, fontWeight:700 }}>{(patientFlow?.[p.id]?.orders||[]).length}</span>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {inPatients.length === 0 && <tr><td colSpan={13} style={{ padding:40, textAlign:"center", color:"var(--text-3)", fontSize:13 }}>No inpatients currently admitted.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* BED BOARD TAB */}
        {activeTab === "bedboard" && (
          <div style={{ padding:20 }}>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {Object.keys(UNITS).map(unit=>(
                <button key={unit} onClick={()=>setSelectedUnit(unit)} style={{ padding:"6px 16px", background:selectedUnit===unit?"var(--blue)":"var(--navy-2)", border:`1px solid ${selectedUnit===unit?"var(--blue)":"var(--border)"}`, borderRadius:5, color:selectedUnit===unit?"#fff":"var(--text-2)", fontSize:12, fontWeight:selectedUnit===unit?600:400, cursor:"pointer" }}>{unit}</button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
              {unitRooms.map(room=>{
                const patient = getPatientInRoom(room);
                const los = patient ? Math.floor((Date.now()-new Date(patient.admitDate))/86400000) : 0;
                return (
                  <div key={room} style={{ background:"var(--card)", border:`2px solid ${patient?"var(--amber)40":"var(--green)30"}`, borderTop:`3px solid ${patient?"var(--amber)":"var(--green)"}`, borderRadius:8, padding:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:patient?"var(--amber)":"var(--green)" }}>{room}</span>
                      <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:3, background:patient?"var(--amber-dim)":"var(--green-dim)", color:patient?"var(--amber)":"var(--green)" }}>{patient?"OCCUPIED":"AVAILABLE"}</span>
                    </div>
                    {patient ? (
                      <div>
                        <div style={{ fontSize:12, fontWeight:600, cursor:"pointer", color:"var(--cyan)" }} onClick={()=>onPatient(patient)}>{patient.name}</div>
                        <div style={{ fontSize:11, color:"var(--text-2)", marginTop:2 }}>{patient.diagnosis}</div>
                        <div style={{ fontSize:11, color:"var(--text-3)", marginTop:2 }}>{patient.pcp} · LOS: {los}d</div>
                        {patient.allergies.length>0&&<div style={{ fontSize:10, color:"var(--red)", marginTop:4 }}>⚠ {patient.allergies.join(", ")}</div>}
                        <button onClick={()=>onPatient(patient)} style={{ marginTop:8, width:"100%", padding:"5px", background:"var(--blue)18", border:"1px solid var(--blue)40", borderRadius:4, color:"var(--blue-light)", fontSize:11, fontWeight:600, cursor:"pointer" }}>Open Chart</button>
                        <button onClick={()=>setOrderPatient(patient)} style={{ marginTop:5, width:"100%", padding:"5px", background:"var(--green)15", border:"1px solid var(--green)35", borderRadius:4, color:"var(--green)", fontSize:11, fontWeight:600, cursor:"pointer" }}>
                          ⚕ Orders{(patientFlow?.[patient.id]?.orders||[]).length>0?` (${(patientFlow?.[patient.id]?.orders||[]).length})`:""}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize:11, color:"var(--green)", marginBottom:8 }}>✓ Ready for admission</div>
                        <button onClick={()=>{setAdmitForm(f=>({...f,room}));setActiveTab("admit");}} style={{ width:"100%", padding:"5px", background:"var(--green)15", border:"1px solid var(--green)35", borderRadius:4, color:"var(--green)", fontSize:11, fontWeight:600, cursor:"pointer" }}>+ Admit to Room</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ADMIT PATIENT TAB */}
        {activeTab === "admit" && (
          <div style={{ padding:20, maxWidth:800 }}>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>Admit New Patient</div>
            <div style={{ fontSize:12, color:"var(--text-3)", marginBottom:20 }}>Complete admission order to add patient to inpatient census.</div>
            <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, padding:20 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:14 }}>
                {[["Patient Name","patientName","text","Last, First Middle"],["MRN","mrn","text","MRN-2024-XXX"],["Date of Birth","dob","date",""],["Attending Physician","attending","text","Dr. Name"],["Admitting Diagnosis","diagnosis","text","Primary diagnosis"],["Room","room","text","e.g. 3B-412"]].map(([label,field,type,ph])=>(
                  <div key={field}>
                    <label style={lbl}>{label}</label>
                    <input type={type} value={admitForm[field]||""} placeholder={ph} onChange={e=>setAdmitForm(f=>({...f,[field]:e.target.value}))} style={inp}/>
                  </div>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14, marginBottom:14 }}>
                {[["Unit","unit",["Med/Surg","ICU","PCU","Obs","ED Obs"]],["Admit Type","admitType",["Inpatient","Observation","Same-Day Surgery","ER Hold"]],["Code Status","code",["Full","DNR","DNI","DNR/DNI","Comfort Care"]],["Diet","diet",["Regular","NPO","Clear Liquid","Low Sodium","Diabetic","Cardiac","Renal"]]].map(([label,field,opts])=>(
                  <div key={field}>
                    <label style={lbl}>{label}</label>
                    <select value={admitForm[field]} onChange={e=>setAdmitForm(f=>({...f,[field]:e.target.value}))} style={inp}>
                      {opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
                {[["Activity","activity",["Ad lib","Bed Rest","BRP","Ambulate with Assist","Chair only"]],["Fall Risk","fallRisk",["Low","Medium","High"]]].map(([label,field,opts])=>(
                  <div key={field}>
                    <label style={lbl}>{label}</label>
                    <select value={admitForm[field]} onChange={e=>setAdmitForm(f=>({...f,[field]:e.target.value}))} style={inp}>
                      {opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>{if(!admitForm.patientName||!admitForm.room)return;showToast(`✓ ${admitForm.patientName} admitted to ${admitForm.room}`);setAdmitForm({patientId:"",room:"",unit:"Med/Surg",attending:"",diagnosis:"",admitType:"Inpatient",code:"Full",diet:"Regular",activity:"Ad lib",fallRisk:"Low"});setActiveTab("census");}} style={{ padding:"8px 24px", background:"var(--green)", border:"none", borderRadius:5, color:"#000", fontSize:13, fontWeight:700, cursor:"pointer" }}>✓ Admit Patient</button>
                <button onClick={()=>setActiveTab("census")} style={{ padding:"8px 16px", background:"var(--navy-2)", border:"1px solid var(--border)", borderRadius:5, color:"var(--text-2)", fontSize:13, cursor:"pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// ─── PHARMACY ─────────────────────────────────────────────────────────────────
const Pharmacy = ({ patientFlow, setPatientFlow, appointments }) => {
  const [tab, setTab] = useState("orders");
  const [selPat, setSelPat] = useState(null);
  const [orderForm, setOrderForm] = useState({ med:"", dose:"", route:"Oral", freq:"", startDate:"", duration:"", indication:"", prn:false });
  const [verFilter, setVerFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(null),3000); };

  const MAR_PATIENTS = PATIENTS.filter(p=>["Inpatient","Ambulatory","Scheduled"].includes(p.status));

  // Pull meds from patientFlow or fall back to MEDS_DATA
  const getMeds = (pid) => {
    const flow = patientFlow?.[pid];
    return flow?.meds || MEDS_DATA[pid] || [];
  };

  const addOrder = () => {
    if(!selPat||!orderForm.med)return;
    const newMed = { id:"MED_"+Date.now(), drug:orderForm.med, dose:orderForm.dose, route:orderForm.route, freq:orderForm.freq, startDate:orderForm.startDate||new Date().toISOString().slice(0,10), duration:orderForm.duration, indication:orderForm.indication, prn:orderForm.prn, status:"Active", prescriber:PATIENTS.find(p=>p.id===selPat)?.pcp||"Provider", dispensed:0, cpt:"J_NEW" };
    setPatientFlow?.(prev=>({...prev,[selPat]:{...(prev?.[selPat]||{}), meds:[...(prev?.[selPat]?.meds||MEDS_DATA[selPat]||[]), newMed]}}));
    // Add billing
    setPatientFlow?.(prev=>({...prev,[selPat]:{...prev[selPat], billingCharges:[...(prev[selPat]?.billingCharges||buildDefaultBilling(selPat)), {id:"RX_"+Date.now(), cpt:"J0_NEW", desc:`${orderForm.med} ${orderForm.dose}`, qty:1, unitFee:45, total:45, date:new Date().toISOString().slice(0,10), category:"Pharmacy", status:"Pending"}]}}));
    setOrderForm({med:"",dose:"",route:"Oral",freq:"",startDate:"",duration:"",indication:"",prn:false});
    showToast(`✓ Order placed: ${newMed.drug}`);
  };

  const verifyMed = (pid, medId) => {
    setPatientFlow?.(prev=>{
      const meds = getMeds(pid).map(m=>m.id===medId?{...m, status:"Verified"}:m);
      return {...prev,[pid]:{...(prev?.[pid]||{}),meds}};
    });
    showToast("✓ Medication verified by pharmacy");
  };

  const allMeds = MAR_PATIENTS.flatMap(p=>getMeds(p.id).map(m=>({...m,patient:p,patientId:p.id})));
  const pendingVer = allMeds.filter(m=>m.status==="Pending"||!m.status);
  const filtered = verFilter==="All"?allMeds:allMeds.filter(m=>m.status===verFilter);

  const inp = {width:"100%",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,padding:"7px 10px",color:"var(--text)",fontSize:13,outline:"none"};
  const lbl = {fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4,display:"block"};

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      {toast&&<div style={{position:"fixed",top:70,right:24,zIndex:9999,background:"#0f2044",border:"1px solid var(--green)",color:"var(--green)",padding:"11px 20px",borderRadius:7,fontSize:13,fontWeight:600,boxShadow:"0 4px 24px rgba(0,0,0,0.5)"}}>{toast}</div>}

      {/* Header */}
      <div style={{background:"var(--card)",borderBottom:"1px solid var(--border)",padding:"0 20px",display:"flex",alignItems:"center",height:48,flexShrink:0}}>
        <div style={{marginRight:20}}><div style={{fontSize:14,fontWeight:700}}>Inpatient Pharmacy</div><div style={{fontSize:10,color:"var(--text-3)"}}>Medication Orders & Verification</div></div>
        {[["orders","Medication Orders"],["mar","MAR"],["verify","Verification Queue"],["neworder","New Order"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{height:48,padding:"0 16px",background:"none",border:"none",borderBottom:`2px solid ${tab===id?"var(--cyan)":"transparent"}`,color:tab===id?"var(--cyan)":"var(--text-2)",fontSize:13,fontWeight:tab===id?600:400,cursor:"pointer",marginBottom:-1,whiteSpace:"nowrap"}}>
            {label}{id==="verify"&&pendingVer.length>0&&<span style={{marginLeft:5,background:"var(--red)",color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700}}>{pendingVer.length}</span>}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:10,fontSize:12}}>
          <span style={{color:"var(--text-3)"}}>Active: <strong style={{color:"var(--green)"}}>{allMeds.filter(m=>m.status==="Active").length}</strong></span>
          <span style={{color:"var(--text-3)"}}>Pending: <strong style={{color:"var(--amber)"}}>{pendingVer.length}</strong></span>
        </div>
      </div>

      {/* Stat bar */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",background:"var(--card-2)",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        {[["Total Orders",allMeds.length,"#4a7fee"],["Active",allMeds.filter(m=>m.status==="Active").length,"#00d68f"],["Pending Verify",pendingVer.length,"#ffb800"],["Discontinued",allMeds.filter(m=>m.status==="Discontinued").length,"#ff4757"],["Patients on Meds",MAR_PATIENTS.filter(p=>getMeds(p.id).length>0).length,"#00c8e0"]].map(([label,val,color],i)=>(
          <div key={label} style={{padding:"9px 0",textAlign:"center",borderRight:i<4?"1px solid var(--border)":"none"}}>
            <div style={{fontSize:20,fontWeight:700,color}}>{val}</div>
            <div style={{fontSize:10,color:"var(--text-3)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",marginTop:2}}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{flex:1,overflowY:"auto"}}>

        {/* MEDICATION ORDERS */}
        {tab==="orders"&&(
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:"var(--card-2)",borderBottom:"1px solid var(--border)",position:"sticky",top:0}}>
              {["Patient","Medication","Dose","Route","Frequency","Start","Status","Prescriber","Actions"].map(h=>(
                <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((m,i)=>{
                const sc = m.status==="Active"?"#00d68f":m.status==="Discontinued"?"#ff4757":m.status==="Verified"?"#00c8e0":"#ffb800";
                return (
                  <tr key={m.id||i} style={{borderBottom:"1px solid var(--border-2)"}} onMouseEnter={e=>e.currentTarget.style.background="#1e3a5f15"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:26,height:26,borderRadius:"50%",background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0}}>{m.patient.name.split(" ").map(n=>n[0]).join("")}</div>
                        <div><div style={{fontSize:12,fontWeight:600}}>{m.patient.name}</div><div style={{fontSize:10,color:"var(--text-3)",fontFamily:"monospace"}}>{m.patient.mrn}</div></div>
                      </div>
                    </td>
                    <td style={{padding:"10px 12px"}}><div style={{fontSize:13,fontWeight:600}}>{m.drug}</div>{m.prn&&<span style={{fontSize:10,background:"var(--amber-dim)",color:"var(--amber)",borderRadius:3,padding:"1px 5px"}}>PRN</span>}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:"var(--text-2)"}}>{m.dose}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:"var(--text-2)"}}>{m.route}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:"var(--text-2)"}}>{m.freq}</td>
                    <td style={{padding:"10px 12px",fontSize:11,color:"var(--text-2)",fontFamily:"monospace"}}>{fmtDate(m.startDate)}</td>
                    <td style={{padding:"10px 12px"}}><span style={{background:sc+"18",color:sc,border:`1px solid ${sc}35`,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:600}}>{m.status||"Active"}</span></td>
                    <td style={{padding:"10px 12px",fontSize:11,color:"var(--text-2)"}}>{m.prescriber}</td>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",gap:4}}>
                        {(!m.status||m.status==="Pending")&&<button onClick={()=>verifyMed(m.patientId,m.id)} style={{padding:"3px 8px",background:"var(--green-dim)",border:"1px solid var(--green)35",borderRadius:3,color:"var(--green)",fontSize:11,fontWeight:600,cursor:"pointer"}}>Verify</button>}
                        <button style={{padding:"3px 8px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:3,color:"var(--text-2)",fontSize:11,cursor:"pointer"}}>DC</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0&&<tr><td colSpan={9} style={{padding:40,textAlign:"center",color:"var(--text-3)",fontSize:13}}>No medication orders.</td></tr>}
            </tbody>
          </table>
        )}

        {/* MAR */}
        {tab==="mar"&&(
          <div>
            <div style={{display:"flex",gap:8,padding:"10px 20px",background:"var(--card-2)",borderBottom:"1px solid var(--border)",flexWrap:"wrap"}}>
              <span style={{fontSize:12,color:"var(--text-2)"}}>Select patient to view MAR:</span>
              {MAR_PATIENTS.map(p=>(
                <button key={p.id} onClick={()=>setSelPat(p.id)} style={{padding:"4px 12px",background:selPat===p.id?"var(--blue)":"var(--navy-2)",border:`1px solid ${selPat===p.id?"var(--blue)":"var(--border)"}`,borderRadius:4,color:selPat===p.id?"#fff":"var(--text-2)",fontSize:12,cursor:"pointer"}}>{p.name}</button>
              ))}
            </div>
            {selPat&&(()=>{
              const p = PATIENTS.find(x=>x.id===selPat);
              const meds = getMeds(selPat);
              const hours = ["06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00"];
              return (
                <div style={{padding:20}}>
                  <div style={{background:"var(--blue)",padding:"10px 16px",borderRadius:"8px 8px 0 0",display:"flex",gap:20,alignItems:"center"}}>
                    <div style={{fontSize:14,fontWeight:700}}>{p.name}</div>
                    <div style={{fontSize:12,opacity:0.85}}>{p.mrn} · {calcAge(p.dob)}y {p.gender} · {p.bloodType}</div>
                    {p.allergies.length>0&&<div style={{background:"rgba(255,71,87,0.3)",border:"1px solid rgba(255,71,87,0.5)",borderRadius:4,padding:"2px 8px",fontSize:11,color:"#ffa0aa",fontWeight:700}}>⚠ {p.allergies.join(", ")}</div>}
                  </div>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",background:"var(--card)",border:"1px solid var(--border)"}}>
                      <thead><tr style={{background:"var(--card-2)"}}>
                        <th style={{padding:"8px 14px",textAlign:"left",fontSize:11,color:"var(--text-3)",fontWeight:700,minWidth:200,borderBottom:"1px solid var(--border)",borderRight:"1px solid var(--border)"}}>Medication</th>
                        {hours.map(h=><th key={h} style={{padding:"8px 10px",textAlign:"center",fontSize:11,color:"var(--text-3)",fontWeight:700,minWidth:60,borderBottom:"1px solid var(--border)",borderRight:"1px solid var(--border-2)"}}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {meds.filter(m=>m.status!=="Discontinued").map(m=>(
                          <tr key={m.id||m.drug} style={{borderBottom:"1px solid var(--border-2)"}}>
                            <td style={{padding:"10px 14px",borderRight:"1px solid var(--border)"}}>
                              <div style={{fontSize:12,fontWeight:700}}>{m.drug}</div>
                              <div style={{fontSize:11,color:"var(--text-3)"}}>{m.dose} · {m.route} · {m.freq}</div>
                              {m.prn&&<span style={{fontSize:10,background:"var(--amber-dim)",color:"var(--amber)",borderRadius:3,padding:"1px 5px"}}>PRN</span>}
                            </td>
                            {hours.map(h=>{
                              const scheduled = ["08:00","12:00","18:00"].includes(h)&&m.freq?.includes("TID")||["08:00","20:00"].includes(h)&&m.freq?.includes("BID")||h==="08:00"&&m.freq?.includes("Daily")||["06:00","12:00","18:00","00:00"].includes(h)&&m.freq?.includes("Q6H");
                              const given = scheduled && Math.random()>0.3;
                              return (
                                <td key={h} style={{padding:"6px",textAlign:"center",borderRight:"1px solid var(--border-2)"}}>
                                  {scheduled?(
                                    <div style={{width:28,height:28,borderRadius:"50%",margin:"0 auto",background:given?"var(--green-dim)":"var(--navy-2)",border:`2px solid ${given?"var(--green)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,cursor:"pointer",title:"Click to document"}}>
                                      {given?"✓":""}
                                    </div>
                                  ):<div style={{color:"var(--text-3)",fontSize:10}}>—</div>}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                        {meds.length===0&&<tr><td colSpan={10} style={{padding:24,textAlign:"center",color:"var(--text-3)",fontSize:13}}>No active medications for this patient.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
            {!selPat&&<div style={{padding:40,textAlign:"center",color:"var(--text-3)",fontSize:13}}>Select a patient above to view their MAR.</div>}
          </div>
        )}

        {/* VERIFICATION QUEUE */}
        {tab==="verify"&&(
          <div style={{padding:20}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Pharmacist Verification Queue</div>
            <div style={{fontSize:12,color:"var(--text-3)",marginBottom:16}}>Review and verify new medication orders before dispensing.</div>
            {pendingVer.length===0&&<div style={{padding:40,textAlign:"center",color:"var(--green)",fontSize:13,fontWeight:600}}>✓ No pending orders — all medications verified</div>}
            {pendingVer.map(m=>{
              const allergy = m.patient.allergies.some(a=>m.drug?.toLowerCase().includes(a.toLowerCase()));
              return (
                <div key={m.id||m.drug} style={{background:"var(--card)",border:`1px solid ${allergy?"var(--red)":"var(--border)"}`,borderLeft:`4px solid ${allergy?"var(--red)":"var(--amber)"}`,borderRadius:8,padding:16,marginBottom:12}}>
                  {allergy&&<div style={{background:"var(--red-dim)",border:"1px solid var(--red)30",borderRadius:5,padding:"8px 12px",marginBottom:12,fontSize:12,color:"var(--red)",fontWeight:700}}>⚠ ALLERGY ALERT: Patient has documented allergy that may interact with this medication</div>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:14,marginBottom:12}}>
                    {[["Patient",m.patient.name],["MRN",m.patient.mrn],["Medication",m.drug],["Dose",m.dose],["Route",m.route],["Frequency",m.freq],["Prescriber",m.prescriber||"—"],["Indication",m.indication||"—"]].map(([k,v])=>(
                      <div key={k}><div style={{fontSize:10,color:"var(--text-3)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div><div style={{fontSize:13,fontWeight:500}}>{v||"—"}</div></div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>verifyMed(m.patientId,m.id||m.drug)} style={{padding:"6px 16px",background:"var(--green)",border:"none",borderRadius:5,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer"}}>✓ Verify & Dispense</button>
                    <button style={{padding:"6px 14px",background:"var(--amber-dim)",border:"1px solid var(--amber)40",borderRadius:5,color:"var(--amber)",fontSize:12,fontWeight:600,cursor:"pointer"}}>Clarify with Prescriber</button>
                    <button style={{padding:"6px 14px",background:"var(--red-dim)",border:"1px solid var(--red)40",borderRadius:5,color:"var(--red)",fontSize:12,fontWeight:600,cursor:"pointer"}}>Hold / Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* NEW ORDER */}
        {tab==="neworder"&&(
          <div style={{padding:20,maxWidth:700}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>New Medication Order</div>
            <div style={{fontSize:12,color:"var(--text-3)",marginBottom:18}}>Enter a new medication order. Order will be routed to pharmacy for verification.</div>
            <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,padding:20}}>
              <div style={{marginBottom:14}}>
                <label style={lbl}>Patient *</label>
                <select value={selPat||""} onChange={e=>setSelPat(e.target.value)} style={inp}>
                  <option value="">— Select Patient —</option>
                  {MAR_PATIENTS.map(p=><option key={p.id} value={p.id}>{p.name} ({p.mrn})</option>)}
                </select>
              </div>
              {selPat&&PATIENTS.find(p=>p.id===selPat)?.allergies.length>0&&(
                <div style={{background:"var(--red-dim)",border:"1px solid var(--red)30",borderRadius:5,padding:"8px 12px",marginBottom:14,fontSize:12,color:"var(--red)",fontWeight:700}}>
                  ⚠ ALLERGIES: {PATIENTS.find(p=>p.id===selPat)?.allergies.join(", ")}
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                {[["Medication / Drug Name *","med","text","e.g. Amoxicillin"],["Dose","dose","text","e.g. 500mg"],["Indication","indication","text","e.g. Community-acquired pneumonia"],["Start Date","startDate","date",""],["Duration","duration","text","e.g. 7 days, Until discharge"]].map(([label,field,type,ph])=>(
                  <div key={field}><label style={lbl}>{label}</label><input type={type} value={orderForm[field]} placeholder={ph} onChange={e=>setOrderForm(f=>({...f,[field]:e.target.value}))} style={inp}/></div>
                ))}
                <div><label style={lbl}>Route</label><select value={orderForm.route} onChange={e=>setOrderForm(f=>({...f,route:e.target.value}))} style={inp}>{["Oral","IV","IM","SQ","Topical","Inhaled","SL","Rectal","Ophthalmic"].map(r=><option key={r}>{r}</option>)}</select></div>
                <div><label style={lbl}>Frequency</label><select value={orderForm.freq} onChange={e=>setOrderForm(f=>({...f,freq:e.target.value}))} style={inp}>{["Once","Daily","BID","TID","QID","Q4H","Q6H","Q8H","Q12H","PRN","Continuous","Stat"].map(r=><option key={r}>{r}</option>)}</select></div>
              </div>
              <label style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={orderForm.prn} onChange={e=>setOrderForm(f=>({...f,prn:e.target.checked}))}/>PRN (as needed)</label>
              <div style={{display:"flex",gap:8}}>
                <button onClick={addOrder} disabled={!selPat||!orderForm.med} style={{padding:"8px 20px",background:selPat&&orderForm.med?"var(--green)":"var(--navy-2)",border:"none",borderRadius:5,color:selPat&&orderForm.med?"#000":"var(--text-3)",fontSize:13,fontWeight:700,cursor:selPat&&orderForm.med?"pointer":"not-allowed"}}>✓ Place Order</button>
                <button onClick={()=>{setOrderForm({med:"",dose:"",route:"Oral",freq:"",startDate:"",duration:"",indication:"",prn:false});}} style={{padding:"8px 14px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,color:"var(--text-2)",fontSize:13,cursor:"pointer"}}>Clear</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── LABORATORY ───────────────────────────────────────────────────────────────
const Laboratory = ({ patientFlow, setPatientFlow }) => {
  const [tab, setTab] = useState("results");
  const [selPat, setSelPat] = useState(null);
  const [orderForm, setOrderForm] = useState({ test:"", urgency:"Routine", indication:"", collectionTime:"" });
  const [toast, setToast] = useState(null);
  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(null),3000); };

  const LAB_TESTS = {
    Hematology: ["CBC with Differential","CBC without Differential","Reticulocyte Count","Peripheral Smear","PT/INR","aPTT","D-Dimer","Fibrinogen"],
    Chemistry:  ["Basic Metabolic Panel","Comprehensive Metabolic Panel","Glucose","Creatinine","BUN","eGFR","Sodium","Potassium","Calcium","Magnesium","Phosphorus","Uric Acid","LDH","Albumin","Total Protein"],
    Cardiac:    ["Troponin I","BNP/NT-proBNP","CK-MB","Myoglobin","Lipid Panel","Homocysteine"],
    Endocrine:  ["HbA1c","TSH","Free T4","Free T3","Cortisol","Insulin","C-Peptide","PTH"],
    Liver:      ["AST","ALT","ALP","Total Bilirubin","Direct Bilirubin","GGT","Hepatitis Panel"],
    Infectious: ["Blood Culture x2","Urine Culture","Sputum Culture","Procalcitonin","CRP","ESR","HIV Screen","Influenza A/B","COVID-19 PCR","Strep Screen","RPR"],
    Urine:      ["Urinalysis","Urine Pregnancy Test","Urine Culture","Urine Protein/Creatinine","Urine Electrolytes","Drug Screen"],
    Other:      ["PSA","CEA","CA-125","AFP","B-HCG","Vitamin D","Vitamin B12","Folate","Ferritin","TIBC","Iron"],
  };

  const getPending = () => {
    if(!patientFlow)return[];
    return Object.entries(patientFlow).flatMap(([pid,flow])=>(flow.labOrders||[]).map(o=>({...o,patientId:pid,patient:PATIENTS.find(p=>p.id===pid)})));
  };

  const getLabs = (pid) => patientFlow?.[pid]?.labs || LAB_DATA[pid] || [];

  const allLabs = PATIENTS.flatMap(p=>getLabs(p.id).map(r=>({...r,patient:p,patientId:p.id})));
  const criticals = allLabs.filter(r=>r.results?.some(x=>x.flag==="H"||x.flag==="L"||x.flag==="C")||r.critical);
  const pending = getPending();

  const placeLabOrder = () => {
    if(!selPat||!orderForm.test)return;
    const order = { id:"LAB_"+Date.now(), test:orderForm.test, urgency:orderForm.urgency, indication:orderForm.indication, status:"Ordered", orderedAt:new Date().toISOString(), orderedBy:"Current User" };
    setPatientFlow?.(prev=>({...prev,[selPat]:{...(prev?.[selPat]||{}),labOrders:[...(prev?.[selPat]?.labOrders||[]),order]}}));
    setPatientFlow?.(prev=>({...prev,[selPat]:{...prev[selPat],billingCharges:[...(prev[selPat]?.billingCharges||buildDefaultBilling(selPat)),{id:"LAB_B_"+Date.now(),cpt:"85025",desc:orderForm.test,qty:1,unitFee:52,total:52,date:new Date().toISOString().slice(0,10),category:"Lab",status:"Pending"}]}}));
    showToast(`✓ Lab ordered: ${orderForm.test} (${orderForm.urgency})`);
    setOrderForm({test:"",urgency:"Routine",indication:"",collectionTime:""});
  };

  const inp = {width:"100%",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,padding:"7px 10px",color:"var(--text)",fontSize:13,outline:"none"};
  const lbl = {fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4,display:"block"};

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      {toast&&<div style={{position:"fixed",top:70,right:24,zIndex:9999,background:"#0f2044",border:"1px solid var(--green)",color:"var(--green)",padding:"11px 20px",borderRadius:7,fontSize:13,fontWeight:600,boxShadow:"0 4px 24px rgba(0,0,0,0.5)"}}>{toast}</div>}

      <div style={{background:"var(--card)",borderBottom:"1px solid var(--border)",padding:"0 20px",display:"flex",alignItems:"center",height:48,flexShrink:0}}>
        <div style={{marginRight:20}}><div style={{fontSize:14,fontWeight:700}}>Laboratory</div><div style={{fontSize:10,color:"var(--text-3)"}}>Results, Orders & Reporting</div></div>
        {[["results","Results"],["order","Order Lab"],["pending","Pending"],["criticals","Critical Values"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{height:48,padding:"0 16px",background:"none",border:"none",borderBottom:`2px solid ${tab===id?"var(--cyan)":"transparent"}`,color:tab===id?"var(--cyan)":"var(--text-2)",fontSize:13,fontWeight:tab===id?600:400,cursor:"pointer",marginBottom:-1,whiteSpace:"nowrap"}}>
            {label}{id==="criticals"&&criticals.length>0&&<span style={{marginLeft:5,background:"var(--red)",color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700}}>{criticals.length}</span>}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:10,fontSize:12}}>
          <span style={{color:"var(--text-3)"}}>Critical: <strong style={{color:"var(--red)"}}>{criticals.length}</strong></span>
          <span style={{color:"var(--text-3)"}}>Pending: <strong style={{color:"var(--amber)"}}>{pending.length}</strong></span>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",background:"var(--card-2)",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        {[["Total Results",allLabs.length,"#4a7fee"],["Critical Values",criticals.length,"#ff4757"],["Pending Orders",pending.length,"#ffb800"],["Final",allLabs.filter(r=>r.status==="Final").length,"#00d68f"]].map(([label,val,color],i)=>(
          <div key={label} style={{padding:"9px 0",textAlign:"center",borderRight:i<3?"1px solid var(--border)":"none"}}>
            <div style={{fontSize:20,fontWeight:700,color}}>{val}</div>
            <div style={{fontSize:10,color:"var(--text-3)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",marginTop:2}}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{flex:1,overflowY:"auto"}}>

        {/* RESULTS */}
        {tab==="results"&&(
          <div>
            <div style={{display:"flex",gap:8,padding:"10px 20px",background:"var(--card-2)",borderBottom:"1px solid var(--border)",flexWrap:"wrap"}}>
              <span style={{fontSize:12,color:"var(--text-2)"}}>Patient:</span>
              <button onClick={()=>setSelPat(null)} style={{padding:"3px 10px",background:!selPat?"var(--blue)":"var(--navy-2)",border:`1px solid ${!selPat?"var(--blue)":"var(--border)"}`,borderRadius:4,color:!selPat?"#fff":"var(--text-2)",fontSize:11,cursor:"pointer"}}>All</button>
              {PATIENTS.map(p=><button key={p.id} onClick={()=>setSelPat(p.id)} style={{padding:"3px 10px",background:selPat===p.id?"var(--blue)":"var(--navy-2)",border:`1px solid ${selPat===p.id?"var(--blue)":"var(--border)"}`,borderRadius:4,color:selPat===p.id?"#fff":"var(--text-2)",fontSize:11,cursor:"pointer"}}>{p.name.split(" ")[1]}</button>)}
            </div>
            {(selPat?PATIENTS.filter(p=>p.id===selPat):PATIENTS).map(p=>{
              const labs = getLabs(p.id);
              if(labs.length===0)return null;
              return (
                <div key={p.id}>
                  <div style={{padding:"8px 20px",background:"var(--card-2)",borderBottom:"1px solid var(--border)",display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700}}>{p.name.split(" ").map(n=>n[0]).join("")}</div>
                    <span style={{fontSize:13,fontWeight:700}}>{p.name}</span>
                    <span style={{fontSize:11,color:"var(--text-3)",fontFamily:"monospace"}}>{p.mrn}</span>
                    <span style={{fontSize:11,color:"var(--text-2)"}}>{calcAge(p.dob)}y · {p.pcp}</span>
                  </div>
                  {labs.map(panel=>(
                    <div key={panel.id||panel.test} style={{margin:"0 20px 16px",marginTop:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden"}}>
                      <div style={{background:"var(--navy-2)",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <span style={{fontSize:13,fontWeight:700}}>{panel.test}</span>
                          <span style={{fontSize:11,color:"var(--text-3)",marginLeft:12,fontFamily:"monospace"}}>{fmtDate(panel.date)}</span>
                        </div>
                        <span style={{background:panel.status==="Final"?"var(--green-dim)":"var(--amber-dim)",color:panel.status==="Final"?"var(--green)":"var(--amber)",borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:700}}>{panel.status}</span>
                      </div>
                      <table style={{width:"100%",borderCollapse:"collapse"}}>
                        <thead><tr style={{background:"var(--card-2)"}}>
                          {["Component","Value","Reference Range","Flag","Unit"].map(h=><th key={h} style={{padding:"6px 14px",textAlign:"left",fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                          {(panel.results||[]).map((r,i)=>{
                            const isCrit = r.flag==="H"||r.flag==="L"||r.flag==="C";
                            return (
                              <tr key={i} style={{borderTop:"1px solid var(--border-2)",background:isCrit?"rgba(255,71,87,0.05)":"transparent"}}>
                                <td style={{padding:"8px 14px",fontSize:12,fontWeight:600}}>{r.name}</td>
                                <td style={{padding:"8px 14px",fontSize:13,fontWeight:700,color:isCrit?"var(--red)":r.flag==="N"||!r.flag?"var(--text)":"var(--text)"}}>{r.value}</td>
                                <td style={{padding:"8px 14px",fontSize:11,color:"var(--text-3)"}}>{r.ref}</td>
                                <td style={{padding:"8px 14px"}}>{r.flag&&<span style={{background:isCrit?"var(--red-dim)":"var(--navy-2)",color:r.flag==="H"?"#ff8a95":r.flag==="L"?"var(--cyan)":"var(--text-3)",borderRadius:3,padding:"1px 6px",fontSize:11,fontWeight:700}}>{r.flag}</span>}</td>
                                <td style={{padding:"8px 14px",fontSize:11,color:"var(--text-3)"}}>{r.unit}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ORDER LAB */}
        {tab==="order"&&(
          <div style={{padding:20,maxWidth:700}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Order Laboratory Test</div>
            <div style={{fontSize:12,color:"var(--text-3)",marginBottom:18}}>Select patient and lab test. STAT orders are prioritized in the lab queue.</div>
            <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,padding:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                <div><label style={lbl}>Patient *</label><select value={selPat||""} onChange={e=>setSelPat(e.target.value)} style={inp}><option value="">— Select —</option>{PATIENTS.map(p=><option key={p.id} value={p.id}>{p.name} ({p.mrn})</option>)}</select></div>
                <div><label style={lbl}>Urgency</label><select value={orderForm.urgency} onChange={e=>setOrderForm(f=>({...f,urgency:e.target.value}))} style={inp}>{["Routine","STAT","ASAP"].map(o=><option key={o}>{o}</option>)}</select></div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={lbl}>Test Category & Test *</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,maxHeight:340,overflowY:"auto"}}>
                  {Object.entries(LAB_TESTS).map(([cat,tests])=>(
                    <div key={cat} style={{background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:6,overflow:"hidden"}}>
                      <div style={{padding:"6px 12px",background:"var(--navy-3)",fontSize:11,fontWeight:700,color:"var(--cyan)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{cat}</div>
                      {tests.map(t=>(
                        <div key={t} onClick={()=>setOrderForm(f=>({...f,test:t}))} style={{padding:"6px 12px",fontSize:12,cursor:"pointer",background:orderForm.test===t?"var(--blue)20":"transparent",color:orderForm.test===t?"var(--cyan)":"var(--text-2)",borderTop:"1px solid var(--border-2)"}} onMouseEnter={e=>e.currentTarget.style.background=orderForm.test===t?"var(--blue)20":"#1e3a5f20"} onMouseLeave={e=>e.currentTarget.style.background=orderForm.test===t?"var(--blue)20":"transparent"}>{t}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {orderForm.test&&<div style={{padding:"8px 12px",background:"var(--green-dim)",border:"1px solid var(--green)30",borderRadius:5,marginBottom:14,fontSize:12,color:"var(--green)"}}>✓ Selected: <strong>{orderForm.test}</strong> — {orderForm.urgency}</div>}
              <div style={{marginBottom:14}}><label style={lbl}>Clinical Indication</label><input value={orderForm.indication} onChange={e=>setOrderForm(f=>({...f,indication:e.target.value}))} placeholder="Reason for ordering..." style={inp}/></div>
              <button onClick={placeLabOrder} disabled={!selPat||!orderForm.test} style={{padding:"8px 20px",background:selPat&&orderForm.test?"var(--green)":"var(--navy-2)",border:"none",borderRadius:5,color:selPat&&orderForm.test?"#000":"var(--text-3)",fontSize:13,fontWeight:700,cursor:selPat&&orderForm.test?"pointer":"not-allowed"}}>✓ Place Lab Order</button>
            </div>
          </div>
        )}

        {/* PENDING */}
        {tab==="pending"&&(
          <div style={{padding:20}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Pending Lab Orders</div>
            {pending.length===0&&<div style={{padding:32,textAlign:"center",color:"var(--text-3)",fontSize:13}}>No pending lab orders.</div>}
            {pending.map(o=>(
              <div key={o.id} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 18px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:14,fontWeight:700}}>{o.test}</span>
                    {o.urgency==="STAT"&&<span style={{background:"var(--red-dim)",color:"var(--red)",borderRadius:3,padding:"1px 7px",fontSize:11,fontWeight:700,border:"1px solid var(--red)40"}}>STAT</span>}
                    {o.urgency==="ASAP"&&<span style={{background:"var(--amber-dim)",color:"var(--amber)",borderRadius:3,padding:"1px 7px",fontSize:11,fontWeight:700}}>ASAP</span>}
                  </div>
                  <div style={{fontSize:12,color:"var(--text-2)"}}>Patient: <strong>{o.patient?.name||"—"}</strong> · {o.patient?.mrn||"—"} · Ordered: {fmtDate(o.orderedAt?.slice(0,10))}</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{setPatientFlow?.(prev=>({...prev,[o.patientId]:{...prev[o.patientId],labOrders:(prev[o.patientId]?.labOrders||[]).map(x=>x.id===o.id?{...x,status:"Collected"}:x)}}));showToast("Specimen collected");}} style={{padding:"5px 12px",background:"var(--amber-dim)",border:"1px solid var(--amber)40",borderRadius:4,color:"var(--amber)",fontSize:12,fontWeight:600,cursor:"pointer"}}>Mark Collected</button>
                  <button onClick={()=>{setPatientFlow?.(prev=>({...prev,[o.patientId]:{...prev[o.patientId],labOrders:(prev[o.patientId]?.labOrders||[]).map(x=>x.id===o.id?{...x,status:"Resulted"}:x)}}));showToast("Results posted");}} style={{padding:"5px 12px",background:"var(--green-dim)",border:"1px solid var(--green)40",borderRadius:4,color:"var(--green)",fontSize:12,fontWeight:600,cursor:"pointer"}}>Post Results</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CRITICAL VALUES */}
        {tab==="criticals"&&(
          <div style={{padding:20}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Critical Lab Values</div>
            <div style={{fontSize:12,color:"var(--text-3)",marginBottom:16}}>Values outside critical range require immediate physician notification.</div>
            {criticals.length===0&&<div style={{padding:32,textAlign:"center",color:"var(--green)",fontSize:13,fontWeight:600}}>✓ No critical lab values at this time</div>}
            {criticals.map(panel=>(
              <div key={panel.id||panel.test+"_"+panel.patientId} style={{background:"var(--card)",border:"1px solid var(--red)40",borderLeft:"4px solid var(--red)",borderRadius:8,padding:16,marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div>
                    <span style={{fontSize:14,fontWeight:700,color:"var(--red)"}}>⚠ {panel.test}</span>
                    <span style={{fontSize:12,color:"var(--text-2)",marginLeft:12}}>{panel.patient.name} · {panel.patient.mrn}</span>
                  </div>
                  <span style={{fontSize:11,color:"var(--text-3)"}}>{fmtDate(panel.date)}</span>
                </div>
                {(panel.results||[]).filter(r=>r.flag==="H"||r.flag==="L").map((r,i)=>(
                  <div key={i} style={{display:"flex",gap:16,padding:"6px 10px",background:"var(--red-dim)",borderRadius:5,marginBottom:4,fontSize:12}}>
                    <span style={{fontWeight:700,color:"var(--red)",minWidth:120}}>{r.name}</span>
                    <span style={{fontWeight:700,color:"var(--red)"}}>{r.value} {r.unit}</span>
                    <span style={{color:"var(--text-3)"}}>Ref: {r.ref}</span>
                    <span style={{background:"var(--red)",color:"#fff",borderRadius:3,padding:"0 5px",fontWeight:700}}>{r.flag}</span>
                  </div>
                ))}
                <div style={{display:"flex",gap:8,marginTop:10}}>
                  <button style={{padding:"5px 12px",background:"var(--red)",border:"none",borderRadius:4,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>📞 Notify Physician</button>
                  <button style={{padding:"5px 12px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:4,color:"var(--text-2)",fontSize:12,cursor:"pointer"}}>✓ Acknowledge</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── RADIOLOGY ────────────────────────────────────────────────────────────────
const RadiologyDept = ({ patientFlow, setPatientFlow }) => {
  const [tab, setTab] = useState("worklist");
  const [selPat, setSelPat] = useState(null);
  const [orderForm, setOrderForm] = useState({ modality:"XR", body:"Chest PA & Lateral", urgency:"Routine", indication:"", contrast:"No Contrast" });
  const [toast, setToast] = useState(null);
  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(null),3000); };

  const RAD_ORDERS = {
    "XR":  ["Chest PA & Lateral","Chest AP Portable","Abdomen AP","Hip AP & Lateral","Knee AP & Lateral","Spine Lumbar","Wrist AP & Lateral","Ankle AP & Lateral","Hand AP","Foot AP"],
    "CT":  ["Head without contrast","Chest without contrast","Chest with contrast","Abdomen/Pelvis with contrast","Abdomen/Pelvis without contrast","Spine Cervical","Spine Lumbar","CTA Head/Neck","CTA Chest (PE Protocol)","CT Angiography Abdomen"],
    "MRI": ["Brain with & without contrast","Brain without contrast","Spine Cervical","Spine Lumbar","Knee","Shoulder","Cardiac MRI","MRCP","MRA Brain"],
    "US":  ["Abdomen Complete","Pelvis","RUQ (Gallbladder)","Renal","Thyroid","Carotid Doppler","Lower Extremity DVT","Echocardiogram","Pelvic OB"],
    "NM":  ["V/Q Scan","Bone Scan","HIDA Scan","Stress Myocardial Perfusion","PET-CT Whole Body"],
    "IR":  ["CT-guided Biopsy","IR Drainage","PICC Placement","Port-a-Cath Placement","Angiography"],
  };

  const getRads = (pid) => patientFlow?.[pid]?.rads || RADIOLOGY_DATA[pid] || [];
  const getRadOrders = (pid) => patientFlow?.[pid]?.radOrders || [];

  const allRads = PATIENTS.flatMap(p=>getRads(p.id).map(r=>({...r,patient:p,patientId:p.id})));
  const allOrders = PATIENTS.flatMap(p=>getRadOrders(p.id).map(o=>({...o,patient:p,patientId:p.id})));
  const pending = allOrders.filter(o=>o.status==="Ordered"||o.status==="Scheduled");

  const placeOrder = () => {
    if(!selPat||!orderForm.body)return;
    const ord = {id:"RAD_"+Date.now(), modality:orderForm.modality, study:`${orderForm.modality} ${orderForm.body}`, urgency:orderForm.urgency, indication:orderForm.indication, contrast:orderForm.contrast, status:"Ordered", orderedAt:new Date().toISOString()};
    setPatientFlow?.(prev=>({...prev,[selPat]:{...(prev?.[selPat]||{}),radOrders:[...(prev?.[selPat]?.radOrders||[]),ord]}}));
    const cptMap = {"XR":"71046","CT":"74177","MRI":"70553","US":"93306","NM":"70553","IR":"74177"};
    const fee = {"XR":185,"CT":1250,"MRI":1850,"US":650,"NM":950,"IR":2200}[orderForm.modality]||500;
    setPatientFlow?.(prev=>({...prev,[selPat]:{...prev[selPat],billingCharges:[...(prev[selPat]?.billingCharges||buildDefaultBilling(selPat)),{id:"RAD_B_"+Date.now(),cpt:cptMap[orderForm.modality]||"71046",desc:ord.study,qty:1,unitFee:fee,total:fee,date:new Date().toISOString().slice(0,10),category:"Radiology",status:"Pending"}]}}));
    showToast(`✓ Ordered: ${ord.study}`);
    setOrderForm({modality:"XR",body:"Chest PA & Lateral",urgency:"Routine",indication:"",contrast:"No Contrast"});
  };

  const inp = {width:"100%",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,padding:"7px 10px",color:"var(--text)",fontSize:13,outline:"none"};
  const lbl = {fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4,display:"block"};
  const modColor = {XR:"#4a7fee",CT:"#00c8e0",MRI:"#8b5cf6",US:"#00d68f",NM:"#ffb800",IR:"#ff4757"};

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      {toast&&<div style={{position:"fixed",top:70,right:24,zIndex:9999,background:"#0f2044",border:"1px solid var(--green)",color:"var(--green)",padding:"11px 20px",borderRadius:7,fontSize:13,fontWeight:600,boxShadow:"0 4px 24px rgba(0,0,0,0.5)"}}>{toast}</div>}

      <div style={{background:"var(--card)",borderBottom:"1px solid var(--border)",padding:"0 20px",display:"flex",alignItems:"center",height:48,flexShrink:0}}>
        <div style={{marginRight:20}}><div style={{fontSize:14,fontWeight:700}}>Radiology</div><div style={{fontSize:10,color:"var(--text-3)"}}>Imaging Orders, Results & Reports</div></div>
        {[["worklist","Worklist"],["results","Results & Reports"],["order","Order Imaging"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{height:48,padding:"0 16px",background:"none",border:"none",borderBottom:`2px solid ${tab===id?"var(--cyan)":"transparent"}`,color:tab===id?"var(--cyan)":"var(--text-2)",fontSize:13,fontWeight:tab===id?600:400,cursor:"pointer",marginBottom:-1}}>
            {label}{id==="worklist"&&pending.length>0&&<span style={{marginLeft:5,background:"var(--amber)",color:"#000",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700}}>{pending.length}</span>}
          </button>
        ))}
        <div style={{marginLeft:"auto",fontSize:12,color:"var(--text-3)"}}>Total Studies: <strong style={{color:"var(--text)"}}>{allRads.length}</strong></div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",background:"var(--card-2)",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        {Object.entries(modColor).map(([mod,color],i)=>{
          const count = allRads.filter(r=>r.modality===mod||r.study?.startsWith(mod)).length + allOrders.filter(o=>o.modality===mod).length;
          return <div key={mod} style={{padding:"9px 0",textAlign:"center",borderRight:i<5?"1px solid var(--border)":"none"}}><div style={{fontSize:18,fontWeight:700,color}}>{count}</div><div style={{fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em",marginTop:2}}>{mod}</div></div>;
        })}
      </div>

      <div style={{flex:1,overflowY:"auto"}}>

        {/* WORKLIST */}
        {tab==="worklist"&&(
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:"var(--card-2)",borderBottom:"1px solid var(--border)",position:"sticky",top:0}}>
              {["","Patient","MRN","Study","Modality","Urgency","Status","Ordered","Actions"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap"}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {[...allOrders,...allRads.map(r=>({...r,status:r.status||"Final",orderedAt:r.date}))].sort((a,b)=>{
                const p={"STAT":0,"ASAP":1,"Routine":2};return(p[a.urgency]||2)-(p[b.urgency]||2);
              }).map((r,i)=>{
                const mc = modColor[r.modality]||"#4a7fee";
                const isUrgent = r.urgency==="STAT"||r.urgency==="ASAP";
                return (
                  <tr key={r.id||i} style={{borderBottom:"1px solid var(--border-2)"}} onMouseEnter={e=>e.currentTarget.style.background="#1e3a5f15"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"10px 8px"}}><div style={{width:3,height:32,borderRadius:2,background:mc}}/></td>
                    <td style={{padding:"10px 12px"}}><div style={{fontSize:13,fontWeight:600}}>{r.patient.name}</div>{r.patient.allergies.includes("Contrast")&&<div style={{fontSize:10,color:"var(--red)"}}>⚠ Contrast allergy</div>}</td>
                    <td style={{padding:"10px 12px",fontSize:11,color:"var(--cyan)",fontFamily:"monospace"}}>{r.patient.mrn}</td>
                    <td style={{padding:"10px 12px",fontSize:12,fontWeight:600}}>{r.study||r.test}</td>
                    <td style={{padding:"10px 12px"}}><span style={{background:mc+"20",color:mc,border:`1px solid ${mc}40`,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:700}}>{r.modality}</span></td>
                    <td style={{padding:"10px 12px"}}>{isUrgent?<span style={{background:r.urgency==="STAT"?"var(--red-dim)":"var(--amber-dim)",color:r.urgency==="STAT"?"var(--red)":"var(--amber)",borderRadius:3,padding:"2px 7px",fontSize:11,fontWeight:700}}>{r.urgency}</span>:<span style={{fontSize:12,color:"var(--text-3)"}}>Routine</span>}</td>
                    <td style={{padding:"10px 12px"}}><span style={{background:r.status==="Final"?"var(--green-dim)":r.status==="Prelim"?"var(--amber-dim)":"var(--purple-dim)",color:r.status==="Final"?"var(--green)":r.status==="Prelim"?"var(--amber)":"var(--purple)",borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:600}}>{r.status}</span></td>
                    <td style={{padding:"10px 12px",fontSize:11,color:"var(--text-3)",fontFamily:"monospace"}}>{fmtDate(r.orderedAt?.slice?.(0,10)||r.date)}</td>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",gap:4}}>
                        {(r.status==="Ordered"||r.status==="Scheduled")&&<button onClick={()=>{setPatientFlow?.(prev=>({...prev,[r.patientId]:{...prev[r.patientId],radOrders:(prev[r.patientId]?.radOrders||[]).map(x=>x.id===r.id?{...x,status:"In Progress"}:x)}}));showToast("Study started");}} style={{padding:"3px 8px",background:"var(--amber-dim)",border:"1px solid var(--amber)40",borderRadius:3,color:"var(--amber)",fontSize:11,cursor:"pointer"}}>Start</button>}
                        {r.status==="In Progress"&&<button onClick={()=>{setPatientFlow?.(prev=>({...prev,[r.patientId]:{...prev[r.patientId],radOrders:(prev[r.patientId]?.radOrders||[]).map(x=>x.id===r.id?{...x,status:"Final"}:x)}}));showToast("Results finalized");}} style={{padding:"3px 8px",background:"var(--green-dim)",border:"1px solid var(--green)40",borderRadius:3,color:"var(--green)",fontSize:11,cursor:"pointer"}}>Finalize</button>}
                        {r.report&&<button style={{padding:"3px 8px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:3,color:"var(--text-2)",fontSize:11,cursor:"pointer"}}>Report</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* RESULTS */}
        {tab==="results"&&(
          <div>
            <div style={{display:"flex",gap:8,padding:"10px 20px",background:"var(--card-2)",borderBottom:"1px solid var(--border)",flexWrap:"wrap"}}>
              <button onClick={()=>setSelPat(null)} style={{padding:"3px 10px",background:!selPat?"var(--blue)":"var(--navy-2)",border:`1px solid ${!selPat?"var(--blue)":"var(--border)"}`,borderRadius:4,color:!selPat?"#fff":"var(--text-2)",fontSize:11,cursor:"pointer"}}>All Patients</button>
              {PATIENTS.map(p=><button key={p.id} onClick={()=>setSelPat(p.id)} style={{padding:"3px 10px",background:selPat===p.id?"var(--blue)":"var(--navy-2)",border:`1px solid ${selPat===p.id?"var(--blue)":"var(--border)"}`,borderRadius:4,color:selPat===p.id?"#fff":"var(--text-2)",fontSize:11,cursor:"pointer"}}>{p.name.split(" ")[1]}</button>)}
            </div>
            {(selPat?PATIENTS.filter(p=>p.id===selPat):PATIENTS).map(p=>{
              const rads = getRads(p.id);
              if(rads.length===0)return null;
              return rads.map(study=>(
                <div key={study.id||study.test} style={{margin:"16px 20px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden"}}>
                  <div style={{background:"var(--navy-2)",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <span style={{background:(modColor[study.modality]||"#4a7fee")+"20",color:modColor[study.modality]||"#4a7fee",border:`1px solid ${(modColor[study.modality]||"#4a7fee")}40`,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:700}}>{study.modality}</span>
                      <span style={{fontSize:13,fontWeight:700}}>{study.test}</span>
                      <span style={{fontSize:11,color:"var(--text-3)",fontFamily:"monospace"}}>{p.name} · {p.mrn} · {fmtDate(study.date)}</span>
                    </div>
                    <span style={{background:"var(--green-dim)",color:"var(--green)",borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:700}}>{study.status||"Final"}</span>
                  </div>
                  <div style={{padding:16}}>
                    <div style={{fontSize:11,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Radiologist Report</div>
                    <div style={{fontSize:13,lineHeight:1.7,color:"var(--text)",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:6,padding:"12px 16px",whiteSpace:"pre-wrap",fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{study.report||"IMPRESSION: Study reviewed by attending radiologist.\nNo acute cardiopulmonary process identified.\nFinal report pending radiologist attestation."}</div>
                    {study.findings&&<div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>{study.findings.map(f=><span key={f} style={{background:"var(--amber-dim)",color:"var(--amber)",borderRadius:4,padding:"2px 8px",fontSize:11,border:"1px solid var(--amber)30"}}>{f}</span>)}</div>}
                  </div>
                </div>
              ));
            })}
          </div>
        )}

        {/* ORDER */}
        {tab==="order"&&(
          <div style={{padding:20,maxWidth:700}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>Order Imaging Study</div>
            <div style={{fontSize:12,color:"var(--text-3)",marginBottom:18}}>STAT orders are immediately placed in the radiology worklist.</div>
            <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,padding:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                <div><label style={lbl}>Patient *</label><select value={selPat||""} onChange={e=>setSelPat(e.target.value)} style={inp}><option value="">— Select —</option>{PATIENTS.map(p=><option key={p.id} value={p.id}>{p.name} ({p.mrn})</option>)}</select></div>
                <div><label style={lbl}>Urgency</label><select value={orderForm.urgency} onChange={e=>setOrderForm(f=>({...f,urgency:e.target.value}))} style={inp}>{["Routine","STAT","ASAP"].map(o=><option key={o}>{o}</option>)}</select></div>
                <div><label style={lbl}>Modality</label><select value={orderForm.modality} onChange={e=>setOrderForm(f=>({...f,modality:e.target.value,body:(RAD_ORDERS[e.target.value]||[])[0]||""}))} style={inp}>{Object.keys(RAD_ORDERS).map(m=><option key={m} value={m}>{m} — {({XR:"X-Ray",CT:"CT Scan",MRI:"MRI",US:"Ultrasound",NM:"Nuclear Med",IR:"Interventional Radiology"})[m]}</option>)}</select></div>
                <div><label style={lbl}>Contrast</label><select value={orderForm.contrast} onChange={e=>setOrderForm(f=>({...f,contrast:e.target.value}))} style={inp}>{["No Contrast","With Contrast","With & Without Contrast","Oral Contrast Only"].map(o=><option key={o}>{o}</option>)}</select></div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={lbl}>Study / Body Part *</label>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6,maxHeight:200,overflowY:"auto"}}>
                  {(RAD_ORDERS[orderForm.modality]||[]).map(s=>(
                    <div key={s} onClick={()=>setOrderForm(f=>({...f,body:s}))} style={{padding:"7px 12px",fontSize:12,cursor:"pointer",background:orderForm.body===s?"var(--blue)":"var(--navy-2)",color:orderForm.body===s?"#fff":"var(--text-2)",border:`1px solid ${orderForm.body===s?"var(--blue)":"var(--border)"}`,borderRadius:5}} onMouseEnter={e=>e.currentTarget.style.background=orderForm.body===s?"var(--blue)":"#1e3a5f30"} onMouseLeave={e=>e.currentTarget.style.background=orderForm.body===s?"var(--blue)":"var(--navy-2)"}>{s}</div>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}><label style={lbl}>Clinical Indication</label><textarea value={orderForm.indication} onChange={e=>setOrderForm(f=>({...f,indication:e.target.value}))} rows={2} placeholder="Clinical reason for study..." style={{...inp,resize:"vertical"}}/></div>
              {selPat&&PATIENTS.find(p=>p.id===selPat)?.allergies.some(a=>a.toLowerCase().includes("contrast"))&&<div style={{padding:"8px 12px",background:"var(--red-dim)",border:"1px solid var(--red)30",borderRadius:5,marginBottom:14,fontSize:12,color:"var(--red)",fontWeight:700}}>⚠ Patient has documented contrast allergy — review before ordering contrast study</div>}
              <button onClick={placeOrder} disabled={!selPat||!orderForm.body} style={{padding:"8px 20px",background:selPat&&orderForm.body?"var(--green)":"var(--navy-2)",border:"none",borderRadius:5,color:selPat&&orderForm.body?"#000":"var(--text-3)",fontSize:13,fontWeight:700,cursor:selPat&&orderForm.body?"pointer":"not-allowed"}}>✓ Place Imaging Order</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CLINICAL NOTES ───────────────────────────────────────────────────────────
const NotesDept = ({ onPatient, patientFlow, setPatientFlow }) => {
  const [tab, setTab] = useState("all");
  const [selPat, setSelPat] = useState(null);
  const [composing, setComposing] = useState(false);
  const [noteForm, setNoteForm] = useState({ patientId:"", type:"Progress Note", title:"", content:"", author:"Dr. Sarah Ellison", cosigner:"", status:"Draft" });
  const [toast, setToast] = useState(null);
  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(null),3000); };

  const NOTE_TYPES = ["H&P (History & Physical)","Progress Note","Discharge Summary","Consult Note","Operative Note","Procedure Note","Nursing Note","Social Work Note","Case Management Note","Telephone Encounter","After-Visit Summary"];
  const NOTE_TEMPLATES = {
    "Progress Note": `SUBJECTIVE:\nPatient reports [symptoms]. Pain level [X]/10.\n\nOBJECTIVE:\nVitals: T [X] HR [X] BP [X]/[X] RR [X] SpO2 [X]%\nGeneral: [appearance]\nCV: [findings]\nResp: [findings]\nAbdomen: [findings]\nNeuro: [findings]\n\nASSESSMENT:\n1. [Diagnosis] - [status]\n2. [Diagnosis] - [status]\n\nPLAN:\n1. [Intervention]\n2. [Intervention]\n3. Follow up [timeframe]`,
    "H&P (History & Physical)": `CHIEF COMPLAINT:\n[Chief complaint]\n\nHISTORY OF PRESENT ILLNESS:\n[Patient] is a [age]-year-old [gender] with PMH of [conditions] who presents with [complaint].\n\nPAST MEDICAL HISTORY:\n[List diagnoses]\n\nMEDICATIONS:\n[List medications]\n\nALLERGIES:\n[List allergies]\n\nSOCIAL HISTORY:\n[Tobacco/EtOH/illicit drug use]\n\nFAMILY HISTORY:\n[Relevant family history]\n\nREVIEW OF SYSTEMS:\n[Systems review]\n\nPHYSICAL EXAMINATION:\nVitals: T [X] HR [X] BP [X]/[X] RR [X] SpO2 [X]%\nGeneral: [appearance]\n[Complete exam]\n\nASSESSMENT & PLAN:\n1. [Problem]\n   - [Plan]\n2. [Problem]\n   - [Plan]`,
    "Discharge Summary": `DISCHARGE SUMMARY\n\nADMISSION DATE: [date]\nDISCHARGE DATE: [date]\n\nATTENDING PHYSICIAN: [name]\n\nPRINCIPAL DIAGNOSIS:\n[Diagnosis]\n\nSECONDARY DIAGNOSES:\n[List]\n\nHOSPITAL COURSE:\n[Summary of hospital stay]\n\nPROCEDURES PERFORMED:\n[List]\n\nDISCHARGE CONDITION:\n[Stable/Improved/Critical]\n\nDISCHARGE MEDICATIONS:\n[List with doses and instructions]\n\nDISCHARGE INSTRUCTIONS:\n[Patient instructions]\n\nFOLLOW-UP:\n[Provider and timeframe]\n\nPENDING RESULTS:\n[Any results still pending]`,
  };

  const getNotes = (pid) => patientFlow?.[pid]?.notes || NOTES_DATA[pid] || [];
  const allNotes = PATIENTS.flatMap(p=>getNotes(p.id).map(n=>({...n,patient:p,patientId:p.id})));
  const drafts = (patientFlow ? Object.values(patientFlow).flatMap(f=>f.notes||[]) : []).filter(n=>n.status==="Draft");

  const saveNote = (status="Draft") => {
    if(!noteForm.patientId||!noteForm.content)return;
    const n = { id:"NOTE_"+Date.now(), type:noteForm.type, title:noteForm.title||noteForm.type, content:noteForm.content, author:noteForm.author, cosigner:noteForm.cosigner, date:new Date().toISOString().slice(0,10), status, encounter:"ENC_"+Date.now() };
    setPatientFlow?.(prev=>({...prev,[noteForm.patientId]:{...(prev?.[noteForm.patientId]||{}),notes:[...(prev?.[noteForm.patientId]?.notes||NOTES_DATA[noteForm.patientId]||[]),n]}}));
    setComposing(false);
    setNoteForm({patientId:"",type:"Progress Note",title:"",content:"",author:"Dr. Sarah Ellison",cosigner:"",status:"Draft"});
    showToast(status==="Signed"?`✓ Note signed and locked`:`Note saved as draft`);
  };

  const inp = {width:"100%",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,padding:"7px 10px",color:"var(--text)",fontSize:13,outline:"none"};
  const lbl = {fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4,display:"block"};
  const noteStatusColor = {Draft:"#ffb800",Signed:"#00d68f","Signed & Attested":"#00c8e0",Amended:"#8b5cf6"};

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      {toast&&<div style={{position:"fixed",top:70,right:24,zIndex:9999,background:"#0f2044",border:"1px solid var(--green)",color:"var(--green)",padding:"11px 20px",borderRadius:7,fontSize:13,fontWeight:600,boxShadow:"0 4px 24px rgba(0,0,0,0.5)"}}>{toast}</div>}

      <div style={{background:"var(--card)",borderBottom:"1px solid var(--border)",padding:"0 20px",display:"flex",alignItems:"center",height:48,flexShrink:0}}>
        <div style={{marginRight:20}}><div style={{fontSize:14,fontWeight:700}}>Clinical Documentation</div><div style={{fontSize:10,color:"var(--text-3)"}}>Notes, H&Ps, Discharge Summaries</div></div>
        {[["all","All Notes"],["unsigned","Unsigned / Draft"],["byme","By Me"]].map(([id,label])=>(
          <button key={id} onClick={()=>{setTab(id);setComposing(false);}} style={{height:48,padding:"0 16px",background:"none",border:"none",borderBottom:`2px solid ${tab===id&&!composing?"var(--cyan)":"transparent"}`,color:tab===id&&!composing?"var(--cyan)":"var(--text-2)",fontSize:13,fontWeight:tab===id&&!composing?600:400,cursor:"pointer",marginBottom:-1}}>
            {label}{id==="unsigned"&&drafts.length>0&&<span style={{marginLeft:5,background:"var(--amber)",color:"#000",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700}}>{drafts.length}</span>}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <button onClick={()=>{setComposing(true);setTab("compose");}} style={{padding:"6px 14px",background:"var(--blue)",border:"none",borderRadius:5,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ New Note</button>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto"}}>
        {/* COMPOSE */}
        {composing&&(
          <div style={{padding:20,maxWidth:900}}>
            <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden"}}>
              <div style={{background:"var(--blue)",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:14,fontWeight:700}}>New Clinical Note</div>
                <button onClick={()=>setComposing(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:4,color:"#fff",padding:"3px 10px",cursor:"pointer",fontSize:13}}>✕ Cancel</button>
              </div>
              <div style={{padding:20}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
                  <div><label style={lbl}>Patient *</label><select value={noteForm.patientId} onChange={e=>{const p=PATIENTS.find(x=>x.id===e.target.value);setNoteForm(f=>({...f,patientId:e.target.value}));}} style={inp}><option value="">— Select Patient —</option>{PATIENTS.map(p=><option key={p.id} value={p.id}>{p.name} ({p.mrn})</option>)}</select></div>
                  <div><label style={lbl}>Note Type</label><select value={noteForm.type} onChange={e=>setNoteForm(f=>({...f,type:e.target.value,content:NOTE_TEMPLATES[e.target.value]||f.content}))} style={inp}>{NOTE_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                  <div><label style={lbl}>Author</label><select value={noteForm.author} onChange={e=>setNoteForm(f=>({...f,author:e.target.value}))} style={inp}>{PROVIDERS_LIST.slice(0,8).map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
                </div>
                <div style={{marginBottom:14}}><label style={lbl}>Note Title (optional)</label><input value={noteForm.title} onChange={e=>setNoteForm(f=>({...f,title:e.target.value}))} placeholder={`${noteForm.type} — ${new Date().toLocaleDateString()}`} style={inp}/></div>
                {noteForm.patientId&&(()=>{const p=PATIENTS.find(x=>x.id===noteForm.patientId);return p&&(
                  <div style={{background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:6,padding:"10px 14px",marginBottom:14,display:"flex",gap:20,fontSize:12}}>
                    <span style={{fontWeight:700,color:"var(--cyan)"}}>{p.name}</span>
                    <span style={{color:"var(--text-3)"}}>{p.mrn}</span>
                    <span style={{color:"var(--text-2)"}}>{calcAge(p.dob)}y {p.gender} · {p.bloodType}</span>
                    <span style={{color:"var(--text-2)"}}>{p.diagnosis}</span>
                    {p.allergies.length>0&&<span style={{color:"var(--red)",fontWeight:600}}>⚠ {p.allergies.join(", ")}</span>}
                  </div>
                );})()}
                <div style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                    <label style={lbl}>Note Content *</label>
                    <button onClick={()=>setNoteForm(f=>({...f,content:NOTE_TEMPLATES[f.type]||""}))} style={{padding:"3px 10px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:4,color:"var(--text-2)",fontSize:11,cursor:"pointer"}}>Load Template</button>
                  </div>
                  <textarea value={noteForm.content} onChange={e=>setNoteForm(f=>({...f,content:e.target.value}))} rows={18} style={{...inp,resize:"vertical",lineHeight:1.7,fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                  <div><label style={lbl}>Co-signer (optional)</label><select value={noteForm.cosigner} onChange={e=>setNoteForm(f=>({...f,cosigner:e.target.value}))} style={inp}><option value="">— None —</option>{PROVIDERS_LIST.slice(0,8).map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>saveNote("Signed")} disabled={!noteForm.patientId||!noteForm.content} style={{padding:"9px 22px",background:noteForm.patientId&&noteForm.content?"var(--green)":"var(--navy-2)",border:"none",borderRadius:5,color:noteForm.patientId&&noteForm.content?"#000":"var(--text-3)",fontSize:13,fontWeight:700,cursor:noteForm.patientId&&noteForm.content?"pointer":"not-allowed"}}>✓ Sign & Lock Note</button>
                  <button onClick={()=>saveNote("Draft")} style={{padding:"8px 16px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,color:"var(--text-2)",fontSize:13,cursor:"pointer"}}>Save as Draft</button>
                  <button onClick={()=>setComposing(false)} style={{padding:"8px 14px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,color:"var(--text-2)",fontSize:13,cursor:"pointer"}}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!composing&&(
          <div>
            <div style={{display:"flex",gap:8,padding:"10px 20px",background:"var(--card-2)",borderBottom:"1px solid var(--border)",flexWrap:"wrap"}}>
              <button onClick={()=>setSelPat(null)} style={{padding:"3px 10px",background:!selPat?"var(--blue)":"var(--navy-2)",border:`1px solid ${!selPat?"var(--blue)":"var(--border)"}`,borderRadius:4,color:!selPat?"#fff":"var(--text-2)",fontSize:11,cursor:"pointer"}}>All</button>
              {PATIENTS.map(p=><button key={p.id} onClick={()=>setSelPat(p.id)} style={{padding:"3px 10px",background:selPat===p.id?"var(--blue)":"var(--navy-2)",border:`1px solid ${selPat===p.id?"var(--blue)":"var(--border)"}`,borderRadius:4,color:selPat===p.id?"#fff":"var(--text-2)",fontSize:11,cursor:"pointer"}}>{p.name.split(" ")[1]}</button>)}
            </div>
            {(selPat?allNotes.filter(n=>n.patientId===selPat):allNotes).sort((a,b)=>b.date>a.date?1:-1).map(note=>{
              const sc = noteStatusColor[note.status]||"#8b5cf6";
              return (
                <div key={note.id||note.type+note.date} style={{margin:"12px 20px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden"}}>
                  <div style={{background:"var(--navy-2)",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                      <span style={{fontSize:13,fontWeight:700}}>{note.type}</span>
                      <span style={{fontSize:11,color:"var(--text-3)",fontFamily:"monospace"}}>{fmtDate(note.date)}</span>
                      <span style={{fontSize:11,color:"var(--text-2)"}}>by {note.author}</span>
                      {!selPat&&<span style={{fontSize:11,color:"var(--cyan)",fontWeight:600}}>{note.patient.name}</span>}
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{background:sc+"18",color:sc,border:`1px solid ${sc}35`,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:600}}>{note.status}</span>
                      {note.status==="Draft"&&<button onClick={()=>saveNote("Signed")} style={{padding:"3px 10px",background:"var(--green-dim)",border:"1px solid var(--green)40",borderRadius:4,color:"var(--green)",fontSize:11,fontWeight:700,cursor:"pointer"}}>Sign</button>}
                    </div>
                  </div>
                  <div style={{padding:"14px 16px",fontSize:12,color:"var(--text)",lineHeight:1.8,whiteSpace:"pre-wrap",fontFamily:"'IBM Plex Mono',monospace",maxHeight:220,overflowY:"auto",background:"var(--navy)20"}}>{note.content||note.text}</div>
                  <div style={{padding:"8px 16px",background:"var(--card-2)",borderTop:"1px solid var(--border)",display:"flex",gap:8}}>
                    <button onClick={()=>note.patient&&onPatient(note.patient)} style={{padding:"4px 10px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:4,color:"var(--text-2)",fontSize:11,cursor:"pointer"}}>Open Chart</button>
                    {note.status==="Signed"&&<button style={{padding:"4px 10px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:4,color:"var(--text-2)",fontSize:11,cursor:"pointer"}}>Addendum</button>}
                    <button style={{padding:"4px 10px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:4,color:"var(--text-2)",fontSize:11,cursor:"pointer"}}>Print</button>
                  </div>
                </div>
              );
            })}
            {allNotes.filter(n=>!selPat||n.patientId===selPat).length===0&&<div style={{padding:40,textAlign:"center",color:"var(--text-3)",fontSize:13}}>No clinical notes found. Create a new note using the "+ New Note" button.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── DISCHARGE ────────────────────────────────────────────────────────────────
const Discharge = ({ onPatient, patientFlow, setPatientFlow }) => {
  const [selPat, setSelPat] = useState(null);
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [discharged, setDischarged] = useState([]);
  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(null),3000); };

  const [dcForm, setDcForm] = useState({
    disposition:"Home", followupProvider:"", followupDays:"7", followupDept:"", transport:"Self",
    dischargeDx:"", dischargeCondition:"Stable", pendingResults:"", diet:"Regular",
    activityRestrictions:"", woundCare:"", meds:[], newMeds:"",
    instructions:"", returnPrecautions:"", patientUnderstanding:"Yes", interpreterUsed:false,
    dischargeDate: new Date().toISOString().slice(0,10), dischargeTime:"",
  });

  const eligiblePatients = PATIENTS.filter(p=>["Inpatient","Ambulatory"].includes(p.status) && !discharged.includes(p.id));

  const inp = {width:"100%",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,padding:"7px 10px",color:"var(--text)",fontSize:13,outline:"none"};
  const lbl = {fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4,display:"block"};

  const selPatObj = PATIENTS.find(p=>p.id===selPat);
  const los = selPatObj?.admitDate ? Math.floor((Date.now()-new Date(selPatObj.admitDate))/86400000) : 1;

  const processDischarge = () => {
    if(!selPat)return;
    // Generate discharge summary note
    const dcNote = {
      id:"DC_NOTE_"+Date.now(), type:"Discharge Summary",
      title:`Discharge Summary — ${selPatObj?.name}`,
      content:`DISCHARGE SUMMARY\n\nPATIENT: ${selPatObj?.name}\nMRN: ${selPatObj?.mrn}\nDISCHARGE DATE: ${dcForm.dischargeDate}\nLENGTH OF STAY: ${los} day(s)\n\nDISCHARGE DIAGNOSIS: ${dcForm.dischargeDx||selPatObj?.diagnosis}\nDISCHARGE CONDITION: ${dcForm.dischargeCondition}\n\nDISPOSITION: ${dcForm.disposition}\nTRANSPORT: ${dcForm.transport}\n\nFOLLOW-UP: ${dcForm.followupProvider} in ${dcForm.followupDays} days — ${dcForm.followupDept}\n\nDISCHARGE INSTRUCTIONS:\n${dcForm.instructions}\n\nRETURN PRECAUTIONS:\n${dcForm.returnPrecautions}\n\nPENDING RESULTS:\n${dcForm.pendingResults||"None"}`,
      date: dcForm.dischargeDate, author: selPatObj?.pcp||"Attending", status:"Signed", encounter:"DC_ENC_"+Date.now()
    };
    setPatientFlow?.(prev=>({...prev,[selPat]:{...(prev?.[selPat]||{}),notes:[...(prev?.[selPat]?.notes||[]),dcNote],dischargeInfo:{...dcForm,los},billingCharges:[...(prev[selPat]?.billingCharges||buildDefaultBilling(selPat)),{id:"DC_B_"+Date.now(),cpt:"99238",desc:"Hospital Discharge Day – <30 min",qty:1,unitFee:155,total:155,date:dcForm.dischargeDate,category:"E&M",status:"Pending"}]}}));
    setDischarged(d=>[...d,selPat]);
    showToast(`✓ ${selPatObj?.name} successfully discharged`);
    setSelPat(null);
    setStep(1);
  };

  const DISPO_OPTIONS = ["Home","Home with Home Health","Skilled Nursing Facility (SNF)","Inpatient Rehab Facility (IRF)","Long-Term Acute Care (LTAC)","Hospice — Home","Hospice — Inpatient","AMA (Against Medical Advice)","Transferred to Another Hospital","Expired"];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      {toast&&<div style={{position:"fixed",top:70,right:24,zIndex:9999,background:"#0f2044",border:"1px solid var(--green)",color:"var(--green)",padding:"11px 20px",borderRadius:7,fontSize:13,fontWeight:600,boxShadow:"0 4px 24px rgba(0,0,0,0.5)"}}>{toast}</div>}

      <div style={{background:"var(--card)",borderBottom:"1px solid var(--border)",padding:"0 20px",display:"flex",alignItems:"center",height:48,flexShrink:0}}>
        <div style={{marginRight:20}}><div style={{fontSize:14,fontWeight:700}}>Discharge Planning</div><div style={{fontSize:10,color:"var(--text-3)"}}>Patient Disposition, Instructions & Documentation</div></div>
        <div style={{marginLeft:"auto",fontSize:12,color:"var(--text-3)"}}>Eligible for discharge: <strong style={{color:"var(--amber)"}}>{eligiblePatients.length}</strong></div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",background:"var(--card-2)",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        {[["Eligible",eligiblePatients.length,"#ffb800"],["Discharged Today",discharged.length,"#00d68f"],["Avg LOS",`${los}d`,"#4a7fee"],["Pending DC",eligiblePatients.filter(p=>patientFlow?.[p.id]?.dischargeInfo).length,"#8b5cf6"]].map(([label,val,color],i)=>(
          <div key={label} style={{padding:"9px 0",textAlign:"center",borderRight:i<3?"1px solid var(--border)":"none"}}>
            <div style={{fontSize:20,fontWeight:700,color}}>{val}</div>
            <div style={{fontSize:10,color:"var(--text-3)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",marginTop:2}}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:20}}>
        {/* Patient selector */}
        {!selPat&&(
          <div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Select Patient to Discharge</div>
            <div style={{fontSize:12,color:"var(--text-3)",marginBottom:16}}>Patients currently admitted or eligible for discharge planning.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}}>
              {eligiblePatients.map(p=>{
                const plos = p.admitDate?Math.floor((Date.now()-new Date(p.admitDate))/86400000):0;
                const flow = patientFlow?.[p.id];
                const charges = flow?.billingCharges||buildDefaultBilling(p.id);
                const totalCharges = charges.reduce((s,c)=>s+c.total,0);
                return (
                  <div key={p.id} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden",cursor:"pointer"}} onClick={()=>{setSelPat(p.id);setDcForm(f=>({...f,dischargeDx:p.diagnosis,followupProvider:p.pcp}));setStep(1);}}>
                    <div style={{background:"var(--navy-2)",padding:"12px 16px",display:"flex",gap:12,alignItems:"center"}}>
                      <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,var(--blue),var(--cyan))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{p.name.split(" ").map(n=>n[0]).join("")}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:700}}>{p.name}</div>
                        <div style={{fontSize:11,color:"var(--text-2)",marginTop:2}}>{p.mrn} · {calcAge(p.dob)}y {p.gender} · {p.insurance}</div>
                      </div>
                      <button style={{padding:"5px 14px",background:"var(--blue)",border:"none",borderRadius:5,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>Start DC</button>
                    </div>
                    <div style={{padding:"12px 16px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                      {[["Room",p.room||"Outpatient"],["Diagnosis",p.diagnosis],["LOS",`${plos}d`],["Attending",p.pcp],["Total Charges",`$${totalCharges.toFixed(0)}`],["Insurance",p.insurance?.split(" ")[0]||"—"]].map(([k,v])=>(
                        <div key={k}><div style={{fontSize:10,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"0.05em"}}>{k}</div><div style={{fontSize:12,fontWeight:500,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</div></div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {discharged.length>0&&(
              <div>
                <div style={{fontSize:13,fontWeight:700,marginBottom:12,color:"var(--green)"}}>✓ Discharged Today</div>
                {PATIENTS.filter(p=>discharged.includes(p.id)).map(p=>(
                  <div key={p.id} style={{background:"var(--card)",border:"1px solid var(--green)30",borderLeft:"3px solid var(--green)",borderRadius:6,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700}}>{p.name}</div>
                      <div style={{fontSize:11,color:"var(--text-2)"}}>{p.mrn} · {patientFlow?.[p.id]?.dischargeInfo?.disposition||"Home"} · DC: {patientFlow?.[p.id]?.dischargeInfo?.dischargeDate||"Today"}</div>
                    </div>
                    <span style={{background:"var(--green-dim)",color:"var(--green)",borderRadius:4,padding:"3px 10px",fontSize:11,fontWeight:700}}>✓ Discharged</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Discharge wizard */}
        {selPat&&selPatObj&&(
          <div style={{maxWidth:820}}>
            {/* Step progress */}
            <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
              {[["1","Disposition"],["2","Instructions"],["3","Medications"],["4","Documentation"]].map(([n,label],i)=>(
                <div key={n} style={{display:"flex",alignItems:"center"}}>
                  <div onClick={()=>step>i+1&&setStep(i+1)} style={{display:"flex",alignItems:"center",gap:7,cursor:step>i+1?"pointer":"default"}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:step>i+1?"var(--green)":step===i+1?"var(--blue)":"var(--navy-2)",border:`2px solid ${step>i+1?"var(--green)":step===i+1?"var(--blue)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:step>i+1?"#000":"#fff"}}>
                      {step>i+1?"✓":n}
                    </div>
                    <span style={{fontSize:12,fontWeight:step===i+1?600:400,color:step===i+1?"var(--text)":"var(--text-3)"}}>{label}</span>
                  </div>
                  {i<3&&<div style={{flex:1,height:1,background:step>i+1?"var(--green)":"var(--border)",margin:"0 10px",minWidth:24}}/>}
                </div>
              ))}
              <button onClick={()=>{setSelPat(null);setStep(1);}} style={{marginLeft:"auto",padding:"4px 12px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:4,color:"var(--text-3)",fontSize:11,cursor:"pointer"}}>← Back to list</button>
            </div>

            {/* Patient banner */}
            <div style={{background:"var(--blue)",borderRadius:"8px 8px 0 0",padding:"12px 18px",display:"flex",gap:14,alignItems:"center",marginBottom:0}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>{selPatObj.name.split(" ").map(n=>n[0]).join("")}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700}}>{selPatObj.name}</div>
                <div style={{fontSize:12,opacity:.85}}>{selPatObj.mrn} · {calcAge(selPatObj.dob)}y {selPatObj.gender} · {selPatObj.diagnosis} · LOS: {los}d</div>
              </div>
              {selPatObj.allergies.length>0&&<div style={{background:"rgba(255,71,87,0.3)",border:"1px solid rgba(255,71,87,0.5)",borderRadius:4,padding:"4px 10px",fontSize:11,color:"#ffa0aa",fontWeight:700}}>⚠ {selPatObj.allergies.join(", ")}</div>}
            </div>

            <div style={{background:"var(--card)",border:"1px solid var(--border)",borderTop:"none",borderRadius:"0 0 8px 8px",padding:20}}>
              {/* STEP 1 — Disposition */}
              {step===1&&(
                <div>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>Step 1 — Disposition & Follow-up</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                    <div><label style={lbl}>Discharge Disposition *</label><select value={dcForm.disposition} onChange={e=>setDcForm(f=>({...f,disposition:e.target.value}))} style={inp}>{DISPO_OPTIONS.map(o=><option key={o}>{o}</option>)}</select></div>
                    <div><label style={lbl}>Patient Condition at Discharge</label><select value={dcForm.dischargeCondition} onChange={e=>setDcForm(f=>({...f,dischargeCondition:e.target.value}))} style={inp}>{["Stable","Improved","Guarded","Critical","Unchanged","Expired"].map(o=><option key={o}>{o}</option>)}</select></div>
                    <div><label style={lbl}>Discharge Diagnosis *</label><input value={dcForm.dischargeDx} onChange={e=>setDcForm(f=>({...f,dischargeDx:e.target.value}))} placeholder={selPatObj.diagnosis} style={inp}/></div>
                    <div><label style={lbl}>Transport</label><select value={dcForm.transport} onChange={e=>setDcForm(f=>({...f,transport:e.target.value}))} style={inp}>{["Self","Family/Friend","Taxi/Rideshare","Wheelchair Van","Ambulance","Air Transport"].map(o=><option key={o}>{o}</option>)}</select></div>
                    <div><label style={lbl}>Follow-up Provider</label><select value={dcForm.followupProvider} onChange={e=>setDcForm(f=>({...f,followupProvider:e.target.value}))} style={inp}><option value="">— Select —</option>{PROVIDERS_LIST.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
                    <div><label style={lbl}>Follow-up Department</label><select value={dcForm.followupDept} onChange={e=>setDcForm(f=>({...f,followupDept:e.target.value}))} style={inp}><option value="">— Select —</option>{DEPARTMENTS_LIST.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}</select></div>
                    <div><label style={lbl}>Follow-up In (Days)</label><select value={dcForm.followupDays} onChange={e=>setDcForm(f=>({...f,followupDays:e.target.value}))} style={inp}>{["1","2","3","5","7","10","14","21","30","60","90","PRN"].map(o=><option key={o}>{o}</option>)}</select></div>
                    <div><label style={lbl}>Discharge Date</label><input type="date" value={dcForm.dischargeDate} onChange={e=>setDcForm(f=>({...f,dischargeDate:e.target.value}))} style={inp}/></div>
                  </div>
                  <div style={{marginBottom:14}}><label style={lbl}>Pending Results at Discharge</label><textarea value={dcForm.pendingResults} onChange={e=>setDcForm(f=>({...f,pendingResults:e.target.value}))} rows={2} placeholder="List any lab, imaging, or pathology results still pending..." style={{...inp,resize:"vertical"}}/></div>
                  <button onClick={()=>setStep(2)} style={{padding:"8px 20px",background:"var(--blue)",border:"none",borderRadius:5,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Next: Instructions →</button>
                </div>
              )}

              {/* STEP 2 — Instructions */}
              {step===2&&(
                <div>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>Step 2 — Patient Instructions</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                    <div><label style={lbl}>Diet</label><select value={dcForm.diet} onChange={e=>setDcForm(f=>({...f,diet:e.target.value}))} style={inp}>{["Regular","Low Sodium (<2g)","Cardiac / Low Fat","Diabetic","Renal (Low K/Phos)","Clear Liquid","Soft","NPO until follow-up"].map(o=><option key={o}>{o}</option>)}</select></div>
                    <div><label style={lbl}>Patient Understanding Verified</label><select value={dcForm.patientUnderstanding} onChange={e=>setDcForm(f=>({...f,patientUnderstanding:e.target.value}))} style={inp}>{["Yes","No — Needs Re-education","Partial"].map(o=><option key={o}>{o}</option>)}</select></div>
                  </div>
                  <div style={{marginBottom:14}}><label style={lbl}>Activity Restrictions</label><textarea value={dcForm.activityRestrictions} onChange={e=>setDcForm(f=>({...f,activityRestrictions:e.target.value}))} rows={2} placeholder="e.g. No lifting >10lbs for 6 weeks, no driving while on opioids..." style={{...inp,resize:"vertical"}}/></div>
                  <div style={{marginBottom:14}}><label style={lbl}>Wound / Incision Care</label><textarea value={dcForm.woundCare} onChange={e=>setDcForm(f=>({...f,woundCare:e.target.value}))} rows={2} placeholder="e.g. Change dressing daily, keep incision dry for 48 hrs..." style={{...inp,resize:"vertical"}}/></div>
                  <div style={{marginBottom:14}}><label style={lbl}>Discharge Instructions</label><textarea value={dcForm.instructions} onChange={e=>setDcForm(f=>({...f,instructions:e.target.value}))} rows={5} placeholder="General care instructions for the patient..." style={{...inp,resize:"vertical"}}/></div>
                  <div style={{marginBottom:16}}><label style={lbl}>Return Precautions — "Return to ER if..."</label><textarea value={dcForm.returnPrecautions} onChange={e=>setDcForm(f=>({...f,returnPrecautions:e.target.value}))} rows={3} placeholder="e.g. Fever >101.5°F, worsening shortness of breath, chest pain, inability to keep fluids down..." style={{...inp,resize:"vertical"}}/></div>
                  <div style={{marginBottom:16}}><label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={dcForm.interpreterUsed} onChange={e=>setDcForm(f=>({...f,interpreterUsed:e.target.checked}))}/>Interpreter services used</label></div>
                  <div style={{display:"flex",gap:8}}><button onClick={()=>setStep(1)} style={{padding:"8px 14px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,color:"var(--text-2)",fontSize:13,cursor:"pointer"}}>← Back</button><button onClick={()=>setStep(3)} style={{padding:"8px 20px",background:"var(--blue)",border:"none",borderRadius:5,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Next: Medications →</button></div>
                </div>
              )}

              {/* STEP 3 — Medications */}
              {step===3&&(
                <div>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Step 3 — Discharge Medications</div>
                  <div style={{fontSize:12,color:"var(--text-3)",marginBottom:16}}>Review current medications and add new discharge prescriptions. Reconcile any changes.</div>
                  <div style={{background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden",marginBottom:14}}>
                    <div style={{padding:"8px 14px",background:"var(--navy-3)",fontSize:11,fontWeight:700,color:"var(--cyan)",textTransform:"uppercase",letterSpacing:"0.07em"}}>Current Medications — Reconciliation</div>
                    {(MEDS_DATA[selPat]||[]).map((m,i)=>(
                      <div key={m.id||m.drug} style={{display:"flex",gap:12,padding:"10px 14px",borderTop:"1px solid var(--border-2)",alignItems:"center"}}>
                        <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{m.drug}</div><div style={{fontSize:11,color:"var(--text-3)"}}>{m.dose} · {m.route} · {m.freq}</div></div>
                        <select defaultValue="Continue" style={{background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:4,padding:"4px 8px",color:"var(--text)",fontSize:11,outline:"none"}}>
                          {["Continue","Discontinue","Change Dose","New Prescription","Hold"].map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                    {(!MEDS_DATA[selPat]||MEDS_DATA[selPat].length===0)&&<div style={{padding:"14px",fontSize:12,color:"var(--text-3)"}}>No active medications on file for this patient.</div>}
                  </div>
                  <div style={{marginBottom:16}}><label style={lbl}>New Discharge Prescriptions</label><textarea value={dcForm.newMeds} onChange={e=>setDcForm(f=>({...f,newMeds:e.target.value}))} rows={4} placeholder="List new medications:&#10;1. Amoxicillin 500mg PO TID x10 days&#10;2. Ibuprofen 400mg PO PRN pain&#10;..." style={{...inp,resize:"vertical"}}/></div>
                  <div style={{display:"flex",gap:8}}><button onClick={()=>setStep(2)} style={{padding:"8px 14px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,color:"var(--text-2)",fontSize:13,cursor:"pointer"}}>← Back</button><button onClick={()=>setStep(4)} style={{padding:"8px 20px",background:"var(--blue)",border:"none",borderRadius:5,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Next: Documentation →</button></div>
                </div>
              )}

              {/* STEP 4 — Documentation & Finalize */}
              {step===4&&(
                <div>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>Step 4 — Review & Finalize Discharge</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                    {[["Patient",selPatObj.name],["MRN",selPatObj.mrn],["Discharge Dx",dcForm.dischargeDx||selPatObj.diagnosis],["Condition",dcForm.dischargeCondition],["Disposition",dcForm.disposition],["Transport",dcForm.transport],["Follow-up",`${dcForm.followupProvider} in ${dcForm.followupDays}d`],["Length of Stay",`${los} day(s)`],["Discharge Date",fmtDate(dcForm.dischargeDate)],["Interpreter",dcForm.interpreterUsed?"Yes":"No"]].map(([k,v])=>(
                      <div key={k} style={{background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,padding:"9px 12px"}}>
                        <div style={{fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div>
                        <div style={{fontSize:13,fontWeight:500}}>{v||"—"}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{background:"var(--amber-dim)",border:"1px solid var(--amber)35",borderRadius:6,padding:"10px 14px",marginBottom:16,fontSize:12,color:"var(--amber)"}}>
                    ⚠ Completing discharge will: generate a Discharge Summary note, update billing, and remove patient from the active census.
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setStep(3)} style={{padding:"8px 14px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,color:"var(--text-2)",fontSize:13,cursor:"pointer"}}>← Back</button>
                    <button onClick={processDischarge} style={{padding:"9px 24px",background:"var(--green)",border:"none",borderRadius:5,color:"#000",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>✓ Complete Discharge</button>
                    <button onClick={()=>onPatient(selPatObj)} style={{padding:"8px 14px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,color:"var(--text-2)",fontSize:13,cursor:"pointer"}}>View Full Chart</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── BILLING ──────────────────────────────────────────────────────────────────
const BillingDept = ({ onPatient, patientFlow }) => {
  const [tab, setTab] = useState("accounts");
  const [selPat, setSelPat] = useState(null);
  const [claimFilter, setClaimFilter] = useState("All");

  const getCharges = (pid) => {
    const flow = patientFlow?.[pid];
    return flow?.billingCharges || buildDefaultBilling(pid);
  };

  const getInsuranceAdj = (total) => total * 0.40;
  const getPatientResp = (total, adj) => (total - adj) * 0.20;
  const getPaid = (pid) => (BILLING_DATA[pid]?.paidAmt||0);

  const allAccounts = PATIENTS.map(p=>{
    const charges = getCharges(p.id);
    const totalCharges = charges.reduce((s,c)=>s+c.total,0);
    const insAdj = getInsuranceAdj(totalCharges);
    const patResp = getPatientResp(totalCharges, insAdj);
    const paid = getPaid(p.id);
    const balance = patResp - paid;
    const flow = patientFlow?.[p.id];
    const dcInfo = flow?.dischargeInfo;
    const hasDischarge = !!dcInfo || p.status==="Discharged";
    return { ...p, charges, totalCharges, insAdj, patResp, paid, balance, dcInfo, hasDischarge, claimStatus: balance<=0?"Paid":totalCharges===0?"No Charges":hasDischarge?"Ready to Bill":"In Progress" };
  });

  const claimStatusColor = { Paid:"#00d68f", "Ready to Bill":"#ffb800", "In Progress":"#8b5cf6", "No Charges":"#4a6080", Submitted:"#00c8e0", Denied:"#ff4757" };
  const totalAR = allAccounts.reduce((s,a)=>s+Math.max(a.balance,0),0);
  const selAcct = allAccounts.find(a=>a.id===selPat);

  const inp = {width:"100%",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:5,padding:"7px 10px",color:"var(--text)",fontSize:13,outline:"none"};

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{background:"var(--card)",borderBottom:"1px solid var(--border)",padding:"0 20px",display:"flex",alignItems:"center",height:48,flexShrink:0}}>
        <div style={{marginRight:20}}><div style={{fontSize:14,fontWeight:700}}>Billing & Revenue Cycle</div><div style={{fontSize:10,color:"var(--text-3)"}}>Charges, Claims & Patient Accounts</div></div>
        {[["accounts","Accounts"],["charges","Charge Detail"],["claims","Claims"],["summary","Summary"]].map(([id,label])=>(
          <button key={id} onClick={()=>{setTab(id);if(id!=="charges")setSelPat(null);}} style={{height:48,padding:"0 16px",background:"none",border:"none",borderBottom:`2px solid ${tab===id?"var(--cyan)":"transparent"}`,color:tab===id?"var(--cyan)":"var(--text-2)",fontSize:13,fontWeight:tab===id?600:400,cursor:"pointer",marginBottom:-1}}>{label}</button>
        ))}
        <div style={{marginLeft:"auto",fontSize:12}}><span style={{color:"var(--text-3)"}}>Total A/R: </span><strong style={{color:"var(--amber)"}}>${totalAR.toFixed(2)}</strong></div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",background:"var(--card-2)",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        {[["Total Charges",`$${allAccounts.reduce((s,a)=>s+a.totalCharges,0).toFixed(0)}`,"#4a7fee"],["Insurance Adj",`-$${allAccounts.reduce((s,a)=>s+a.insAdj,0).toFixed(0)}`,"#ff4757"],["Patient Resp",`$${allAccounts.reduce((s,a)=>s+a.patResp,0).toFixed(0)}`,"#ffb800"],["Total Paid",`$${allAccounts.reduce((s,a)=>s+a.paid,0).toFixed(0)}`,"#00d68f"],["A/R Balance",`$${totalAR.toFixed(0)}`,"#ffb800"]].map(([label,val,color],i)=>(
          <div key={label} style={{padding:"9px 0",textAlign:"center",borderRight:i<4?"1px solid var(--border)":"none"}}>
            <div style={{fontSize:18,fontWeight:700,color}}>{val}</div>
            <div style={{fontSize:10,color:"var(--text-3)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",marginTop:2}}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{flex:1,overflowY:"auto"}}>

        {/* ACCOUNTS */}
        {tab==="accounts"&&(
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:"var(--card-2)",borderBottom:"1px solid var(--border)",position:"sticky",top:0}}>
              {["","Patient","MRN","Insurance","Total Charges","Ins Adj","Patient Resp","Paid","Balance","Claim Status","Actions"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap"}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {allAccounts.map((a,i)=>{
                const sc = claimStatusColor[a.claimStatus]||"#8b5cf6";
                return (
                  <tr key={a.id} style={{borderBottom:"1px solid var(--border-2)"}} onMouseEnter={e=>e.currentTarget.style.background="#1e3a5f15"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"10px 8px"}}><div style={{width:3,height:36,borderRadius:2,background:sc}}/></td>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{a.name.split(" ").map(n=>n[0]).join("")}</div>
                        <div><div style={{fontSize:13,fontWeight:700,cursor:"pointer",color:"var(--cyan)"}} onClick={()=>onPatient(a)}>{a.name}</div><div style={{fontSize:10,color:"var(--text-3)"}}>{a.diagnosis}</div></div>
                      </div>
                    </td>
                    <td style={{padding:"10px 12px",fontSize:11,color:"var(--cyan)",fontFamily:"monospace"}}>{a.mrn}</td>
                    <td style={{padding:"10px 12px",fontSize:11,color:"var(--text-2)"}}>{a.insurance}</td>
                    <td style={{padding:"10px 12px",fontSize:13,fontWeight:600}}>${a.totalCharges.toFixed(2)}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:"var(--red)"}}>-${a.insAdj.toFixed(2)}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:"var(--amber)"}}>${a.patResp.toFixed(2)}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:"var(--green)"}}>${a.paid.toFixed(2)}</td>
                    <td style={{padding:"10px 12px"}}><span style={{fontSize:13,fontWeight:700,color:a.balance>0?"var(--red)":"var(--green)"}}>${Math.max(a.balance,0).toFixed(2)}</span></td>
                    <td style={{padding:"10px 12px"}}><span style={{background:sc+"18",color:sc,border:`1px solid ${sc}35`,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{a.claimStatus}</span></td>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>{setSelPat(a.id);setTab("charges");}} style={{padding:"3px 8px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:3,color:"var(--text-2)",fontSize:11,cursor:"pointer"}}>Detail</button>
                        {a.claimStatus==="Ready to Bill"&&<button style={{padding:"3px 8px",background:"var(--green-dim)",border:"1px solid var(--green)40",borderRadius:3,color:"var(--green)",fontSize:11,fontWeight:600,cursor:"pointer"}}>Submit</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* CHARGE DETAIL */}
        {tab==="charges"&&(
          <div>
            <div style={{display:"flex",gap:8,padding:"10px 20px",background:"var(--card-2)",borderBottom:"1px solid var(--border)",flexWrap:"wrap"}}>
              <button onClick={()=>{setSelPat(null);}} style={{padding:"3px 10px",background:!selPat?"var(--blue)":"var(--navy-2)",border:`1px solid ${!selPat?"var(--blue)":"var(--border)"}`,borderRadius:4,color:!selPat?"#fff":"var(--text-2)",fontSize:11,cursor:"pointer"}}>All</button>
              {PATIENTS.map(p=><button key={p.id} onClick={()=>setSelPat(p.id)} style={{padding:"3px 10px",background:selPat===p.id?"var(--blue)":"var(--navy-2)",border:`1px solid ${selPat===p.id?"var(--blue)":"var(--border)"}`,borderRadius:4,color:selPat===p.id?"#fff":"var(--text-2)",fontSize:11,cursor:"pointer"}}>{p.name.split(" ")[1]}</button>)}
            </div>
            {(selPat?allAccounts.filter(a=>a.id===selPat):allAccounts).map(a=>(
              <div key={a.id} style={{margin:"16px 20px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden"}}>
                <div style={{background:"var(--navy-2)",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{fontSize:14,fontWeight:700}}>{a.name}</div>
                    <span style={{fontSize:11,color:"var(--text-3)",fontFamily:"monospace"}}>{a.mrn}</span>
                    <span style={{fontSize:11,color:"var(--text-2)"}}>{a.insurance}</span>
                  </div>
                  <div style={{display:"flex",gap:16,fontSize:12}}>
                    <span>Total: <strong style={{color:"var(--text)"}}>${a.totalCharges.toFixed(2)}</strong></span>
                    <span>Adj: <strong style={{color:"var(--red)"}}>-${a.insAdj.toFixed(2)}</strong></span>
                    <span>Balance: <strong style={{color:a.balance>0?"var(--amber)":"var(--green)"}}>${Math.max(a.balance,0).toFixed(2)}</strong></span>
                  </div>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead><tr style={{background:"var(--card-2)"}}>
                    {["CPT","Description","Category","Qty","Unit Fee","Total","Date","Status"].map(h=><th key={h} style={{padding:"7px 12px",textAlign:"left",fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {a.charges.map((c,ci)=>{
                      const catColor = {Lab:"#00c8e0",Radiology:"#8b5cf6",Pharmacy:"#00d68f","E&M":"#4a7fee",Facility:"#ffb800"}[c.category]||"#4a6080";
                      return (
                        <tr key={c.id||ci} style={{borderTop:"1px solid var(--border-2)"}}>
                          <td style={{padding:"9px 12px",fontSize:11,color:"var(--cyan)",fontFamily:"monospace",fontWeight:700}}>{c.cpt}</td>
                          <td style={{padding:"9px 12px",fontSize:12,fontWeight:600}}>{c.desc}</td>
                          <td style={{padding:"9px 12px"}}><span style={{background:catColor+"18",color:catColor,borderRadius:3,padding:"1px 7px",fontSize:11,fontWeight:600}}>{c.category}</span></td>
                          <td style={{padding:"9px 12px",fontSize:13,textAlign:"center"}}>{c.qty}</td>
                          <td style={{padding:"9px 12px",fontSize:12,color:"var(--text-2)"}}>${c.unitFee.toFixed(2)}</td>
                          <td style={{padding:"9px 12px",fontSize:13,fontWeight:700}}>${c.total.toFixed(2)}</td>
                          <td style={{padding:"9px 12px",fontSize:11,color:"var(--text-3)",fontFamily:"monospace"}}>{fmtDate(c.date)}</td>
                          <td style={{padding:"9px 12px"}}><span style={{background:c.status==="Billed"?"var(--green-dim)":"var(--amber-dim)",color:c.status==="Billed"?"var(--green)":"var(--amber)",borderRadius:3,padding:"1px 7px",fontSize:11,fontWeight:600}}>{c.status||"Pending"}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{background:"var(--navy-2)",borderTop:"2px solid var(--border)"}}>
                      <td colSpan={4} style={{padding:"10px 12px",fontSize:12,color:"var(--text-3)"}}>Total Charges</td>
                      <td style={{padding:"10px 12px",fontSize:14,fontWeight:700}}></td>
                      <td style={{padding:"10px 12px",fontSize:14,fontWeight:700,color:"var(--text)"}}>${a.totalCharges.toFixed(2)}</td>
                      <td colSpan={2}></td>
                    </tr>
                    <tr style={{background:"var(--navy-2)"}}>
                      <td colSpan={4} style={{padding:"6px 12px",fontSize:11,color:"var(--text-3)"}}>Insurance Adjustment (40%)</td>
                      <td/><td style={{padding:"6px 12px",fontSize:12,color:"var(--red)",fontWeight:700}}>-${a.insAdj.toFixed(2)}</td><td colSpan={2}/>
                    </tr>
                    <tr style={{background:"var(--navy-2)"}}>
                      <td colSpan={4} style={{padding:"6px 12px",fontSize:11,color:"var(--text-3)"}}>Patient Responsibility (20% of allowed)</td>
                      <td/><td style={{padding:"6px 12px",fontSize:12,color:"var(--amber)",fontWeight:700}}>${a.patResp.toFixed(2)}</td><td colSpan={2}/>
                    </tr>
                    <tr style={{background:"var(--navy-2)"}}>
                      <td colSpan={4} style={{padding:"6px 12px",fontSize:11,color:"var(--text-3)"}}>Paid</td>
                      <td/><td style={{padding:"6px 12px",fontSize:12,color:"var(--green)",fontWeight:700}}>${a.paid.toFixed(2)}</td><td colSpan={2}/>
                    </tr>
                    <tr style={{background:"var(--navy-3)"}}>
                      <td colSpan={4} style={{padding:"10px 12px",fontSize:13,fontWeight:700,color:"var(--text)"}}>Outstanding Balance</td>
                      <td/><td style={{padding:"10px 12px",fontSize:15,fontWeight:700,color:a.balance>0?"var(--amber)":"var(--green)"}}>${Math.max(a.balance,0).toFixed(2)}</td><td colSpan={2}/>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* CLAIMS */}
        {tab==="claims"&&(
          <div style={{padding:20}}>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              {["All","Ready to Bill","In Progress","Paid","Denied"].map(s=>(
                <button key={s} onClick={()=>setClaimFilter(s)} style={{padding:"5px 12px",background:claimFilter===s?"var(--blue)":"var(--navy-2)",border:`1px solid ${claimFilter===s?"var(--blue)":"var(--border)"}`,borderRadius:4,color:claimFilter===s?"#fff":"var(--text-2)",fontSize:12,cursor:"pointer"}}>{s}</button>
              ))}
            </div>
            {allAccounts.filter(a=>claimFilter==="All"||a.claimStatus===claimFilter).map(a=>{
              const sc = claimStatusColor[a.claimStatus]||"#8b5cf6";
              return (
                <div key={a.id} style={{background:"var(--card)",border:`1px solid ${sc}30`,borderLeft:`4px solid ${sc}`,borderRadius:8,padding:"14px 18px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4}}>
                      <span style={{fontSize:14,fontWeight:700}}>{a.name}</span>
                      <span style={{fontSize:11,color:"var(--text-3)",fontFamily:"monospace"}}>{a.mrn}</span>
                      <span style={{background:sc+"18",color:sc,border:`1px solid ${sc}35`,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:600}}>{a.claimStatus}</span>
                    </div>
                    <div style={{display:"flex",gap:16,fontSize:12,color:"var(--text-2)"}}>
                      <span>Insurance: {a.insurance}</span>
                      <span>Charges: <strong>${a.totalCharges.toFixed(2)}</strong></span>
                      <span>Patient Balance: <strong style={{color:a.balance>0?"var(--amber)":"var(--green)"}}>${Math.max(a.balance,0).toFixed(2)}</strong></span>
                      {a.hasDischarge&&<span style={{color:"var(--green)"}}>✓ Discharge complete</span>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,flexShrink:0}}>
                    <button onClick={()=>{setSelPat(a.id);setTab("charges");}} style={{padding:"5px 12px",background:"var(--navy-2)",border:"1px solid var(--border)",borderRadius:4,color:"var(--text-2)",fontSize:12,cursor:"pointer"}}>Charges</button>
                    {a.claimStatus==="Ready to Bill"&&<button style={{padding:"5px 12px",background:"var(--green)",border:"none",borderRadius:4,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer"}}>Submit Claim</button>}
                    {a.claimStatus==="In Progress"&&<button style={{padding:"5px 12px",background:"var(--amber-dim)",border:"1px solid var(--amber)40",borderRadius:4,color:"var(--amber)",fontSize:12,cursor:"pointer"}}>Pre-Auth</button>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SUMMARY */}
        {tab==="summary"&&(
          <div style={{padding:20}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
              {/* Category breakdown */}
              <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden"}}>
                <div style={{padding:"10px 16px",background:"var(--navy-2)",fontSize:13,fontWeight:700}}>Charges by Category</div>
                <div style={{padding:16}}>
                  {Object.entries(allAccounts.reduce((acc,a)=>{
                    a.charges.forEach(c=>{acc[c.category]=(acc[c.category]||0)+c.total;});return acc;
                  },{})).sort((a,b)=>b[1]-a[1]).map(([cat,total])=>{
                    const catColor = {Lab:"#00c8e0",Radiology:"#8b5cf6",Pharmacy:"#00d68f","E&M":"#4a7fee",Facility:"#ffb800",Other:"#4a6080"}[cat]||"#4a6080";
                    const max = Math.max(...Object.values(allAccounts.reduce((acc,a)=>{a.charges.forEach(c=>{acc[c.category]=(acc[c.category]||0)+c.total;});return acc;},{})));
                    return (
                      <div key={cat} style={{marginBottom:10}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}>
                          <span style={{color:"var(--text)"}}>{cat}</span>
                          <span style={{fontWeight:700}}>${total.toFixed(0)}</span>
                        </div>
                        <div style={{height:8,background:"var(--navy-2)",borderRadius:4,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${(total/max)*100}%`,background:catColor,borderRadius:4}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* AR aging */}
              <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden"}}>
                <div style={{padding:"10px 16px",background:"var(--navy-2)",fontSize:13,fontWeight:700}}>A/R Aging Buckets</div>
                <div style={{padding:16}}>
                  {[["0–30 Days",allAccounts.filter(a=>a.balance>0).reduce((s,a)=>s+a.balance*.6,0),"#00d68f"],["31–60 Days",allAccounts.filter(a=>a.balance>0).reduce((s,a)=>s+a.balance*.25,0),"#ffb800"],["61–90 Days",allAccounts.filter(a=>a.balance>0).reduce((s,a)=>s+a.balance*.1,0),"#ff8c00"],["90+ Days",allAccounts.filter(a=>a.balance>0).reduce((s,a)=>s+a.balance*.05,0),"#ff4757"]].map(([label,val,color])=>(
                    <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border-2)"}}>
                      <span style={{fontSize:13,color:"var(--text-2)"}}>{label}</span>
                      <span style={{fontSize:16,fontWeight:700,color}}>${val.toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderTop:"2px solid var(--border)",marginTop:4}}>
                    <span style={{fontSize:13,fontWeight:700}}>Total A/R</span>
                    <span style={{fontSize:18,fontWeight:700,color:"var(--amber)"}}>${totalAR.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient detail table */}
            <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,overflow:"hidden"}}>
              <div style={{padding:"10px 16px",background:"var(--navy-2)",fontSize:13,fontWeight:700}}>Patient Account Summary</div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"var(--card-2)"}}>
                  {["Patient","Insurance","Diagnosis","Total Charges","Ins Adj","Pat Resp","Paid","Balance"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {allAccounts.map((a,i)=>(
                    <tr key={a.id} style={{borderTop:"1px solid var(--border-2)"}} onMouseEnter={e=>e.currentTarget.style.background="#1e3a5f15"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"10px 12px"}}><div style={{fontSize:13,fontWeight:600,cursor:"pointer",color:"var(--cyan)"}} onClick={()=>onPatient(a)}>{a.name}</div><div style={{fontSize:10,color:"var(--text-3)",fontFamily:"monospace"}}>{a.mrn}</div></td>
                      <td style={{padding:"10px 12px",fontSize:11,color:"var(--text-2)"}}>{a.insurance?.split(" ")[0]}</td>
                      <td style={{padding:"10px 12px",fontSize:12,color:"var(--text-2)"}}>{a.diagnosis}</td>
                      <td style={{padding:"10px 12px",fontSize:13,fontWeight:700}}>${a.totalCharges.toFixed(2)}</td>
                      <td style={{padding:"10px 12px",fontSize:12,color:"var(--red)"}}>-${a.insAdj.toFixed(2)}</td>
                      <td style={{padding:"10px 12px",fontSize:12,color:"var(--amber)"}}>${a.patResp.toFixed(2)}</td>
                      <td style={{padding:"10px 12px",fontSize:12,color:"var(--green)"}}>${a.paid.toFixed(2)}</td>
                      <td style={{padding:"10px 12px",fontSize:13,fontWeight:700,color:a.balance>0?"var(--amber)":"var(--green)"}}>${Math.max(a.balance,0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [globalAppts, setGlobalAppts] = useState(APPOINTMENTS);
  const [patientFlow, setPatientFlow] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isMobile } = useIsMobile();

  // Listen for "More" button events from bottom nav
  useEffect(() => {
    const handler = () => setDrawerOpen(true);
    document.addEventListener("openDrawer", handler);
    return () => document.removeEventListener("openDrawer", handler);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.classList.toggle("drawer-open", drawerOpen);
  }, [drawerOpen]);

  const handlePatient = (patient) => { setSelectedPatient(patient); setView("chart"); };
  const updateApptStatus = (apptId, newStatus) => {
    setGlobalAppts(prev => prev.map(a => a.id === apptId ? { ...a, status: newStatus } : a));
  };

  if (!user) return <><GlobalStyle /><Login onLogin={(u) => setUser(u)} /></>;

  return (
    <>
      <GlobalStyle />
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar
          active={view === "chart" ? "patients" : view}
          onNav={(v) => { setView(v); setSelectedPatient(null); }}
          user={user}
          mobileOpen={drawerOpen}
          onMobileClose={() => setDrawerOpen(false)}
        />
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Top header */}
          <div style={{ height: "var(--header-h)", background: "var(--card)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 16px", flexShrink: 0, gap: 10 }}>
            {/* Hamburger — mobile only */}
            {isMobile && (
              <button onClick={() => setDrawerOpen(true)} style={{ background: "none", border: "none", color: "var(--text-2)", fontSize: 20, padding: "4px 8px", display: "flex", alignItems: "center", flexShrink: 0 }}>
                ☰
              </button>
            )}
            {/* Logo — mobile */}
            {isMobile && (
              <div style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>MedCore <span style={{ color: "var(--cyan)" }}>EMR</span></div>
            )}
            {/* Search — hidden on mobile */}
            <div className="header-search" style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 12px", width: 240 }}>
                <Icon name="search" size={13} />
                <input placeholder="Search patients, orders..." style={{ background: "transparent", border: "none", color: "var(--text)", fontSize: 13, outline: "none", width: "100%" }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
              <div className="header-status" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)" }} />
                <span style={{ fontSize: 12, color: "var(--text-2)" }}>Online</span>
                <div style={{ width: 1, height: 18, background: "var(--border)" }} />
                <span style={{ fontSize: 12, color: "var(--text-2)", textTransform: "capitalize" }}>{user.role}: <strong style={{ color: "var(--text)" }}>{user.username}</strong></span>
              </div>
              <button onClick={() => setUser(null)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "var(--navy-2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", fontSize: 12 }}>
                <Icon name="logout" size={12} /><span className="header-status">Logout</span>
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="main-content-area" style={{ flex: 1, overflow: "auto" }}>
            {view === "chart" && selectedPatient && <PatientChart patient={selectedPatient} user={user} onBack={() => { setSelectedPatient(null); setView("patients"); }} />}
            {view === "dashboard" && <Dashboard onNav={setView} onPatient={handlePatient} />}
            {view === "patients" && <PatientList onPatient={handlePatient} />}
            {view === "emergency" && <EmergencyRoom patientFlow={patientFlow} setPatientFlow={setPatientFlow} />}
            {view === "scheduling" && <Scheduling appointments={globalAppts} setAppointments={setGlobalAppts} />}
            {view === "ambulatory" && <Ambulatory onPatient={handlePatient} appointments={globalAppts} onUpdateAppt={updateApptStatus} onAddAppt={(a) => setGlobalAppts(prev => [...prev, a])} patientFlow={patientFlow} setPatientFlow={setPatientFlow} />}
            {view === "inpatient" && <Inpatient onPatient={handlePatient} patientFlow={patientFlow} setPatientFlow={setPatientFlow} />}
            {view === "pharmacy" && <Pharmacy patientFlow={patientFlow} setPatientFlow={setPatientFlow} appointments={globalAppts} />}
            {view === "laboratory" && <Laboratory patientFlow={patientFlow} setPatientFlow={setPatientFlow} />}
            {view === "radiology" && <RadiologyDept patientFlow={patientFlow} setPatientFlow={setPatientFlow} />}
            {view === "notes" && <NotesDept onPatient={handlePatient} patientFlow={patientFlow} setPatientFlow={setPatientFlow} />}
            {view === "discharge" && <Discharge onPatient={handlePatient} patientFlow={patientFlow} setPatientFlow={setPatientFlow} />}
            {view === "billing" && <BillingDept onPatient={handlePatient} patientFlow={patientFlow} />}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── EMERGENCY ROOM (CERNER FIRSTNET STYLE) ───────────────────────────────────

// FirstNet color palette — distinct from the rest of the app
const FN = {
  bg:       "#0e1117",
  panel:    "#161b27",
  panel2:   "#1c2336",
  border:   "#253352",
  border2:  "#1a2540",
  text:     "#d4ddf5",
  text2:    "#7a8fb5",
  text3:    "#3d5080",
  red:      "#e5343a",
  redDim:   "#e5343a22",
  orange:   "#f07d2a",
  orangeDim:"#f07d2a20",
  yellow:   "#e8c53a",
  yellowDim:"#e8c53a18",
  green:    "#2ec87a",
  greenDim: "#2ec87a18",
  blue:     "#1f6bea",
  blueDim:  "#1f6bea18",
  teal:     "#0fb8c9",
  tealDim:  "#0fb8c918",
  purple:   "#9b6af4",
  purpleDim:"#9b6af420",
  gray:     "#2d3a52",
  accentBar:"#1f6bea",
};

// ESI triage levels — Cerner color scheme
const ESI = {
  1: { label:"ESI 1 — Resuscitation",  color:"#e5343a", bg:"#e5343a22", short:"ESI 1" },
  2: { label:"ESI 2 — Emergent",        color:"#f07d2a", bg:"#f07d2a20", short:"ESI 2" },
  3: { label:"ESI 3 — Urgent",          color:"#e8c53a", bg:"#e8c53a18", short:"ESI 3" },
  4: { label:"ESI 4 — Less Urgent",     color:"#2ec87a", bg:"#2ec87a18", short:"ESI 4" },
  5: { label:"ESI 5 — Non-urgent",      color:"#0fb8c9", bg:"#0fb8c918", short:"ESI 5" },
};

const ER_CHIEF_COMPLAINTS = [
  "Chest Pain","Shortness of Breath","Abdominal Pain","Headache","Altered Mental Status",
  "Fever / Sepsis","Stroke / Neuro Deficits","Trauma / Fall","Back Pain","Syncope / Pre-syncope",
  "Nausea / Vomiting","Palpitations","Leg Pain / Swelling","Wound / Laceration","Psychiatric Emergency",
  "Overdose / Toxicology","Allergic Reaction / Anaphylaxis","Urinary Symptoms","GI Bleed","Seizure",
  "Eye Complaint","Ear / Nose / Throat","Skin / Rash","Pediatric Fever","Obstetric / GYN Emergency",
];

const ER_PROVIDERS = [
  "Dr. Marcus Osei", "Dr. Alicia Vega", "Dr. Thomas Brennan", "Dr. Priya Kapoor",
  "Dr. DeShawn Williams","Dr. Mei Zhang","NP Sandra Ruiz","PA Kevin Holloway",
];

const ER_NURSES = [
  "RN A. Mitchell","RN C. Dawson","RN F. Okafor","RN T. Nguyen",
  "RN M. Torres","RN J. Steele",
];

const ER_ROOMS = [
  { id:"T1",  label:"Trauma 1",    type:"trauma",    bay:true  },
  { id:"T2",  label:"Trauma 2",    type:"trauma",    bay:true  },
  { id:"R1",  label:"Room 1",      type:"resus",     bay:true  },
  { id:"R2",  label:"Room 2",      type:"room",      bay:false },
  { id:"R3",  label:"Room 3",      type:"room",      bay:false },
  { id:"R4",  label:"Room 4",      type:"room",      bay:false },
  { id:"R5",  label:"Room 5",      type:"room",      bay:false },
  { id:"R6",  label:"Room 6",      type:"room",      bay:false },
  { id:"R7",  label:"Room 7",      type:"room",      bay:false },
  { id:"R8",  label:"Room 8",      type:"room",      bay:false },
  { id:"F1",  label:"Fast Track 1",type:"fasttrack", bay:false },
  { id:"F2",  label:"Fast Track 2",type:"fasttrack", bay:false },
  { id:"F3",  label:"Fast Track 3",type:"fasttrack", bay:false },
  { id:"WR",  label:"Waiting Rm",  type:"waiting",   bay:false },
];

const ER_ROOM_TYPE_COLOR = {
  trauma:    FN.red,
  resus:     FN.orange,
  room:      FN.blue,
  fasttrack: FN.teal,
  waiting:   FN.gray,
};

// Initial ER patient seed data
const INITIAL_ER_PATIENTS = [
  { id:"ER001", name:"Harold Stevens",  dob:"1948-04-12", gender:"M", mrn:"ER-2025-001", phone:"555-8801", insurance:"Medicare",    allergies:["Penicillin"],  chiefComplaint:"Chest Pain",           esi:2, arrivalTime:"08:14", room:"R1",  provider:"Dr. Marcus Osei",   nurse:"RN A. Mitchell", status:"With Provider",  disposition:null,     los:47,  vitals:{ bp:"162/98", hr:108, temp:98.6, spo2:95, rr:20,  pain:7 }, criticalFlags:["Troponin Pending","ECG Done"], orders:[], notes:[] },
  { id:"ER002", name:"Keisha Thompson", dob:"1989-11-22", gender:"F", mrn:"ER-2025-002", phone:"555-8802", insurance:"Aetna",       allergies:[],              chiefComplaint:"Abdominal Pain",        esi:3, arrivalTime:"08:42", room:"R4",  provider:"Dr. Alicia Vega",   nurse:"RN C. Dawson",   status:"Labs Pending",   disposition:null,     los:29,  vitals:{ bp:"118/72", hr:94,  temp:99.1, spo2:99, rr:16,  pain:6 }, criticalFlags:[], orders:[], notes:[] },
  { id:"ER003", name:"Walter Gomez",    dob:"1955-07-30", gender:"M", mrn:"ER-2025-003", phone:"555-8803", insurance:"Cigna",       allergies:["Sulfa","Latex"],chiefComplaint:"Shortness of Breath",  esi:2, arrivalTime:"09:05", room:"T1",  provider:"Dr. Thomas Brennan",nurse:"RN F. Okafor",   status:"Resuscitation",  disposition:null,     los:20,  vitals:{ bp:"88/52",  hr:132, temp:101.8,spo2:84, rr:32,  pain:9 }, criticalFlags:["CRITICAL SpO2","Sepsis Protocol"], orders:[], notes:[] },
  { id:"ER004", name:"Brittany Lee",    dob:"1996-03-18", gender:"F", mrn:"ER-2025-004", phone:"555-8804", insurance:"BlueCross",   allergies:[],              chiefComplaint:"Headache",             esi:3, arrivalTime:"09:20", room:"R6",  provider:"Dr. Priya Kapoor",  nurse:"RN T. Nguyen",   status:"Imaging",        disposition:null,     los:15,  vitals:{ bp:"138/86", hr:82,  temp:98.4, spo2:99, rr:14,  pain:8 }, criticalFlags:["CT Head Ordered"], orders:[], notes:[] },
  { id:"ER005", name:"Arnold Petrov",   dob:"1938-12-01", gender:"M", mrn:"ER-2025-005", phone:"555-8805", insurance:"Medicare",    allergies:["Codeine"],     chiefComplaint:"Altered Mental Status",esi:1, arrivalTime:"07:55", room:"T2",  provider:"Dr. Marcus Osei",   nurse:"RN A. Mitchell", status:"Resuscitation",  disposition:null,     los:60,  vitals:{ bp:"200/120",hr:58,  temp:102.4,spo2:88, rr:28,  pain:null}, criticalFlags:["STROKE ALERT","BP Critical","SpO2 Low"], orders:[], notes:[] },
  { id:"ER006", name:"Janelle Morris",  dob:"1975-08-09", gender:"F", mrn:"ER-2025-006", phone:"555-8806", insurance:"United",      allergies:[],              chiefComplaint:"Fever",                esi:3, arrivalTime:"09:50", room:"R7",  provider:"Dr. DeShawn Williams",nurse:"RN M. Torres",  status:"Waiting Results",disposition:null,     los:10,  vitals:{ bp:"126/78", hr:101, temp:103.2,spo2:97, rr:18,  pain:4 }, criticalFlags:["High Fever"], orders:[], notes:[] },
  { id:"ER007", name:"Carmen Ruiz",     dob:"2001-05-14", gender:"F", mrn:"ER-2025-007", phone:"555-8807", insurance:"Medicaid",    allergies:[],              chiefComplaint:"Laceration",           esi:4, arrivalTime:"10:10", room:"F1",  provider:"NP Sandra Ruiz",    nurse:"RN J. Steele",   status:"Treatment",      disposition:null,     los:5,   vitals:{ bp:"112/68", hr:76,  temp:98.2, spo2:100,rr:14,  pain:3 }, criticalFlags:[], orders:[], notes:[] },
  { id:"ER008", name:"Oliver Banks",    dob:"1963-02-28", gender:"M", mrn:"ER-2025-008", phone:"555-8808", insurance:"Aetna",       allergies:["Aspirin"],     chiefComplaint:"Back Pain",            esi:4, arrivalTime:"10:22", room:"F2",  provider:"PA Kevin Holloway",  nurse:"RN J. Steele",   status:"Waiting Triage", disposition:null,     los:3,   vitals:{ bp:"128/80", hr:80,  temp:98.6, spo2:99, rr:16,  pain:5 }, criticalFlags:[], orders:[], notes:[] },
  { id:"ER009", name:"Dorothy Chang",   dob:"1929-09-17", gender:"F", mrn:"ER-2025-009", phone:"555-8809", insurance:"Medicare",    allergies:[],              chiefComplaint:"Fall / Trauma",        esi:2, arrivalTime:"10:31", room:"WR",  provider:null,                nurse:null,             status:"Waiting Triage", disposition:null,     los:2,   vitals:{ bp:"150/90", hr:88,  temp:98.6, spo2:96, rr:18,  pain:6 }, criticalFlags:["Hip Fracture Concern"], orders:[], notes:[] },
];

const ER_STATUS_COLOR = {
  "Waiting Triage": FN.gray,
  "Triaged":        FN.yellow,
  "Waiting Bed":    FN.orange,
  "In Room":        FN.blue,
  "With Provider":  FN.teal,
  "Resuscitation":  FN.red,
  "Labs Pending":   FN.purple,
  "Imaging":        FN.purple,
  "Waiting Results":FN.yellow,
  "Treatment":      FN.blue,
  "Ready DC":       FN.green,
  "Admitted":       FN.orange,
  "Discharged":     FN.green,
  "AMA":            FN.red,
  "LWBS":           FN.gray,
};

const ER_DISPOSITIONS = ["Home","Admit — Med/Surg","Admit — ICU","Admit — PCU","Admit — Obs","Transfer Out","AMA","LWBS","Expired","Left without Triage"];

const ER_ORDERS = {
  Labs: ["ECG","CBC with Diff","BMP","CMP","Troponin I","BNP","D-Dimer","Lactate","Blood Culture x2","Urinalysis","Urine Culture","PT/INR/aPTT","Lipase","LFTs","Procalcitonin","COVID-19 PCR","Pregnancy Test","Urine Drug Screen","Acetaminophen Level","Salicylate Level"],
  Radiology: ["Chest XR Portable","Chest CT w/o Contrast","Chest CT PE Protocol","CT Head w/o Contrast","CT Abd/Pelvis w Contrast","CT C-Spine w/o Contrast","XR Pelvis","XR Extremity","Bedside Echo","CT Angio Brain","MRI Brain w/o","Abdominal US","FAST Exam"],
  Medications: ["Normal Saline 1L IV Bolus","NS 0.9% @ 125 mL/hr","Morphine 4mg IV PRN","Hydromorphone 0.5mg IV PRN","Fentanyl 50mcg IV","Ondansetron 4mg IV","Lorazepam 2mg IV","Aspirin 325mg PO","Nitroglycerin 0.4mg SL","Metoprolol 5mg IV","Labetalol 20mg IV","Ceftriaxone 1g IV","Piperacillin-Tazobactam 3.375g IV","Vancomycin 25mg/kg IV","Methylprednisolone 125mg IV","Diphenhydramine 50mg IV","Epinephrine 0.3mg IM","tPA (Alteplase) — Stroke Protocol","Heparin Drip — Protocol","Insulin Regular — Protocol"],
  Procedures: ["IV Access — Peripheral","IV Access — Central Line","Foley Catheter","Nasogastric Tube","Urethral Catheter","Laceration Repair","I&D Abscess","Arterial Line","Lumbar Puncture","Paracentesis","Thoracentesis","Intubation RSI","Cardioversion","Chest Tube","Pericardiocentesis","Splint Application"],
  Nursing: ["Continuous Cardiac Monitor","Continuous Pulse Ox","Vital Signs Q15min","Vital Signs Q1H","O2 to maintain SpO2 >94%","2 Large-bore IVs","Strict I&O","NPO","Urinary Catheter Care","Fall Precautions","Aspiration Precautions","Isolation — Contact","Isolation — Droplet","Restraint Order","Code Team Notification","Suicide Precautions"],
};

const ER_PROTOCOLS = [
  { name:"Chest Pain / ACS Protocol",     icon:"❤️",  color:FN.red,    orders:["ECG","Troponin I","CBC with Diff","BMP","Chest XR Portable","Aspirin 325mg PO","Continuous Cardiac Monitor","IV Access — Peripheral"] },
  { name:"Sepsis Bundle (qSOFA ≥2)",       icon:"🦠",  color:FN.orange, orders:["Blood Culture x2","Lactate","CBC with Diff","BMP","Procalcitonin","Normal Saline 1L IV Bolus","Ceftriaxone 1g IV","Vital Signs Q1H"] },
  { name:"Stroke Alert",                   icon:"🧠",  color:FN.purple, orders:["CT Head w/o Contrast","CT Angio Brain","CBC with Diff","PT/INR/aPTT","BMP","Chest XR Portable","Continuous Cardiac Monitor","IV Access — Peripheral"] },
  { name:"Trauma Activation",             icon:"🚨",  color:FN.red,    orders:["CT Head w/o Contrast","CT C-Spine w/o Contrast","CT Abd/Pelvis w Contrast","FAST Exam","CBC with Diff","BMP","PT/INR/aPTT","Blood Culture x2"] },
  { name:"Anaphylaxis Protocol",           icon:"⚠️",  color:FN.orange, orders:["Epinephrine 0.3mg IM","Diphenhydramine 50mg IV","Methylprednisolone 125mg IV","Normal Saline 1L IV Bolus","Continuous Cardiac Monitor","O2 to maintain SpO2 >94%"] },
  { name:"Altered Mental Status",          icon:"🧩",  color:FN.yellow, orders:["CT Head w/o Contrast","BMP","CBC with Diff","Urinalysis","Urine Drug Screen","Acetaminophen Level","Salicylate Level","Blood Culture x2"] },
];

// Triage form for new arrivals
const TriageModal = ({ onClose, onAdmit }) => {
  const [form, setForm] = useState({ name:"", dob:"", gender:"M", mrn:"", phone:"", insurance:"", allergies:"", chiefComplaint:"", esi:3, arrivalMode:"Walk-in", room:"", provider:"", nurse:"" });
  const inp = { width:"100%", background:FN.panel2, border:`1px solid ${FN.border}`, borderRadius:4, padding:"7px 10px", color:FN.text, fontSize:12, outline:"none", fontFamily:"'IBM Plex Sans',sans-serif" };
  const lbl = { fontSize:10, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:3, display:"block" };

  const handleSubmit = () => {
    if (!form.name || !form.chiefComplaint) return;
    const newPt = {
      id: "ER_" + Date.now(),
      name: form.name, dob: form.dob, gender: form.gender,
      mrn: form.mrn || "ER-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random()*900)+100),
      phone: form.phone, insurance: form.insurance,
      allergies: form.allergies ? form.allergies.split(",").map(a=>a.trim()).filter(Boolean) : [],
      chiefComplaint: form.chiefComplaint,
      esi: parseInt(form.esi), arrivalTime: new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false}),
      room: form.room || "WR", provider: form.provider || null, nurse: form.nurse || null,
      status: form.room ? "In Room" : "Waiting Triage",
      disposition: null, los: 0,
      vitals: { bp:"", hr:"", temp:"", spo2:"", rr:"", pain:"" },
      criticalFlags: [], orders: [], notes: [],
      arrivalMode: form.arrivalMode,
    };
    onAdmit(newPt);
    onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:FN.panel, border:`1px solid ${FN.border}`, borderRadius:8, width:700, maxHeight:"90vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 20px 60px rgba(0,0,0,0.7)" }}>
        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#6b0000,#b01c1c)", padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#fff" }}>🚨 Register New ER Patient</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)", marginTop:2 }}>Emergency Registration & Triage</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:4, color:"#fff", padding:"4px 12px", cursor:"pointer", fontSize:13 }}>✕</button>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:20 }}>
          {/* ESI selection — prominent */}
          <div style={{ marginBottom:18 }}>
            <label style={lbl}>ESI Triage Level *</label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
              {[1,2,3,4,5].map(n=>{
                const e = ESI[n];
                const active = parseInt(form.esi)===n;
                return (
                  <button key={n} onClick={()=>setForm(f=>({...f,esi:n}))}
                    style={{ padding:"12px 8px", background:active?e.bg:"transparent", border:`2px solid ${active?e.color:FN.border}`, borderRadius:6, color:active?e.color:FN.text3, fontSize:11, fontWeight:700, cursor:"pointer", textAlign:"center", lineHeight:1.4 }}>
                    <div style={{ fontSize:20, fontWeight:900, color:active?e.color:FN.text3 }}>{n}</div>
                    <div>{["Resuscitate","Emergent","Urgent","Less Urgent","Non-Urgent"][n-1]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Patient Info */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 80px", gap:12, marginBottom:12 }}>
            <div><label style={lbl}>Patient Name *</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Last, First Middle" style={inp}/></div>
            <div><label style={lbl}>Date of Birth</label><input type="date" value={form.dob} onChange={e=>setForm(f=>({...f,dob:e.target.value}))} style={inp}/></div>
            <div><label style={lbl}>Sex</label><select value={form.gender} onChange={e=>setForm(f=>({...f,gender:e.target.value}))} style={inp}><option value="M">M</option><option value="F">F</option><option value="X">X</option></select></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div><label style={lbl}>Phone</label><input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="555-0000" style={inp}/></div>
            <div><label style={lbl}>Insurance / Payer</label><input value={form.insurance} onChange={e=>setForm(f=>({...f,insurance:e.target.value}))} placeholder="Insurance name or Self-pay" style={inp}/></div>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={lbl}>Allergies (comma-separated)</label>
            <input value={form.allergies} onChange={e=>setForm(f=>({...f,allergies:e.target.value}))} placeholder="e.g. Penicillin, Sulfa, Latex or NKDA" style={inp}/>
          </div>

          {/* Chief complaint */}
          <div style={{ marginBottom:12 }}>
            <label style={lbl}>Chief Complaint *</label>
            <select value={form.chiefComplaint} onChange={e=>setForm(f=>({...f,chiefComplaint:e.target.value}))} style={inp}>
              <option value="">— Select chief complaint —</option>
              {ER_CHIEF_COMPLAINTS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Logistics */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
            <div><label style={lbl}>Arrival Mode</label><select value={form.arrivalMode} onChange={e=>setForm(f=>({...f,arrivalMode:e.target.value}))} style={inp}>{["Walk-in","EMS / Ambulance","Police","Helicopter","Transfer In","Walk-in with Family"].map(o=><option key={o}>{o}</option>)}</select></div>
            <div><label style={lbl}>Assign Room</label><select value={form.room} onChange={e=>setForm(f=>({...f,room:e.target.value}))} style={inp}><option value="">Waiting Room</option>{ER_ROOMS.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}</select></div>
            <div><label style={lbl}>Assign Provider</label><select value={form.provider} onChange={e=>setForm(f=>({...f,provider:e.target.value}))} style={inp}><option value="">— Unassigned —</option>{ER_PROVIDERS.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
            <div><label style={lbl}>Assign Nurse</label><select value={form.nurse} onChange={e=>setForm(f=>({...f,nurse:e.target.value}))} style={inp}><option value="">— Unassigned —</option>{ER_NURSES.map(n=><option key={n} value={n}>{n}</option>)}</select></div>
          </div>
        </div>

        <div style={{ padding:"12px 20px", borderTop:`1px solid ${FN.border}`, background:FN.panel2, display:"flex", gap:8, justifyContent:"flex-end", flexShrink:0 }}>
          <button onClick={onClose} style={{ padding:"8px 16px", background:FN.panel, border:`1px solid ${FN.border}`, borderRadius:4, color:FN.text2, fontSize:13, cursor:"pointer" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={!form.name||!form.chiefComplaint}
            style={{ padding:"8px 22px", background:form.name&&form.chiefComplaint?FN.red:"#3d1a1a", border:"none", borderRadius:4, color:form.name&&form.chiefComplaint?"#fff":"#6d3a3a", fontSize:13, fontWeight:700, cursor:form.name&&form.chiefComplaint?"pointer":"not-allowed" }}>
            🚨 Register Patient
          </button>
        </div>
      </div>
    </div>
  );
};

// Vitals modal
const VitalsModal = ({ patient, onClose, onSave }) => {
  const [v, setV] = useState({ bp:patient.vitals?.bp||"", hr:patient.vitals?.hr||"", temp:patient.vitals?.temp||"", spo2:patient.vitals?.spo2||"", rr:patient.vitals?.rr||"", pain:patient.vitals?.pain||"" });
  const inp = { width:"100%", background:FN.panel2, border:`1px solid ${FN.border}`, borderRadius:4, padding:"8px 10px", color:FN.text, fontSize:13, outline:"none", fontFamily:"'IBM Plex Sans',sans-serif" };
  const lbl = { fontSize:10, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4, display:"block" };
  const fields = [["Blood Pressure","bp","text","e.g. 120/80","mmHg"],["Heart Rate","hr","number","e.g. 88","bpm"],["Temperature","temp","number","e.g. 98.6","°F"],["SpO2","spo2","number","e.g. 98","%"],["Resp Rate","rr","number","e.g. 16","br/min"],["Pain","pain","number","0–10","/10"]];
  const isAbn = (field,val) => (field==="hr"&&val&&(val>100||val<60))||(field==="spo2"&&val&&val<95)||(field==="temp"&&val&&parseFloat(val)>100.4)||(field==="pain"&&val&&parseInt(val)>=7);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:FN.panel, border:`1px solid ${FN.border}`, borderRadius:8, width:440, boxShadow:"0 20px 60px rgba(0,0,0,0.7)" }}>
        <div style={{ background:FN.panel2, borderBottom:`1px solid ${FN.border}`, padding:"12px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", borderRadius:"8px 8px 0 0" }}>
          <div style={{ fontSize:14, fontWeight:700, color:FN.text }}>Record Vitals — {patient.name}</div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:FN.text2, fontSize:18, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:18, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
          {fields.map(([label,field,type,ph,unit])=>{
            const abn = isAbn(field,v[field]);
            return (
              <div key={field}>
                <label style={{...lbl, color:abn?FN.red:FN.text3}}>{label} <span style={{ fontWeight:400, color:FN.text3 }}>{unit}</span></label>
                <div style={{ position:"relative" }}>
                  <input type={type} value={v[field]} onChange={e=>setV(x=>({...x,[field]:type==="number"?parseFloat(e.target.value)||e.target.value:e.target.value}))} placeholder={ph}
                    style={{...inp, border:`1px solid ${abn?FN.red:FN.border}`, paddingRight:abn?28:10}}/>
                  {abn&&<span style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", color:FN.red, fontSize:12 }}>⚠</span>}
                </div>
                {abn&&<div style={{ fontSize:10, color:FN.red, marginTop:2 }}>Abnormal</div>}
              </div>
            );
          })}
        </div>
        {v.temp&&v.spo2&&v.hr&&<div style={{ margin:"0 18px 12px", padding:"8px 12px", background:FN.tealDim, border:`1px solid ${FN.teal}30`, borderRadius:4, fontSize:11, color:FN.teal }}>
          {[v.hr>100&&"Tachycardia",v.hr<60&&"Bradycardia",v.spo2<95&&"Hypoxia",parseFloat(v.temp)>100.4&&"Febrile",parseInt(v.pain)>=7&&"Severe Pain"].filter(Boolean).join(" · ")||"Vitals within acceptable range"}
        </div>}
        <div style={{ padding:"12px 18px", borderTop:`1px solid ${FN.border}`, display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ padding:"7px 14px", background:"transparent", border:`1px solid ${FN.border}`, borderRadius:4, color:FN.text2, fontSize:12, cursor:"pointer" }}>Cancel</button>
          <button onClick={()=>{onSave(v);onClose();}} style={{ padding:"7px 18px", background:FN.teal, border:"none", borderRadius:4, color:"#000", fontSize:12, fontWeight:700, cursor:"pointer" }}>✓ Save Vitals</button>
        </div>
      </div>
    </div>
  );
};

// Order entry panel for ER
const EROrderPanel = ({ patient, onClose, onPlaceOrder }) => {
  const [cat, setCat] = useState("Labs");
  const [sel, setSel] = useState([]);
  const [urgency, setUrgency] = useState("Routine");
  const [notes, setNotes] = useState("");
  const catColor = { Labs:FN.teal, Radiology:FN.purple, Medications:FN.green, Procedures:FN.orange, Nursing:FN.yellow };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:FN.panel, border:`1px solid ${FN.border}`, borderRadius:8, width:900, maxHeight:"88vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 20px 60px rgba(0,0,0,0.7)" }}>
        {/* Header */}
        <div style={{ background:FN.panel2, borderBottom:`1px solid ${FN.border}`, padding:"12px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:FN.text }}>📋 Place Orders — {patient.name}</div>
            <div style={{ fontSize:11, color:FN.text2 }}>{patient.mrn} · ESI {patient.esi} · {patient.chiefComplaint}</div>
          </div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:FN.text2, fontSize:18, cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          {/* Category tabs (left) */}
          <div style={{ width:140, background:FN.bg, borderRight:`1px solid ${FN.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
            {Object.keys(ER_ORDERS).map(c=>{
              const cc = catColor[c]||FN.blue;
              return (
                <button key={c} onClick={()=>{setCat(c);setSel([]);}} style={{ padding:"13px 12px", background:cat===c?cc+"18":"transparent", borderLeft:`3px solid ${cat===c?cc:"transparent"}`, border:"none", color:cat===c?cc:FN.text2, fontSize:12, fontWeight:cat===c?700:400, cursor:"pointer", textAlign:"left" }}>
                  {{"Labs":"🔬 Labs","Radiology":"🩻 Radiology","Medications":"💊 Medications","Procedures":"⚕️ Procedures","Nursing":"🩺 Nursing"}[c]}
                </button>
              );
            })}
          </div>

          {/* Order list (center) */}
          <div style={{ flex:1, overflowY:"auto", borderRight:`1px solid ${FN.border}` }}>
            <div style={{ padding:"8px 12px", background:FN.panel2, borderBottom:`1px solid ${FN.border}`, fontSize:11, color:FN.text3, fontStyle:"italic" }}>
              Click orders to select, then click "Place Selected Orders"
            </div>
            {(ER_ORDERS[cat]||[]).map(order=>{
              const selected = sel.includes(order);
              const cc = catColor[cat]||FN.blue;
              return (
                <div key={order} onClick={()=>setSel(s=>s.includes(order)?s.filter(x=>x!==order):[...s,order])}
                  style={{ padding:"10px 14px", cursor:"pointer", background:selected?cc+"18":"transparent", borderLeft:`3px solid ${selected?cc:"transparent"}`, borderBottom:`1px solid ${FN.border2}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}
                  onMouseEnter={e=>e.currentTarget.style.background=selected?cc+"18":FN.panel2}
                  onMouseLeave={e=>e.currentTarget.style.background=selected?cc+"18":"transparent"}>
                  <span style={{ fontSize:12, color:selected?cc:FN.text, fontWeight:selected?600:400 }}>{order}</span>
                  {selected&&<span style={{ color:cc, fontSize:14, fontWeight:700 }}>✓</span>}
                </div>
              );
            })}
          </div>

          {/* Selected orders + urgency (right) */}
          <div style={{ width:240, display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"10px 14px", background:FN.panel2, borderBottom:`1px solid ${FN.border}`, fontSize:11, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>Selected Orders ({sel.length})</div>
            <div style={{ flex:1, overflowY:"auto", padding:"8px 14px" }}>
              {sel.length===0&&<div style={{ fontSize:11, color:FN.text3, fontStyle:"italic", marginTop:8 }}>No orders selected</div>}
              {sel.map(o=>(
                <div key={o} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:`1px solid ${FN.border2}` }}>
                  <span style={{ fontSize:11, color:FN.text }}>{o}</span>
                  <button onClick={()=>setSel(s=>s.filter(x=>x!==o))} style={{ background:"none", border:"none", color:FN.text3, cursor:"pointer", fontSize:14, padding:"0 4px" }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ padding:"12px 14px", borderTop:`1px solid ${FN.border}`, flexShrink:0 }}>
              <div style={{ fontSize:10, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Urgency</div>
              <div style={{ display:"flex", gap:4, marginBottom:12 }}>
                {["Routine","STAT"].map(u=>(
                  <button key={u} onClick={()=>setUrgency(u)} style={{ flex:1, padding:"6px", background:urgency===u?(u==="STAT"?FN.red:FN.blue)+"25":"transparent", border:`1px solid ${urgency===u?(u==="STAT"?FN.red:FN.blue):FN.border}`, borderRadius:4, color:urgency===u?(u==="STAT"?FN.red:FN.blue):FN.text3, fontSize:11, fontWeight:700, cursor:"pointer" }}>{u}</button>
                ))}
              </div>
              <div style={{ fontSize:10, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Notes</div>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="Order notes..." style={{ width:"100%", background:FN.panel2, border:`1px solid ${FN.border}`, borderRadius:4, padding:"6px 8px", color:FN.text, fontSize:11, outline:"none", resize:"none", fontFamily:"'IBM Plex Sans',sans-serif" }}/>
            </div>
          </div>
        </div>

        <div style={{ padding:"12px 18px", borderTop:`1px solid ${FN.border}`, background:FN.panel2, display:"flex", gap:8, justifyContent:"flex-end", flexShrink:0 }}>
          <button onClick={onClose} style={{ padding:"8px 16px", background:"transparent", border:`1px solid ${FN.border}`, borderRadius:4, color:FN.text2, fontSize:12, cursor:"pointer" }}>Cancel</button>
          <button onClick={()=>{if(sel.length>0){onPlaceOrder(sel,urgency,cat,notes);onClose();}}} disabled={sel.length===0}
            style={{ padding:"8px 20px", background:sel.length>0?FN.blue:"#1a2a4a", border:"none", borderRadius:4, color:sel.length>0?"#fff":"#3d5080", fontSize:12, fontWeight:700, cursor:sel.length>0?"pointer":"not-allowed" }}>
            ✓ Place {sel.length||""} Order{sel.length!==1?"s":""}
          </button>
        </div>
      </div>
    </div>
  );
};

// Note entry for ER
const ERNoteModal = ({ patient, onClose, onSave }) => {
  const [type, setType] = useState("Triage Note");
  const [content, setContent] = useState("");
  const [provider, setProvider] = useState(patient.provider || ER_PROVIDERS[0]);
  const NOTE_TEMPLATES = {
    "Triage Note": `TRIAGE NOTE\n\nArrival Mode: ${patient.arrivalMode||"Walk-in"}\nTriage Time: ${patient.arrivalTime}\nESI Level: ${patient.esi} — ${ESI[patient.esi]?.label||""}\n\nChief Complaint: ${patient.chiefComplaint}\n\nInitial Vitals:\nBP: ${patient.vitals?.bp||"___"} HR: ${patient.vitals?.hr||"___"} Temp: ${patient.vitals?.temp||"___"}°F SpO2: ${patient.vitals?.spo2||"___"}% RR: ${patient.vitals?.rr||"___"} Pain: ${patient.vitals?.pain||"___"}/10\n\nAllergies: ${patient.allergies?.length>0?patient.allergies.join(", "):"NKDA"}\n\nBrief History:\n[Enter brief history here]\n\nTriage Assessment:\n[Assessment]\n\nPlan:\n[Initial plan]`,
    "Physician Note": `EMERGENCY PHYSICIAN NOTE\n\nDate/Time: ${new Date().toLocaleString()}\nProvider: ${patient.provider||"ED Physician"}\nPatient: ${patient.name} | DOB: ${patient.dob} | MRN: ${patient.mrn}\nESI: ${patient.esi}\n\nCHIEF COMPLAINT: ${patient.chiefComplaint}\n\nHISTORY OF PRESENT ILLNESS:\n[HPI]\n\nPMH: [Past medical history]\nPSH: [Past surgical history]\nMeds: [Current medications]\nAllergies: ${patient.allergies?.length>0?patient.allergies.join(", "):"NKDA"}\nSocial: [Tobacco/alcohol/drugs]\n\nREVIEW OF SYSTEMS:\n[ROS]\n\nPHYSICAL EXAMINATION:\nVitals: T ${patient.vitals?.temp||"___"} HR ${patient.vitals?.hr||"___"} BP ${patient.vitals?.bp||"___"} RR ${patient.vitals?.rr||"___"} SpO2 ${patient.vitals?.spo2||"___"}%\nGeneral: [Appearance]\nHEENT: [Findings]\nCV: [Findings]\nResp: [Findings]\nAbdomen: [Findings]\nNeuro: [Findings]\n\nMEDICAL DECISION MAKING:\n[Clinical reasoning]\n\nASSESSMENT:\n1. [Primary diagnosis]\n2. [Secondary]\n\nPLAN:\n1. [Orders/interventions]\n2. [Disposition]\n\nDISPOSITION: [Home/Admit/Transfer]\nCondition at disposition: [Stable/Improved]`,
    "Nursing Note": `NURSING NOTE\n\nTime: ${new Date().toLocaleTimeString()}\nNurse: ${patient.nurse||"RN"}\nPatient: ${patient.name}\n\nVitals: BP ${patient.vitals?.bp||"___"} HR ${patient.vitals?.hr||"___"} SpO2 ${patient.vitals?.spo2||"___"}%\n\nAssessment:\n[Nursing assessment]\n\nInterventions:\n- [IV access]\n- [Medications given]\n- [Other interventions]\n\nResponse:\n[Patient response to treatment]\n\nPlan:\n[Nursing plan]`,
    "Procedure Note": `PROCEDURE NOTE\n\nProcedure: [Name]\nIndication: [Clinical indication]\nOperator: ${patient.provider||"ED Physician"}\nAnesthesia: [Local/None/Conscious sedation]\nConsent: Obtained\n\nProcedure:\n[Describe procedure steps]\n\nFindings:\n[Findings during procedure]\n\nComplication:\nNone\n\nSpecimen:\n[If applicable]\n\nPost-procedure plan:\n[Plan]`,
  };
  const inp = { width:"100%", background:FN.panel2, border:`1px solid ${FN.border}`, borderRadius:4, padding:"7px 10px", color:FN.text, fontSize:12, outline:"none", fontFamily:"'IBM Plex Sans',sans-serif" };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:FN.panel, border:`1px solid ${FN.border}`, borderRadius:8, width:720, maxHeight:"90vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 20px 60px rgba(0,0,0,0.7)" }}>
        <div style={{ background:FN.panel2, borderBottom:`1px solid ${FN.border}`, padding:"12px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div style={{ fontSize:14, fontWeight:700, color:FN.text }}>📝 New Clinical Note — {patient.name}</div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:FN.text2, fontSize:18, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:"12px 18px", borderBottom:`1px solid ${FN.border}`, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, flexShrink:0 }}>
          <div><div style={{ fontSize:10, color:FN.text3, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Note Type</div><select value={type} onChange={e=>{setType(e.target.value);setContent(NOTE_TEMPLATES[e.target.value]||"");}} style={inp}>{Object.keys(NOTE_TEMPLATES).map(t=><option key={t} value={t}>{t}</option>)}</select></div>
          <div><div style={{ fontSize:10, color:FN.text3, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Author</div><select value={provider} onChange={e=>setProvider(e.target.value)} style={inp}>{[...ER_PROVIDERS,...ER_NURSES].map(p=><option key={p} value={p}>{p}</option>)}</select></div>
          <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
            <button onClick={()=>setContent(NOTE_TEMPLATES[type]||"")} style={{ padding:"7px 12px", background:FN.panel2, border:`1px solid ${FN.border}`, borderRadius:4, color:FN.text2, fontSize:11, cursor:"pointer", width:"100%" }}>Load Template</button>
          </div>
        </div>
        <div style={{ flex:1, padding:"12px 18px", overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <textarea value={content} onChange={e=>setContent(e.target.value)} style={{ flex:1, background:FN.panel2, border:`1px solid ${FN.border}`, borderRadius:4, padding:"10px 12px", color:FN.text, fontSize:12, outline:"none", resize:"none", lineHeight:1.7, fontFamily:"'IBM Plex Mono',monospace" }} placeholder="Enter clinical note content or load a template..."/>
        </div>
        <div style={{ padding:"12px 18px", borderTop:`1px solid ${FN.border}`, display:"flex", gap:8, justifyContent:"flex-end", flexShrink:0 }}>
          <button onClick={onClose} style={{ padding:"8px 14px", background:"transparent", border:`1px solid ${FN.border}`, borderRadius:4, color:FN.text2, fontSize:12, cursor:"pointer" }}>Cancel</button>
          <button onClick={()=>{if(content){onSave({id:"ERN_"+Date.now(),type,content,provider,time:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})});onClose();}}} style={{ padding:"8px 18px", background:FN.blue, border:"none", borderRadius:4, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>✓ Sign Note</button>
        </div>
      </div>
    </div>
  );
};

// Detail panel shown when a patient row is expanded
const ERPatientDetail = ({ patient, onUpdatePatient, onClose }) => {
  const [showOrders, setShowOrders] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  const esi = ESI[patient.esi]||ESI[3];
  const inp2 = { background:FN.panel2, border:`1px solid ${FN.border}`, borderRadius:4, padding:"5px 8px", color:FN.text, fontSize:12, outline:"none", fontFamily:"'IBM Plex Sans',sans-serif" };

  return (
    <div style={{ background:FN.panel2, borderBottom:`1px solid ${FN.border}`, borderLeft:`3px solid ${esi.color}`, padding:"16px 20px" }}>
      {showOrders&&<EROrderPanel patient={patient} onClose={()=>setShowOrders(false)} onPlaceOrder={(orders,urgency,cat,notes)=>{
        const newOrds = orders.map(o=>({id:"ERO_"+Date.now()+"_"+Math.random().toString(36).slice(2,6), name:o, category:cat, urgency, notes, status:"Ordered", time:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}));
        onUpdatePatient({...patient, orders:[...(patient.orders||[]),...newOrds]});
      }}/>}
      {showNote&&<ERNoteModal patient={patient} onClose={()=>setShowNote(false)} onSave={note=>onUpdatePatient({...patient,notes:[...(patient.notes||[]),note]})}/>}
      {showVitals&&<VitalsModal patient={patient} onClose={()=>setShowVitals(false)} onSave={v=>onUpdatePatient({...patient,vitals:v})}/>}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:16 }}>

        {/* Demographics */}
        <div>
          <div style={{ fontSize:10, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8, paddingBottom:4, borderBottom:`1px solid ${FN.border}` }}>Patient</div>
          {[["DOB",patient.dob?fmtDate(patient.dob):"—"],["Age/Sex",patient.dob?`${calcAge(patient.dob)}y ${patient.gender}`:"—"],["MRN",patient.mrn],["Phone",patient.phone||"—"],["Insurance",patient.insurance||"—"],["Arrival",patient.arrivalMode||"Walk-in"]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", gap:6, marginBottom:5, fontSize:12 }}>
              <span style={{ color:FN.text3, minWidth:60 }}>{k}</span>
              <span style={{ color:FN.text }}>{v}</span>
            </div>
          ))}
          {patient.allergies?.length>0?(
            <div style={{ background:FN.redDim, border:`1px solid ${FN.red}30`, borderRadius:4, padding:"5px 8px", fontSize:11, color:FN.red, marginTop:6, fontWeight:600 }}>⚠ {patient.allergies.join(", ")}</div>
          ):<div style={{ fontSize:11, color:FN.green, marginTop:6 }}>✓ NKDA</div>}
        </div>

        {/* Vitals */}
        <div>
          <div style={{ fontSize:10, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8, paddingBottom:4, borderBottom:`1px solid ${FN.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span>Vitals</span>
            <button onClick={()=>setShowVitals(true)} style={{ background:FN.teal+"18", border:`1px solid ${FN.teal}35`, borderRadius:3, color:FN.teal, fontSize:10, padding:"2px 7px", cursor:"pointer", fontWeight:600 }}>Update</button>
          </div>
          {[["BP",patient.vitals?.bp,"mmHg",false],["HR",patient.vitals?.hr,"bpm",patient.vitals?.hr>100||patient.vitals?.hr<60],["Temp",patient.vitals?.temp,"°F",parseFloat(patient.vitals?.temp)>100.4],["SpO2",patient.vitals?.spo2,"%",patient.vitals?.spo2<95],["RR",patient.vitals?.rr,"br/min",patient.vitals?.rr>20],["Pain",patient.vitals?.pain,"/10",patient.vitals?.pain>=7]].map(([k,v,u,abn])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:12 }}>
              <span style={{ color:FN.text3 }}>{k}</span>
              <span style={{ color:abn?FN.red:v?FN.text:FN.text3, fontWeight:abn?700:400 }}>{v?`${v} ${u}`:"—"}{abn?" ⚠":""}</span>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div>
          <div style={{ fontSize:10, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8, paddingBottom:4, borderBottom:`1px solid ${FN.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span>Orders ({patient.orders?.length||0})</span>
            <button onClick={()=>setShowOrders(true)} style={{ background:FN.blue+"18", border:`1px solid ${FN.blue}35`, borderRadius:3, color:FN.blue, fontSize:10, padding:"2px 7px", cursor:"pointer", fontWeight:600 }}>+ Order</button>
          </div>
          {(!patient.orders||patient.orders.length===0)&&<div style={{ fontSize:11, color:FN.text3, fontStyle:"italic" }}>No orders placed</div>}
          {(patient.orders||[]).slice(-6).map(o=>(
            <div key={o.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5, gap:8 }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:600, color:o.urgency==="STAT"?FN.orange:FN.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.urgency==="STAT"&&"⚡ "}{o.name}</div>
                <div style={{ fontSize:10, color:FN.text3 }}>{o.category} · {o.time}</div>
              </div>
              <span style={{ fontSize:10, fontWeight:600, background:o.status==="Resulted"?FN.greenDim:o.status==="Ordered"?FN.orangeDim:FN.panel, color:o.status==="Resulted"?FN.green:o.status==="Ordered"?FN.orange:FN.text3, borderRadius:3, padding:"1px 6px", flexShrink:0 }}>{o.status}</span>
            </div>
          ))}
          {(patient.orders||[]).length>6&&<div style={{ fontSize:10, color:FN.text3 }}>+{patient.orders.length-6} more</div>}
        </div>

        {/* Notes & Disposition */}
        <div>
          <div style={{ fontSize:10, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8, paddingBottom:4, borderBottom:`1px solid ${FN.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span>Notes ({patient.notes?.length||0})</span>
            <button onClick={()=>setShowNote(true)} style={{ background:FN.purpleDim, border:`1px solid ${FN.purple}35`, borderRadius:3, color:FN.purple, fontSize:10, padding:"2px 7px", cursor:"pointer", fontWeight:600 }}>+ Note</button>
          </div>
          {(!patient.notes||patient.notes.length===0)&&<div style={{ fontSize:11, color:FN.text3, fontStyle:"italic", marginBottom:10 }}>No notes</div>}
          {(patient.notes||[]).slice(-3).map(n=>(
            <div key={n.id} style={{ background:FN.panel, border:`1px solid ${FN.border}`, borderRadius:4, padding:"6px 8px", marginBottom:6 }}>
              <div style={{ fontSize:11, fontWeight:600, color:FN.text }}>{n.type}</div>
              <div style={{ fontSize:10, color:FN.text3 }}>{n.provider} · {n.time}</div>
            </div>
          ))}
          {/* Disposition */}
          <div style={{ marginTop:10 }}>
            <div style={{ fontSize:10, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Disposition</div>
            <select value={patient.disposition||""} onChange={e=>onUpdatePatient({...patient,disposition:e.target.value,status:["Home","AMA","LWBS","Expired","Left without Triage"].some(d=>e.target.value.includes(d))?"Discharged":e.target.value.startsWith("Admit")?"Admitted":patient.status})}
              style={{...inp2, width:"100%"}}>
              <option value="">— Pending —</option>
              {ER_DISPOSITIONS.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          {/* Status update */}
          <div style={{ marginTop:8 }}>
            <div style={{ fontSize:10, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>Status</div>
            <select value={patient.status} onChange={e=>onUpdatePatient({...patient,status:e.target.value})}
              style={{...inp2,width:"100%"}}>
              {Object.keys(ER_STATUS_COLOR).map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Quick action bar */}
      <div style={{ display:"flex", gap:8, marginTop:14, paddingTop:12, borderTop:`1px solid ${FN.border}` }}>
        <button onClick={()=>setShowOrders(true)} style={{ padding:"6px 14px", background:FN.blue, border:"none", borderRadius:4, color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>📋 Place Orders</button>
        <button onClick={()=>setShowNote(true)} style={{ padding:"6px 14px", background:FN.purpleDim, border:`1px solid ${FN.purple}35`, borderRadius:4, color:FN.purple, fontSize:12, fontWeight:600, cursor:"pointer" }}>📝 New Note</button>
        <button onClick={()=>setShowVitals(true)} style={{ padding:"6px 14px", background:FN.tealDim, border:`1px solid ${FN.teal}35`, borderRadius:4, color:FN.teal, fontSize:12, fontWeight:600, cursor:"pointer" }}>🩺 Record Vitals</button>
        {/* ESI override */}
        <div style={{ marginLeft:"auto", display:"flex", gap:5, alignItems:"center" }}>
          <span style={{ fontSize:11, color:FN.text3 }}>ESI:</span>
          {[1,2,3,4,5].map(n=>{
            const e=ESI[n];
            return <button key={n} onClick={()=>onUpdatePatient({...patient,esi:n})} style={{ width:26, height:26, borderRadius:4, background:patient.esi===n?e.color:"transparent", border:`1px solid ${patient.esi===n?e.color:FN.border}`, color:patient.esi===n?"#000":FN.text3, fontSize:11, fontWeight:700, cursor:"pointer" }}>{n}</button>;
          })}
        </div>
      </div>
    </div>
  );
};

// MAIN ER COMPONENT
const EmergencyRoom = ({ patientFlow, setPatientFlow }) => {
  const [tab, setTab] = useState("tracking");
  const [erPatients, setErPatients] = useState(INITIAL_ER_PATIENTS);
  const [expandedId, setExpandedId] = useState(null);
  const [showTriage, setShowTriage] = useState(false);
  const [showProtocols, setShowProtocols] = useState(false);
  const [filterESI, setFilterESI] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProvider, setFilterProvider] = useState("All");
  const [searchQ, setSearchQ] = useState("");
  const [toast, setToast] = useState(null);
  const [clock, setClock] = useState(new Date());
  const [protocolPt, setProtocolPt] = useState(null);

  useEffect(()=>{ const t=setInterval(()=>setClock(new Date()),30000); return()=>clearInterval(t); },[]);

  const showToast = (m,type="green")=>{ setToast({m,type}); setTimeout(()=>setToast(null),3000); };

  const updatePatient = (updated) => {
    setErPatients(prev=>prev.map(p=>p.id===updated.id?updated:p));
    if (expandedId===updated.id) {} // keep expanded
  };

  const admitPatient = (pt) => {
    setErPatients(prev=>[pt,...prev]);
    showToast(`✓ ${pt.name} registered — ESI ${pt.esi}`);
  };

  const applyProtocol = (protocol, patient) => {
    const newOrds = protocol.orders.map(o=>({
      id:"PROT_"+Date.now()+"_"+Math.random().toString(36).slice(2,6),
      name:o, category:"Protocol", urgency:"STAT",
      notes:`${protocol.name} bundle`, status:"Ordered",
      time:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),
    }));
    updatePatient({...patient, orders:[...(patient.orders||[]),...newOrds], criticalFlags:[...new Set([...(patient.criticalFlags||[]),protocol.name])]});
    showToast(`✓ ${protocol.name} activated — ${newOrds.length} orders placed`,"orange");
    setShowProtocols(false);
    setProtocolPt(null);
  };

  // Stats
  const total = erPatients.length;
  const byESI = [1,2,3,4,5].map(n=>erPatients.filter(p=>p.esi===n).length);
  const avgLOS = erPatients.length>0?Math.round(erPatients.reduce((s,p)=>s+p.los,0)/erPatients.length):0;
  const critCount = erPatients.filter(p=>p.criticalFlags?.length>0).length;
  const waitingTriage = erPatients.filter(p=>p.status==="Waiting Triage").length;

  // Filter
  const filtered = erPatients.filter(p=>{
    if (filterESI!=="All" && p.esi!==parseInt(filterESI)) return false;
    if (filterStatus!=="All" && p.status!==filterStatus) return false;
    if (filterProvider!=="All" && p.provider!==filterProvider) return false;
    if (searchQ && !p.name.toLowerCase().includes(searchQ.toLowerCase()) && !p.mrn.toLowerCase().includes(searchQ.toLowerCase()) && !p.chiefComplaint.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const providers = [...new Set(erPatients.map(p=>p.provider).filter(Boolean))];

  // Room occupancy map
  const roomMap = {};
  erPatients.forEach(p=>{ if(p.room) roomMap[p.room]=p; });

  const s = { display:"flex", flexDirection:"column", height:"100%", overflow:"hidden", background:FN.bg, fontFamily:"'IBM Plex Sans',sans-serif" };

  return (
    <div style={s}>
      {toast&&<div style={{ position:"fixed", top:70, right:24, zIndex:9999, background:FN.panel, border:`1px solid ${toast.type==="orange"?FN.orange:toast.type==="red"?FN.red:FN.green}`, color:toast.type==="orange"?FN.orange:toast.type==="red"?FN.red:FN.green, padding:"11px 20px", borderRadius:6, fontSize:13, fontWeight:600, boxShadow:"0 4px 24px rgba(0,0,0,0.5)" }}>{toast.m}</div>}

      {showTriage&&<TriageModal onClose={()=>setShowTriage(false)} onAdmit={admitPatient}/>}

      {/* Protocol picker */}
      {showProtocols&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:FN.panel, border:`1px solid ${FN.border}`, borderRadius:8, width:640, maxHeight:"80vh", overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"14px 18px", background:FN.panel2, borderBottom:`1px solid ${FN.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:14, fontWeight:700, color:FN.text }}>🚨 Activate Protocol</div>
              <button onClick={()=>{setShowProtocols(false);setProtocolPt(null);}} style={{ background:"none", border:"none", color:FN.text2, cursor:"pointer", fontSize:18 }}>✕</button>
            </div>
            {!protocolPt&&(
              <div style={{ padding:"12px 18px", borderBottom:`1px solid ${FN.border}` }}>
                <div style={{ fontSize:11, color:FN.text3, marginBottom:8 }}>Select patient to apply protocol to:</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {erPatients.filter(p=>!["Discharged","AMA","LWBS"].includes(p.status)).map(p=>(
                    <button key={p.id} onClick={()=>setProtocolPt(p)} style={{ padding:"5px 12px", background:FN.panel2, border:`1px solid ${ESI[p.esi]?.color||FN.border}40`, borderRadius:4, color:ESI[p.esi]?.color||FN.text2, fontSize:12, cursor:"pointer" }}>ESI{p.esi} {p.name}</button>
                  ))}
                </div>
              </div>
            )}
            {protocolPt&&<div style={{ padding:"8px 18px", background:FN.redDim, borderBottom:`1px solid ${FN.red}30`, fontSize:12, color:FN.red, fontWeight:600 }}>Patient: {protocolPt.name} — {protocolPt.chiefComplaint}</div>}
            <div style={{ flex:1, overflowY:"auto", padding:18 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {ER_PROTOCOLS.map(proto=>(
                  <div key={proto.name} style={{ background:FN.panel2, border:`1px solid ${proto.color}35`, borderLeft:`3px solid ${proto.color}`, borderRadius:6, padding:"12px 14px", cursor:protocolPt?"pointer":"default", opacity:protocolPt?1:0.6 }}
                    onClick={()=>protocolPt&&applyProtocol(proto,protocolPt)}
                    onMouseEnter={e=>protocolPt&&(e.currentTarget.style.background=proto.color+"18")}
                    onMouseLeave={e=>e.currentTarget.style.background=FN.panel2}>
                    <div style={{ fontSize:13, fontWeight:700, color:proto.color, marginBottom:6 }}>{proto.icon} {proto.name}</div>
                    <div style={{ fontSize:10, color:FN.text3 }}>{proto.orders.length} auto-orders: {proto.orders.slice(0,3).join(", ")}{proto.orders.length>3&&`... +${proto.orders.length-3} more`}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FIRSTNET TOP BAR ── */}
      <div style={{ background:"#111827", borderBottom:`2px solid ${FN.accentBar}`, padding:"0 16px", display:"flex", alignItems:"center", height:50, flexShrink:0, gap:0 }}>
        {/* Oracle / Cerner branding feel */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginRight:24, paddingRight:24, borderRight:`1px solid ${FN.border}` }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:FN.red, boxShadow:`0 0 8px ${FN.red}` }}/>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"#fff", letterSpacing:"0.03em" }}>FirstNet <span style={{ color:FN.teal }}>ER</span></div>
            <div style={{ fontSize:9, color:FN.text3, letterSpacing:"0.07em" }}>CERNER ORACLE</div>
          </div>
        </div>

        {/* Tabs */}
        {[["tracking","Tracking Board"],["bedboard","Bed Board"],["orders","Orders"],["whiteboard","Whiteboard"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{ height:50, padding:"0 16px", background:"none", border:"none", borderBottom:`2px solid ${tab===id?FN.teal:"transparent"}`, color:tab===id?FN.teal:FN.text2, fontSize:12, fontWeight:tab===id?600:400, cursor:"pointer", marginBottom:-2, whiteSpace:"nowrap" }}>
            {label}
          </button>
        ))}

        {/* Right side */}
        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, color:FN.teal }}>{clock.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</div>
          <div style={{ width:1, height:20, background:FN.border }}/>
          <button onClick={()=>{setShowProtocols(true);setProtocolPt(null);}} style={{ padding:"5px 12px", background:FN.orange+"20", border:`1px solid ${FN.orange}40`, borderRadius:4, color:FN.orange, fontSize:11, fontWeight:700, cursor:"pointer" }}>🚨 Protocols</button>
          <button onClick={()=>setShowTriage(true)} style={{ padding:"5px 14px", background:FN.red, border:"none", borderRadius:4, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>+ Register Patient</button>
        </div>
      </div>

      {/* ── STAT BAR ── */}
      <div style={{ background:"#0d1117", borderBottom:`1px solid ${FN.border}`, display:"flex", flexShrink:0 }}>
        {/* ESI counts */}
        <div style={{ display:"flex", borderRight:`1px solid ${FN.border}` }}>
          {[1,2,3,4,5].map(n=>{
            const e=ESI[n];
            return (
              <div key={n} onClick={()=>setFilterESI(filterESI===String(n)?"All":String(n))}
                style={{ padding:"8px 14px", textAlign:"center", borderRight:`1px solid ${FN.border}`, cursor:"pointer", background:filterESI===String(n)?e.bg:"transparent", minWidth:60 }}>
                <div style={{ fontSize:18, fontWeight:700, color:e.color }}>{byESI[n-1]}</div>
                <div style={{ fontSize:9, color:e.color, fontWeight:700, textTransform:"uppercase", marginTop:1 }}>ESI {n}</div>
              </div>
            );
          })}
        </div>
        {/* Other stats */}
        {[["Total",total,FN.text2],["Avg LOS",`${avgLOS}m`,FN.yellow],["Waiting Triage",waitingTriage,FN.orange],["Critical Flags",critCount,FN.red]].map(([label,val,color],i)=>(
          <div key={label} style={{ padding:"8px 16px", textAlign:"center", borderRight:`1px solid ${FN.border}`, minWidth:80 }}>
            <div style={{ fontSize:18, fontWeight:700, color }}>{val}</div>
            <div style={{ fontSize:9, color:FN.text3, fontWeight:600, textTransform:"uppercase", marginTop:1 }}>{label}</div>
          </div>
        ))}
        {/* Search & filters */}
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, padding:"0 12px" }}>
          <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search name, MRN, complaint..." style={{ background:FN.panel, border:`1px solid ${FN.border}`, borderRadius:4, padding:"5px 10px", color:FN.text, fontSize:12, outline:"none", width:200, fontFamily:"'IBM Plex Sans',sans-serif" }}/>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ background:FN.panel, border:`1px solid ${FN.border}`, borderRadius:4, padding:"5px 8px", color:FN.text, fontSize:11, outline:"none" }}>
            <option value="All">All Statuses</option>
            {Object.keys(ER_STATUS_COLOR).map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterProvider} onChange={e=>setFilterProvider(e.target.value)} style={{ background:FN.panel, border:`1px solid ${FN.border}`, borderRadius:4, padding:"5px 8px", color:FN.text, fontSize:11, outline:"none" }}>
            <option value="All">All Providers</option>
            {providers.map(p=><option key={p} value={p}>{p}</option>)}
          </select>
          {(filterESI!=="All"||filterStatus!=="All"||filterProvider!=="All"||searchQ)&&<button onClick={()=>{setFilterESI("All");setFilterStatus("All");setFilterProvider("All");setSearchQ("");}} style={{ padding:"4px 10px", background:FN.redDim, border:`1px solid ${FN.red}30`, borderRadius:4, color:FN.red, fontSize:11, cursor:"pointer" }}>✕ Clear</button>}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ flex:1, overflowY:"auto" }}>

        {/* ══ TRACKING BOARD ══ */}
        {tab==="tracking"&&(
          <div>
            {/* Column headers — FirstNet style */}
            <div style={{ display:"grid", gridTemplateColumns:"36px 70px 56px 200px 160px 140px 120px 120px 80px 1fr", background:"#0d1117", borderBottom:`1px solid ${FN.border}`, position:"sticky", top:0, zIndex:2 }}>
              {["","ESI","LOS","Patient","Chief Complaint","Status","Provider","Nurse","Room","Flags/Actions"].map((h,i)=>(
                <div key={i} style={{ padding:"7px 10px", fontSize:9, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</div>
              ))}
            </div>

            {filtered.length===0&&<div style={{ padding:48, textAlign:"center", color:FN.text3, fontSize:13 }}>No patients match current filters.</div>}

            {filtered.map((pt)=>{
              const esi = ESI[pt.esi]||ESI[3];
              const sc = ER_STATUS_COLOR[pt.status]||FN.text3;
              const isExpanded = expandedId===pt.id;
              const hasCritical = pt.criticalFlags?.length>0;

              return (
                <div key={pt.id} style={{ borderBottom:`1px solid ${FN.border2}` }}>
                  <div
                    style={{ display:"grid", gridTemplateColumns:"36px 70px 56px 200px 160px 140px 120px 120px 80px 1fr", alignItems:"center", cursor:"pointer", background:isExpanded?esi.color+"0a":hasCritical?"rgba(229,52,58,0.04)":"transparent", transition:"background .1s" }}
                    onClick={()=>setExpandedId(isExpanded?null:pt.id)}
                    onMouseEnter={e=>!isExpanded&&(e.currentTarget.style.background=FN.panel2)}
                    onMouseLeave={e=>!isExpanded&&(e.currentTarget.style.background=hasCritical?"rgba(229,52,58,0.04)":"transparent")}>

                    {/* ESI color stripe */}
                    <div style={{ width:4, alignSelf:"stretch", background:esi.color }}/>

                    {/* ESI badge */}
                    <div style={{ padding:"10px 10px" }}>
                      <div style={{ width:34, height:34, borderRadius:4, background:esi.bg, border:`2px solid ${esi.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:esi.color }}>{pt.esi}</div>
                    </div>

                    {/* LOS */}
                    <div style={{ padding:"10px 10px" }}>
                      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, fontWeight:700, color:pt.los>120?FN.red:pt.los>60?FN.orange:FN.text2 }}>{pt.los}m</div>
                    </div>

                    {/* Patient */}
                    <div style={{ padding:"10px 10px" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:FN.text }}>{pt.name}</div>
                      <div style={{ fontSize:10, color:FN.text3, fontFamily:"'IBM Plex Mono',monospace" }}>{pt.mrn}{pt.dob?` · ${calcAge(pt.dob)}y ${pt.gender}`:""}</div>
                      {pt.allergies?.length>0&&<div style={{ fontSize:10, color:FN.red, fontWeight:600 }}>⚠ {pt.allergies.join(", ")}</div>}
                    </div>

                    {/* Chief complaint */}
                    <div style={{ padding:"10px 10px", fontSize:12, color:FN.text, fontWeight:500 }}>{pt.chiefComplaint}</div>

                    {/* Status */}
                    <div style={{ padding:"10px 10px" }}>
                      <span style={{ background:sc+"18", color:sc, border:`1px solid ${sc}30`, borderRadius:4, padding:"3px 8px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>{pt.status}</span>
                    </div>

                    {/* Provider */}
                    <div style={{ padding:"10px 10px", fontSize:11, color:FN.text2 }}>{pt.provider||<span style={{ color:FN.text3, fontStyle:"italic" }}>Unassigned</span>}</div>

                    {/* Nurse */}
                    <div style={{ padding:"10px 10px", fontSize:11, color:FN.text2 }}>{pt.nurse||<span style={{ color:FN.text3, fontStyle:"italic" }}>Unassigned</span>}</div>

                    {/* Room */}
                    <div style={{ padding:"10px 10px" }}>
                      {pt.room?<span style={{ background:ER_ROOM_TYPE_COLOR[ER_ROOMS.find(r=>r.id===pt.room)?.type]+"20", color:ER_ROOM_TYPE_COLOR[ER_ROOMS.find(r=>r.id===pt.room)?.type]||FN.blue, border:`1px solid ${ER_ROOM_TYPE_COLOR[ER_ROOMS.find(r=>r.id===pt.room)?.type]||FN.blue}35`, borderRadius:3, padding:"2px 7px", fontSize:11, fontWeight:700 }}>{pt.room}</span>:<span style={{ fontSize:11, color:FN.text3 }}>WR</span>}
                    </div>

                    {/* Flags + mini actions */}
                    <div style={{ padding:"10px 10px", display:"flex", gap:5, alignItems:"center", flexWrap:"wrap" }} onClick={e=>e.stopPropagation()}>
                      {pt.criticalFlags?.map(f=>(
                        <span key={f} style={{ background:FN.redDim, color:FN.red, border:`1px solid ${FN.red}35`, borderRadius:3, padding:"1px 6px", fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>🚨 {f}</span>
                      ))}
                      {(pt.orders||[]).length>0&&<span style={{ background:FN.orangeDim, color:FN.orange, borderRadius:3, padding:"1px 6px", fontSize:10, fontWeight:600 }}>📋 {(pt.orders||[]).length} orders</span>}
                      <button onClick={e=>{e.stopPropagation();setExpandedId(isExpanded?null:pt.id);}} style={{ marginLeft:"auto", padding:"3px 8px", background:"transparent", border:`1px solid ${FN.border}`, borderRadius:3, color:FN.text3, fontSize:11, cursor:"pointer" }}>{isExpanded?"▲":"▼"}</button>
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded&&<ERPatientDetail patient={pt} onUpdatePatient={updatePatient} onClose={()=>setExpandedId(null)}/>}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ BED BOARD ══ */}
        {tab==="bedboard"&&(
          <div style={{ padding:20 }}>
            {/* Summary row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
              {[["Occupied",erPatients.filter(p=>p.room&&p.room!=="WR").length,FN.orange],["Available",ER_ROOMS.filter(r=>r.type!=="waiting"&&!roomMap[r.id]).length,FN.green],["Waiting Room",erPatients.filter(p=>!p.room||p.room==="WR").length,FN.yellow],["Trauma Active",erPatients.filter(p=>p.room==="T1"||p.room==="T2").length,FN.red]].map(([label,val,color])=>(
                <div key={label} style={{ background:FN.panel, border:`1px solid ${color}30`, borderTop:`3px solid ${color}`, borderRadius:6, padding:"14px 16px" }}>
                  <div style={{ fontSize:26, fontWeight:700, color, marginBottom:3 }}>{val}</div>
                  <div style={{ fontSize:12, color:FN.text2 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Room grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:12 }}>
              {ER_ROOMS.map(room=>{
                const pt = roomMap[room.id];
                const rc = ER_ROOM_TYPE_COLOR[room.type]||FN.blue;
                const esi = pt?ESI[pt.esi]:null;
                return (
                  <div key={room.id} style={{ background:FN.panel, border:`1px solid ${pt?esi?.color||rc:FN.border}35`, borderTop:`3px solid ${pt?esi?.color||rc:FN.gray}`, borderRadius:6, padding:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:FN.text }}>{room.label}</div>
                        <div style={{ fontSize:9, color:rc, textTransform:"uppercase", fontWeight:700, letterSpacing:"0.07em" }}>{room.type}</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:pt?esi?.color||rc:FN.green, boxShadow:`0 0 6px ${pt?esi?.color||rc:FN.green}` }}/>
                        <span style={{ fontSize:10, fontWeight:700, color:pt?esi?.color||rc:FN.green }}>{pt?"OCCUPIED":"AVAILABLE"}</span>
                      </div>
                    </div>
                    {pt?(
                      <div>
                        <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4 }}>
                          <div style={{ width:22, height:22, borderRadius:3, background:esi?.bg, border:`1px solid ${esi?.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:esi?.color, flexShrink:0 }}>{pt.esi}</div>
                          <div style={{ fontSize:13, fontWeight:700, color:FN.text }}>{pt.name}</div>
                        </div>
                        <div style={{ fontSize:11, color:FN.text2, marginBottom:3 }}>{pt.chiefComplaint}</div>
                        <div style={{ fontSize:10, color:FN.text3 }}>{pt.provider||"Unassigned"} · {pt.los}m</div>
                        <div style={{ fontSize:10, color:FN.text3 }}>{pt.status}</div>
                        {pt.criticalFlags?.length>0&&<div style={{ fontSize:10, color:FN.red, fontWeight:700, marginTop:4 }}>🚨 {pt.criticalFlags[0]}{pt.criticalFlags.length>1?` +${pt.criticalFlags.length-1}`:""}</div>}
                        <div style={{ display:"flex", gap:5, marginTop:8 }}>
                          <button onClick={()=>{setExpandedId(pt.id);setTab("tracking");}} style={{ flex:1, padding:"5px", background:FN.blue+"18", border:`1px solid ${FN.blue}35`, borderRadius:3, color:FN.blue, fontSize:10, fontWeight:600, cursor:"pointer" }}>Open</button>
                          <button onClick={()=>{setExpandedId(pt.id);setTab("tracking");}} style={{ flex:1, padding:"5px", background:FN.green+"15", border:`1px solid ${FN.green}35`, borderRadius:3, color:FN.green, fontSize:10, fontWeight:600, cursor:"pointer" }}>Orders</button>
                        </div>
                      </div>
                    ):(
                      <div>
                        <div style={{ fontSize:12, color:FN.green, marginBottom:8 }}>✓ Available</div>
                        <button onClick={()=>setShowTriage(true)} style={{ width:"100%", padding:"5px", background:FN.greenDim, border:`1px solid ${FN.green}35`, borderRadius:3, color:FN.green, fontSize:10, fontWeight:600, cursor:"pointer" }}>+ Assign Patient</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ ORDERS VIEW ══ */}
        {tab==="orders"&&(
          <div>
            <div style={{ padding:"10px 16px", background:"#0d1117", borderBottom:`1px solid ${FN.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:12, color:FN.text2 }}>All active orders across ER patients</div>
              <div style={{ fontSize:12, color:FN.text3 }}>Total: <strong style={{ color:FN.text }}>{erPatients.reduce((s,p)=>s+(p.orders?.length||0),0)}</strong></div>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"#0d1117", borderBottom:`1px solid ${FN.border}`, position:"sticky", top:0 }}>
                {["Patient","ESI","Category","Order","Urgency","Time","Status","Action"].map(h=>(
                  <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:10, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {erPatients.flatMap(pt=>(pt.orders||[]).map(o=>({...o,patient:pt}))).sort((a,b)=>a.urgency==="STAT"?-1:1).map((o,i)=>{
                  const sc = o.urgency==="STAT"?FN.red:o.status==="Resulted"?FN.green:FN.orange;
                  return (
                    <tr key={o.id||i} style={{ borderBottom:`1px solid ${FN.border2}` }} onMouseEnter={e=>e.currentTarget.style.background=FN.panel} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"9px 12px" }}>
                        <div style={{ fontSize:12, fontWeight:600, color:FN.text }}>{o.patient.name}</div>
                        <div style={{ fontSize:10, color:FN.text3, fontFamily:"'IBM Plex Mono',monospace" }}>{o.patient.mrn}</div>
                      </td>
                      <td style={{ padding:"9px 12px" }}><span style={{ background:ESI[o.patient.esi]?.bg, color:ESI[o.patient.esi]?.color, borderRadius:3, padding:"2px 7px", fontSize:11, fontWeight:700 }}>ESI {o.patient.esi}</span></td>
                      <td style={{ padding:"9px 12px", fontSize:12, color:FN.text2 }}>{o.category}</td>
                      <td style={{ padding:"9px 12px", fontSize:12, fontWeight:600, color:FN.text }}>{o.name}</td>
                      <td style={{ padding:"9px 12px" }}>{o.urgency==="STAT"?<span style={{ background:FN.redDim, color:FN.red, borderRadius:3, padding:"2px 7px", fontSize:11, fontWeight:700 }}>STAT</span>:<span style={{ fontSize:12, color:FN.text3 }}>Routine</span>}</td>
                      <td style={{ padding:"9px 12px", fontSize:11, color:FN.text3, fontFamily:"'IBM Plex Mono',monospace" }}>{o.time}</td>
                      <td style={{ padding:"9px 12px" }}><span style={{ background:sc+"18", color:sc, border:`1px solid ${sc}30`, borderRadius:3, padding:"2px 7px", fontSize:11, fontWeight:600 }}>{o.status}</span></td>
                      <td style={{ padding:"9px 12px" }}>
                        {o.status==="Ordered"&&<button onClick={()=>updatePatient({...o.patient,orders:o.patient.orders.map(x=>x.id===o.id?{...x,status:"Resulted"}:x)})} style={{ padding:"3px 8px", background:FN.greenDim, border:`1px solid ${FN.green}35`, borderRadius:3, color:FN.green, fontSize:11, fontWeight:600, cursor:"pointer" }}>Result</button>}
                      </td>
                    </tr>
                  );
                })}
                {erPatients.every(p=>!p.orders?.length)&&<tr><td colSpan={8} style={{ padding:40, textAlign:"center", color:FN.text3, fontSize:13 }}>No orders placed yet. Open a patient and place orders.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* ══ WHITEBOARD ══ */}
        {tab==="whiteboard"&&(
          <div style={{ padding:20 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
              {erPatients.filter(p=>!["Discharged","AMA","LWBS"].includes(p.status)).map(pt=>{
                const esi = ESI[pt.esi]||ESI[3];
                const sc = ER_STATUS_COLOR[pt.status]||FN.text3;
                return (
                  <div key={pt.id} style={{ background:FN.panel, border:`1px solid ${esi.color}35`, borderLeft:`4px solid ${esi.color}`, borderRadius:6, padding:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <div style={{ width:28, height:28, borderRadius:4, background:esi.bg, border:`2px solid ${esi.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:esi.color, flexShrink:0 }}>{pt.esi}</div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700, color:FN.text }}>{pt.name}</div>
                          <div style={{ fontSize:10, color:FN.text3, fontFamily:"'IBM Plex Mono',monospace" }}>{pt.mrn}</div>
                        </div>
                      </div>
                      <span style={{ background:sc+"18", color:sc, border:`1px solid ${sc}30`, borderRadius:3, padding:"2px 7px", fontSize:10, fontWeight:600, whiteSpace:"nowrap" }}>{pt.status}</span>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
                      {[["CC",pt.chiefComplaint],["Room",pt.room||"WR"],["MD",pt.provider?.split(" ").slice(-1)[0]||"—"],["LOS",`${pt.los}m`]].map(([k,v])=>(
                        <div key={k} style={{ background:FN.panel2, borderRadius:4, padding:"5px 8px" }}>
                          <div style={{ fontSize:9, color:FN.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>{k}</div>
                          <div style={{ fontSize:11, fontWeight:600, color:FN.text, marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {pt.vitals?.bp&&(
                      <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
                        {[["BP",pt.vitals.bp,""],["HR",pt.vitals.hr,"bpm"],["SpO2",pt.vitals.spo2,"%"],["Temp",pt.vitals.temp,"°F"]].filter(([,v])=>v).map(([k,v,u])=>{
                          const abn=(k==="HR"&&(v>100||v<60))||(k==="SpO2"&&v<95)||(k==="Temp"&&parseFloat(v)>100.4);
                          return <span key={k} style={{ background:abn?FN.redDim:FN.panel2, border:`1px solid ${abn?FN.red+"40":FN.border}`, borderRadius:3, padding:"2px 6px", fontSize:10, color:abn?FN.red:FN.text, fontFamily:"'IBM Plex Mono',monospace", fontWeight:abn?700:400 }}>{k}:{v}{u}{abn?"⚠":""}</span>;
                        })}
                      </div>
                    )}
                    {pt.criticalFlags?.length>0&&<div style={{ background:FN.redDim, border:`1px solid ${FN.red}30`, borderRadius:3, padding:"4px 8px", fontSize:10, color:FN.red, fontWeight:700 }}>🚨 {pt.criticalFlags.join(" · ")}</div>}
                    {(pt.orders||[]).length>0&&<div style={{ marginTop:6, fontSize:10, color:FN.orange }}>📋 {(pt.orders||[]).length} order{(pt.orders||[]).length!==1?"s":""} · {(pt.orders||[]).filter(o=>o.status==="Ordered").length} pending</div>}
                    {pt.disposition&&<div style={{ marginTop:6, background:FN.greenDim, border:`1px solid ${FN.green}30`, borderRadius:3, padding:"3px 8px", fontSize:10, color:FN.green, fontWeight:600 }}>Dispo: {pt.disposition}</div>}
                    <button onClick={()=>{setExpandedId(pt.id);setTab("tracking");}} style={{ width:"100%", marginTop:10, padding:"5px", background:FN.blue+"18", border:`1px solid ${FN.blue}35`, borderRadius:4, color:FN.blue, fontSize:11, fontWeight:600, cursor:"pointer" }}>Open Patient</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


