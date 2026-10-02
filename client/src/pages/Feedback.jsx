import { useState } from "react";
import api from "../services/api.js";

const Feedback = () => {
  const [type, setType] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!message.trim()) {
      return setError("Feedback message is required.");
    }
    if (message.trim().length < 5) {
      return setError("Message must be at least 5 characters long.");
    }

    setSubmitting(true);
    try {
      await api.post("/feedback", { type, message: message.trim() });
      setSuccess("Thank you! Your feedback has been submitted.");
      setMessage("");
      setType("suggestion");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Submit Feedback</h2>
      <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
        Help us improve EventSphere! Share your suggestions or report any issues.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label>Type *</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="suggestion">💡 Suggestion</option>
            <option value="issue">⚠️ Issue / Bug Report</option>
          </select>
        </div>

        <div className="form-group">
          <label>Message *</label>
          <textarea
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your suggestion or issue in detail (min 5 characters)..."
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default Feedback;
