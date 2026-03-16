import { useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import EventList from "./components/EventList";
import EventForm from "./components/EventForm";
import BookingList from "./components/BookingList";
import Navbar from "./components/Navbar";
import { setAuthToken } from "./api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshEvents, setRefreshEvents] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>Event Booking System</h1>
      {!isLoggedIn ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "start" }}>
          <Login onSuccess={() => setIsLoggedIn(true)} />
          <Register />
        </div>
      ) : (
        <>
          <Navbar onLogout={handleLogout} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            <EventForm onEventCreated={() => setRefreshEvents((n) => n + 1)} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <EventList refreshKey={refreshEvents} />
              <BookingList refreshEventsKey={refreshEvents} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
