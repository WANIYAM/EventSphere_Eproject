import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Expo from "../models/Expo.js";
import Booth from "../models/Booth.js";
import Application from "../models/Application.js";
import Session from "../models/Session.js";
import Registration from "../models/Registration.js";
import Message from "../models/Message.js";
import Feedback from "../models/Feedback.js";
import Notification from "../models/Notification.js";

dotenv.config();

if (process.env.NODE_ENV === "production") {
  console.error("Refusing to seed demo data when NODE_ENV=production.");
  process.exit(1);
}

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventsphere";
const DEMO_PASSWORD = "Demo@123";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// Seeded random generator: the same data is produced on every run.
function mulberry32(seed) {
  let a = seed;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20261013);
const rand = () => rng();
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const chance = (p) => rand() < p;
const sample = (arr, n) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
};

// Dates are relative to today, so expos always show as upcoming (or past) correctly.
const atUTC = (dayOffset, hour = 9, minute = 0) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + dayOffset);
  d.setUTCHours(hour, minute, 0, 0);
  return d;
};
const randomPast = (maxDays) => new Date(Date.now() - randInt(1, maxDays * 24) * 3600000);

// Creates documents in small parallel batches. Keeps going if one fails.
// The returned array lines up with `docs` (null where a document failed).
const createMany = async (Model, docs, label, chunkSize = 20) => {
  const out = [];
  let failed = 0;
  let firstError = null;
  for (let i = 0; i < docs.length; i += chunkSize) {
    const results = await Promise.allSettled(docs.slice(i, i + chunkSize).map((d) => Model.create(d)));
    for (const r of results) {
      if (r.status === "fulfilled") {
        out.push(r.value);
      } else {
        out.push(null);
        failed++;
        if (!firstError) firstError = r.reason;
      }
    }
  }
  if (failed) {
    console.warn(`  ! ${label}: ${failed} of ${docs.length} could not be created. First error: ${firstError?.message}`);
    if (firstError?.code === 11000) {
      console.warn("    (duplicate key: check the unique indexes on this collection, see the notes in the chat)");
    }
  }
  return out;
};

