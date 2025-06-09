import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    mail: "",
    birth_date: "",
    gender: "",
    password: "",
    reWritePass: "",
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  // אימות לשלב הנוכחי
  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.first_name) newErrors.first_name = "First name is required";
      if (!formData.last_name) newErrors.last_name = "Last name is required";
      if (!formData.username) newErrors.username = "Username is required";
    } else if (step === 2) {
      if (!formData.birth_date) newErrors.birth_date = "Birth date is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
    } else if (step === 3) {
      if (!formData.mail) newErrors.mail = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.reWritePass)
        newErrors.reWritePass = "Passwords do not match";
    }
    return newErrors;
  };

  // אימות של כל השדות לפני שליחה
  const validateAll = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.birth_date) newErrors.birth_date = "Birth date is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.mail) newErrors.mail = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.reWritePass)
      newErrors.reWritePass = "Passwords do not match";
    return newErrors;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStep(step + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setErrors({});
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 handleSubmit called"); // << בדיקה

    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      for (let pair of data.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      console.log("📦 Sending data:", data);
      const response = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const text = await response.text(); // ← לא json כדי לא להיתקע אם זה טקסט פשוט
        console.error("Server response error:", text);
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed. Try again.");
      }

      navigate("/login");
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Register - Step {step}</h2>

      {step === 1 && (
        <>
          <input
            type="text"
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
          />
          {errors.first_name && <p className="error-text">{errors.first_name}</p>}

          <input
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
          />
          {errors.last_name && <p className="error-text">{errors.last_name}</p>}

          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          {errors.username && <p className="error-text">{errors.username}</p>}
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="date"
            value={formData.birth_date}
            onChange={(e) =>
              setFormData({ ...formData, birth_date: e.target.value })
            }
          />
          {errors.birth_date && (
            <p className="error-text">{errors.birth_date}</p>
          )}

          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="error-text">{errors.gender}</p>}
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={formData.mail}
            onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
          />
          {errors.mail && <p className="error-text">{errors.mail}</p>}

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.reWritePass}
            onChange={(e) =>
              setFormData({ ...formData, reWritePass: e.target.value })
            }
          />
          {errors.reWritePass && (
            <p className="error-text">{errors.reWritePass}</p>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, profileImage: e.target.files[0] })
            }
          />
        </>
      )}

      <div className="buttons">
        {step > 1 && <button onClick={handleBack}>Back</button>}
        {step < 3 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button type="submit">Register</button>
        )}
      </div>

      {serverError && <div className="error-text">{serverError}</div>}
    </form>
  );
}

export default Register;
