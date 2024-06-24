import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import APIService from "../services/APIService";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    APIService.clearToken();
    navigate("/");
  }, [navigate]);

  return null;
}

export default Logout;