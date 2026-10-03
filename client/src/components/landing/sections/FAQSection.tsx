import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EXPO_FAQS = [
  {
    q: "How do exhibitors reserve and manage booth spaces?",
    a: "Exhibitors log into the Exhibitor Portal to browse available spaces on the interactive floor plan. Once a space is chosen, they can reserve it, upload company logos, list products/services, and manage on-site staff badges.",
    rot: -1.8,
  },
  {
    q: "How does EventSphere differentiate user roles?",
    a: "During registration, users choose between Admin/Organizer, Exhibitor, or Attendee roles. Role-based access control (RBAC) ensures organizers manage floor plans and schedules, exhibitors manage booths, and attendees browse and bookmark sessions.",
    rot: 2.0,
  },
  {
    q: "Can attendees bookmark sessions and receive real-time updates?",
    a: "Yes. Attendees can search the schedule, register for specific workshops, and bookmark sessions. The system provides real-time notifications for schedule changes, room updates, and upcoming bookmarked sessions.",
    rot: -1.5,
  },
  {
    q: "How can attendees and neighboring exhibitors communicate?",
    a: "EventSphere includes direct messaging and inquiry tools. Attendees can initiate contact with exhibitors for product inquiries and appointments, while neighboring booth exhibitors can collaborate directly through the platform.",
    rot: 1.8,
  },
  {
    q: "What analytics and reporting are available for organizers?",
    a: "Organizers have access to a real-time dashboard displaying overall expo performance, attendee footfall, session popularity metrics, and individual booth engagement analytics.",
    rot: -2.1,
  },
  {
    q: "What security and data privacy standards are implemented?",
    a: "All sensitive user data, passwords, and communications are encrypted during storage and transmission. The system complies with GDPR privacy guidelines and features automated daily backups to guarantee 99% uptime.",
    rot: 1.5,
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" style={{ maxWidth: 1040, margin: "0 auto", padding: "80px 24px 120px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <span style={{ color: "var(--color-cerulean)", fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" }}>
          SYSTEM SPECIFICATIONS & ARCHITECTURE
        </span>
        <h2 className="style-display" style={{ fontSize: "clamp(46px, 7vw, 84px)", color: "var(--color-dark)", marginTop: 6 }}>
          EXPO SUITE &#123; FAQS &#125; ARCHITECTURE
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {EXPO_FAQS.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div key={idx} style={{ position: "relative" }}>
              <motion.button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                whileHover={{ x: -2 }}
                style={{
                  width: "100%",
                  padding: "24px 28px",
                  backgroundColor: "var(--color-light)",
                  border: "2px solid var(--color-dark)",
                  boxShadow: isOpen ? "none" : "4px 4px 0px var(--color-dark)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "left",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <span className="style-p2" style={{ fontSize: "clamp(18px, 2.5vw, 26px)", color: "var(--color-dark)" }}>
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? "var(--color-primary)" : "var(--color-kiwi)" }}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    color: isOpen ? "#fff" : "var(--color-dark)",
                    border: "2px solid var(--color-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  +
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, rotate: 0 }}
                    animate={{ opacity: 1, height: "auto", rotate: item.rot }}
                    exit={{ opacity: 0, height: 0, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 24 }}
                    style={{
                      backgroundColor: "var(--color-selective-yellow)",
                      border: "2px solid var(--color-dark)",
                      boxShadow: "6px 6px 0px var(--color-dark)",
                      padding: "32px",
                      marginTop: 10,
                      marginBottom: 16,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <p className="style-p3" style={{ color: "var(--color-dark)" }}>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
