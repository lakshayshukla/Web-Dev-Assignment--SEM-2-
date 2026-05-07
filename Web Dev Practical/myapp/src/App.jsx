import { useState } from "react";

export default function App() {
  const [isDark, setIsDark] = useState(false);

  const toggle = () => setIsDark(!isDark);

  return (
    <div style={{
      height: "100vh",
      background: isDark ? "black" : "white",
      color: isDark ? "white" : "black"
    }}>
      <h2>Theme: {isDark ? "Dark" : "Light"}</h2>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}