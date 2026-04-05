import { useState } from "react";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Diet from "./pages/Diet";
import Program from "./pages/Program";
import Profile from "./pages/Profile";

export default function App() {
  const [tab, setTab] = useState("home");

  const pages = { home: <Home />, diet: <Diet />, program: <Program />, profile: <Profile /> };

  return (
    <>
      {pages[tab]}
      <Nav active={tab} onChange={setTab} />
    </>
  );
}
