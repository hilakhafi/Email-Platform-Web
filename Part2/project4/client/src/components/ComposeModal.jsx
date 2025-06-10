export default function ComposeModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
        <h3>New Message</h3>
        <form>
          <input type="email" placeholder="To" required />
          <input type="text" placeholder="Subject" />
          <textarea placeholder="Body..." rows={8} />
          <button type="submit">Send</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
