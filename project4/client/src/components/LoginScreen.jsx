import { useState } from "react";
import "./LoginScreen.css";

export default function LoginScreen({ onLogin }) {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail, password }),
    });

    if (res.ok) {
      const data = await res.json();
      onLogin(data.userId);
    } else {
      setError("שם משתמש או סיסמה שגויים");
    }
  };

  return (
    <div className="login-container">
      <h2>התחברות</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="כתובת מייל"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">התחבר</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
