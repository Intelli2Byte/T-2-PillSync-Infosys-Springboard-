import React, { useState } from "react";
import {
  Sunrise, Sun, Moon, Mail, Lock, ArrowRight, AlertTriangle,
  CheckCircle2, RotateCcw, Home, Pill, BarChart3, User as UserIcon,
  Send, Users,
} from "lucide-react";

const C = {
  ink: "#1C2541",
  sub: "#6B7686",
  cloud: "#F6F8FA",
  card: "#FFFFFF",
  line: "#E7EBF0",
  morning: "#FFA733",
  morningSoft: "#FFF1DD",
  afternoon: "#2FA6D8",
  afternoonSoft: "#E4F4FB",
  dusk: "#6C5CE7",
  duskSoft: "#ECEAFC",
  mint: "#1CB894",
  mintSoft: "#DEF7F0",
  coral: "#FF5A6E",
  coralSoft: "#FFE7EA",
};

const SLOTS = [
  { id: "morning", label: "Morning", time: "8:00 AM", color: C.morning, soft: C.morningSoft, Icon: Sunrise },
  { id: "afternoon", label: "Afternoon", time: "2:00 PM", color: C.afternoon, soft: C.afternoonSoft, Icon: Sun },
  { id: "night", label: "Night", time: "9:00 PM", color: C.dusk, soft: C.duskSoft, Icon: Moon },
];

const INITIAL_MEDS = [
  { id: 1, slot: "morning", name: "Amlodipine", dosage: "5mg · 1 tablet", tag: "Blood Pressure", taken: true },
  { id: 2, slot: "morning", name: "Metformin", dosage: "500mg · 1 tablet", tag: "Diabetes", taken: true },
  { id: 3, slot: "afternoon", name: "Vitamin D3", dosage: "60,000 IU · 1 capsule", tag: "Vitamins", taken: false },
  { id: 4, slot: "night", name: "Levothyroxine", dosage: "50mcg · 1 tablet", tag: "Thyroid", taken: false },
  { id: 5, slot: "night", name: "Atorvastatin", dosage: "10mg · 1 tablet", tag: "Heart", taken: false },
];

function LoginScreen({ onLogin }) {
  const [role, setRole] = useState("patient");
  return (
    <div style={{ background: C.cloud, position: "relative", overflow: "hidden" }} className="min-h-screen flex items-center justify-center p-6">
      <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${C.morningSoft} 0%, transparent 70%)`, top: -120, left: -100 }} />
      <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${C.duskSoft} 0%, transparent 70%)`, bottom: -140, right: -120 }} />

      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 24, boxShadow: "0 24px 60px -20px rgba(28,37,65,0.15)" }} className="relative w-full max-w-sm p-8">
        <div className="flex items-center gap-2 mb-1">
          <div style={{ background: `linear-gradient(135deg, ${C.morning}, ${C.dusk})`, width: 36, height: 36, borderRadius: 12 }} className="flex items-center justify-center">
            <Pill size={18} color="#fff" />
          </div>
          <span style={{ color: C.ink, fontWeight: 800, fontSize: 20 }}>PillSync</span>
        </div>
        <p style={{ color: C.sub, fontSize: 14 }} className="mb-6">Good morning. Let's keep today's doses on track.</p>

        <div style={{ background: C.cloud, borderRadius: 12, padding: 4 }} className="flex mb-5">
          {["patient", "caregiver"].map((r) => (
            <button key={r} onClick={() => setRole(r)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 9, fontSize: 13, fontWeight: 600, background: role === r ? C.card : "transparent", color: role === r ? C.ink : C.sub, boxShadow: role === r ? "0 2px 6px rgba(28,37,65,0.08)" : "none" }}>
              {r === "patient" ? "Patient" : "Caregiver"}
            </button>
          ))}
        </div>

        <label style={{ fontSize: 12, color: C.sub, fontWeight: 600 }} className="block mb-1.5">Email</label>
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex items-center gap-2 px-3 py-2.5 mb-4">
          <Mail size={16} color={C.sub} />
          <input defaultValue={role === "patient" ? "meera.sharma@mail.com" : "arjun.k@mail.com"} style={{ fontSize: 14, color: C.ink }} className="w-full outline-none bg-transparent" />
        </div>

        <label style={{ fontSize: 12, color: C.sub, fontWeight: 600 }} className="block mb-1.5">Password</label>
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 12 }} className="flex items-center gap-2 px-3 py-2.5 mb-6">
          <Lock size={16} color={C.sub} />
          <input type="password" defaultValue="••••••••" style={{ fontSize: 14, color: C.ink }} className="w-full outline-none bg-transparent" />
        </div>

        <button onClick={() => onLogin(role)} style={{ background: C.ink, color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 14 }} className="w-full py-3 flex items-center justify-center gap-2 hover:opacity-90 transition">
          Sign in <ArrowRight size={16} />
        </button>

        <p style={{ color: C.sub, fontSize: 12 }} className="text-center mt-5">
          Forgot password? <span style={{ color: C.mint, fontWeight: 600, cursor: "pointer" }}>Reset it</span>
        </p>
      </div>
    </div>
  );
}

