// import { useState } from "react";
// import LoginScreen from "./components/LoginScreen";

// function App() {
//   const [userId, setUserId] = useState(null);

//   if (!userId) {
//     return <LoginScreen onLogin={setUserId} />;
//   }

//   return <h1>ברוך הבא, משתמש {userId}!</h1>; // בהמשך תחליפי במסך ה־Inbox
// }

// export default App;

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import Register from "./components/Register";
import MailHome from "./components/MailHome";

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <Routes>
        {!userId ? (
          <>
            <Route path="/login" element={<LoginScreen onLogin={setUserId} />} />
            <Route path="/register" element={<Register />} />
            {/* אם מישהו ניגש לכתובת אחרת, נשלח אותו ל-login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
       <>
            <Route path="/mails" element={<MailHome />} />
            <Route path="*" element={<Navigate to="/mails" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;