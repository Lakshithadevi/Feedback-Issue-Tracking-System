export default function Topbar({ spaceName, onCreate }) {
  return (
    <div className="topbar">
      <h3>{spaceName}</h3>
      <button onClick={onCreate}>+ Create Issue</button>
    </div>
  );
}