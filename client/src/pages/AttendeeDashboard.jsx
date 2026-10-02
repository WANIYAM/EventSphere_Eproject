import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const AttendeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ expos: 0, sessions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/registrations/my");
        const regs = res.data;
        setStats({
          expos: regs.filter((r) => r.type === "expo" && r.registered).length,
          sessions: regs.filter((r) => r.type === "session" && r.registered).length
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Attendee Dashboard</h1>
      <p style={{ marginBottom: "1.5rem" }}>Welcome, {user?.name}!</p>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="stat-card">
          <h3>Registered Expos</h3>
          <div className="stat-number">{loading ? "..." : stats.expos}</div>
        </div>
        <div className="stat-card">
          <h3>Registered Sessions</h3>
          <div className="stat-number">{loading ? "..." : stats.sessions}</div>
        </div>
      </div>

      {/* Quick Links */}
      <h3>Quick Actions</h3>
      <div className="quick-links-grid" style={{ marginTop: "1rem" }}>
        <Link to="/attendee/expos" className="quick-link-card">
          <h4>Browse Expos</h4>
          <p>Discover upcoming expos, view schedules, and register to attend.</p>
        </Link>

        <Link to="/attendee/schedule" className="quick-link-card">
          <h4>My Schedule</h4>
          <p>View your registered expos, sessions, and bookmarked events.</p>
        </Link>

        <Link to="/messages" className="quick-link-card">
          <h4>Messages & Support</h4>
          <p>Contact event administration and view your message history.</p>
        </Link>

        <Link to="/feedback" className="quick-link-card">
          <h4>Feedback</h4>
          <p>Share suggestions or report issues to help us improve.</p>
        </Link>
      </div>
    </div>
  );
};

export default AttendeeDashboard;
