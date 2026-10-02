import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetLink("");

    if (!email.trim()) {
      return setError("Email address is required.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return setError("Please enter a valid email address.");
    }

    setSubmitting(true);

    try {
      const res = await api.post("/auth/forgot-password", { email: email.trim() });
      setMessage(res.data.message || "Password reset request submitted");
      if (res.data.resetLink) {
        setResetLink(res.data.resetLink);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-container">
      <div className="card">
        <h2>Forgot Password</h2>
        <p className="card-subtitle">
          Enter your registered email address and we'll generate a reset link.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {resetLink && (
          <div className="dev-link-box">
            <strong>Demo Mode Reset Link:</strong>
            <br />
            <a href={resetLink} target="_blank" rel="noreferrer">
              {resetLink}
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Sending..." : "Generate Reset Link"}
          </button>
        </form>

        <div className="form-footer">
          <p>
            Remember your password? <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
