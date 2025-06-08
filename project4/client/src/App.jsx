import { useState } from "react";
import LoginScreen from "./components/LoginScreen";

function App() {
  const [userId, setUserId] = useState(null);

  if (!userId) {
    return <LoginScreen onLogin={setUserId} />;
  }

  return <h1>ברוך הבא, משתמש {userId}!</h1>; // בהמשך תחליפי במסך ה־Inbox
}

export default App;
