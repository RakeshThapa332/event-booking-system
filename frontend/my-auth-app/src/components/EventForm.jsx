import { useState } from "react";
import API from "../api";

function EventForm({ onEventCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !location || !date) {
      setError("Please fill title, location, and date.");
      return;
    }

    try {
      await API.post("events/", { title, description, location, date });
      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      onEventCreated?.();
      alert("Event created successfully.");
    } catch (err) {
      setError("Failed to create event. Check your token and fields.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form-panel">
      <h2>Create New Event</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-block">
        <input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input required placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <div className="date-row">
          <input required type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary" type="submit">Create Event</button>
    </form>
  );
}

export default EventForm;
