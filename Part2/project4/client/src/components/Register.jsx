import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
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

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.mail) newErrors.mail = "Email is required";
    if (!formData.birth_date) newErrors.birth_date = "Birth date is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.reWritePass) newErrors.reWritePass = "Please confirm your password";
    if (!formData.profileImage) newErrors.profileImage = "Profile image is required";
    console.log("Validating...", formData);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 handleSubmit called"); // << בדיקה

    const validationErrors = validate();
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
      <h2>Register</h2>

      <input
        type="text"
        placeholder="First Name"
        value={formData.first_name}
        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
      />
      {errors.first_name && <div className="error-text">{errors.first_name}</div>}

      <input
        type="text"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
      />
      {errors.last_name && <div className="error-text">{errors.last_name}</div>}

      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      {errors.username && <div className="error-text">{errors.username}</div>}

      <input
        type="email"
        placeholder="Email"
        value={formData.mail}
        onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
      />
      {errors.mail && <div className="error-text">{errors.mail}</div>}

      <input
        type="date"
        value={formData.birth_date}
        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
      />
      {errors.birth_date && <div className="error-text">{errors.birth_date}</div>}

     <select
        value={formData.gender}
        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      {errors.gender && <div className="error-text">{errors.gender}</div>}

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {errors.password && <div className="error-text">{errors.password}</div>}

      <input
        type="password"
        placeholder="Confirm Password"
        value={formData.reWritePass}
        onChange={(e) => setFormData({ ...formData, reWritePass: e.target.value })}
      />
      {errors.reWritePass && <div className="error-text">{errors.reWritePass}</div>}

      <input
        type="file"
        name="profileImage"
        accept="image/*"
        onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
      />

      <button type="submit">Register</button>

      {serverError && <div className="error-text">{serverError}</div>}
    </form>
  );
}

export default Register; 