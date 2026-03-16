import { useEffect, useState } from "react";
import API from "../api";

function EventList({ refreshKey = 0 }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("events/");
      setEvents(res.data);
    } catch (err) {
      setError("Failed to load events. Please log in or check API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [refreshKey]);

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, background: "#fff" }}>
      <h2>Available Events</h2>
      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && events.length === 0 && <p>No events available yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {events.map((event) => (
          <li key={event.id} style={{ borderBottom: "1px solid #eee", marginBottom: 8, paddingBottom: 8 }}>
            <strong>{event.title}</strong>
            <div>{event.description || "No description"}</div>
            <div>{event.location}</div>
            <div>{new Date(event.date).toLocaleString()}</div>
            <div style={{ color: "#555", fontSize: "0.9rem" }}>Created by ID: {event.created_by}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventList;
