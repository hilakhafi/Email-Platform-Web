export default function Sidebar({ onCompose }) {
  return (
    <aside className="sidebar">
      <button className="compose-button" onClick={onCompose}>
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
  );
}
