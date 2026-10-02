import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api.js";

const BASE = "http://localhost:5000";

const ExhibitorProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/exhibitors/${id}`);
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <p style={{ padding: "2rem" }}>Loading profile...</p>;
  if (error) return <div className="alert alert-danger" style={{ margin: "2rem" }}>{error}</div>;
  if (!profile) return <p style={{ padding: "2rem" }}>Profile not found.</p>;

  return (
    <div className="dashboard-container">
      <div style={{ marginBottom: "1.5rem" }}>
        <button className="btn-link" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="exhibitor-profile-header">
        <div className="exhibitor-profile-logo">
          {profile.logo ? (
            <img src={`${BASE}${profile.logo}`} alt={profile.company} />
          ) : (
            <div className="logo-placeholder-lg">🏢</div>
          )}
        </div>
        <div>
          <h2>{profile.company || profile.name}</h2>
          {profile.category && <span className="badge badge-exhibitor">{profile.category}</span>}
          {profile.website && (
            <p style={{ marginTop: "0.5rem" }}>
              🌐 <a href={profile.website} target="_blank" rel="noreferrer">{profile.website}</a>
            </p>
          )}
        </div>
      </div>

      {profile.description && (
        <div className="form-card" style={{ marginTop: "1.5rem" }}>
          <h3>About</h3>
          <p style={{ marginTop: "0.5rem" }}>{profile.description}</p>
        </div>
      )}

      {/* Products */}
      {profile.expos?.some((e) => e.products) && (
        <div className="form-card" style={{ marginTop: "1rem" }}>
          <h3>Products & Services</h3>
          {profile.expos.filter((e) => e.products).map((e, i) => (
            <p key={i} style={{ marginTop: "0.5rem" }}>{e.products}</p>
          ))}
        </div>
      )}

      {/* Expos & Booths */}
      {profile.expos?.length > 0 && (
        <div className="form-card" style={{ marginTop: "1rem" }}>
          <h3>Participating Expos</h3>
          <table className="table" style={{ marginTop: "0.5rem" }}>
            <thead>
              <tr>
                <th>Expo</th>
                <th>Dates</th>
                <th>Booth</th>
              </tr>
            </thead>
            <tbody>
              {profile.expos.map((e, i) => (
                <tr key={i}>
                  <td>{e.expo?.title}</td>
                  <td>
                    {e.expo?.startDate && new Date(e.expo.startDate).toLocaleDateString()} – {e.expo?.endDate && new Date(e.expo.endDate).toLocaleDateString()}
                  </td>
                  <td>{e.boothNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Contact button */}
      <div style={{ marginTop: "1.5rem" }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/messages?to=${profile._id}&name=${encodeURIComponent(profile.company || profile.name)}`)}
        >
          ✉ Contact Exhibitor
        </button>
      </div>
    </div>
  );
};

export default ExhibitorProfileView;
