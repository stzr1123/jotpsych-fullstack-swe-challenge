import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import APIService from "../services/APIService";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate initial version below 1.2.0
    APIService.setAppVersion("1.0.0");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await APIService.request("/login", "POST", { username, password });
      APIService.setToken(data.token);
      setMessage("Login successful");
      navigate("/profile"); // Redirect to profile page
    } catch (error: any) {
      // Update to version above 1.2.0 after the initial interaction
      APIService.setAppVersion("1.2.1");
      console.error(error);
      setMessage(error.message || "Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;