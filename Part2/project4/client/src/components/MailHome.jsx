import { useState, useEffect } from "react";
import "./MailHome.css";

export default function MailHome() {
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
console.log("📫 MailHome loaded!");

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
      <aside className="sidebar">
        <button className="compose-button" onClick={() => setShowCompose(true)}>
          ✉ Compose
        </button>
        <nav>
          <ul>
            <li>Inbox</li>
            <li>Sent</li>
            <li>Drafts</li>
            <li>Trash</li>
          </ul>
        </nav>
      </aside>

      <main className="mail-list">
        {loading && <p>Loading mails...</p>}
        {error && <p className="error">Error: {error}</p>}
        {!loading && !error && mails.map((mail) => (
          <div
            key={mail.id}
            className={`mail-item ${mail.id === selectedMail?.id ? "selected" : ""}`}
            onClick={() => setSelectedMail(mail)}
          >
            <strong>{mail.subject}</strong>
            <p>{mail.body.slice(0, 60)}...</p>
          </div>
        ))}
      </main>

      <section className="mail-view">
        {selectedMail ? (
          <div>
            <h2>{selectedMail.subject}</h2>
            <p><strong>From:</strong> {selectedMail.from}</p>
            <p><strong>To:</strong> {selectedMail.to}</p>
            <p>{selectedMail.body}</p>
          </div>
        ) : (
          <p className="placeholder">Select an email to view</p>
        )}
      </section>

      {showCompose && (
        <div className="modal-overlay" onClick={() => setShowCompose(false)}>
          <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
            <h3>New Message</h3>
            <form>
              <input type="email" placeholder="To" required />
              <input type="text" placeholder="Subject" />
              <textarea placeholder="Body..." rows={8} />
              <button type="submit">Send</button>
            </form>
            <button onClick={() => setShowCompose(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
