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
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.mail) newErrors.email = "Email is required";
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
      for (const key in formData) {
       data.append(key, formData[key]);
      }

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
        placeholder="First Name"
        value={formData.first_name}
        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
      />

      <input
        type="text"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
      />

      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        value={formData.mail}
        onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
      />

      <input
        type="date"
        value={formData.birth_date}
        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
      />

      <select
        value={formData.gender}
        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={formData.reWritePass}
        onChange={(e) => setFormData({ ...formData, reWritePass: e.target.value })}
      />

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