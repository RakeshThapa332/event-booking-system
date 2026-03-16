import { useState } from "react";
import API, { setAuthToken } from "../api";

function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("token/", { username, password });
      const token = res.data.access;
      localStorage.setItem("token", token);
      setAuthToken(token);
      alert("Login successful!");
      onSuccess?.();
    } catch (err) {
      alert("Login failed! Check credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <h2>Login</h2>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;