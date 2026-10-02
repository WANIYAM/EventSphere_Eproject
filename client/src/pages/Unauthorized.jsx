import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="card-container">
      <div className="card text-center">
        <h1 style={{ color: "#e63946" }}>403 - Unauthorized</h1>
        <p>You do not have permission to access this page.</p>
        <div style={{ marginTop: "1rem" }}>
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
