import { useState } from "react";
import API from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("register/", { username, email, password });
      alert("Registration successful! You can now log in.");
    } catch (err) {
      alert("Registration failed!");
    }
  };

  return (
    <form className="form-block" onSubmit={handleSubmit}>
      <div className="field"><label>Username</label><input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
      <div className="field"><label>Email</label><input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div className="field"><label>Password</label><input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
      <button className="btn btn-primary">Register</button>
    </form>
  );
}

export default Register;