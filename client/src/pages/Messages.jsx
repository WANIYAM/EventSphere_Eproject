import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "../components/Loading.jsx";
import { CornerBrackets, ShineSweep, PulseDot, TickerStrip, RotatingBadge } from "../components/common/NeoBrutalKit.jsx";

const ITEMS_PER_PAGE = 5;

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const prefilledTo = searchParams.get("to");
  const prefilledName = searchParams.get("name");

  const [activeTab, setActiveTab] = useState(prefilledTo ? "compose" : "inbox");
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);

  // Pagination states
  const [inboxPage, setInboxPage] = useState(1);
  const [sentPage, setSentPage] = useState(1);

  const [usersList, setUsersList] = useState([]);
  const [adminContact, setAdminContact] = useState(null);
  const [recipientOptions, setRecipientOptions] = useState([]);
  const [composeData, setComposeData] = useState({
    receiver: prefilledTo || "",
    subject: "",
    body: "",
  });
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const [inboxRes, sentRes] = await Promise.all([
        api.get("/messages/inbox"),
        api.get("/messages/sent"),
      ]);
      setInbox(inboxRes.data || []);
      setSent(sentRes.data || []);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load messages");
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

        const options = [{ _id: res.data._id, label: `${res.data.name} (Organizer)` }];
        if (prefilledTo && prefilledTo !== res.data._id) {
          options.push({ _id: prefilledTo, label: prefilledName || "Exhibitor" });
        }
        setRecipientOptions(options);

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

    if (!composeData.receiver) return setError("Please select a recipient.");
    if (!composeData.body.trim()) return setError("Message body is required.");

    setSending(true);

    try {
      await api.post("/messages", composeData);
      setSuccess("Message dispatched successfully!");
      const defaultReceiver = adminContact ? adminContact._id : "";
      setComposeData({ receiver: defaultReceiver, subject: "", body: "" });
      setActiveTab("sent");
      setSentPage(1);
      fetchMessages();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleReply = (msg) => {
    const replyReceiver = msg.sender?._id || msg.sender;
    setComposeData({
      receiver: replyReceiver,
      subject: msg.subject.startsWith("Re:") ? msg.subject : `Re: ${msg.subject}`,
      body: "",
    });
    setSelectedMessage(null);
    setActiveTab("compose");
  };

  const unreadCount = inbox.filter((m) => !m.read).length;

  // Pagination slice logic
  const totalInboxPages = Math.ceil(inbox.length / ITEMS_PER_PAGE) || 1;
  const currentInbox = inbox.slice((inboxPage - 1) * ITEMS_PER_PAGE, inboxPage * ITEMS_PER_PAGE);

  const totalSentPages = Math.ceil(sent.length / ITEMS_PER_PAGE) || 1;
  const currentSent = sent.slice((sentPage - 1) * ITEMS_PER_PAGE, sentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "10px 0" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
        <ShineSweep duration={1.4} />
        <RotatingBadge text={`${unreadCount} UNREAD`} size={70} bg="var(--color-cerulean, #14a6ea)" color="#fff" top={-18} right={-18} duration={16} />
        <span style={{ backgroundColor: "var(--color-cerulean, #14a6ea)", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
          EVENT COMMUNICATION
        </span>
        <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
          MESSAGES & INBOX
        </h1>
      </div>

      <div style={{ backgroundColor: "var(--color-dark, #231e25)", borderRadius: 4, padding: "5px 0", border: "2px solid #000" }}>
        <TickerStrip items={["EVENT COMMUNICATION BUS", "ORGANIZERS · EXHIBITORS · ATTENDEES", "SECURE DISPATCH"]} color="var(--color-cerulean, #14a6ea)" duration={24} />
      </div>

      {error && (
        <div style={{ backgroundColor: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          Error: {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "3px 3px 0px var(--color-dark, #231e25)", padding: "12px 16px", color: "#000000", fontWeight: 800, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          Success: {success}
        </div>
      )}

      {/* Tabs Bar */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { id: "inbox", label: `INBOX (${unreadCount} UNREAD)` },
          { id: "sent", label: `SENT ARCHIVE (${sent.length})` },
          { id: "compose", label: "COMPOSE MESSAGE" },
        ].map((t) => {
          const isActive = activeTab === t.id && !selectedMessage;

          return (
            <motion.button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setSelectedMessage(null);
              }}
              whileHover={{ y: -2 }}
              whileTap={{ y: 1 }}
              style={{
                padding: "10px 20px",
                borderRadius: 4,
                backgroundColor: isActive ? "var(--color-dark, #231e25)" : "var(--color-light, #fff8eb)",
                color: isActive ? "var(--color-light, #fff8eb)" : "var(--color-dark, #231e25)",
                border: "2px solid var(--color-dark, #231e25)",
                boxShadow: isActive ? "4px 4px 0px var(--color-primary, #ff3e33)" : "2px 2px 0px var(--color-dark, #231e25)",
                fontFamily: "var(--font-display)",
                fontSize: 18,
                letterSpacing: 0.5,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {isActive && <ShineSweep duration={1.4} delay={0} opacity={0.3} />}
              <span style={{ position: "relative", zIndex: 7 }}>{t.label}</span>
            </motion.button>
          );
        })}
      </div>

      {loading ? (
        <Loading message="Synchronizing messages..." />
      ) : (
        <>
          {/* =========================================================
              INBOX TAB WITH PAGINATION
          ========================================================== */}
          {activeTab === "inbox" && !selectedMessage && (
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "3px solid var(--color-dark, #231e25)",
                boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
                padding: "24px",
              }}
            >
              {inbox.length === 0 ? (
                <div style={{ padding: 32, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
                  Your inbox is clean. No incoming messages.
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {currentInbox.map((msg) => (
                      <motion.div
                        key={msg._id}
                        onClick={() => handleOpenMessage(msg, true)}
                        whileHover={{ x: 4 }}
                        style={{
                          backgroundColor: msg.read ? "#ffffff" : "var(--color-light, #fff8eb)",
                          border: "2px solid var(--color-dark, #231e25)",
                          borderLeft: msg.read ? "2px solid var(--color-dark, #231e25)" : "6px solid var(--color-primary, #ff3e33)",
                          boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
                          padding: "16px 20px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          gap: 16,
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <strong style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16 }}>
                              {msg.sender?.name || "User"}
                            </strong>
                            <span style={{ fontSize: 11, backgroundColor: "#f3f4f6", border: "1px solid #000", padding: "1px 6px", borderRadius: 2, textTransform: "uppercase", fontWeight: 700 }}>
                              {msg.sender?.role || "Member"}
                            </span>
                          </div>
                          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: msg.read ? 500 : 800, color: "var(--color-dark)", margin: "4px 0 0 0" }}>
                            {msg.subject || "(No Subject)"}
                          </p>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", color: "#6b7280" }}>
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                          <div>
                            {!msg.read ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--color-primary, #ff3e33)", fontSize: 12, fontWeight: 800 }}>
                                <PulseDot color="var(--color-primary, #ff3e33)" size={7} glow={false} /> New
                              </span>
                            ) : (
                              <span style={{ color: "var(--color-dark, #231e25)", fontSize: 12, fontWeight: 800 }}>Read</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Inbox Pagination Controls */}
                  {totalInboxPages > 1 && (
                    <div style={{ marginTop: 24, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <button
                        onClick={() => setInboxPage((p) => Math.max(1, p - 1))}
                        disabled={inboxPage === 1}
                        style={{
                          backgroundColor: inboxPage === 1 ? "#e5e7eb" : "var(--color-dark, #231e25)",
                          color: inboxPage === 1 ? "#9ca3af" : "#fff",
                          border: "2px solid #000",
                          padding: "6px 14px",
                          borderRadius: 4,
                          fontFamily: "var(--font-display)",
                          fontSize: 16,
                          cursor: inboxPage === 1 ? "not-allowed" : "pointer",
                        }}
                      >
                        ← PREV
                      </button>

                      {Array.from({ length: totalInboxPages }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          onClick={() => setInboxPage(num)}
                          style={{
                            minWidth: 36,
                            height: 36,
                            backgroundColor: inboxPage === num ? "var(--color-primary, #ff3e33)" : "#ffffff",
                            color: inboxPage === num ? "#ffffff" : "#000000",
                            border: "2px solid #000",
                            boxShadow: inboxPage === num ? "2px 2px 0 #000" : "none",
                            borderRadius: 4,
                            fontFamily: "var(--font-display)",
                            fontSize: 18,
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          {num}
                        </button>
                      ))}

                      <button
                        onClick={() => setInboxPage((p) => Math.min(totalInboxPages, p + 1))}
                        disabled={inboxPage === totalInboxPages}
                        style={{
                          backgroundColor: inboxPage === totalInboxPages ? "#e5e7eb" : "var(--color-dark, #231e25)",
                          color: inboxPage === totalInboxPages ? "#9ca3af" : "#fff",
                          border: "2px solid #000",
                          padding: "6px 14px",
                          borderRadius: 4,
                          fontFamily: "var(--font-display)",
                          fontSize: 16,
                          cursor: inboxPage === totalInboxPages ? "not-allowed" : "pointer",
                        }}
                      >
                        NEXT →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* =========================================================
              SENT ARCHIVE TAB WITH PAGINATION
          ========================================================== */}
          {activeTab === "sent" && !selectedMessage && (
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "3px solid var(--color-dark, #231e25)",
                boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
                padding: "24px",
              }}
            >
              {sent.length === 0 ? (
                <div style={{ padding: 32, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
                  No dispatched sent messages.
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {currentSent.map((msg) => (
                      <motion.div
                        key={msg._id}
                        onClick={() => handleOpenMessage(msg, false)}
                        whileHover={{ x: 4 }}
                        style={{
                          backgroundColor: "#ffffff",
                          border: "2px solid var(--color-dark, #231e25)",
                          boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
                          padding: "16px 20px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          gap: 16,
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>To:</span>
                            <strong style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 16 }}>
                              {msg.receiver?.name || "Recipient"}
                            </strong>
                            <span style={{ fontSize: 11, backgroundColor: "#f3f4f6", border: "1px solid #000", padding: "1px 6px", borderRadius: 2, textTransform: "uppercase", fontWeight: 700 }}>
                              {msg.receiver?.role || "Member"}
                            </span>
                          </div>
                          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--color-dark)", margin: "4px 0 0 0" }}>
                            {msg.subject || "(No Subject)"}
                          </p>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", color: "#6b7280" }}>
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                          <div>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--color-dark, #231e25)", fontSize: 12, fontWeight: 800 }}>
                              View Details →
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Sent Archive Pagination Controls */}
                  {totalSentPages > 1 && (
                    <div style={{ marginTop: 24, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <button
                        onClick={() => setSentPage((p) => Math.max(1, p - 1))}
                        disabled={sentPage === 1}
                        style={{
                          backgroundColor: sentPage === 1 ? "#e5e7eb" : "var(--color-dark, #231e25)",
                          color: sentPage === 1 ? "#9ca3af" : "#fff",
                          border: "2px solid #000",
                          padding: "6px 14px",
                          borderRadius: 4,
                          fontFamily: "var(--font-display)",
                          fontSize: 16,
                          cursor: sentPage === 1 ? "not-allowed" : "pointer",
                        }}
                      >
                        ← PREV
                      </button>

                      {Array.from({ length: totalSentPages }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          onClick={() => setSentPage(num)}
                          style={{
                            minWidth: 36,
                            height: 36,
                            backgroundColor: sentPage === num ? "var(--color-primary, #ff3e33)" : "#ffffff",
                            color: sentPage === num ? "#ffffff" : "#000000",
                            border: "2px solid #000",
                            boxShadow: sentPage === num ? "2px 2px 0 #000" : "none",
                            borderRadius: 4,
                            fontFamily: "var(--font-display)",
                            fontSize: 18,
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          {num}
                        </button>
                      ))}

                      <button
                        onClick={() => setSentPage((p) => Math.min(totalSentPages, p + 1))}
                        disabled={sentPage === totalSentPages}
                        style={{
                          backgroundColor: sentPage === totalSentPages ? "#e5e7eb" : "var(--color-dark, #231e25)",
                          color: sentPage === totalSentPages ? "#9ca3af" : "#fff",
                          border: "2px solid #000",
                          padding: "6px 14px",
                          borderRadius: 4,
                          fontFamily: "var(--font-display)",
                          fontSize: 16,
                          cursor: sentPage === totalSentPages ? "not-allowed" : "pointer",
                        }}
                      >
                        NEXT →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* MESSAGE DETAIL VIEW */}
          {selectedMessage && (
            <div
              style={{
                backgroundColor: "var(--color-light, #fff8eb)",
                border: "3px solid var(--color-dark, #231e25)",
                boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
                padding: "28px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => setSelectedMessage(null)}
                  style={{ background: "#ffffff", border: "2px solid #000", padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", fontWeight: 800, fontSize: 13 }}
                >
                  ← Back to Messages List
                </button>
                <span style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "#6b7280" }}>
                  Sent: {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>

              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, margin: "0 0 8px 0" }}>
                  {selectedMessage.subject || "(No Subject)"}
                </h3>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>
                  <span><strong>From:</strong> {selectedMessage.sender?.name} ({selectedMessage.sender?.role})</span>
                  <span><strong>To:</strong> {selectedMessage.receiver?.name} ({selectedMessage.receiver?.role})</span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "2px solid var(--color-dark, #231e25)",
                  padding: "20px",
                  borderRadius: 4,
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedMessage.body}
              </div>

              {selectedMessage.sender?._id !== user._id && (
                <div>
                  <button
                    onClick={() => handleReply(selectedMessage)}
                    style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "2px solid #000", boxShadow: "2px 2px 0px #000", padding: "10px 22px", fontFamily: "var(--font-display)", fontSize: 20, cursor: "pointer" }}
                  >
                    Reply to Message →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* COMPOSE TAB */}
          {activeTab === "compose" && !selectedMessage && (
            <form
              onSubmit={handleSendMessage}
              style={{
                backgroundColor: "#ffffff",
                border: "3px solid var(--color-dark, #231e25)",
                boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
              <ShineSweep duration={1.5} delay={0.3} opacity={0.25} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: 0 }}>
                COMPOSE NEW TRANSMISSION
              </h3>

              <div>
                <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>To (Recipient) *</label>
                {user?.role === "admin" ? (
                  <select
                    value={composeData.receiver}
                    onChange={(e) => setComposeData({ ...composeData, receiver: e.target.value })}
                    style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, marginTop: 4, backgroundColor: "var(--color-light, #fff8eb)" }}
                  >
                    <option value="">-- Select Recipient --</option>
                    {usersList.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.role}{u.company ? ` - ${u.company}` : ""}) - {u.email}
                      </option>
                    ))}
                  </select>
                ) : recipientOptions.length > 1 ? (
                  <select
                    value={composeData.receiver}
                    onChange={(e) => setComposeData({ ...composeData, receiver: e.target.value })}
                    style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, marginTop: 4, backgroundColor: "var(--color-light, #fff8eb)" }}
                  >
                    {recipientOptions.map((opt) => (
                      <option key={opt._id} value={opt._id}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={adminContact ? `${adminContact.name} (Organizer Direct Desk)` : "Loading Organizer Contact..."}
                    style={{ width: "100%", padding: "10px", border: "2px solid #ccc", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, marginTop: 4, backgroundColor: "#f3f4f6" }}
                  />
                )}
              </div>

              <div>
                <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Subject</label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  placeholder="Inquiry topic / booth question"
                  style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4 }}
                />
              </div>

              <div>
                <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Message Body *</label>
                <textarea
                  rows="5"
                  value={composeData.body}
                  onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                  placeholder="Type your message or inquiry here..."
                  style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4 }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={sending}
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
                  cursor: sending ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                {sending && <PulseDot color="#fff" glow={false} size={8} />}
                {sending ? "SENDING..." : "DISPATCH MESSAGE"}
              </motion.button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default Messages;