const rotateIndex = (offset, k, length) => (offset + k) % length;

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const EXHIBITORS = [
  {
    company: "Bush Babe Displays",
    email: "bushbabe@demo.com",
    category: "Exhibition Technology",
    website: "https://bushbabe-displays.com",
    description: "Their packaging design for our ziplock bags and adorable print collaterals have our customers falling in love!",
    products: "Modular trade show booths and RFID-enabled badges",
    logo: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "Wilder Ness Digital",
    email: "wilderness@demo.com",
    category: "Smart Signage",
    website: "https://wilderness-digital.com",
    description: "BYOOOOOB breathed life into Wilderness! From brand identity to iSUP surfboards and packaging design!",
    products: "Digital wayfinding totems and synchronized LED screens",
    logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "EPYC Systems",
    email: "epyc@demo.com",
    category: "Cloud Infrastructure",
    website: "https://epyc-systems.com",
    description: "They are fast & affordable for a growing business. Would continue to work with them as long as possible!",
    products: "High-throughput cloud registration nodes with 99.9% uptime",
    logo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "SpeckLes IoT",
    email: "speckles@demo.com",
    category: "Smart IoT & Packaging",
    website: "https://speckles-iot.com",
    description: "Super professional bunch, sticks to timelines! My go-to team for all our packaging design.",
    products: "Smart IoT touch surfaces and real-time booth lead scanners",
    logo: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "Orchid Foods Sdn Bhd",
    email: "orchid@demo.com",
    category: "Food & Beverage",
    website: "https://orchidfoods.com.my",
    description: "Premium Malaysian snacks and ready-to-drink beverages crafted from local ingredients.",
    products: "Artisan snacks, sambal sauces, and cold-brew white coffee",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "Batik Bloom Atelier",
    email: "batikbloom@demo.com",
    category: "Fashion & Textiles",
    website: "https://batikbloom.my",
    description: "Contemporary batik and songket fashion designed for the modern wardrobe.",
    products: "Batik apparel, scarves, and accessories",
    logo: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "VitaCare Wellness",
    email: "vitacare@demo.com",
    category: "Health & Wellness",
    website: "https://vitacare-wellness.com",
    description: "Preventive health screening and wellness products for families.",
    products: "Health screening kiosks and herbal supplements",
    logo: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "BrightPath Academy",
    email: "brightpath@demo.com",
    category: "Education & Training",
    website: "https://brightpath-academy.edu.my",
    description: "Skills training and certification programmes for working professionals.",
    products: "Digital skills courses and corporate training packages",
    logo: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "VoltDrive Motors",
    email: "voltdrive@demo.com",
    category: "Automotive & EV",
    website: "https://voltdrive-motors.com",
    description: "Electric mobility solutions and public charging infrastructure.",
    products: "EV chargers, electric scooters, and fleet conversion kits",
    logo: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "SolarNest Energy",
    email: "solarnest@demo.com",
    category: "Renewable Energy",
    website: "https://solarnest-energy.com",
    description: "Rooftop solar and battery storage for homes and factories.",
    products: "Solar panels, inverters, and battery storage systems",
    logo: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "SwiftHaul Logistics",
    email: "swifthaul@demo.com",
    category: "Logistics & Supply Chain",
    website: "https://swifthaul-logistics.com",
    description: "End-to-end freight, warehousing, and last-mile delivery across ASEAN.",
    products: "Freight forwarding, warehousing, and a delivery tracking platform",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "Langkawi Escapes",
    email: "langkawi@demo.com",
    category: "Hospitality & Travel",
    website: "https://langkawi-escapes.com",
    description: "Boutique island resorts and curated travel experiences.",
    products: "Resort packages and guided adventure tours",
    logo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "PayNimbus",
    email: "paynimbus@demo.com",
    category: "Fintech",
    website: "https://paynimbus.io",
    description: "Payments and invoicing tools built for small merchants.",
    products: "QR payment terminals and merchant dashboards",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "GreenHarvest Agritech",
    email: "greenharvest@demo.com",
    category: "Agritech",
    website: "https://greenharvest-agritech.com",
    description: "Smart farming sensors and farm-to-market platforms.",
    products: "Soil sensors, drone mapping, and crop analytics",
    logo: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "PrintPeak Studio",
    email: "printpeak@demo.com",
    category: "Print & Packaging",
    website: "https://printpeak-studio.com",
    description: "Custom packaging, large-format printing, and branded merchandise.",
    products: "Eco packaging, banners, and branded merchandise",
    logo: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "StageCraft Events",
    email: "stagecraft@demo.com",
    category: "Event Services",
    website: "https://stagecraft-events.com",
    description: "Staging, lighting, and AV production for exhibitions and conferences.",
    products: "Stage builds, LED walls, and sound systems",
    logo: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "CloudBridge Networks",
    email: "cloudbridge@demo.com",
    category: "Cloud Infrastructure",
    website: "https://cloudbridge-networks.com",
    description: "Managed cloud hosting and connectivity for growing businesses.",
    products: "Managed hosting, VPN, and disaster recovery",
    logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "PixelForge Interactive",
    email: "pixelforge@demo.com",
    category: "Exhibition Technology",
    website: "https://pixelforge-interactive.com",
    description: "AR and VR experiences for product demos and brand activations.",
    products: "AR product demos and VR showrooms",
    logo: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "AquaPure Systems",
    email: "aquapure@demo.com",
    category: "Water & Environment",
    website: "https://aquapure-systems.com",
    description: "Water purification and wastewater treatment systems.",
    products: "Filtration units and water quality monitors",
    logo: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "Kopi Kita Roasters",
    email: "kopikita@demo.com",
    category: "Food & Beverage",
    website: "https://kopikita-roasters.com",
    description: "Single-origin coffee roasted in small batches in Sabah.",
    products: "Roasted beans, drip bags, and cafe equipment",
    logo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "SafeGate Security",
    email: "safegate@demo.com",
    category: "Cybersecurity",
    website: "https://safegate-security.com",
    description: "Cybersecurity consulting and managed detection services.",
    products: "Security audits, endpoint protection, and 24/7 monitoring",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "TerraBuild Materials",
    email: "terrabuild@demo.com",
    category: "Construction & Materials",
    website: "https://terrabuild-materials.com",
    description: "Sustainable building materials and prefab solutions.",
    products: "Eco bricks, prefab panels, and insulation",
    logo: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "LuminaRetail Tech",
    email: "luminaretail@demo.com",
    category: "Retail Technology",
    website: "https://luminaretail.tech",
    description: "Smart shelves, point of sale, and in-store analytics.",
    products: "POS systems, smart shelf labels, and footfall analytics",
    logo: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    company: "NusaCraft Collective",
    email: "nusacraft@demo.com",
    category: "Handicrafts & Design",
    website: "https://nusacraft-collective.com",
    description: "Handmade crafts and design pieces from Borneo artisans.",
    products: "Wood carvings, woven goods, and home decor",
    logo: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=300&h=300&q=80"
  },
];

const ATTENDEE_NAMES = [
  "Aisha Khan", "Daniel Tan", "Nur Aisyah", "Rahul Mehta", "Mei Ling", "Hassan Raza", "Farah Ibrahim", "Jason Lee",
  "Zainab Ali", "Amir Hamzah", "Priya Sharma", "Ben Ong", "Sara Ahmed", "Kevin Lau", "Nadia Yusof", "Omar Farooq",
  "Chloe Wong", "Imran Sheikh", "Lina Abdullah", "Ravi Chandran", "Hira Malik", "Adam Yeoh", "Alya Rashid", "Tariq Mahmood",
  "Sophie Lim", "Yusuf Karim", "Mariam Qureshi", "Eric Chan", "Dina Salleh", "Bilal Ahmad", "Joanne Teo", "Faisal Nawaz",
  "Hana Othman", "Vikram Singh", "Elena Tay", "Usman Ghani", "Nabila Rosli", "Calvin Goh", "Rida Fatima", "Syed Hamdan",
];

const EMPLOYERS = [
  "Self-employed", "Nexus Retail Group", "Horizon Telecom", "Penang Tech Hub", "Sunrise Trading", "Meridian Hotels",
  "Apex Manufacturing", "BlueWave Consulting", "Harmony Logistics", "Campus Ventures", "Independent consultant", "Crescent Foods",
];

