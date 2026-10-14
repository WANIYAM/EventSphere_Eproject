import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EXPO_FAQS = [
  {
    q: "How do exhibitors reserve and manage booth spaces?",
    a: "Exhibitors can review available booth spaces and submit an application. Organizers review applications and assign booth spaces. Exhibitors can maintain their company profile, products or services, and contact information.",
    rot: -1.8,
  },
  {
    q: "How does EventSphere differentiate user roles?",
    a: "Users register as organizers, exhibitors, or attendees. Each role has access to the event information and management tools relevant to its work.",
    rot: 2.0,
  },
  {
    q: "What can attendees do with the event schedule?",
    a: "Attendees can browse event schedules, sessions, and workshops, then register for events or sessions and bookmark sessions of interest. The system can provide notifications or reminders for bookmarked sessions.",
    rot: -1.5,
  },
  {
    q: "How can users contact exhibitors or organizers?",
    a: "Attendees can contact exhibitors with questions, and exhibitors can contact organizers for support. The platform also provides messaging for users to communicate about event-related inquiries.",
    rot: 1.8,
  },
  {
    q: "What analytics and reporting are available for organizers?",
    a: "Organizer reports cover attendee engagement, booth traffic, and session popularity to help review expo performance.",
    rot: -2.1,
  },
  {
    q: "How does EventSphere manage account access and privacy?",
    a: "EventSphere provides role-based account access for organizers, exhibitors, and attendees. Contact the event organizer for information about data handling and privacy practices for a specific deployment.",
    rot: 1.5,
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" style={{ maxWidth: 1040, margin: "0 auto", padding: "80px 24px 120px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <span style={{ color: "var(--color-cerulean)", fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" }}>
          EVENT MANAGEMENT HELP
        </span>
        <h2 className="style-display" style={{ fontSize: "clamp(46px, 7vw, 84px)", color: "var(--color-dark)", marginTop: 6 }}>
          EVENTSPHERE &#123; QUESTIONS &#125; & ANSWERS
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
