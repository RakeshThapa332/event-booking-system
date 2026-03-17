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

  const [bookingModal, setBookingModal] = useState(null);


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

    const selected = events.find((e) => e.id === Number(selectedEventId));
    if (!selected) {
      setError("Please choose a valid event.");
      return;
    }
    if (selected.status === 'completed') {
      setError("Cannot book completed events.");
      return;
    }
    if (bookings.some((b) => b.event === Number(selectedEventId))) {
      setError("You already booked this event.");
      return;
    }

    try {
      const res = await API.post("bookings/", { event: selectedEventId });
      setSuccess("Booking created successfully.");
      setBookingModal({ booking: res.data, event: eventById[selectedEventId] });
      fetchBookings();
    } catch (err) {
      const msg = err?.response?.data?.event || "Booking failed. Event may not exist.";
      setError(msg);
    }
  };

  const eventById = events.reduce((acc, ev) => {
    acc[ev.id] = ev;
    return acc;
  }, {});

  const handleDelete = async (bookingId) => {
    setError("");
    setSuccess("");
    try {
      await API.delete(`bookings/${bookingId}/`);
      setSuccess("Booking deleted.");
      fetchBookings();
    } catch (err) {
      setError("Failed to delete booking.");
    }
  };

  return (
    <div className="booking-panel">
      <h2>My Bookings</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {bookings.length === 0 ? <p>No bookings yet.</p> : (
        <ul className="plain">
          {bookings.map((b) => (
            <li key={b.id}>
              <div className="booking-header"><strong>Booking ID: {b.id}</strong> <button className="btn btn-danger" onClick={() => handleDelete(b.id)}>Delete</button></div>
              <div>Event: {eventById[b.event]?.title || `Event ID ${b.event}`}</div>
              <div>Status: {eventById[b.event]?.status === 'completed' ? <span className="event-status-chip completed">Completed</span> : <span className="event-status-chip">Upcoming</span>}</div>
              <div>Booked at: {new Date(b.booked_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleBook} style={{ marginTop: 12 }}>
        <h3>Book Event</h3>
        <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
          <option value="">Select event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id} disabled={bookings.some((b) => b.event === event.id)}>
              {event.title} ({new Date(event.date).toLocaleDateString()}) {event.status === 'completed' ? ' - Completed' : ''}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" type="submit" disabled={!selectedEventId}>Book Event</button>
      </form>
      {bookingModal && (
        <div className="modal-backdrop" onClick={() => setBookingModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Booking Confirmed</h3>
            <p>Your booking for <strong>{bookingModal.event?.title || 'event'}</strong> is confirmed.</p>
            <p>Booking ID: {bookingModal.booking.id}</p>
            <p>Booked at: {new Date(bookingModal.booking.booked_at).toLocaleString()}</p>
            <button className="btn btn-primary" onClick={() => setBookingModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingList;
