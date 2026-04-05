import { useState, useEffect } from "react";
import { Sparkles, Flame, UtensilsCrossed, TrendingDown, Droplets, Dumbbell, BookOpen } from "lucide-react";
import { userProfile, generateDailyPlan, getBMIStatus, WEEKLY_TIPS } from "../dietAI";

export default function Home() {
  const [plan] = useState(() => generateDailyPlan());
  const [tipIdx, setTipIdx] = useState(0);
  const bmi = getBMIStatus();

  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i + 1) % WEEKLY_TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="page fade-in">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Merhaba 👋</h1>
          <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 2 }}>{plan.dayName}, {plan.date}</p>
        </div>
        <span className="tag" style={{ background: "#4c1d9522", color: "var(--purple)", border: "1px solid #4c1d9544" }}>
          {userProfile.grade}
        </span>
      </div>

      {/* AI Card */}
      <div className="card-gradient" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ background: "#ffffff22", borderRadius: 12, padding: 8, flexShrink: 0 }}>
          <Sparkles size={18} color="#a78bfa" />
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.5, color: "#c4b5fd" }}>{plan.aiMessage}</p>
      </div>

      {/* BMI Card */}
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
        <div style={{ textAlign: "center", minWidth: 80 }}>
          <p className="label" style={{ marginBottom: 4 }}>BMI</p>
          <p style={{ fontSize: 38, fontWeight: 900, color: bmi.color, lineHeight: 1 }}>{userProfile.bmi}</p>
          <span className="tag" style={{ background: bmi.color + "22", color: bmi.color, marginTop: 6 }}>{bmi.status}</span>
        </div>
        <div style={{ flex: 1, borderLeft: "1px solid var(--border)", paddingLeft: 16 }}>
          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>{bmi.advice}</p>
          <p className="muted" style={{ marginTop: 8 }}>{userProfile.height} cm · {userProfile.weight} kg</p>
        </div>
      </div>

      {/* Kalori */}
      <div className="grid-3" style={{ marginBottom: 14 }}>
        {[
          { icon: <Flame size={18} color="#ef4444" />, val: plan.targetCalories, label: "Hedef kcal", color: "#ef4444" },
          { icon: <UtensilsCrossed size={18} color="#f59e0b" />, val: plan.totalCalories, label: "Plan kcal", color: "#f59e0b" },
          { icon: <TrendingDown size={18} color="#10b981" />, val: `${plan.calorieDiff >= 0 ? "-" : "+"}${Math.abs(plan.calorieDiff)}`, label: "Fark", color: plan.calorieDiff >= 0 ? "#10b981" : "#ef4444" },
        ].map((item, i) => (
          <div key={i} className="card-sm" style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{item.icon}</div>
            <p style={{ fontSize: 20, fontWeight: 800, color: item.color }}>{item.val}</p>
            <p className="label">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="card-sm" style={{ borderLeft: "3px solid var(--green)", background: "#052e1622", marginBottom: 14 }}>
        <p style={{ fontSize: 11, color: "var(--green)", fontWeight: 700, marginBottom: 4 }}>Günün İpucu</p>
        <p style={{ fontSize: 14, color: "var(--text2)" }}>{WEEKLY_TIPS[tipIdx]}</p>
      </div>

      {/* Quick Stats */}
      <p className="section-title">Bugünkü Program</p>
      <div className="grid-4">
        {[
          { icon: <UtensilsCrossed size={22} color="#8b5cf6" />, label: "5 Öğün" },
          { icon: <Dumbbell size={22} color="#3b82f6" />, label: plan.isRestDay ? "Dinlenme" : `${plan.exercises.length} Egzersiz` },
          { icon: <BookOpen size={22} color="#f59e0b" />, label: `${plan.study.length} Ders` },
          { icon: <Droplets size={22} color="#14b8a6" />, label: "8 Bardak" },
        ].map((item, i) => (
          <div key={i} className="card-sm" style={{ textAlign: "center", padding: "14px 8px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{item.icon}</div>
            <p style={{ fontSize: 10, color: "var(--text2)", fontWeight: 600 }}>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
