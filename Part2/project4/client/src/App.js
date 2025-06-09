import { useState } from "react";
import LoginScreen from "./components/LoginScreen";

function App() {
  const [userId, setUserId] = useState(null);

  const handleLogin = (id) => {
    setUserId(id);
  };

  return (
    <div className="App">
      {userId ? (
        <h1>מחובר! מזהה משתמש: {userId}</h1> // תחליפי בהמשך ב-Inbox או Dashboard
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