const SPEAKERS = [
  "Sofia Rahman (Lead Organizer)", "Noah Islam (Booth Strategist)", "Ethan Karim (Platform Architect)", "Arian Malik (Experience Director)",
  "Dr. Aisha Tan (Event Economist)", "Daniel Lim (Retail Technologist)", "Priya Nair (Sustainability Lead)", "Hafiz Abdullah (Logistics Director)",
  "Mei Ling Chong (Fintech Analyst)", "Farah Zainal (Marketing Strategist)", "Rajesh Kumar (Supply Chain Expert)", "Siti Aminah (Tourism Board Advisor)",
  "Jason Wong (Cybersecurity Consultant)", "Nurul Huda (Startup Mentor)", "Marcus Lee (Robotics Engineer)", "Aliyah Hassan (Hospitality Consultant)",
];

const STAFF_POOL = [
  { name: "Ahmad Faiz", role: "Sales Lead" }, { name: "Lim Wei Jie", role: "Product Specialist" },
  { name: "Nurul Izzah", role: "Customer Success" }, { name: "Ravi Menon", role: "Technical Support" },
  { name: "Tan Mei Xin", role: "Marketing Executive" }, { name: "Hakim Zulkifli", role: "Account Manager" },
  { name: "Sarah Lee", role: "Booth Coordinator" }, { name: "Kumar Pillai", role: "Business Development" },
];

const TIERS = {
  A: { size: "6x6 m", price: 1200 },
  B: { size: "3x6 m", price: 800 },
  C: { size: "3x3 m", price: 500 },
};

// Four sessions a day. Different locations, so nothing overlaps in the same room.
const SLOTS = [
  { hour: 4, minute: 0, duration: 90, location: "Main Auditorium" },
  { hour: 6, minute: 0, duration: 120, location: "Exhibit Hall 1" },
  { hour: 9, minute: 0, duration: 120, location: "Conference Room B" },
  { hour: 12, minute: 0, duration: 150, location: "Executive Lounge" },
];

