import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginScreen.css";

export default function LoginScreen({ onLogin }) {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("email"); // "email" or "password"
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // לשמירת פרטי המשתמש
  const navigate = useNavigate();

    // function to handle email submission, it sends the email to the server to verify if it exists
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("http://localhost:4000/api/tokens/verify-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail }),
      });
      
      if (res.ok) {
        // אם יש מידע על המשתמש - נשמור אותו
        try {
          const userData = await res.json();
          if (userData && typeof userData === 'object') {
            setUserProfile(userData);
          }
        } catch (err) {
          // אם אין מידע - לא נורא, נמשיך בלי
        }
        setStep("password");
      } else {
        setError("Email not found");
      }
    } catch (err) {
      setError("Connection error");
    }
  };

  // function to handle password submission, it sends the email and password to the server to get a token
  // const handlePasswordSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
    
  //   const res = await fetch("http://localhost:4000/api/tokens", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ mail, password }),
  //   });
    
  //   if (res.ok) {
  //     const data = await res.json();
  //     localStorage.setItem("token", data.token);
  //     localStorage.setItem("userId", data.userId);
  //     onLogin(data.userId);
  //   } else {
  //     setError("Incorrect password");
  //   }
  // };

  // function to handle password submission, it sends the email and password to the server to get a token
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
  };

  // פונקציה לקבלת השם הנכון להצגה
  const getDisplayName = () => {
    if (!userProfile) return mail.split('@')[0];
    
    // אם יש שם פרטי, השתמש בו, אחרת השתמש בשם משתמש או מייל
    if (userProfile.first_name) {
      return userProfile.first_name;
    } else if (userProfile.username) {
      return userProfile.username;
    } else {
      return mail.split('@')[0];
    }
  };

  // פונקציה לקבלת תמונת הפרופיל
  const getProfileImage = () => {
    if (userProfile && userProfile.avatar) {
      return `http://localhost:4000/${userProfile.avatar.replace(/\\/g, '/')}`;
    }
    return null;
  };

 return (
    <div className="google-register-page">
      <div className="form-container">
        {/* צד ימין */}
        <div className="side-panel">
          <img
            src="https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
            alt="Google"
            className="side-logo"
          />
          <h1>Sign in</h1>
          <p>to continue to Gmail</p>
        </div>

        {/* צד שמאל */}
        <form onSubmit={step === "email" ? handleEmailSubmit : handlePasswordSubmit}>
          {step === "email" ? (
            <>
              <input
                type="email"
                placeholder="Email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
              />
              {error && <div className="error-text">{error}</div>}
              <div className="form-actions">
                <button type="button"
                className="create-account-btn"
                onClick={() => navigate("/register")}>
                  Create account
                </button>
                <button type="submit" className="next-btn">
                  Next
                  </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="sign-in-title">Hi {getDisplayName()}</h2>
                <p className="user-email">{mail}</p>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="show-password-inline">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                Show password
              </label>
              {error && <div className="error-text">{error}</div>}
              <div className="buttons">
                <button type="button" onClick={() => setStep("email")}>
                  Back
                </button>
                <button type="submit">Sign in</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <div className="google-logo">
//           <svg width="75" height="24" viewBox="0 0 75 24" fill="none">
//             <path d="M37.44 12.24c0-.74-.06-1.28-.18-1.84H24v3.48h7.64c-.32 1.64-1.3 2.76-2.76 3.52v2.92h4.48c2.62-2.4 4.08-5.92 4.08-8.08z" fill="#4285F4"/>
//             <path d="M24 24c3.72 0 6.86-1.22 9.14-3.32l-4.48-2.92c-1.24.84-2.82 1.34-4.66 1.34-3.58 0-6.62-2.42-7.7-5.66H11.8v3.02C14.06 21.1 18.66 24 24 24z" fill="#34A853"/>
//             <path d="M16.3 13.44c-.28-.84-.44-1.74-.44-2.64s.16-1.8.44-2.64V5.14H11.8C10.68 7.38 10 9.62 10 12s.68 4.62 1.8 6.86l4.5-3.42z" fill="#FBBC05"/>
//             <path d="M24 4.76c2.02 0 3.84.7 5.26 2.06l3.94-3.94C30.86 1.08 27.72 0 24 0 18.66 0 14.06 2.9 11.8 7.54l4.5 3.42c1.08-3.24 4.12-5.2 7.7-5.2z" fill="#EA4335"/>
//           </svg>
//         </div>

//         <h1 className="sign-in-title">
//           {step === "email" ? "Sign in" : `Hey ${getDisplayName()}`}
//         </h1>
//         <p className="sign-in-subtitle">
//           {step === "email" 
//             ? "with your Google Account to continue" 
//             : ""
//           }
//         </p>

//         <form
//           className="login-form"
//           onSubmit={step === "email" ? handleEmailSubmit : handlePasswordSubmit}
//         >
// {step === "email" ? (
//   <>
//     <div className="input-group">
//       <input
//         type="email"
//         placeholder="Email or phone"
//         value={mail}
//         onChange={(e) => setMail(e.target.value)}
//         className="google-input"
//         required
//       />
//     </div>

//     {error && <div className="error-message">{error}</div>}

//     <div className="form-actions">
//       <button
//         type="button"
//         className="create-account-btn"
//         onClick={() => navigate("/register")}
//       >
//         Create account
//       </button>
//       <button type="submit" className="next-btn">
//         Next
//       </button>
//     </div>
//   </>
// ) : (
//   <>
//     {/* כותרת ושם */}
//     <div className="user-header">
//       <h2 className="sign-in-title">Hi {getDisplayName()}</h2>
//       <p className="user-email">{mail}</p>
//     </div>

//     <div className="password-section">
//       <div className="input-group">
//         <input
//           type={showPassword ? "text" : "password"}
//           placeholder="Enter your password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="google-input"
//           required
//         />
//         <label className="show-password-inline">
//           <input 
//             type="checkbox" 
//             checked={showPassword}
//             onChange={(e) => setShowPassword(e.target.checked)}
//           />
//           <span>Show password</span>
//         </label>
//       </div>
//     </div>

//     {error && <div className="error-message">{error}</div>}

//     <div className="form-actions">
//       <button 
//         type="button" 
//         className="back-btn"
//         onClick={() => setStep("email")}
//       >
//         Back
//       </button>
//       <button type="submit" className="next-btn">
//         Next
//       </button>
//     </div>
//   </>
// )}
//         </form>
//       </div>
//     </div>
//   );
// }