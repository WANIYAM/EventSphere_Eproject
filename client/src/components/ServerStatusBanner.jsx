import { useEffect, useState } from "react";
import api from "../services/api.js";

const ServerStatusBanner = () => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    const checkHealth = async () => {
      try {
        const response = await api.get("/health", { timeout: 10000 });
        if (active) {
          const isConnected = response.data.database === "connected";
          setStatus((prevStatus) => {
            if (prevStatus === "disconnected" && isConnected) {
              window.dispatchEvent(new CustomEvent("server:recovered"));
            }
            return isConnected ? "healthy" : "disconnected";
          });
        }
      } catch {
        if (active) {
          setStatus("unreachable");
        }
      }
    };

    checkHealth();
    const intervalId = setInterval(checkHealth, 15000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  if (status === "checking" || status === "healthy") {
    return null;
  }

  const message =
    status === "disconnected"
      ? "The database is unavailable. Please try again shortly."
      : "Cannot reach the server. Check that the backend is running.";

  return (
    <div className="server-status-banner" role="status" aria-live="polite">
      {message}
    </div>
  );
};

export default ServerStatusBanner;