// Each expo needs (days x 4) session titles.
const EXPOS = [
  {
    title: "EventSphere Asia Summit 2026",
    theme: "Reinventing Trade Shows for Asia",
    location: "Putrajaya International Convention Centre, Putrajaya, Malaysia",
    description: "A three-day summit on smart venues, exhibitor onboarding at scale, and real-time analytics for organizers. This edition has already taken place.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    startOffset: -45, days: 3, boothCount: 24, speakerOffset: 0,
    offset: 6, counts: { booked: 10, reserved: 0, approved: 0, pending: 0, rejected: 2 },
    sessions: [
      ["Opening Keynote: Reinventing Trade Shows for Asia", "Event Industry"], ["Showcase: Smart Venue Technology", "Venue Tech"],
      ["Panel: Government and Industry Partnerships", "Public-Private"], ["Delegates' Welcome Reception", "Networking"],
      ["Workshop: Exhibitor Onboarding That Scales", "Operations"], ["Talk: Real-Time Analytics for Organizers", "Analytics"],
      ["Panel: Accessibility and Inclusion at Events", "Inclusion"], ["Sponsor Showcase Session", "Sponsorship"],
      ["Keynote: Generative AI in Event Planning", "Applied AI"], ["Workshop: Crisis Management for Live Events", "Risk"],
      ["Panel: The Next Decade of Expos", "Future Trends"], ["Closing Ceremony & Summit Awards", "Awards"],
    ],
  },
  {
    title: "EventSphere Expo 2025",
    theme: "Next-Gen Trade Shows & Digital Floor Plans",
    location: "KOMCA DPS 1, Penang, Malaysia",
    description: "Overcoming traditional trade show hurdles through automated registration, interactive floor plans, and real-time analytics across 150,000 sq ft.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    startOffset: 2, days: 3, boothCount: 30, speakerOffset: 0,
    prefix: [{ i: 0, state: "booked" }, { i: 1, state: "reserved" }, { i: 2, state: "booked" }, { i: 3, state: "booked" }],
    offset: 4, counts: { booked: 8, reserved: 2, approved: 2, pending: 4, rejected: 1 },
    sessions: [
      ["Opening Keynote & EventSphere Platform Unveiling", "Trade Show Modernization"], ["Exhibitor Product Showcases & Interactive Floor Walk", "Floor Plan Navigation"],
      ["Panel: Scalable Architecture for Global Expos", "Enterprise Concurrency"], ["B2B Matchmaking Gala & Exhibitor Awards", "Executive Networking"],
      ["Keynote: The Future of Hybrid Trade Shows", "Event Technology Trends"], ["Workshop: Designing a Booth That Converts", "Booth Design"],
      ["Panel: Data-Driven Lead Generation", "Analytics & Leads"], ["Sponsor Roundtable: Measuring Expo ROI", "Sponsorship & ROI"],
      ["Keynote: Sustainability in Large-Scale Events", "Green Events"], ["Live Demo: RFID Badges and Smart Check-in", "Attendee Experience"],
      ["Fireside Chat: Building Exhibitor Communities", "Community & Networking"], ["Closing Ceremony & Best Booth Awards", "Awards"],
    ],
  },
  {
    title: "Malaysia Digital Commerce Expo",
    theme: "Selling Smarter Across ASEAN",
    location: "Kuala Lumpur Convention Centre, Kuala Lumpur, Malaysia",
    description: "E-commerce platforms, payment providers, and logistics partners meet online merchants to talk cross-border selling, social commerce, and AI-driven retail.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    startOffset: 21, days: 3, boothCount: 30, speakerOffset: 3,
    offset: 8, counts: { booked: 9, reserved: 3, approved: 2, pending: 4, rejected: 2 },
    sessions: [
      ["Keynote: Malaysia's Digital Economy Roadmap", "Digital Economy"], ["Showcase: E-commerce Platforms and Payment Gateways", "E-commerce"],
      ["Panel: Cross-Border Selling in ASEAN", "Cross-Border Trade"], ["Fintech Networking Evening", "Fintech"],
      ["Workshop: Conversion Rate Optimization", "Growth Marketing"], ["Talk: Social Commerce and Live Selling", "Social Commerce"],
      ["Panel: Cybersecurity for Online Merchants", "Cybersecurity"], ["Startup Pitch Session", "Startups"],
      ["Keynote: AI in Retail Personalization", "Applied AI"], ["Workshop: Last-Mile Delivery Optimization", "Logistics"],
      ["Panel: Women in Tech and Commerce", "Leadership"], ["Closing Keynote & Digital Commerce Awards", "Awards"],
    ],
  },
  {
    title: "Borneo Green Energy & Agritech Expo",
    theme: "Powering and Feeding a Sustainable Borneo",
    location: "Borneo Convention Centre Kuching, Sarawak, Malaysia",
    description: "Renewable energy providers, agritech innovators, and sustainability advocates show practical solutions for farms, factories, and rural communities.",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    startOffset: 45, days: 2, boothCount: 24, speakerOffset: 6,
    offset: 14, counts: { booked: 6, reserved: 2, approved: 1, pending: 3, rejected: 1 },
    sessions: [
      ["Opening Keynote: Powering Borneo with Renewables", "Renewable Energy"], ["Showcase: Solar, Hydro and Biomass Solutions", "Clean Tech"],
      ["Panel: Financing the Green Transition", "Green Finance"], ["Networking Dinner with Agri Innovators", "Networking"],
      ["Workshop: Smart Farming with IoT Sensors", "Agritech"], ["Talk: Sustainable Palm Oil and Forest Conservation", "Sustainability"],
      ["Panel: Electric Mobility for Rural Communities", "EV"], ["Closing Keynote & Innovation Awards", "Awards"],
    ],
  },
  {
    title: "Southern Gateway Logistics & Manufacturing Expo",
    theme: "Building ASEAN's Industrial Supply Chain",
    location: "Persada Johor International Convention Centre, Johor Bahru, Malaysia",
    description: "Manufacturers, freight operators, and automation vendors meet to discuss Industry 4.0, cold chain, and export readiness for SMEs.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    startOffset: 70, days: 3, boothCount: 30, speakerOffset: 9,
    offset: 3, counts: { booked: 8, reserved: 3, approved: 2, pending: 3, rejected: 2 },
    sessions: [
      ["Keynote: Johor as ASEAN's Logistics Hub", "Supply Chain"], ["Showcase: Warehouse Automation and Robotics", "Automation"],
      ["Panel: Industry 4.0 in Manufacturing", "Industry 4.0"], ["Manufacturers' Networking Evening", "Networking"],
      ["Workshop: Cold Chain Management", "Cold Chain"], ["Talk: Port Operations and Customs Digitalization", "Trade Facilitation"],
      ["Panel: Reskilling the Industrial Workforce", "Workforce"], ["Supplier Speed-Matching Session", "B2B Matching"],
      ["Keynote: Green Logistics and Carbon Reporting", "Sustainability"], ["Live Demo: Fleet Tracking and Route Optimization", "Fleet Tech"],
      ["Panel: SME Export Readiness", "Exports"], ["Closing Keynote & Excellence Awards", "Awards"],
    ],
  },
  {
    title: "Sabah Tourism & Hospitality Expo",
    theme: "Growing Sabah's Visitor Economy",
    location: "Sabah International Convention Centre, Kota Kinabalu, Malaysia",
    description: "Resorts, tour operators, and tourism boards share strategies for eco-tourism, guest experience, and digital marketing for hotels and homestays.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    startOffset: 100, days: 2, boothCount: 24, speakerOffset: 12,
    offset: 18, counts: { booked: 5, reserved: 2, approved: 1, pending: 3, rejected: 1 },
    sessions: [
      ["Opening Keynote: Sabah's Tourism Recovery and Growth", "Tourism Strategy"], ["Showcase: Eco-Resorts and Adventure Operators", "Eco-Tourism"],
      ["Panel: Digital Marketing for Hotels and Homestays", "Hospitality Marketing"], ["Chefs' Showcase & Networking Evening", "Culinary Tourism"],
      ["Workshop: Guest Experience and Service Design", "Guest Experience"], ["Talk: Marine Conservation and Dive Tourism", "Conservation"],
      ["Panel: Sustainable Tourism Certification", "Sustainability"], ["Closing Keynote & Hospitality Awards", "Awards"],
    ],
  },
];

