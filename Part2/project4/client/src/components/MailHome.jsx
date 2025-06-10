import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MailList from "./MailList";
import MailView from "./MailView";
import ComposeModal from "./ComposeModal";
import "../styles/MailHome.css";
export default function MailHome() {
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMails() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/mails");
        if (!res.ok) throw new Error("Failed to fetch mails");
        const data = await res.json();
        setMails(data);
      } catch (err) {
        setError(err.message || "Unknown error");
        setMails([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMails();
  }, []);

  return (
    <div className="mail-home">
      <Sidebar onCompose={() => setShowCompose(true)} />
      <MailList
        mails={mails}
        loading={loading}
        error={error}
        selectedMail={selectedMail}
        onSelect={setSelectedMail}
      />
      <MailView mail={selectedMail} />
      {showCompose && <ComposeModal onClose={() => setShowCompose(false)} />}
    </div>
  );
}
