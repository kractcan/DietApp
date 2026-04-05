const userProfile = {
  name: "Öğrenci",
  age: 14,
  grade: "8. Sınıf",
  height: 172,
  weight: 87,
  gender: "erkek",
  goal: "kilo vermek",
};

const bmr = 88.36 + 13.4 * userProfile.weight + 4.8 * userProfile.height - 5.7 * userProfile.age;
userProfile.dailyCalories = Math.round(bmr * 1.375);
userProfile.targetCalories = userProfile.dailyCalories - 500;
userProfile.bmi = (userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1);

export { userProfile };

const MEALS = {
  kahvalti: [
    { name: "Yulaf ezmesi + muz", calories: 320, protein: 10, carb: 58, fat: 6 },
    { name: "2 yumurta + tam buğday ekmek", calories: 280, protein: 18, carb: 24, fat: 12 },
    { name: "Yoğurt + granola + çilek", calories: 350, protein: 14, carb: 52, fat: 8 },
    { name: "Peynirli omlet + salata", calories: 310, protein: 20, carb: 8, fat: 18 },
  ],
  ogle: [
    { name: "Izgara tavuk + bulgur + salata", calories: 480, protein: 38, carb: 52, fat: 10 },
    { name: "Mercimek çorbası + ekmek", calories: 380, protein: 22, carb: 58, fat: 6 },
    { name: "Fırın somon + brokoli + pirinç", calories: 520, protein: 42, carb: 44, fat: 14 },
    { name: "Kuru fasulye + bulgur + cacık", calories: 440, protein: 24, carb: 62, fat: 8 },
  ],
  aksam: [
    { name: "Izgara köfte + sebze + yoğurt", calories: 420, protein: 34, carb: 28, fat: 16 },
    { name: "Tavuk sote + zeytinyağlı sebze", calories: 380, protein: 36, carb: 22, fat: 12 },
    { name: "Balık buğulama + salata", calories: 340, protein: 38, carb: 12, fat: 10 },
    { name: "Nohut yemeği + yoğurt", calories: 400, protein: 20, carb: 56, fat: 8 },
  ],
  ara: [
    { name: "1 elma + 10 badem", calories: 180, protein: 4, carb: 28, fat: 8 },
    { name: "Yoğurt + bal", calories: 160, protein: 8, carb: 24, fat: 4 },
    { name: "Muz", calories: 120, protein: 2, carb: 28, fat: 0 },
    { name: "Tam buğday kraker + peynir", calories: 200, protein: 10, carb: 22, fat: 8 },
  ],
};

const EXERCISES = [
  { name: "30 dk yürüyüş", duration: 30, calories: 150, type: "cardio" },
  { name: "20 dk koşu", duration: 20, calories: 200, type: "cardio" },
  { name: "Şınav 3×15", duration: 15, calories: 80, type: "güç" },
  { name: "Mekik 3×20", duration: 15, calories: 70, type: "güç" },
  { name: "Squat 3×15", duration: 15, calories: 90, type: "güç" },
  { name: "Bisiklet 30 dk", duration: 30, calories: 220, type: "cardio" },
];

const STUDY_BLOCKS = [
  { subject: "Matematik", duration: 45, tip: "Konu tekrarı + soru çöz" },
  { subject: "Türkçe", duration: 40, tip: "Paragraf soruları" },
  { subject: "Fen Bilimleri", duration: 45, tip: "Deney notları + test" },
  { subject: "İngilizce", duration: 35, tip: "Kelime + gramer" },
  { subject: "Sosyal Bilgiler", duration: 40, tip: "Harita + özet" },
  { subject: "Din Kültürü", duration: 30, tip: "Konu özeti" },
  { subject: "İnkılap Tarihi", duration: 35, tip: "Kronoloji çalış" },
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function generateDailyPlan() {
  const day = new Date().getDay();
  const isRestDay = day === 0;
  const kahvalti = pick(MEALS.kahvalti);
  const ogle = pick(MEALS.ogle);
  const aksam = pick(MEALS.aksam);
  const ara1 = pick(MEALS.ara);
  const ara2 = pick(MEALS.ara);
  const totalCalories = kahvalti.calories + ogle.calories + aksam.calories + ara1.calories + ara2.calories;
  const exercises = isRestDay ? [] : [
    pick(EXERCISES.filter(e => e.type === "cardio")),
    pick(EXERCISES.filter(e => e.type === "güç")),
  ];
  const study = [...STUDY_BLOCKS].sort(() => Math.random() - 0.5).slice(0, 3);
  const bmi = parseFloat(userProfile.bmi);
  const aiMessage = bmi > 30
    ? "Bugün hedef kalorinin altında kalmaya çalış. Su içmeyi unutma! 💧"
    : bmi > 25
    ? "Harika gidiyorsun! Düzenli egzersiz ve dengeli beslenme ile hedefe ulaşacaksın. 💪"
    : "Sağlıklı kilodayken kas geliştirmeye odaklan. Protein alımına dikkat et! 🥩";

  return {
    date: new Date().toLocaleDateString("tr-TR"),
    dayName: ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"][day],
    isRestDay,
    meals: { kahvalti, ogle, aksam, ara1, ara2 },
    totalCalories,
    targetCalories: userProfile.targetCalories,
    calorieDiff: userProfile.targetCalories - totalCalories,
    exercises,
    study,
    aiMessage,
  };
}

export function getBMIStatus() {
  const bmi = parseFloat(userProfile.bmi);
  if (bmi < 18.5) return { status: "Zayıf", color: "#3498db", advice: "Daha fazla kalori alman gerekiyor." };
  if (bmi < 25) return { status: "Normal", color: "#2ecc71", advice: "Kilonu korumaya devam et!" };
  if (bmi < 30) return { status: "Fazla Kilolu", color: "#f39c12", advice: "Hafif kalori açığı ve egzersiz önerilir." };
  return { status: "Obez", color: "#e74c3c", advice: "Doktor kontrolü ve düzenli egzersiz şart." };
}

export function getMotivation(consumed, target) {
  const r = consumed / target;
  if (r < 0.5) return "Güzel başlangıç! Öğle yemeğini atlamayı unutma 💪";
  if (r < 0.8) return "Harika gidiyorsun, hedefe yaklaşıyorsun! 🔥";
  if (r < 1.0) return "Neredeyse tamamladın! ⚡";
  if (r < 1.2) return "Biraz aştın ama sorun değil 😊";
  return "Bugün fazla kalori aldın. Yarın daha dikkatli ol! 🥗";
}

export const WEEKLY_TIPS = [
  "🥤 Günde 8 bardak su iç",
  "🚶 Her gün en az 30 dk yürü",
  "🥗 Tabağının yarısı sebze olsun",
  "📚 LGS için günde 2 saat çalış",
  "😴 Günde 8-9 saat uyu",
  "🍎 Ara öğünlerde meyve tercih et",
  "📵 Yemek yerken telefona bakma",
];