const demoExpos = [
  {
    title: "Global Tech & AI Innovation Expo 2025",
    description: "The world's leading exhibition for artificial intelligence, robotics, and enterprise cloud architecture.",
    theme: "Artificial Intelligence & Cloud",
    location: "Kuala Lumpur Convention Centre (KLCC)",
    startDate: new Date("2025-06-10"),
    endDate: new Date("2025-06-13"),
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    days: 4, boothCount: 24, speakerOffset: 1,
    offset: 2, counts: { booked: 7, reserved: 3, approved: 2, pending: 3, rejected: 1 },
    sessions: [
      ["Opening Keynote: Building Responsible AI at Scale", "Artificial Intelligence"], ["Robotics Showcase: Automation in Practice", "Robotics"],
      ["Panel: Enterprise Cloud Architecture", "Cloud Computing"], ["Networking Reception: AI Innovators", "Networking"],
      ["Workshop: Deploying Generative AI Safely", "Responsible AI"], ["Live Demo: Collaborative Service Robots", "Robotics"],
      ["Panel: Cloud Security and Data Sovereignty", "Cybersecurity"], ["Startup Pitches: Applied AI", "Startups"],
      ["Keynote: The Future of Human-AI Collaboration", "Future Technology"], ["Workshop: Scaling Machine Learning", "Machine Learning"],
      ["Panel: AI Regulation and Governance", "Policy"], ["Technology Partner Showcase", "Enterprise Technology"],
      ["Talk: Sustainable Data Centres", "Cloud Sustainability"], ["Workshop: From AI Pilot to Production", "AI Operations"],
      ["Panel: Investing in Deep Tech", "Venture Capital"], ["Closing Keynote: Innovation for Everyone", "Innovation"],
    ],
  },
  {
    title: "Penang Green Energy & Smart Cities Summit",
    description: "Showcasing sustainable energy solutions, EV mobility infrastructure, and IoT urban management.",
    theme: "Renewable Energy & IoT",
    location: "Setia SPICE Convention Centre, Penang",
    startDate: new Date("2025-07-22"),
    endDate: new Date("2025-07-24"),
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    days: 3, boothCount: 24, speakerOffset: 4,
    offset: 10, counts: { booked: 6, reserved: 3, approved: 3, pending: 2, rejected: 1 },
    sessions: [
      ["Opening Keynote: Powering the Smart City", "Smart Cities"], ["Showcase: Grid-Scale Renewable Energy", "Renewable Energy"],
      ["Panel: EV Charging Networks for Malaysia", "Electric Mobility"], ["Green Cities Networking Reception", "Networking"],
      ["Workshop: IoT for Urban Energy Management", "Internet of Things"], ["Talk: Solar and Battery Storage", "Energy Storage"],
      ["Panel: Financing Sustainable Infrastructure", "Green Finance"], ["Smart Mobility Product Showcase", "Urban Mobility"],
      ["Keynote: Resilient Cities and Climate Adaptation", "Climate Resilience"], ["Workshop: Measuring City Carbon Emissions", "Sustainability"],
      ["Panel: Connected Buildings and Public Services", "Urban Technology"], ["Closing Session: A Greener Penang", "City Planning"],
    ],
  },
  {
    title: "Silicon Valley Future Tech & Fintech Forum",
    description: "Connecting fintech disruptors, venture capitalists, and cybersecurity pioneers in Northern California.",
    theme: "Fintech & Cybersecurity",
    location: "Moscone Center, San Francisco",
    startDate: new Date("2025-09-15"),
    endDate: new Date("2025-09-18"),
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    days: 4, boothCount: 24, speakerOffset: 8,
    offset: 18, counts: { booked: 7, reserved: 2, approved: 3, pending: 2, rejected: 1 },
    sessions: [
      ["Opening Keynote: The Next Wave of Financial Technology", "Fintech"], ["Showcase: Secure Digital Payments", "Payments"],
      ["Panel: Protecting the Global Financial System", "Cybersecurity"], ["Investor and Founder Welcome Reception", "Networking"],
      ["Workshop: Building Compliant Fintech Products", "Financial Regulation"], ["Talk: Identity, Fraud, and Trust", "Digital Identity"],
      ["Panel: AI in Financial Services", "Artificial Intelligence"], ["Startup Pitch: Future of Finance", "Startups"],
      ["Keynote: Open Banking and Embedded Finance", "Open Finance"], ["Workshop: Cloud Security for Fintech", "Cloud Security"],
      ["Panel: Venture Capital and Deep Tech", "Venture Capital"], ["Product Showcase: Wealth Technology", "WealthTech"],
      ["Talk: Cross-Border Payments at Scale", "Payments"], ["Workshop: Incident Response for Startups", "Cybersecurity"],
      ["Panel: Responsible AI in Financial Decisions", "Responsible AI"], ["Closing Forum: Building Trusted Finance", "Future of Finance"],
    ],
  },
];

