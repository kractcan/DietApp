import { userProfile, getBMIStatus } from "../dietAI";
import { Ruler, Weight, Calendar, GraduationCap, Flame, Zap, Target } from "lucide-react";

export default function Profile() {
  const bmi = getBMIStatus();
  const bmiVal = parseFloat(userProfile.bmi);
  const bmiMin = 15, bmiMax = 40;
  const bmiPos = Math.min(Math.max((bmiVal - bmiMin) / (bmiMax - bmiMin), 0), 1) * 100;

  const stats = [
    { icon: <Ruler size={18} color="#3b82f6" />, label: "Boy", value: `${userProfile.height} cm`, color: "#3b82f6" },
    { icon: <Weight size={18} color="#ef4444" />, label: "Kilo", value: `${userProfile.weight} kg`, color: "#ef4444" },
    { icon: <Calendar size={18} color="#f59e0b" />, label: "Yaş", value: `${userProfile.age}`, color: "#f59e0b" },
    { icon: <GraduationCap size={18} color="#8b5cf6" />, label: "Sınıf", value: userProfile.grade, color: "#8b5cf6" },
    { icon: <Flame size={18} color="#ef4444" />, label: "Hedef", value: `${userProfile.targetCalories} kcal`, color: "#ef4444" },
    { icon: <Zap size={18} color="#10b981" />, label: "İhtiyaç", value: `${userProfile.dailyCalories} kcal`, color: "#10b981" },
  ];

  const goals = [
    "Haftada 0.5 kg vermek",
    "Günde 8 bardak su içmek",
    "Her gün 30 dk egzersiz",
    "LGS'ye hazırlanmak",
    "Düzenli uyku (22:30)",
  ];

  return (
    <div className="page fade-in">
      {/* Avatar */}
      <div style={{ textAlign: "center", paddingTop: 30, paddingBottom: 20 }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%",
          background: "var(--surface)", border: "3px solid var(--purple)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 44, margin: "0 auto 12px"
        }}>🧑‍🎓</div>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>{userProfile.name}</h2>
        <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 4 }}>{userProfile.grade} · {userProfile.goal}</p>
      </div>

      {/* BMI */}
      <div className="card" style={{ marginBottom: 14 }}>
        <p className="section-title" style={{ margin: "0 0 12px" }}>Vücut Kitle İndeksi</p>
        <div style={{ position: "relative", marginBottom: 6 }}>
          <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden" }}>
            {[["#3b82f6", 1], ["#10b981", 1.3], ["#f59e0b", 1], ["#ef4444", 1]].map(([color, flex], i) => (
              <div key={i} style={{ flex, background: color }} />
            ))}
          </div>
          <div style={{
            position: "absolute", top: -4, left: `${bmiPos}%`,
            width: 20, height: 20, borderRadius: "50%",
            background: "#fff", border: "3px solid var(--bg)",
            transform: "translateX(-50%)",
            boxShadow: `0 0 0 2px ${bmi.color}`
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          {["Zayıf", "Normal", "Fazla", "Obez"].map(l => (
            <span key={l} style={{ fontSize: 10, color: "var(--text3)" }}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: bmi.color + "11", borderRadius: 14, padding: "12px 16px" }}>
          <p style={{ fontSize: 40, fontWeight: 900, color: bmi.color, lineHeight: 1 }}>{bmiVal}</p>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: bmi.color }}>{bmi.status}</p>
            <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>{bmi.advice}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <p className="section-title">Bilgilerim</p>
      <div className="grid-3" style={{ marginBottom: 14 }}>
        {stats.map((s, i) => (
          <div key={i} className="card-sm" style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{s.icon}</div>
            <p style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</p>
            <p className="label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Hedefler */}
      <p className="section-title">Hedeflerim</p>
      <div className="card" style={{ marginBottom: 14 }}>
        {goals.map((g, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < goals.length - 1 ? "1px solid var(--border)" : "none" }}>
            <Target size={16} color="var(--green)" />
            <p style={{ fontSize: 14, color: "var(--text2)" }}>{g}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="card-sm" style={{ display: "flex", gap: 10, background: "#0f2a3a", borderColor: "#1e4a6a" }}>
        <span style={{ fontSize: 16 }}>ℹ️</span>
        <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>
          Kalori ihtiyacın Harris-Benedict formülüyle hesaplandı. Kilo vermek için günlük ihtiyacından 500 kcal düşük hedef belirlendi.
        </p>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}
