import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="page-container flex-center" style={{ minHeight: "60vh", textAlign: "center" }}>
      <div>
        <h1 style={{ fontSize: "4rem", color: "var(--primary-color)", marginBottom: "0.5rem" }}>404</h1>
        <h2>Page Not Found</h2>
        <p className="text-muted" style={{ margin: "1rem 0 1.5rem 0" }}>
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