const INQUIRIES = [
  { subject: "Question about your products", body: (c) => `Hello ${c} team, I'll be visiting the expo and would like to know more about your product range. Do you offer live demos at your booth?` },
  { subject: "Partnership enquiry", body: (c) => `Hi ${c}, we run a small business and are looking for suppliers. Could someone from your team meet me during the expo?` },
  { subject: "Booth visit appointment", body: (c) => `Good day, I would like to book a short appointment at the ${c} booth. Which time slot is best for you?` },
  { subject: "Pricing and brochure request", body: (c) => `Hello, could ${c} share a brochure and indicative pricing before the event? Thank you.` },
  { subject: "Sample request", body: (c) => `Hi ${c}, do you plan to give out samples at the expo? I am interested in trying your products.` },
  { subject: "Do you offer bulk discounts?", body: (c) => `Dear ${c}, my company is planning a bulk order. Are there special rates for orders placed at the expo?` },
];
const INQUIRY_REPLIES = [
  "Thanks for your interest! Yes, we run live demos at our booth every two hours. Please drop by.",
  "Happy to help. We will have our sales team at the booth on all expo days. Looking forward to meeting you.",
  "Thank you for reaching out. Please come by in the afternoon, when we will have more time for a proper discussion.",
  "We will bring brochures and a price list to the booth. See you there!",
];
const EXHIBITOR_TO_ADMIN = [
  { subject: "Booth setup time", body: "Hello, could you confirm what time exhibitors can start setting up the day before the expo?" },
  { subject: "Extra power sockets", body: "Our demo needs two additional power sockets at the booth. Is it possible to arrange this?" },
  { subject: "Application status question", body: "We submitted our application a few days ago. When can we expect a decision?" },
  { subject: "Logo and listing update", body: "We updated our company logo and description. Please let us know if it appears correctly on the exhibitor list." },
  { subject: "Booth upgrade request", body: "Is it possible to move to a larger booth if one becomes available?" },
  { subject: "Wi-Fi access for demos", body: "Will there be dedicated Wi-Fi at the booths? Our product demo needs a stable connection." },
  { subject: "Staff badges", body: "How many exhibitor badges are included with our booth, and can we request extra ones?" },
];
const ADMIN_REPLIES = [
  "Setup opens at 8:00 AM the day before the expo. Please bring your booth confirmation with you.",
  "We have noted your request and will confirm shortly.",
  "Your application is under review and you will be notified as soon as it is processed.",
  "Thanks for the update. The listing now shows your latest details.",
  "We will check availability and get back to you within two working days.",
];
const SUGGESTIONS = [
  "The floor plan is easy to use. It would be great to filter booths by price.",
  "Please add a dark mode option for the dashboard.",
  "A downloadable PDF schedule would help attendees plan their day.",
  "Add the ability to export bookmarked sessions to my calendar.",
  "More filters on the exhibitor search, such as category and location, would be useful.",
  "Email reminders before sessions would be a helpful addition.",
  "It would help to see booth photos on exhibitor profiles.",
  "Please add a venue map that shows where each session room is.",
  "A mobile app would make this even better.",
  "Add a QR code for quick check-in at the venue entrance.",
  "Show ratings or reviews from previous expos on exhibitor profiles.",
  "Let attendees message several exhibitors at once.",
  "A short walkthrough for first-time users would be great.",
  "Add a live crowd indicator for popular sessions.",
  "Allow exhibitors to pin an announcement on their profile.",
  "Consider adding multiple languages for international visitors.",
  "A checklist of what to bring on setup day would help exhibitors.",
  "Let attendees follow their favourite exhibitors for updates.",
  "Show the number of seats left for each session.",
  "Add a networking page where attendees can find each other.",
];
const ISSUES = [
  "The schedule page loaded slowly on my phone.",
  "I had trouble uploading a PNG logo on the profile page.",
  "The password reset link took a long time to arrive.",
  "The booth grid was hard to use on a small screen.",
  "The notification badge did not clear after I read my messages.",
  "The session time looked different from the time on the poster.",
  "One exhibitor appeared twice in the search results.",
  "The register button stayed disabled for a moment after I logged in.",
  "The page needed a refresh to show my latest booth status.",
  "Some table columns were cut off on my laptop screen.",
];

/* ------------------------------------------------------------------ */
/* Plan builder: which exhibitor applies to an expo, with what state    */
/* ------------------------------------------------------------------ */

const buildPlan = (offset, counts) => {
  const order = [];
  Object.entries({
    booked: counts.booked, reserved: counts.reserved, approved: counts.approved,
    pending: counts.pending, rejected: counts.rejected,
  }).forEach(([state, n]) => {
    for (let k = 0; k < n; k++) order.push(state);
  });
  return order.map((state, k) => ({ i: rotateIndex(offset, k, EXHIBITORS.length), state }));
};

/* ------------------------------------------------------------------ */
/* Seed                                                                */
/* ------------------------------------------------------------------ */

