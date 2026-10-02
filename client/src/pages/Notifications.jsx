import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      setError(err.response?.data?.message || "Failed to load notifications");
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
    <div className="page-container">
      <div className="page-header flex-between">
        <h2>Notifications</h2>
        {unreadCount > 0 && (
          <button className="btn btn-secondary" onClick={handleMarkAllRead}>
            Mark All as Read
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {notifications.length === 0 ? (
        <div className="empty-state">
          <p>You have no notifications yet.</p>
        </div>
      ) : (
        <div className="notif-page-list">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`notif-card ${!notif.read ? "unread" : ""}`}
              onClick={() => handleItemClick(notif)}
            >
              <div className="notif-card-body">
                <p className="notif-card-msg">{notif.message}</p>
                <span className="notif-card-date">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
              {!notif.read && <span className="unread-dot">●</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
