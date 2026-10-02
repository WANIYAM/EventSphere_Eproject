import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "../components/Loading.jsx";

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  // Check for prefilled recipient from query params (?to=id&name=Name)
  const prefilledTo = searchParams.get("to");
  const prefilledName = searchParams.get("name");

  const [activeTab, setActiveTab] = useState(prefilledTo ? "compose" : "inbox");
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);

  // Compose state
  const [usersList, setUsersList] = useState([]);
  const [adminContact, setAdminContact] = useState(null);
  const [recipientOptions, setRecipientOptions] = useState([]); // for attendee dropdown
  const [composeData, setComposeData] = useState({
    receiver: prefilledTo || "",
    subject: "",
    body: ""
  });
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const [inboxRes, sentRes] = await Promise.all([
        api.get("/messages/inbox"),
        api.get("/messages/sent")
      ]);
      setInbox(inboxRes.data);
      setSent(sentRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipientOptions = async () => {
    try {
      if (user?.role === "admin") {
        const res = await api.get("/users");
        setUsersList(res.data.filter((u) => u._id !== user._id));
      } else {
        const res = await api.get("/messages/admin-contact");
        setAdminContact(res.data);

        // Build attendee dropdown: admin + any prefilled recipient
        const options = [{ _id: res.data._id, label: `${res.data.name} (Admin)` }];
        if (prefilledTo && prefilledTo !== res.data._id) {
          options.push({ _id: prefilledTo, label: prefilledName || "Exhibitor" });
        }
        setRecipientOptions(options);

        // Default to prefilled or admin
        if (!prefilledTo) {
          setComposeData((prev) => ({ ...prev, receiver: res.data._id }));
        }
      }
    } catch (err) {
      console.error("Failed to load recipients:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchRecipientOptions();
  }, [user]);

  const handleOpenMessage = async (msg, isInbox) => {
    setSelectedMessage(msg);

    if (isInbox && !msg.read) {
      try {
        await api.put(`/messages/${msg._id}/read`);
        setInbox((prev) =>
          prev.map((item) => (item._id === msg._id ? { ...item, read: true } : item))
        );
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!composeData.receiver) {
      return setError("Please select a recipient.");
    }
    if (!composeData.body.trim()) {
      return setError("Message body is required.");
    }

    setSending(true);

    try {
      await api.post("/messages", composeData);
      setSuccess("Message sent successfully!");
      const defaultReceiver = adminContact ? adminContact._id : "";
      setComposeData({ receiver: defaultReceiver, subject: "", body: "" });
      setActiveTab("sent");
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleReply = (msg) => {
    const replyReceiver = msg.sender?._id || msg.sender;
    setComposeData({
      receiver: replyReceiver,
      subject: msg.subject.startsWith("Re:") ? msg.subject : `Re: ${msg.subject}`,
      body: ""
    });
    setSelectedMessage(null);
    setActiveTab("compose");
  };

  return (
    <div className="dashboard-container">
      <h2>Messages & Communication</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Tabs */}
      <div className="tab-bar" style={{ margin: "1rem 0" }}>
        <button
          className={`tab-btn ${activeTab === "inbox" ? "active" : ""}`}
          onClick={() => { setActiveTab("inbox"); setSelectedMessage(null); }}
        >
          Inbox ({inbox.filter((m) => !m.read).length} Unread)
        </button>
        <button
          className={`tab-btn ${activeTab === "sent" ? "active" : ""}`}
          onClick={() => { setActiveTab("sent"); setSelectedMessage(null); }}
        >
          Sent Messages
        </button>
        <button
          className={`tab-btn ${activeTab === "compose" ? "active" : ""}`}
          onClick={() => { setActiveTab("compose"); setSelectedMessage(null); }}
        >
          + Compose Message
        </button>
      </div>

      {loading ? (
        <Loading message="Loading messages..." />
      ) : (
        <>
          {/* Inbox Tab */}
          {activeTab === "inbox" && !selectedMessage && (
            <div className="messages-list">
              {inbox.length === 0 ? (
                <div className="empty-state">Your inbox is empty.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr><th>Sender</th><th>Subject</th><th>Date</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {inbox.map((msg) => (
                        <tr
                          key={msg._id}
                          style={{ fontWeight: msg.read ? "normal" : "bold", cursor: "pointer" }}
                          onClick={() => handleOpenMessage(msg, true)}
                        >
                          <td>{msg.sender?.name} <span className="text-muted">({msg.sender?.role})</span></td>
                          <td>{msg.subject}</td>
                          <td>{new Date(msg.createdAt).toLocaleString()}</td>
                          <td>
                            <button onClick={(e) => { e.stopPropagation(); handleOpenMessage(msg, true); }} className="btn-sm btn-info">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Sent Tab */}
          {activeTab === "sent" && !selectedMessage && (
            <div className="messages-list">
              {sent.length === 0 ? (
                <div className="empty-state">No sent messages.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr><th>Recipient</th><th>Subject</th><th>Date</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {sent.map((msg) => (
                        <tr key={msg._id} style={{ cursor: "pointer" }} onClick={() => handleOpenMessage(msg, false)}>
                          <td>{msg.receiver?.name} <span className="text-muted">({msg.receiver?.role})</span></td>
                          <td>{msg.subject}</td>
                          <td>{new Date(msg.createdAt).toLocaleString()}</td>
                          <td>
                            <button onClick={(e) => { e.stopPropagation(); handleOpenMessage(msg, false); }} className="btn-sm btn-info">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Detail View */}
          {selectedMessage && (
            <div className="form-card" style={{ marginTop: "1rem" }}>
              <button className="btn-link" onClick={() => setSelectedMessage(null)} style={{ marginBottom: "1rem", display: "inline-block" }}>
                &larr; Back to messages list
              </button>
              <h3>{selectedMessage.subject}</h3>
              <p className="text-muted" style={{ marginBottom: "1rem" }}>
                From: {selectedMessage.sender?.name} ({selectedMessage.sender?.role}) | To:{" "}
                {selectedMessage.receiver?.name} ({selectedMessage.receiver?.role}) | Date:{" "}
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>
              <div style={{ background: "#f9fafb", padding: "1rem", borderRadius: "0.375rem", whiteSpace: "pre-wrap", marginBottom: "1rem" }}>
                {selectedMessage.body}
              </div>
              {selectedMessage.sender?._id !== user._id && (
                <button onClick={() => handleReply(selectedMessage)} className="btn btn-primary btn-sm">Reply</button>
              )}
            </div>
          )}

          {/* Compose Tab */}
          {activeTab === "compose" && (
            <form onSubmit={handleSendMessage} className="form-card">
              <h3>Compose Message</h3>
              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label>To (Recipient) *</label>
                {user?.role === "admin" ? (
                  <select
                    value={composeData.receiver}
                    onChange={(e) => setComposeData({ ...composeData, receiver: e.target.value })}
                  >
                    <option value="">-- Select Recipient --</option>
                    {usersList.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.role}{u.company ? ` - ${u.company}` : ""}) - {u.email}
                      </option>
                    ))}
                  </select>
                ) : recipientOptions.length > 1 ? (
                  /* Attendee with prefilled + admin */
                  <select
                    value={composeData.receiver}
                    onChange={(e) => setComposeData({ ...composeData, receiver: e.target.value })}
                  >
                    {recipientOptions.map((opt) => (
                      <option key={opt._id} value={opt._id}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={adminContact ? `${adminContact.name} (Admin)` : "Loading Admin Contact..."}
                  />
                )}
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  placeholder="Message subject"
                />
              </div>

              <div className="form-group">
                <label>Message Body *</label>
                <textarea
                  rows="5"
                  value={composeData.body}
                  onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                  placeholder="Type your message here..."
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default Messages;