const seedDemoData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log("Database connected successfully.");

    /* ---- Clean ---- */
    console.log("Cleaning collections...");
    await Promise.all([
      Expo.deleteMany({}), Booth.deleteMany({}), Application.deleteMany({}), Session.deleteMany({}),
      Registration.deleteMany({}), Message.deleteMany({}), Feedback.deleteMany({}), Notification.deleteMany({}),
      User.deleteMany({ role: { $ne: "admin" } }),
    ]);

    /* ---- Admin ---- */
    let admin = await User.findOne({ role: "admin" });
    if (!admin) {
      admin = await User.create({
        name: "Super Admin", email: "admin@eventsphere.com", password: "Admin@123", role: "admin", phone: "+60 4-653 8888",
      });
      console.log("Admin created: admin@eventsphere.com / Admin@123");
    }

    /* ---- Exhibitors ---- */
    console.log(`Seeding ${EXHIBITORS.length} exhibitors...`);
    const exhibitorUsers = await createMany(
      User,
      EXHIBITORS.map((e, idx) => ({
        name: e.company,
        email: e.email,
        password: DEMO_PASSWORD,
        role: "exhibitor",
        company: e.company,
        category: e.category,
        website: e.website,
        description: e.description,
        // Added logo fields:
        logo: e.logo,
        avatar: e.logo,
        profileImage: e.logo,
        image: e.logo,
        phone: `+60 12-345 ${String(idx + 1).padStart(4, "0")}`,
      })),
      "exhibitors"
    );

    /* ---- Attendees ---- */
    console.log(`Seeding ${ATTENDEE_NAMES.length} attendees...`);
    const attendeeUsers = (await createMany(
      User,
      ATTENDEE_NAMES.map((name, idx) => ({
        name, email: `attendee${idx + 1}@demo.com`, password: DEMO_PASSWORD, role: "attendee",
        phone: `+60 12-555 ${String(100 + idx + 1).padStart(4, "0")}`,
        company: EMPLOYERS[idx % EMPLOYERS.length],
      })),
      "attendees"
    )).filter(Boolean);

    /* ---- Expos, booths, applications, sessions ---- */
    const createdExpos = []; // { doc, cfg }
    const sessionsByExpo = {};
    const applicationRecords = []; // used for notifications

    for (const cfg of [...EXPOS, ...demoExpos]) {
      console.log(`Seeding expo: ${cfg.title}`);
      const expoStartDate = cfg.startDate || atUTC(cfg.startOffset, 4, 0);
      const expoEndDate = cfg.endDate || atUTC(cfg.startOffset + cfg.days - 1, 14, 0);
      const expo = await Expo.create({
        title: cfg.title, theme: cfg.theme, location: cfg.location, description: cfg.description,
        image: cfg.image,
        startDate: expoStartDate,
        endDate: expoEndDate,
        createdBy: admin._id,
      });
      createdExpos.push({ doc: expo, cfg });

      // Plan: which exhibitors apply, and which of them hold a booth
      const rawPlan = [...(cfg.prefix || []), ...buildPlan(cfg.offset, cfg.counts)].filter((p) => exhibitorUsers[p.i]);
      let nextBooth = 0;
      const entries = rawPlan.map((p) => ({
        ...p,
        boothIndex: p.state === "booked" || p.state === "reserved" ? nextBooth++ : null,
      }));

      // Booths (A, B, C zones of 10). Booths held by exhibitors are filled in here.
      const boothDocs = Array.from({ length: cfg.boothCount }, (_, i) => {
        const zone = ["A", "B", "C"][Math.floor(i / 10)];
        return {
          expo: expo._id, boothNumber: `${zone}${(i % 10) + 1}`,
          size: TIERS[zone].size, price: TIERS[zone].price, status: "available",
        };
      });
      for (const en of entries) {
        if (en.boothIndex === null) continue;
        Object.assign(boothDocs[en.boothIndex], {
          status: en.state === "booked" ? "booked" : "reserved",
          exhibitor: exhibitorUsers[en.i]._id,
          details: `${EXHIBITORS[en.i].company}: ${EXHIBITORS[en.i].products}`,
          staff: sample(STAFF_POOL, 2),
        });
      }
      const createdBooths = await createMany(Booth, boothDocs, `booths (${cfg.title})`);

      // Applications
      const appDocs = entries.map((en) => ({
        expo: expo._id,
        exhibitor: exhibitorUsers[en.i]._id,
        companyName: EXHIBITORS[en.i].company,
        products: EXHIBITORS[en.i].products,
        status: en.state === "pending" ? "pending" : en.state === "rejected" ? "rejected" : "approved",
        booth: en.boothIndex !== null && createdBooths[en.boothIndex] ? createdBooths[en.boothIndex]._id : undefined,
        createdAt: randomPast(30),
      }));
      await createMany(Application, appDocs, `applications (${cfg.title})`);
      entries.forEach((en) => {
        applicationRecords.push({
          user: exhibitorUsers[en.i], expoTitle: cfg.title, state: en.state,
          boothNumber: en.boothIndex !== null ? boothDocs[en.boothIndex].boothNumber : null,
        });
      });

      // Sessions
      const sessionDocs = [];
      let n = 0;
      for (let d = 0; d < cfg.days; d++) {
        for (const slot of SLOTS) {
          const [title, topic] = cfg.sessions[n];
          const start = new Date(expoStartDate);
          start.setUTCDate(start.getUTCDate() + d);
          start.setUTCHours(slot.hour, slot.minute, 0, 0);
          sessionDocs.push({
            expo: expo._id, title, topic, location: slot.location,
            speaker: SPEAKERS[(n + cfg.speakerOffset) % SPEAKERS.length],
            startTime: start,
            endTime: new Date(start.getTime() + slot.duration * 60000),
            reminderSent: start < new Date(),
          });
          n++;
        }
      }
      sessionsByExpo[expo._id.toString()] = (await createMany(Session, sessionDocs, `sessions (${cfg.title})`)).filter(Boolean);
    }

    /* ---- Registrations and bookmarks ---- */
    console.log("Seeding registrations and bookmarks...");
    const regDocs = [];
    const expoRegRecords = [];
    const sessionRegRecords = [];
    for (const att of attendeeUsers) {
      for (const ce of sample(createdExpos, randInt(1, 4))) {
        const expoId = ce.doc._id;
        regDocs.push({ user: att._id, expo: expoId, type: "expo", registered: true, createdAt: randomPast(25) });
        expoRegRecords.push({ user: att, expoTitle: ce.cfg.title });

        const sessions = sessionsByExpo[expoId.toString()] || [];
        const registered = sample(sessions, randInt(2, 5));
        const registeredIds = new Set(registered.map((s) => s._id.toString()));
        registered.forEach((s) => {
          regDocs.push({ user: att._id, expo: expoId, session: s._id, type: "session", registered: true, bookmarked: chance(0.3) });
          sessionRegRecords.push({ user: att, sessionTitle: s.title });
        });
        sample(sessions.filter((s) => !registeredIds.has(s._id.toString())), randInt(0, 3)).forEach((s) => {
          regDocs.push({ user: att._id, expo: expoId, session: s._id, type: "session", registered: false, bookmarked: true });
        });
      }
    }
    await createMany(Registration, regDocs, "registrations");

    /* ---- Messages ---- */
    console.log("Seeding messages...");
    const exUsers = exhibitorUsers.filter(Boolean);
    const msgDocs = [];
    const addMsg = (sender, receiver, subject, body, unreadChance = 0.35) =>
      msgDocs.push({ sender: sender._id, receiver: receiver._id, subject, body, read: !chance(unreadChance), createdAt: randomPast(14) });

    for (let k = 0; k < 24; k++) {
      const att = pick(attendeeUsers);
      const ex = pick(exUsers);
      const tpl = INQUIRIES[k % INQUIRIES.length];
      addMsg(att, ex, tpl.subject, tpl.body(ex.company), 0.4);
      if (k < 12) addMsg(ex, att, `Re: ${tpl.subject}`, INQUIRY_REPLIES[k % INQUIRY_REPLIES.length], 0.4);
    }
    for (let k = 0; k < 14; k++) {
      const ex = exUsers[k % exUsers.length];
      const tpl = EXHIBITOR_TO_ADMIN[k % EXHIBITOR_TO_ADMIN.length];
      addMsg(ex, admin, tpl.subject, tpl.body, 0.5);
      if (k < 9) addMsg(admin, ex, `Re: ${tpl.subject}`, ADMIN_REPLIES[k % ADMIN_REPLIES.length], 0.3);
    }
    await createMany(Message, msgDocs, "messages");

    /* ---- Feedback ---- */
    console.log("Seeding feedback...");
    const feedbackAuthors = [...attendeeUsers, ...exUsers];
    const feedbackDocs = Array.from({ length: 30 }, (_, k) => {
      const isIssue = k % 3 === 0;
      return {
        user: pick(feedbackAuthors)._id,
        type: isIssue ? "issue" : "suggestion",
        message: isIssue ? ISSUES[Math.floor(k / 3) % ISSUES.length] : SUGGESTIONS[(k - Math.floor(k / 3) - 1) % SUGGESTIONS.length],
        createdAt: randomPast(20),
      };
    });
    await createMany(Feedback, feedbackDocs, "feedback");

    /* ---- Notifications ---- */
    console.log("Seeding notifications...");
    const notifDocs = [];
    const addNotif = (user, message, link, type) =>
      notifDocs.push({ user: user._id, message, link, type, read: chance(0.45), createdAt: randomPast(10) });

    sample(applicationRecords.filter((r) => r.state === "pending"), 14).forEach((r) =>
      addNotif(admin, `New application from ${r.user.company} for ${r.expoTitle}`, "/admin/applications", "application")
    );
    for (let k = 0; k < 4; k++) addNotif(admin, "New feedback received", "/admin/feedback", "feedback");

    const exhibitorNotifs = [];
    applicationRecords.forEach((r) => {
      if (r.state === "rejected") {
        exhibitorNotifs.push([r.user, `Your application for ${r.expoTitle} was not approved`, "/exhibitor/applications", "application"]);
      } else if (r.state !== "pending") {
        exhibitorNotifs.push([r.user, `Your application for ${r.expoTitle} was approved`, "/exhibitor/applications", "application"]);
        if (r.state === "booked") {
          exhibitorNotifs.push([r.user, `Booth ${r.boothNumber} was confirmed for ${r.expoTitle}`, "/exhibitor/booths", "booth"]);
        }
      }
    });
    sample(exhibitorNotifs, 70).forEach((n) => addNotif(...n));

    sample(expoRegRecords, 35).forEach((r) => addNotif(r.user, `You are registered for ${r.expoTitle}`, "/attendee/schedule", "registration"));
    sample(sessionRegRecords, 20).forEach((r) => addNotif(r.user, `Reminder: ${r.sessionTitle} starts soon`, "/attendee/schedule", "reminder"));
    await createMany(Notification, notifDocs, "notifications");

    /* ---- Summary ---- */
    const count = async (Model, filter = {}) => Model.countDocuments(filter);
    console.log("\n=======================================================");
    console.log("        EVENTSPHERE DEMO DATA SEEDED SUCCESSFULLY       ");
    console.log("=======================================================");
    console.table({
      "Users (exhibitors)": await count(User, { role: "exhibitor" }),
      "Users (attendees)": await count(User, { role: "attendee" }),
      Expos: await count(Expo),
      Booths: await count(Booth),
      "Booths booked": await count(Booth, { status: "booked" }),
      "Booths reserved": await count(Booth, { status: "reserved" }),
      Applications: await count(Application),
      "Applications pending": await count(Application, { status: "pending" }),
      "Applications approved": await count(Application, { status: "approved" }),
      "Applications rejected": await count(Application, { status: "rejected" }),
      Sessions: await count(Session),
      Registrations: await count(Registration),
      Messages: await count(Message),
      Feedback: await count(Feedback),
      Notifications: await count(Notification),
    });
    console.log("\nDemo logins:");
    console.log("  Admin:      admin@eventsphere.com / Admin@123");
    console.log(`  Exhibitors: ${EXHIBITORS.slice(0, 5).map((e) => e.email).join(", ")} ... (all ${EXHIBITORS.length}) / ${DEMO_PASSWORD}`);
    console.log(`  Attendees:  attendee1@demo.com to attendee${ATTENDEE_NAMES.length}@demo.com / ${DEMO_PASSWORD}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    try { await mongoose.disconnect(); } catch { /* ignore */ }
    process.exit(1);
  }
};

seedDemoData();