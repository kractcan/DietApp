import { useState, useEffect } from "react";
import { Check, Plus, Trash2, Dumbbell, BookOpen, Clock } from "lucide-react";
import { generateDailyPlan } from "../dietAI";

const SCHEDULE = [
  { time: "07:00", label: "Uyan & Kahvaltı", color: "#f59e0b" },
  { time: "08:30", label: "Okul / Ders", color: "#3b82f6" },
  { time: "13:00", label: "Öğle Yemeği", color: "#10b981" },
  { time: "15:00", label: "Egzersiz", color: "#ef4444" },
  { time: "16:30", label: "Ders Çalışma", color: "#8b5cf6" },
  { time: "19:00", label: "Akşam Yemeği", color: "#14b8a6" },
  { time: "21:00", label: "Dinlenme / Okuma", color: "#94a3b8" },
  { time: "22:30", label: "Uyku", color: "#6d28d9" },
];

const EX_STORAGE = `program_${new Date().toDateString()}`;
const CUSTOM_STORAGE = "custom_program";

export default function Program() {
  const [plan] = useState(() => generateDailyPlan());
  const [doneEx, setDoneEx] = useState({});
  const [doneSt, setDoneSt] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [doneCustom, setDoneCustom] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", duration: "", type: "egzersiz", note: "" });

  useEffect(() => {
    const s = localStorage.getItem(EX_STORAGE);
    if (s) { const d = JSON.parse(s); setDoneEx(d.ex || {}); setDoneSt(d.st || {}); setDoneCustom(d.custom || {}); }
    const c = localStorage.getItem(CUSTOM_STORAGE);
    if (c) setCustomItems(JSON.parse(c));
  }, []);

  const save = (ex, st, dc) => localStorage.setItem(EX_STORAGE, JSON.stringify({ ex, st, custom: dc }));

  const toggleEx = i => { const n = { ...doneEx, [i]: !doneEx[i] }; setDoneEx(n); save(n, doneSt, doneCustom); };
  const toggleSt = i => { const n = { ...doneSt, [i]: !doneSt[i] }; setDoneSt(n); save(doneEx, n, doneCustom); };
  const toggleCustom = id => { const n = { ...doneCustom, [id]: !doneCustom[id] }; setDoneCustom(n); save(doneEx, doneSt, n); };

  const addCustom = () => {
    if (!form.name) return;
    const item = { id: Date.now(), ...form };
    const c = [...customItems, item];
    setCustomItems(c);
    localStorage.setItem(CUSTOM_STORAGE, JSON.stringify(c));
    setForm({ name: "", duration: "", type: "egzersiz", note: "" });
    setShowModal(false);
  };

  const removeCustom = id => {
    const c = customItems.filter(i => i.id !== id);
    setCustomItems(c);
    localStorage.setItem(CUSTOM_STORAGE, JSON.stringify(c));
  };

  const burnedCalories = plan.exercises.filter((_, i) => doneEx[i]).reduce((s, e) => s + e.calories, 0);
  const studyMin = plan.study.filter((_, i) => doneSt[i]).reduce((s, e) => s + e.duration, 0);

  return (
    <div className="page fade-in">
      <h1 className="page-title">Günlük Program</h1>

      {/* Zaman Çizelgesi */}
      <p className="section-title">⏰ Günlük Çizelge</p>
      <div className="card" style={{ padding: "16px 14px" }}>
        {SCHEDULE.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < SCHEDULE.length - 1 ? 16 : 0, position: "relative" }}>
            <span style={{ fontSize: 11, color: "var(--text3)", width: 40, flexShrink: 0 }}>{item.time}</span>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0, position: "relative", zIndex: 1 }} />
            {i < SCHEDULE.length - 1 && (
              <div style={{ position: "absolute", left: 52, top: 14, width: 2, height: 20, background: "var(--border)" }} />
            )}
            <div style={{ borderLeft: `2px solid ${item.color}`, paddingLeft: 10 }}>
              <p style={{ fontSize: 13, color: "var(--text2)" }}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Egzersiz */}
      <p className="section-title">💪 Egzersiz</p>
      <div className="grid-2" style={{ marginBottom: 10 }}>
        <div className="card-sm" style={{ textAlign: "center" }}>
          <p style={{ fontSize: 24, fontWeight: 800, color: "#ef4444" }}>{burnedCalories}</p>
          <p className="label">Yakılan kcal</p>
        </div>
        <div className="card-sm" style={{ textAlign: "center" }}>
          <p style={{ fontSize: 24, fontWeight: 800, color: "#3b82f6" }}>
            {Object.values(doneEx).filter(Boolean).length}/{plan.exercises.length}
          </p>
          <p className="label">Tamamlanan</p>
        </div>
      </div>

      {plan.isRestDay ? (
        <div className="card" style={{ textAlign: "center", padding: 24 }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>😴</p>
          <p style={{ fontWeight: 700, fontSize: 16 }}>Bugün Dinlenme Günü</p>
          <p className="muted" style={{ marginTop: 4 }}>Hafif yürüyüş yapabilirsin.</p>
        </div>
      ) : (
        plan.exercises.map((ex, i) => (
          <div key={i} className={`check-row ${doneEx[i] ? "done" : ""}`} onClick={() => toggleEx(i)}>
            <div style={{ background: "#3b82f622", borderRadius: 10, padding: 8, color: "#3b82f6" }}>
              <Dumbbell size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{ex.name}</p>
              <p className="muted">{ex.duration} dk · {ex.calories} kcal · {ex.type}</p>
            </div>
            <div className={`check-circle ${doneEx[i] ? "done" : ""}`}>
              {doneEx[i] && <Check size={14} color="#fff" />}
            </div>
          </div>
        ))
      )}

      {/* Ders */}
      <p className="section-title">📚 Ders Programı</p>
      <div className="grid-2" style={{ marginBottom: 10 }}>
        <div className="card-sm" style={{ textAlign: "center" }}>
          <p style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>{studyMin}</p>
          <p className="label">Çalışılan dk</p>
        </div>
        <div className="card-sm" style={{ textAlign: "center" }}>
          <p style={{ fontSize: 24, fontWeight: 800, color: "#8b5cf6" }}>
            {Object.values(doneSt).filter(Boolean).length}/{plan.study.length}
          </p>
          <p className="label">Tamamlanan</p>
        </div>
      </div>

      {plan.study.map((s, i) => (
        <div key={i} className={`check-row ${doneSt[i] ? "done" : ""}`} onClick={() => toggleSt(i)}>
          <div style={{ background: "#f59e0b22", borderRadius: 10, padding: 8, color: "#f59e0b" }}>
            <BookOpen size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600 }}>{s.subject}</p>
            <p className="muted">{s.duration} dk · {s.tip}</p>
          </div>
          <div className={`check-circle ${doneSt[i] ? "done" : ""}`}>
            {doneSt[i] && <Check size={14} color="#fff" />}
          </div>
        </div>
      ))}

      {/* Kendi Programın */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className="section-title">✏️ Kendi Programım</p>
        <button className="btn" style={{ padding: "8px 14px", fontSize: 12 }} onClick={() => setShowModal(true)}>
          <Plus size={14} /> Ekle
        </button>
      </div>

      {customItems.length === 0 && (
        <div className="card-sm" style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
          Kendi aktiviteni ekle!
        </div>
      )}

      {customItems.map(item => (
        <div key={item.id} className={`check-row ${doneCustom[item.id] ? "done" : ""}`}>
          <div style={{ background: "#8b5cf622", borderRadius: 10, padding: 8, color: "#8b5cf6" }} onClick={() => toggleCustom(item.id)}>
            <Clock size={18} />
          </div>
          <div style={{ flex: 1 }} onClick={() => toggleCustom(item.id)}>
            <p style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</p>
            <p className="muted">{item.type}{item.duration ? ` · ${item.duration} dk` : ""}{item.note ? ` · ${item.note}` : ""}</p>
          </div>
          <div className={`check-circle ${doneCustom[item.id] ? "done" : ""}`} onClick={() => toggleCustom(item.id)}>
            {doneCustom[item.id] && <Check size={14} color="#fff" />}
          </div>
          <button onClick={() => removeCustom(item.id)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", marginLeft: 8, padding: 4 }}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-handle" />
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Aktivite Ekle</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input placeholder="Aktivite adı *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="egzersiz">Egzersiz</option>
                <option value="ders">Ders</option>
                <option value="hobi">Hobi</option>
                <option value="diğer">Diğer</option>
              </select>
              <input placeholder="Süre (dk)" type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
              <input placeholder="Not (opsiyonel)" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
              <button className="btn" style={{ justifyContent: "center" }} onClick={addCustom}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
