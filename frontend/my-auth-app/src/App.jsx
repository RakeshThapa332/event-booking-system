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
  const [authMode, setAuthMode] = useState("login");

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
  };

  return (
    <div className="app-shell">
      <div className="hero-panel">
        <div className="hero-content">
          <p className="hero-tag">Fast, simple event booking</p>
          <h1>Welcome to Event Planner</h1>
          <p className="hero-subtitle">
            Create events, discover sessions, and manage bookings in one place.
            Login or register to continue.
          </p>
        </div>

        {!isLoggedIn ? (
          <div className="auth-layout">
            <div className="auth-auth-card">
              <div className="auth-toggle">
                <button className={authMode === "login" ? "tab active" : "tab"} onClick={() => setAuthMode("login")}>Login</button>
                <button className={authMode === "register" ? "tab active" : "tab"} onClick={() => setAuthMode("register")}>Register</button>
              </div>

              {authMode === "login" ? (
                <>
                  <h2>Login</h2>
                  <p className="form-note">Enter your username and password to continue.</p>
                  <Login onSuccess={() => setIsLoggedIn(true)} />
                </>
              ) : (
                <>
                  <h2>Create Account</h2>
                  <p className="form-note">Register quickly to start booking events.</p>
                  <Register />
                </>
              )}
            </div>
            <div className="auth-promo-card">
              <h2>Welcome to Event Planner</h2>
              <p>Plan events, share sessions, and track bookings—all in one clean dashboard.</p>
              <ul>
                <li>Secure sign-in with JWT</li>
                <li>Create events in seconds</li>
                <li>Book sessions quickly</li>
                <li>Simple and responsive UI</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="dashboard-panel">
            <Navbar onLogout={handleLogout} />
            <div className="dashboard-top-grid">
              <EventForm onEventCreated={() => setRefreshEvents((n) => n + 1)} />
              <BookingList refreshEventsKey={refreshEvents} />
            </div>
            <div className="event-list-wrap" style={{ marginTop: '1rem' }}>
              <EventList refreshKey={refreshEvents} onEventsChanged={() => setRefreshEvents((n) => n + 1)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
