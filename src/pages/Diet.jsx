import { useState, useEffect } from "react";
import { Sun, Coffee, UtensilsCrossed, IceCream, Moon, Check, Plus, Trash2 } from "lucide-react";
import { generateDailyPlan, getMotivation } from "../dietAI";

const MEAL_META = {
  kahvalti: { icon: <Sun size={20} />, color: "#f59e0b", label: "Kahvaltı" },
  ara1:     { icon: <Coffee size={20} />, color: "#14b8a6", label: "Ara Öğün 1" },
  ogle:     { icon: <UtensilsCrossed size={20} />, color: "#3b82f6", label: "Öğle Yemeği" },
  ara2:     { icon: <IceCream size={20} />, color: "#8b5cf6", label: "Ara Öğün 2" },
  aksam:    { icon: <Moon size={20} />, color: "#ef4444", label: "Akşam Yemeği" },
};

const STORAGE_KEY = `diet_${new Date().toDateString()}`;

export default function Diet() {
  const [plan] = useState(() => generateDailyPlan());
  const [eaten, setEaten] = useState({});
  const [water, setWater] = useState(0);
  const [customMeals, setCustomMeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", calories: "", protein: "", carb: "", fat: "" });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const d = JSON.parse(saved);
      setEaten(d.eaten || {});
      setWater(d.water || 0);
      setCustomMeals(d.customMeals || []);
    }
  }, []);

  const save = (e, w, c) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ eaten: e, water: w, customMeals: c }));
  };

  const toggleMeal = (key) => {
    const n = { ...eaten, [key]: !eaten[key] };
    setEaten(n); save(n, water, customMeals);
  };

  const addWater = () => {
    if (water < 12) { const w = water + 1; setWater(w); save(eaten, w, customMeals); }
  };

  const removeWater = () => {
    if (water > 0) { const w = water - 1; setWater(w); save(eaten, w, customMeals); }
  };

  const addCustomMeal = () => {
    if (!form.name || !form.calories) return;
    const meal = { id: Date.now(), name: form.name, calories: +form.calories, protein: +form.protein || 0, carb: +form.carb || 0, fat: +form.fat || 0 };
    const c = [...customMeals, meal];
    setCustomMeals(c); save(eaten, water, c);
    setForm({ name: "", calories: "", protein: "", carb: "", fat: "" });
    setShowModal(false);
  };

  const removeCustom = (id) => {
    const c = customMeals.filter(m => m.id !== id);
    const e = { ...eaten }; delete e[`custom_${id}`];
    setCustomMeals(c); setEaten(e); save(e, water, c);
  };

  const aiMealCalories = Object.keys(MEAL_META)
    .filter(k => eaten[k])
    .reduce((s, k) => s + (plan.meals[k]?.calories || 0), 0);

  const customCalories = customMeals
    .filter(m => eaten[`custom_${m.id}`])
    .reduce((s, m) => s + m.calories, 0);

  const consumed = aiMealCalories + customCalories;
  const progress = Math.min(consumed / plan.targetCalories, 1);
  const progressColor = progress > 1 ? "#ef4444" : progress > 0.8 ? "#f59e0b" : "#10b981";

  return (
    <div className="page fade-in">
      <h1 className="page-title">Diyet Takibi</h1>

      {/* Progress */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span className="label">Günlük Kalori</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{consumed} / {plan.targetCalories} kcal</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress * 100}%`, background: progressColor }} />
        </div>
        <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 10, textAlign: "center" }}>
          {getMotivation(consumed, plan.targetCalories)}
        </p>
      </div>

      {/* AI Öğünler */}
      <p className="section-title">AI Öğün Planı</p>
      {Object.keys(MEAL_META).map(key => {
        const meal = plan.meals[key];
        const meta = MEAL_META[key];
        const done = eaten[key];
        return (
          <div key={key} className={`check-row ${done ? "done" : ""}`} onClick={() => toggleMeal(key)}>
            <div style={{ background: meta.color + "22", borderRadius: 12, padding: 8, color: meta.color, flexShrink: 0 }}>
              {meta.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: "var(--text3)", marginBottom: 2 }}>{meta.label}</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{meal.name}</p>
              <p className="muted" style={{ marginTop: 2 }}>P:{meal.protein}g · K:{meal.carb}g · Y:{meal.fat}g</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: meta.color }}>{meal.calories}</p>
              <p className="muted">kcal</p>
            </div>
            <div className={`check-circle ${done ? "done" : ""}`} style={{ marginLeft: 8 }}>
              {done && <Check size={14} color="#fff" />}
            </div>
          </div>
        );
      })}

      {/* Kendi Öğünlerin */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className="section-title">Kendi Öğünlerim</p>
        <button className="btn" style={{ padding: "8px 14px", fontSize: 12 }} onClick={() => setShowModal(true)}>
          <Plus size={14} /> Ekle
        </button>
      </div>

      {customMeals.length === 0 && (
        <div className="card-sm" style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
          Henüz öğün eklemedin. + Ekle butonuna bas.
        </div>
      )}

      {customMeals.map(meal => {
        const key = `custom_${meal.id}`;
        const done = eaten[key];
        return (
          <div key={meal.id} className={`check-row ${done ? "done" : ""}`} style={{ position: "relative" }}>
            <div style={{ flex: 1 }} onClick={() => toggleMeal(key)}>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{meal.name}</p>
              <p className="muted">P:{meal.protein}g · K:{meal.carb}g · Y:{meal.fat}g</p>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: "var(--purple)", marginRight: 8 }} onClick={() => toggleMeal(key)}>
              {meal.calories} <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text3)" }}>kcal</span>
            </p>
            <div className={`check-circle ${done ? "done" : ""}`} onClick={() => toggleMeal(key)}>
              {done && <Check size={14} color="#fff" />}
            </div>
            <button onClick={() => removeCustom(meal.id)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", marginLeft: 8, padding: 4 }}>
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}

      {/* Su */}
      <p className="section-title">Su Takibi 💧</p>
      <div className="card" style={{ textAlign: "center" }}>
        <div className="water-grid" style={{ marginBottom: 12 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className={`water-glass ${i < water ? "filled" : ""}`} onClick={addWater}>💧</span>
          ))}
        </div>
        <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{water} / 8 bardak</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button className="btn btn-ghost" style={{ padding: "8px 16px" }} onClick={removeWater}>-1</button>
          <button className="btn" style={{ padding: "8px 16px" }} onClick={addWater}>+1 Bardak</button>
        </div>
        {water >= 8 && <p style={{ color: "var(--green)", marginTop: 10, fontSize: 13 }}>Günlük su hedefine ulaştın! 🎉</p>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-handle" />
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Öğün Ekle</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input placeholder="Öğün adı *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input placeholder="Kalori (kcal) *" type="number" value={form.calories} onChange={e => setForm(f => ({ ...f, calories: e.target.value }))} />
              <div className="grid-3">
                <input placeholder="Protein (g)" type="number" value={form.protein} onChange={e => setForm(f => ({ ...f, protein: e.target.value }))} />
                <input placeholder="Karbonhidrat (g)" type="number" value={form.carb} onChange={e => setForm(f => ({ ...f, carb: e.target.value }))} />
                <input placeholder="Yağ (g)" type="number" value={form.fat} onChange={e => setForm(f => ({ ...f, fat: e.target.value }))} />
              </div>
              <button className="btn" style={{ justifyContent: "center" }} onClick={addCustomMeal}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
