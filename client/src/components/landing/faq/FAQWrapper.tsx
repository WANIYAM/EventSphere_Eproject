import React from "react";
import { FAQItem } from "./FAQItem";
import { FAQS } from "../../data/content";

export const FAQWrapper: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      {FAQS.map((item, idx) => (
        <FAQItem
          key={idx}
          question={item.question}
          answer={item.answer}
          defaultOpen={idx === 0}
          rotation={item.rotation}
        />
      ))}
    </div>
  );
};