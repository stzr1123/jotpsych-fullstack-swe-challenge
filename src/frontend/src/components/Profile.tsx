import React, { useState, useEffect } from "react";
import APIService from "../services/APIService";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState<{ username: string, motto: string, profile_picture: string }>({ username: "", motto: "", profile_picture: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await APIService.request("/user", "GET", null, true);
        setUser(data);
      } catch (error) {
        console.error(error);
        navigate("/login"); // Redirect to login if user data cannot be fetched
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        {user.profile_picture ? <img src={user.profile_picture} alt="Profile" style={{ borderRadius: "50%", width: "150px", height: "150px" }} /> : <div style={{ borderRadius: "50%", width: "150px", height: "150px", background: "#ccc" }} />}
      </div>
      <h2>{user.username}</h2>
      <p>"{user.motto}"</p>
      <button onClick={() => navigate("/edit-profile")}>Record (New) Motto</button>
      <button onClick={() => { APIService.clearToken(); navigate("/login"); }}>Logout</button>
    </div>
  );
}

export default Profile;