export default function MailList({ mails, loading, error, selectedMail, onSelect }) {
  if (loading) return <main className="mail-list"><p>Loading mails...</p></main>;
  if (error) return <main className="mail-list"><p className="error">Error: {error}</p></main>;

  return (
    <main className="mail-list">
      {mails.map((mail) => (
        <div
          key={mail.id}
          className={`mail-item ${mail.id === selectedMail?.id ? "selected" : ""}`}
          onClick={() => onSelect(mail)}
        >
          <strong>{mail.subject}</strong>
          <p>{mail.body.slice(0, 60)}...</p>
        </div>
      ))}
    </main>
  );
}
