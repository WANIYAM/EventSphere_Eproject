import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import api from "../../services/api.js";
import Loading from "../../components/Loading.jsx";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/analytics/admin");
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <Loading message="Loading analytics overview..." />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!data) return <div className="empty-state">No analytics data available</div>;

  const {
    totals,
    boothsByStatus,
    applicationsByStatus,
    registrationsPerExpo,
    topSessions,
    occupancyPerExpo,
    feedbackByType
  } = data;

  return (
    <div className="admin-page-container">
      <h2>System Analytics & Performance</h2>

      {/* Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="stat-card">
          <h4>Total Users</h4>
          <p className="stat-number">{totals.users}</p>
          <small className="text-muted">
            {totals.admins} Admins · {totals.exhibitors} Exhibitors · {totals.attendees} Attendees
          </small>
        </div>

        <div className="stat-card">
          <h4>Total Expos</h4>
          <p className="stat-number">{totals.expos}</p>
        </div>

        <div className="stat-card">
          <h4>Total Sessions</h4>
          <p className="stat-number">{totals.sessions}</p>
        </div>

        <div className="stat-card">
          <h4>Applications</h4>
          <p className="stat-number">{totals.applications}</p>
        </div>

        <div className="stat-card">
          <h4>User Feedback</h4>
          <p className="stat-number">{totals.feedback}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Booth Status Bar Chart */}
        <div className="chart-card">
          <h3>Booths by Status</h3>
          {boothsByStatus.every((b) => b.count === 0) ? (
            <p className="text-muted">No booth data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={boothsByStatus}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6">
                  {boothsByStatus.map((entry, index) => {
                    let color = "#10b981"; // green for Available
                    if (entry.name === "Reserved") color = "#f59e0b"; // yellow
                    if (entry.name === "Booked") color = "#ef4444"; // red
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Applications Status Pie Chart */}
        <div className="chart-card">
          <h3>Applications by Status</h3>
          {applicationsByStatus.every((a) => a.value === 0) ? (
            <p className="text-muted">No application data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={applicationsByStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {applicationsByStatus.map((entry, index) => {
                    let color = "#f59e0b"; // yellow for pending
                    if (entry.name === "Approved") color = "#10b981";
                    if (entry.name === "Rejected") color = "#ef4444";
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Registrations Per Expo Bar Chart */}
        <div className="chart-card">
          <h3>Attendee Registrations per Expo</h3>
          {registrationsPerExpo.length === 0 ? (
            <p className="text-muted">No expo registration data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={registrationsPerExpo}>
                <XAxis dataKey="expoTitle" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top 5 Sessions Bar Chart */}
        <div className="chart-card">
          <h3>Top 5 Most Popular Sessions</h3>
          {topSessions.length === 0 ? (
            <p className="text-muted">No session registration data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topSessions}>
                <XAxis dataKey="title" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Booth Occupancy Percentage Per Expo Bar Chart */}
        <div className="chart-card full-width">
          <h3>Booth Occupancy Percentage per Expo (%)</h3>
          {occupancyPerExpo.length === 0 ? (
            <p className="text-muted">No booth occupancy data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={occupancyPerExpo}>
                <XAxis dataKey="expoTitle" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="percent" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
