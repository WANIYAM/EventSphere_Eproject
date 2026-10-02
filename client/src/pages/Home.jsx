import { useState, useEffect } from "react";
import api from "../services/api.js";

const Home = () => {
  const [healthStatus, setHealthStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setHealthStatus(JSON.stringify(res.data)))
      .catch((err) => setError(err.message || "Failed to fetch health status"));
  }, []);

  return (
    <div>
      <h1>EventSphere Home</h1>
      {healthStatus && <p>Health Status: {healthStatus}</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default Home;
