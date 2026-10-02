import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ExhibitorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h1>Exhibitor Dashboard</h1>
      <p style={{ marginBottom: "0.5rem" }}>Welcome back, {user?.name}!</p>
      {user?.company && <p className="text-muted" style={{ marginBottom: "1.5rem" }}>Company: {user.company}</p>}

      <h3>Quick Actions</h3>
      <div className="quick-links-grid" style={{ marginTop: "1rem" }}>
        <Link to="/exhibitor/profile" className="quick-link-card">
          <h4>Company Profile</h4>
          <p>Update company info, category, description, website, and upload logo.</p>
        </Link>

        <Link to="/exhibitor/expos" className="quick-link-card">
          <h4>Browse Expos</h4>
          <p>Explore upcoming expos and submit booth applications.</p>
        </Link>

        <Link to="/exhibitor/applications" className="quick-link-card">
          <h4>My Applications</h4>
          <p>View your submitted applications, status, and assigned booths.</p>
        </Link>

        <Link to="/exhibitor/booths" className="quick-link-card">
          <h4>My Booth & Self-Selection</h4>
          <p>Reserve available booths, manage staff roster, and booth details.</p>
        </Link>

        <Link to="/messages" className="quick-link-card">
          <h4>Messages</h4>
          <p>Communicate directly with expo administrators.</p>
        </Link>

        <Link to="/feedback" className="quick-link-card">
          <h4>Feedback</h4>
          <p>Share suggestions or report issues to help us improve.</p>
        </Link>
      </div>
    </div>
  );
};

export default ExhibitorDashboard;
