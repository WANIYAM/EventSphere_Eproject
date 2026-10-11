import { useState } from "react";
import { motion } from "framer-motion";
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

    if (!message.trim()) return setError("Feedback message is required.");
    if (message.trim().length < 5) return setError("Message must be at least 5 characters long.");

    setSubmitting(true);
    try {
      await api.post("/feedback", { type, message: message.trim() });
      setSuccess("Thank you! Your feedback has been logged to the operations crew.");
      setMessage("");
      setType("suggestion");
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "10px 0" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px 28px",
        }}
      >
        <span style={{ backgroundColor: "var(--color-light-salmon, #ffa490)", color: "#000", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
          [ PLATFORM COLLABORATION ]
        </span>
        <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
          SUBMIT USER FEEDBACK
        </h1>
        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, color: "#6b7280", margin: "4px 0 0 0", fontWeight: 500 }}>
          Share your suggestions or report booth and technical issues to help improve EventSphere.
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700 }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "2.5px solid var(--color-dark, #231e25)", padding: "12px 16px", color: "#000000", fontWeight: 800 }}>
          ✓ {success}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "var(--color-light, #fff8eb)",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div>
          <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Category Type</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
            <button
              type="button"
              onClick={() => setType("suggestion")}
              style={{
                padding: "10px",
                border: "2px solid #000",
                borderRadius: 4,
                backgroundColor: type === "suggestion" ? "var(--color-kiwi, #abf139)" : "#ffffff",
                color: "#000",
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                boxShadow: type === "suggestion" ? "3px 3px 0px #000" : "none",
              }}
            >
              💡 Feature Suggestion
            </button>
            <button
              type="button"
              onClick={() => setType("issue")}
              style={{
                padding: "10px",
                border: "2px solid #000",
                borderRadius: 4,
                backgroundColor: type === "issue" ? "var(--color-primary, #ff3e33)" : "#ffffff",
                color: type === "issue" ? "#fff" : "#000",
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                boxShadow: type === "issue" ? "3px 3px 0px #000" : "none",
              }}
            >
              ⚠️ Issue / Bug Report
            </button>
          </div>
        </div>

        <div>
          <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Detailed Message *</label>
          <textarea
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your suggestion or venue issue in detail (min 5 characters)..."
            style={{ width: "100%", padding: "12px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
          />
        </div>

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            backgroundColor: "var(--color-primary, #ff3e33)",
            color: "#ffffff",
            border: "2px solid #000",
            boxShadow: "3px 3px 0px #000",
            padding: "12px",
            fontFamily: "var(--font-display)",
            fontSize: 22,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "SUBMITTING..." : "SUBMIT FEEDBACK LOG →"}
        </motion.button>
      </form>
    </div>
  );
};

export default Feedback;