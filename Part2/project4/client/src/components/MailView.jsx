export default function MailView({ mail }) {
  return (
    <section className="mail-view">
      {mail ? (
        <div>
          <h2>{mail.subject}</h2>
          <p><strong>From:</strong> {mail.from}</p>
          <p><strong>To:</strong> {mail.to}</p>
          <p>{mail.body}</p>
        </div>
      ) : (
        <p className="placeholder">Select an email to view</p>
      )}
    </section>
  );
}