function TimelineRail({ meds }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 20 }} className="p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 style={{ color: C.ink, fontWeight: 700, fontSize: 16 }}>Today's timeline</h3>
        <span style={{ color: C.sub, fontSize: 12 }}>Mon, Aug 3</span>
      </div>
      <div className="relative flex items-start justify-between px-2">
        <div style={{ position: "absolute", top: 20, left: "12%", right: "12%", height: 2, background: C.line }} />
        {SLOTS.map((slot) => {
          const slotMeds = meds.filter((m) => m.slot === slot.id);
          const allTaken = slotMeds.length > 0 && slotMeds.every((m) => m.taken);
          return (
            <div key={slot.id} className="relative flex flex-col items-center gap-2" style={{ width: "30%" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: allTaken ? slot.color : "#fff", border: `2px solid ${slot.color}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: allTaken ? `0 4px 12px ${slot.color}55` : "none" }}>
                <slot.Icon size={18} color={allTaken ? "#fff" : slot.color} />
              </div>
              <span style={{ color: C.ink, fontWeight: 700, fontSize: 13 }}>{slot.label}</span>
              <span style={{ color: C.sub, fontSize: 11 }}>{slot.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdherenceRing({ percent }) {
  const r = 42, c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 20 }} className="p-5 flex flex-col items-center">
      <h3 style={{ color: C.ink, fontWeight: 700, fontSize: 16 }} className="self-start mb-3">Weekly adherence</h3>
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} stroke={C.line} strokeWidth="10" fill="none" />
        <circle cx="55" cy="55" r={r} stroke={C.mint} strokeWidth="10" fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 55 55)" />
        <text x="55" y="60" textAnchor="middle" style={{ fontWeight: 800, fontSize: 22, fill: C.ink }}>{percent}%</text>
      </svg>
      <p style={{ color: C.sub, fontSize: 12 }} className="mt-2 text-center">6 of 7 days on track. Nicely done.</p>
    </div>
  );
}

function RefillBanner() {
  return (
    <div style={{ background: C.coralSoft, border: `1px solid ${C.coral}33`, borderRadius: 16 }} className="p-4 flex items-center gap-3">
      <div style={{ background: C.coral, borderRadius: 10, width: 36, height: 36 }} className="flex items-center justify-center shrink-0">
        <AlertTriangle size={18} color="#fff" />
      </div>
      <div className="flex-1">
        <p style={{ color: C.ink, fontWeight: 600, fontSize: 13 }}>Amlodipine is expected to finish in 5 days</p>
        <p style={{ color: C.sub, fontSize: 12 }}>Recommended refill by Fri, Aug 8</p>
      </div>
      <button style={{ background: C.ink, color: "#fff", borderRadius: 10, fontSize: 12, fontWeight: 600 }} className="px-3 py-2 shrink-0">Arrange refill</button>
    </div>
  );
}

function MedCard({ med, slot, isCaregiver, onToggle }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderLeft: `4px solid ${slot.color}`, borderRadius: 14, opacity: med.taken ? 0.65 : 1 }} className="p-4 flex items-center justify-between transition">
      <div>
        <p style={{ color: C.ink, fontWeight: 700, fontSize: 14, textDecoration: med.taken ? "line-through" : "none" }}>{med.name}</p>
        <p style={{ color: C.sub, fontSize: 12 }}>{med.dosage}</p>
        <span style={{ background: slot.soft, color: slot.color, fontSize: 10, fontWeight: 700, borderRadius: 999 }} className="inline-block px-2 py-0.5 mt-1">{med.tag}</span>
      </div>
      {isCaregiver ? (
        <button style={{ border: `1px solid ${C.line}`, color: C.ink, borderRadius: 10, fontSize: 12, fontWeight: 600 }} className="px-3 py-2 flex items-center gap-1.5">
          <Send size={13} /> Nudge
        </button>
      ) : (
        <button onClick={onToggle} style={{ borderRadius: 10, fontSize: 12, fontWeight: 700, padding: "8px 12px", background: med.taken ? "transparent" : C.mint, color: med.taken ? C.sub : "#fff", border: med.taken ? `1px solid ${C.line}` : "none" }} className="flex items-center gap-1.5 shrink-0">
          {med.taken ? (<><RotateCcw size={13} /> Undo</>) : (<><CheckCircle2 size={13} /> Taken</>)}
        </button>
      )}
    </div>
  );
}

function Dashboard({ role, onSwitchRole }) {
  const [meds, setMeds] = useState(INITIAL_MEDS);
  const taken = meds.filter((m) => m.taken).length;
  const percent = Math.round((taken / meds.length) * 100);
  const isCaregiver = role === "caregiver";
  const toggle = (id) => setMeds((m) => m.map((x) => (x.id === id ? { ...x, taken: !x.taken } : x)));

  return (
    <div style={{ background: C.cloud, minHeight: "100vh" }} className="pb-24">
      <div style={{ background: C.card, borderBottom: `1px solid ${C.line}` }} className="px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div style={{ background: `linear-gradient(135deg, ${C.morning}, ${C.dusk})`, width: 32, height: 32, borderRadius: 10 }} className="flex items-center justify-center">
            <Pill size={16} color="#fff" />
          </div>
          <span style={{ color: C.ink, fontWeight: 800, fontSize: 17 }}>PillSync</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onSwitchRole} style={{ border: `1px solid ${C.line}`, borderRadius: 999, fontSize: 12, fontWeight: 600, color: C.ink }} className="px-3 py-1.5 flex items-center gap-1.5">
            <Users size={13} /> {isCaregiver ? "Viewing: Meera" : "Switch to caregiver"}
          </button>
          <div style={{ background: C.duskSoft, color: C.dusk, borderRadius: "50%", width: 34, height: 34 }} className="flex items-center justify-center font-bold text-sm">
            {isCaregiver ? "AK" : "MS"}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-6">
        <h1 style={{ color: C.ink, fontWeight: 800, fontSize: 24 }}>{isCaregiver ? "Monitoring Meera Sharma" : "Good afternoon, Meera"}</h1>
        <p style={{ color: C.sub, fontSize: 14 }} className="mb-6">
          {isCaregiver ? "2 of 5 doses taken today · adherence steady this week" : "You've taken 2 of 5 doses so far today"}
        </p>

        <div className="mb-4"><RefillBanner /></div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2"><TimelineRail meds={meds} /></div>
          <AdherenceRing percent={percent} />
        </div>

        <h3 style={{ color: C.ink, fontWeight: 700, fontSize: 16 }} className="mb-3">Medicines by slot</h3>

        <div className="space-y-5">
          {SLOTS.map((slot) => {
            const slotMeds = meds.filter((m) => m.slot === slot.id);
            if (!slotMeds.length) return null;
            return (
              <div key={slot.id}>
                <div className="flex items-center gap-2 mb-2">
                  <slot.Icon size={14} color={slot.color} />
                  <span style={{ color: slot.color, fontWeight: 700, fontSize: 12 }}>{slot.label} · {slot.time}</span>
                </div>
                <div className="space-y-2">
                  {slotMeds.map((med) => (
                    <MedCard key={med.id} med={med} slot={slot} isCaregiver={isCaregiver} onToggle={() => toggle(med.id)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: C.card, borderTop: `1px solid ${C.line}` }} className="fixed bottom-0 left-0 right-0 px-8 py-3 flex justify-around max-w-3xl mx-auto md:rounded-t-2xl md:left-1/2 md:-translate-x-1/2 md:w-full">
        {[
          { Icon: Home, label: "Home", active: true },
          { Icon: Pill, label: "Medicines" },
          { Icon: BarChart3, label: "Reports" },
          { Icon: UserIcon, label: "Profile" },
        ].map(({ Icon, label, active }) => (
          <div key={label} className="flex flex-col items-center gap-1" style={{ color: active ? C.mint : C.sub }}>
            <Icon size={20} />
            <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("login");
  const [role, setRole] = useState("patient");

  return screen === "login" ? (
    <LoginScreen onLogin={(r) => { setRole(r); setScreen("dashboard"); }} />
  ) : (
    <Dashboard role={role} onSwitchRole={() => setRole((r) => (r === "patient" ? "caregiver" : "patient"))} />
  );
}