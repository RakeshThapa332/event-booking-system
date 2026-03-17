import { useState } from "react";
import API from "../api";

function EventForm({ onEventCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !location || !date) {
      setError("Please fill title, location, and date.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("date", date);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      await API.post("events/", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setImageFile(null);
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
        <div>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </div>
      </div>
      <button className="btn btn-primary" type="submit">Create Event</button>
    </form>
  );
}

export default EventForm;
