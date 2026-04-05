import { Home, Salad, Calendar, User } from "lucide-react";

const tabs = [
  { id: "home", label: "Ana Sayfa", Icon: Home },
  { id: "diet", label: "Diyet", Icon: Salad },
  { id: "program", label: "Program", Icon: Calendar },
  { id: "profile", label: "Profil", Icon: User },
];

export default function Nav({ active, onChange }) {
  return (
    <nav className="nav">
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-item ${active === id ? "active" : ""}`}
          onClick={() => onChange(id)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </nav>
  );
}
