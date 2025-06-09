import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    mail: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
    setErrors({});
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    const { fullName, mail, password, confirmPassword } = formData;

    if (!fullName) newErrors.fullName = "Full name is required";
    if (!mail) newErrors.mail = "Email is required";
    if (!password) newErrors.password = "Password is required";
    else if (!isStrongPassword(password))
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, and a number";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

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
      data.append("mail", formData.mail);
      data.append("password", formData.password);
      data.append("profileImage", formData.profileImage);

      await axios.post("/api/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/login");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      {serverError && <p className="error-text">{serverError}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="error-text">{errors.fullName}</p>}
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.mail}
            onChange={handleChange}
          />
          {errors.mail && <p className="error-text">{errors.mail}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}
        </div>

        <div>
          <label>Profile Image:</label>
          <input type="file" name="profileImage" onChange={handleChange} />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
