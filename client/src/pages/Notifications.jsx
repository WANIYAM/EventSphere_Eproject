import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api.js";
import Loading from "../components/Loading.jsx";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/notifications");
      setNotifications(res.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put("/api/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (notif) => {
    if (!notif.read) {
      try {
        await api.put(`/api/notifications/${notif._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
      } catch (err) {
        console.error(err);
      }
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  if (loading) return <Loading message="Loading notifications..." />;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "10px 0" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <span style={{ backgroundColor: "var(--color-selective-yellow, #feb804)", color: "#000", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
            [ LIVE NOTIFICATION LOGS ]
          </span>
          <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
            EXPO SYSTEM ALERTS
          </h1>
        </div>

        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMarkAllRead}
            style={{
              backgroundColor: "var(--color-dark, #231e25)",
              color: "var(--color-light, #fff8eb)",
              border: "2px solid #000",
              boxShadow: "2px 2px 0px #000",
              padding: "8px 18px",
              borderRadius: 4,
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Mark All as Read ({unreadCount})
          </motion.button>
        )}
      </div>

      {error && (
        <div style={{ backgroundColor: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Notifications List */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px",
        }}
      >
        {notifications.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
            You have no notifications yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {notifications.map((notif) => (
              <motion.div
                key={notif._id}
                onClick={() => handleItemClick(notif)}
                whileHover={{ x: 4 }}
                style={{
                  backgroundColor: notif.read ? "#ffffff" : "var(--color-light, #fff8eb)",
                  border: "2px solid var(--color-dark, #231e25)",
                  borderLeft: notif.read ? "2px solid var(--color-dark, #231e25)" : "6px solid var(--color-primary, #ff3e33)",
                  boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: 16,
                }}
              >
                <div>
                  <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 15, fontWeight: notif.read ? 600 : 800, color: "var(--color-dark)", margin: 0 }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", color: "#6b7280" }}>
                    ⏰ {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>

                {!notif.read && (
                  <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--color-primary, #ff3e33)" }} />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;