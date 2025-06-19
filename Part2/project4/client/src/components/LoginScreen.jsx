import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginScreen.css";
import { Mail } from "lucide-react";


export default function LoginScreen({ onLogin }) {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("email"); // "email" or "password"
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // function to handle email submission, it sends the email to the server to verify if it exists
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost:4000/api/tokens/verify-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail }),
    });
    if (res.ok) {
      setStep("password");
    } else {
      setError("Email not found");
    }
  };
// function to handle password submissio, it sends the email and password to the server to get a token
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
      <div className="form-header">
        <Mail size={36} color="#EA4335" />
        <h2>Sign in</h2>
      </div>
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