import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      return setError("Email is required.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return setError("Please enter a valid email address.");
    }
    if (!password) {
      return setError("Password is required.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    setSubmitting(true);

    try {
      const loggedUser = await login(email.trim(), password);
      if (loggedUser.role === "admin") {
        navigate("/admin");
      } else if (loggedUser.role === "exhibitor") {
        navigate("/exhibitor");
      } else {
        navigate("/attendee");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-container">
      <div className="card">
        <h2>Login to EventSphere</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="form-footer">
          <p>
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
