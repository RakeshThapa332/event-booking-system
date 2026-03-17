function Navbar({ onLogout }) {
  return (
    <div className="navbar">
      <div>
        <strong>Dashboard</strong> • Create events, view sessions, and manage bookings.
      </div>
      <button className="logout-pill" onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Navbar;
