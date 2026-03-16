function Navbar({ onLogout }) {
  return (
    <div style={{ background: "#1f2937", color: "#fff", padding: 10, borderRadius: 8, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        Logged in. You can create events, view events, and make bookings.
      </div>
      <button onClick={onLogout} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, padding: "0.4rem 0.8rem" }}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;
