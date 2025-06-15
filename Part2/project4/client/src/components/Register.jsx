import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

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

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // אימות לשלב הנוכחי
  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.first_name) {
    newErrors.first_name = "First name is required";
  } else if (!/^[A-Za-zא-ת]{2,}$/.test(formData.first_name)) {
    newErrors.first_name = "First name must have at least 2 letters";
  }

  if (!formData.last_name) {
    newErrors.last_name = "Last name is required";
  } else if (!/^[A-Za-zא-ת]{2,}$/.test(formData.last_name)) {
    newErrors.last_name = "Last name must have at least 2 letters";
  }

  if (!formData.username) {
    newErrors.username = "Username is required";
  } else if (formData.username.length < 3) {
    newErrors.username = "Username must be at least 3 characters long";
  }
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

  // פונקציה שיוצרת Blob של תמונה עם אות על רקע צבעוני
const generateDefaultProfileImage = (letter) => {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext("2d");

  // צבע רקע אקראי מתוך רשימה
  const colors = ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];

  // רקע
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // טקסט – האות הראשונה
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 100px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter.toUpperCase(), canvas.width / 2, canvas.height / 2);

  // הפיכה ל־Blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/png");
  });
};


 const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        if (key !== "profileImage") {
          data.append(key, formData[key]);
        }
      }

      // אם לא צורפה תמונה → צור ברירת מחדל עם אות ראשונה מהאימייל
      if (!formData.profileImage) {
        const firstLetter = formData.mail?.charAt(0) || "U";
        const blob = await generateDefaultProfileImage(firstLetter);
        const previewUrl = URL.createObjectURL(blob);
        setPreviewImage(previewUrl);
        data.append("profileImage", blob, "generated-profile.png");
      } else {
        data.append("profileImage", formData.profileImage);
      }

      const response = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Server response error:", result);
        setServerError(result.error || "Registration failed. Try again.");
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error("❌ Registration error:", err.message);
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

          {/* <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, profileImage: e.target.files[0] })
            }
          /> */}

          <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setFormData({ ...formData, profileImage: file });

            if (file) {
              setPreviewImage(URL.createObjectURL(file));
            } else {
              setPreviewImage(null);
            }
          }}
        />
        {previewImage && (
        <div className="image-preview">
          <img
            src={previewImage}
            alt="Preview"
            style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "10px" }}
          />
        </div>
      )}

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
