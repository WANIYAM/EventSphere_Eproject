import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { useSocket } from "../context/SocketContext.jsx";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingId, setPendingId] = useState(null);
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

  useEffect(() => { fetchNotifications(); }, []);

  useEffect(() => {
    if (!socket) return;
    const handleNewNotif = (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev.slice(0, 49)]);
      setUnreadCount((prev) => prev + 1);
    };
    socket.on("notification", handleNewNotif);
    return () => socket.off("notification", handleNewNotif);
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
    if (pendingId) return;
    if (!notif.read) {
      setPendingId(notif._id);
      try {
        await api.put(`/notifications/${notif._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      } finally { setPendingId(null); }
    }
    setIsOpen(false);
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="notif-bell-container" ref={dropdownRef} style={{ position: "relative", zIndex: 10001 }}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ y: -2, boxShadow: "5px 5px 0 #000" }}
        whileTap={{ scale: 0.94, y: 1, boxShadow: "1.5px 1.5px 0 #000" }}
        title={`Notifications${unreadCount > 0 ? ` · ${unreadCount} unread` : ""}`}
        aria-label={`Notifications (${unreadCount} unread)`}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          padding: 0,
          borderRadius: "50%",
          backgroundColor: isOpen ? "#231e25" : "var(--color-light-salmon, #ffa490)",
          color: isOpen ? "#fff8eb" : "#231e25",
          border: "2px solid #231e25",
          boxShadow: isOpen ? "1.5px 1.5px 0 #000" : "3px 3px 0 #000",
          cursor: "pointer",
          flexShrink: 0,
          transition: "background 0.15s ease",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>

        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 520, damping: 22 }}
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 21,
              height: 21,
              padding: "0 5px",
              borderRadius: 21,
              backgroundColor: "var(--color-primary, #ff3e33)",
              color: "#ffffff",
              fontSize: 11,
              fontWeight: 900,
              fontFamily: "'Satoshi', sans-serif",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #000",
              boxShadow: "1.5px 1.5px 0 #000",
              lineHeight: 1,
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 10px)",
              width: "min(340px, calc(100vw - 32px))",
              backgroundColor: "#ffffff",
              border: "3px solid #231e25",
              boxShadow: "8px 8px 0 #231e25",
              borderRadius: 6,
              zIndex: 99999,
              overflow: "hidden",
            }}
          >
            {/* Corner brackets */}
            <div style={{ position: "absolute", top: 6, left: 6, width: 9, height: 9, borderTop: "2.5px solid #000", borderLeft: "2.5px solid #000", pointerEvents: "none", zIndex: 5 }} />
            <div style={{ position: "absolute", top: 6, right: 6, width: 9, height: 9, borderTop: "2.5px solid #000", borderRight: "2.5px solid #000", pointerEvents: "none", zIndex: 5 }} />

            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#231e25",
                color: "#fff8eb",
                borderBottom: "3px solid #000",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <motion.span
                  animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--color-kiwi, #abf139)",
                    boxShadow: "0 0 8px var(--color-kiwi, #abf139)",
                  }}
                />
                <h4 style={{
                  fontSize: 13,
                  margin: 0,
                  fontWeight: 900,
                  fontFamily: "var(--font-display)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}>
                  Notifications
                </h4>
                <span style={{
                  background: "var(--color-kiwi, #abf139)",
                  color: "#000",
                  fontSize: 10,
                  fontWeight: 900,
                  padding: "2px 7px",
                  borderRadius: 30,
                  border: "1.5px solid #000",
                  fontFamily: "'Satoshi', sans-serif",
                }}>
                  {notifications.length}
                </span>
              </div>

              {unreadCount > 0 && (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleMarkAllRead}
                  style={{
                    background: "var(--color-kiwi, #abf139)",
                    color: "#000",
                    border: "1.5px solid #000",
                    boxShadow: "2px 2px 0 #000",
                    borderRadius: 3,
                    padding: "4px 10px",
                    fontSize: 10,
                    fontWeight: 900,
                    fontFamily: "'Satoshi', sans-serif",
                    letterSpacing: 0.4,
                    cursor: "pointer",
                  }}
                >
                  MARK ALL READ
                </motion.button>
              )}
            </div>

            {/* Notification List */}
            <div style={{ maxHeight: 340, overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 13,
                  color: "#6b7280",
                  fontWeight: 600,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <span style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    letterSpacing: 0.8,
                    color: "#231e25",
                  }}>
                    NO NOTIFICATIONS
                  </span>
                  <span style={{ fontSize: 11.5 }}>You're all caught up.</span>
                </div>
              ) : (
                notifications.map((notif, idx) => {
                  const isPending = pendingId === notif._id;
                  return (
                    <motion.div
                      key={notif._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => handleItemClick(notif)}
                      whileHover={{ background: notif.read ? "#fafafa" : "rgba(255,62,51,0.06)" }}
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        padding: "12px 16px 12px 20px",
                        borderBottom: "1.5px dashed #d1d5db",
                        cursor: "pointer",
                        backgroundColor: notif.read ? "#ffffff" : "var(--color-light, #fff8eb)",
                        fontFamily: "'Satoshi', sans-serif",
                        borderLeft: notif.read ? "3px solid transparent" : "6px solid var(--color-primary, #ff3e33)",
                        opacity: isPending ? 0.6 : 1,
                      }}
                    >
                      {!notif.read && (
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                          style={{
                            position: "absolute",
                            top: 14,
                            right: 14,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "var(--color-primary, #ff3e33)",
                            border: "1.5px solid #000",
                          }}
                        />
                      )}
                      <p style={{
                        fontSize: 13,
                        color: "#231e25",
                        fontWeight: notif.read ? 600 : 800,
                        margin: "0 0 6px 0",
                        paddingRight: 20,
                        lineHeight: 1.45,
                      }}>
                        {notif.message}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: notif.read ? "#9ca3af" : "var(--color-kiwi, #abf139)",
                          border: "1px solid #000",
                        }} />
                        <span style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 700, letterSpacing: 0.4 }}>
                          {new Date(notif.createdAt).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div style={{
                background: "#f9fafb",
                borderTop: "2px solid #000",
                padding: "8px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 0.6,
                color: "#6b7280",
              }}>
                <span>{unreadCount} UNREAD</span>
                <span>{notifications.length - unreadCount} READ</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;