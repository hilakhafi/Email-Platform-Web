import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    profileImage: null,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("profileImage", formData.profileImage);

      const response = await fetch("/api/register", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
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
        placeholder="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
      />
      {errors.fullName && <div className="error-text">{errors.fullName}</div>}

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      {errors.email && <div className="error-text">{errors.email}</div>}

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {errors.password && <div className="error-text">{errors.password}</div>}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
      />

      <button type="submit">Register</button>

      {serverError && <div className="error-text">{serverError}</div>}
    </form>
  );
}

export default Register; 