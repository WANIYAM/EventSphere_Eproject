import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { useSocket } from "../context/SocketContext.jsx";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { socket } = useSocket();

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data || []);
      const unread = (res.data || []).filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotif = (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev.slice(0, 49)]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification", handleNewNotif);

    return () => {
      socket.off("notification", handleNewNotif);
    };
  }, [socket]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (notif) => {
    if (!notif.read) {
      try {
        await api.put(`/notifications/${notif._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      }
    }
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="notif-bell-container" ref={dropdownRef} style={{ position: "relative" }}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.96 }}
        title="Notifications"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "6px 16px",
          borderRadius: 9999,
          backgroundColor: isOpen ? "var(--color-dark, #231e25)" : "var(--color-light-salmon, #ffa490)",
          color: isOpen ? "var(--color-light, #fff8eb)" : "var(--color-dark, #231e25)",
          textDecoration: "none",
          border: "1.5px solid var(--color-dark, #231e25)",
          boxShadow: "2.5px 2.5px 0px var(--color-dark, #231e25)",
          fontFamily: "'Satoshi', sans-serif",
          fontSize: 14,
          fontWeight: 800,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span
            style={{
              backgroundColor: "var(--color-primary, #ff3e33)",
              color: "#ffffff",
              fontSize: 10,
              fontWeight: 900,
              borderRadius: 10,
              padding: "1px 5px",
              border: "1px solid #000",
            }}
          >
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: "absolute",
              right: 0,
              top: "120%",
              width: 320,
              backgroundColor: "#ffffff",
              border: "2.5px solid var(--color-dark, #231e25)",
              boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
              borderRadius: 4,
              zIndex: 1000,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                backgroundColor: "#f9fafb",
                borderBottom: "2px solid var(--color-dark, #231e25)",
                fontFamily: "'Satoshi', sans-serif",
              }}
            >
              <h4 style={{ fontSize: 14, margin: 0, fontWeight: 800 }}>Notifications</h4>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-primary, #ff3e33)",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontSize: 13, color: "#6b7280" }}>
                  No notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => handleItemClick(notif)}
                    style={{
                      padding: "12px 14px",
                      borderBottom: "1.5px dashed #e5e7eb",
                      cursor: "pointer",
                      backgroundColor: notif.read ? "#ffffff" : "var(--color-light, #fff8eb)",
                      fontFamily: "'Satoshi', sans-serif",
                    }}
                  >
                    <p style={{ fontSize: 13, color: "var(--color-dark)", fontWeight: notif.read ? 600 : 800, margin: "0 0 4px 0" }}>
                      {notif.message}
                    </p>
                    <span style={{ fontSize: 11, color: "#6b7280" }}>
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;