import { useEffect, useState } from "react";
import API from "../api";

function BookingList({ refreshEventsKey = 0 }) {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await API.get("bookings/");
      setBookings(res.data);
    } catch (err) {
      setError("Failed to fetch bookings.");
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await API.get("events/");
      setEvents(res.data);
      if (!selectedEventId && res.data.length > 0) {
        setSelectedEventId(res.data[0].id);
      }
    } catch (err) {
      setError("Failed to fetch events for booking.");
    }
  };

  useEffect(() => {
    setError("");
    setSuccess("");
    fetchEvents();
    fetchBookings();
  }, [refreshEventsKey]);

  const handleBook = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedEventId) {
      setError("Pick an event to book.");
      return;
    }

    try {
      await API.post("bookings/", { event: selectedEventId });
      setSuccess("Booking created successfully.");
      fetchBookings();
    } catch (err) {
      setError("Booking failed. Event may not exist.");
    }
  };

  const eventById = events.reduce((acc, ev) => {
    acc[ev.id] = ev;
    return acc;
  }, {});

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, background: "#fff" }}>
      <h2>My Bookings</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {bookings.length === 0 ? <p>No bookings yet.</p> : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {bookings.map((b) => (
            <li key={b.id} style={{ borderBottom: "1px solid #eee", marginBottom: 8, paddingBottom: 8 }}>
              <strong>Booking ID: {b.id}</strong>
              <div>Event: {eventById[b.event]?.title || `Event ID ${b.event}`}</div>
              <div>Booked at: {new Date(b.booked_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleBook} style={{ marginTop: 12 }}>
        <h3>Book event</h3>
        <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} style={{ width: "100%", marginBottom: 8 }}>
          <option value="">Select event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>{event.title} ({new Date(event.date).toLocaleDateString()})</option>
          ))}
        </select>
        <button type="submit">Book Event</button>
      </form>
    </div>
  );
}

export default BookingList;
