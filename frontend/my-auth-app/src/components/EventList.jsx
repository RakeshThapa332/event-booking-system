import { useEffect, useState } from "react";
import API from "../api";

function EventList({ refreshKey = 0, onEventsChanged }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const deleteEvent = async (eventId) => {
    setError("");
    try {
      await API.delete(`events/${eventId}/`);
      loadEvents();
      onEventsChanged?.();
    } catch (err) {
      setError("Failed to delete event. Only creator can delete.");
    }
  };

  const [editingEvent, setEditingEvent] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", description: "", location: "", date: "" });

  const markComplete = async (eventId) => {
    setError("");
    try {
      await API.post(`events/${eventId}/complete/`);
      loadEvents();
      onEventsChanged?.();
    } catch (err) {
      setError("Failed to complete event.");
    }
  };

  const startEdit = (event) => {
    setEditingEvent(event);
    setEditValues({ title: event.title, description: event.description || "", location: event.location, date: event.date });
  };

  const saveEdit = async () => {
    setError("");
    try {
      await API.put(`events/${editingEvent.id}/`, editValues);
      setEditingEvent(null);
      loadEvents();
      onEventsChanged?.();
    } catch (err) {
      setError("Update failed. Ensure required fields are correct.");
    }
  };

  useEffect(() => {
    loadEvents();
  }, [refreshKey]);

  return (
    <div className="event-panel">
      <h2>Available Events</h2>
      {loading && <p>Loading events...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && events.length === 0 && <p>No events available yet.</p>}
      <div className="event-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-image" style={{ backgroundImage: `url(${event.image || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'})` }} />
            <div className="event-card-body">
                <strong>{event.title}</strong>
                <p>{event.description || "No description yet."}</p>
                <div className="event-meta">{event.location} • <span className="event-date">{new Date(event.date).toLocaleString()}</span></div>
                <div className="event-meta">Status: <strong>{event.status === 'completed' ? 'Completed' : 'Upcoming'}</strong></div>
                <div className="event-meta">Created by: {event.created_by}</div>
                <div className="event-card-actions">
                  <button className="btn btn-primary" onClick={() => setSelectedEvent(event)}>View</button>
                  {event.can_edit && <button className="btn btn-primary" onClick={() => startEdit(event)}>Edit</button>}
                  {event.can_mark_complete && <button className="btn btn-primary" onClick={() => markComplete(event.id)}>Complete</button>}
                  {event.can_delete && <button className="btn btn-danger" onClick={() => deleteEvent(event.id)}>Delete</button>}
                </div>
              </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-grid">
              <div className="event-modal-left">
                <h3>{selectedEvent.title}</h3>
                <p>{selectedEvent.description || "No description."}</p>
                <p><strong>Location:</strong> {selectedEvent.location}</p>
                <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleString()}</p>
                <p><strong>Status:</strong> {selectedEvent.status}</p>
                <p><strong>Created by:</strong> {selectedEvent.created_by}</p>
              </div>
              <div className="event-modal-image" style={{ backgroundImage: `url(${selectedEvent.image || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'})` }} />
            </div>
            <button onClick={() => setSelectedEvent(null)} className="btn btn-primary">Close</button>
          </div>
        </div>
      )}

      {editingEvent && (
        <div className="modal-backdrop" onClick={() => setEditingEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Event</h3>
            <div className="form-block">
              <input value={editValues.title} onChange={(e) => setEditValues((v) => ({ ...v, title: e.target.value }))} placeholder="Title" />
              <input value={editValues.description} onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))} placeholder="Description" />
              <input value={editValues.location} onChange={(e) => setEditValues((v) => ({ ...v, location: e.target.value }))} placeholder="Location" />
              <div className="date-row">
                <input type="datetime-local" value={editValues.date} onChange={(e) => setEditValues((v) => ({ ...v, date: e.target.value }))} />
              </div>
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" onClick={saveEdit}>Save</button>
              <button className="btn btn-danger" onClick={() => setEditingEvent(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventList;
