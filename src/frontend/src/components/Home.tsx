import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import APIService from "../services/APIService";

function Home() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = APIService.getToken();
      if (token) {
        try {
          const data = await APIService.request("/user", "GET", null, true);
          setUsername(data.username);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h2>Home</h2>
      {username ? (
        <div>
          <p>Welcome, {username}!</p>
          <p>
            <Link to="/logout">Logout</Link>
          </p>
        </div>
      ) : (
        <p>
          Please <Link to="/login">login</Link> or{" "}
          <Link to="/register">register</Link>.
        </p>
      )}
    </div>
  );
}

export default Home;