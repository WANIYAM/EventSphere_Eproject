import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalExpos: 0,
    pendingApps: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [exposRes, appsRes] = await Promise.all([
          api.get("/expos"),
          api.get("/applications?status=pending")
        ]);
        setStats({
          totalExpos: exposRes.data.length,
          pendingApps: appsRes.data.length
        });
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <p style={{ marginBottom: "1.5rem" }}>Welcome back, {user?.name || "Admin"}!</p>

      {/* Stats row */}
      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="stat-card">
          <h3>Total Expos</h3>
          <div className="stat-number">{loading ? "..." : stats.totalExpos}</div>
        </div>
        <div className="stat-card">
          <h3>Pending Applications</h3>
          <div className="stat-number">{loading ? "..." : stats.pendingApps}</div>
        </div>
      </div>

      {/* Quick Links */}
      <h3>Quick Actions</h3>
      <div className="quick-links-grid" style={{ marginTop: "1rem" }}>
        <Link to="/admin/expos" className="quick-link-card">
          <h4>Manage Expos</h4>
          <p>Create expos, set dates/locations, manage sessions & booth layouts.</p>
        </Link>

        <Link to="/admin/applications" className="quick-link-card">
          <h4>Manage Applications</h4>
          <p>Review and approve or reject exhibitor booth applications.</p>
        </Link>

        <Link to="/messages" className="quick-link-card">
          <h4>Messages & Inbox</h4>
          <p>Read messages and send notifications or responses to users.</p>
        </Link>

        <Link to="/admin/analytics" className="quick-link-card">
          <h4>Analytics Overview</h4>
          <p>View system totals, booth occupancy, popular sessions, and user metrics.</p>
        </Link>

        <Link to="/admin/feedback" className="quick-link-card">
          <h4>View Feedback</h4>
          <p>Review suggestions and issues submitted by all users.</p>
        </Link>

        <Link to="/feedback" className="quick-link-card">
          <h4>Submit Feedback</h4>
          <p>Share your own suggestions or report platform issues.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
