import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginScreen.css";

export default function LoginScreen({ onLogin }) {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("email"); // "email" or "password"
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    //172.20.10.2
    // את יכולה לשנות את זה לפי איך השרת שלך בנוי
    const res = await fetch("http://localhost:4000/api/tokens/verify-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail }),
    });
    console.log("here");
    if (res.ok) {
      setStep("password");
    } else {
      setError("Email not found");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:4000/api/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      onLogin(data.userId);
    } else {
      setError("Incorrect password");
    }
    console.log("Saved token:", localStorage.getItem("token"));

  };

  return (
    <div className="login-container">
      <form
        className="login-form"
        onSubmit={step === "email" ? handleEmailSubmit : handlePasswordSubmit}
      >
        <h2>Sign in</h2>

        {step === "email" ? (
          <>
            <input
              type="email"
              placeholder="Email address"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
            <button type="submit">Next</button>

            {error && <p className="error">{error}</p>}

            <p className="signup-redirect">
              Don't have an account?
              <button
                type="button"
                onClick={() => navigate("/register")}
              >
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            <p className="email-display">Email: <strong>{mail}</strong></p>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="buttons">
              <button type="button" onClick={() => setStep("email")}>
                Back
              </button>
              <button type="submit">Login</button>
            </div>

            {error && <p className="error">{error}</p>}
          </>
        )}
      </form>
    </div>
  );

}