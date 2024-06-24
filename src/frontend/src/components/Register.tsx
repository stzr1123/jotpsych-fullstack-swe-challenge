import React, { useState } from "react";
import APIService from "../services/APIService";

function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [motto, setMotto] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await APIService.request("/register", "POST", { username, password, motto, profile_picture: profilePicture });
      APIService.setToken(data.token);
      setMessage("User registered successfully");
    } catch (error: any) {
      console.error(error);
      setMessage(error.message || "Error registering user");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <div>
          <label>Motto:</label>
          <input
            type="text"
            value={motto}
            onChange={(e) => setMotto(e.target.value)}
          />
        </div>
        <div>
          <label>Profile Picture URL:</label>
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;