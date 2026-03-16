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
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button>Register</button>
    </form>
  );
}

export default Register;