// import { useState } from "react";
// import LoginScreen from "./components/LoginScreen";

// function App() {
//   const [userId, setUserId] = useState(null);

//   const handleLogin = (id) => {
//     setUserId(id);
//   };

//   return (
//     <div className="App">
//       {userId ? (
//         <h1>מחובר! מזהה משתמש: {userId}</h1> // תחליפי בהמשך ב-Inbox או Dashboard
//       ) : (
//         <LoginScreen onLogin={handleLogin} />
//       )}
//     </div>
//   );
// }

// export default App;

// import { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import LoginScreen from "./components/LoginScreen";
// import Register from "./components/Register";

// function App() {
//   const [userId, setUserId] = useState(null);

//   return (
//     <Router>
//       {!userId ? (
//         <Routes>
//           <Route path="/login" element={<LoginScreen onLogin={setUserId} />} />
//           <Route path="/register" element={<Register />} />
//           {/* כל נתיב אחר ינותב ל-login */}
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       ) : (
//         <Routes>
//           {/* כאן את יכולה להחליף את זה ב-Dashboard או Inbox */}
//           <Route
//             path="*"
//             element={
//               <div style={{ padding: "1rem" }}>
//                 <h1>מחובר! מזהה משתמש: {userId}</h1>
//                 <button onClick={() => setUserId(null)}>התנתק</button>
//               </div>
//             }
//           />
//         </Routes>
//       )}
//     </Router>
//   );
// }

// export default App;


import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import Register from "./components/Register";
import MailHome from "./components/MailHome"; 


function App() {
  const [userId, setUserId] = useState(null);

  const handleLogin = (id) => setUserId(id);

  return (
    <div className="App">
      <Routes>
        {!userId ? (
          <>
            <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/mails" replace />} />
            <Route path="/mails" element={<MailHome />} />
            <Route path="*" element={<Navigate to="/mails" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
