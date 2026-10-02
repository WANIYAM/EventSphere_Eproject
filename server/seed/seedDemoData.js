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

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventsphere";

const seedDemoData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully.");

    // Clear existing data (keep admin user if exists)
    console.log("Cleaning collections...");
    await Expo.deleteMany({});
    await Booth.deleteMany({});
    await Application.deleteMany({});
    await Session.deleteMany({});
    await Registration.deleteMany({});
    await Message.deleteMany({});
    await Feedback.deleteMany({});
    await Notification.deleteMany({});
    await User.deleteMany({ role: { $ne: "admin" } });

    // Ensure Admin account exists
    let admin = await User.findOne({ role: "admin" });
    if (!admin) {
      admin = await User.create({
        name: "Super Admin",
        email: "admin@eventsphere.com",
        password: "Admin@123",
        role: "admin",
        phone: "+1 555-0100"
      });
      console.log("Admin account created: admin@eventsphere.com");
    } else {
      console.log("Preserved existing Admin account: admin@eventsphere.com");
    }

    // 1. Create Exhibitors
    console.log("Seeding exhibitors...");
    const exhibitorData = [
      {
        name: "TechCorp Solutions",
        email: "exhibitor1@demo.com",
        password: "Demo@123",
        role: "exhibitor",
        company: "TechCorp Inc.",
        category: "Technology",
        phone: "+1 555-0101",
        website: "https://techcorp-example.com",
        description: "Leading innovator in AI, IoT and enterprise cloud software solutions."
      },
      {
        name: "Gourmet Delights",
        email: "exhibitor2@demo.com",
        password: "Demo@123",
        role: "exhibitor",
        company: "Gourmet Foods Ltd.",
        category: "Food & Beverage",
        phone: "+1 555-0102",
        website: "https://gourmet-example.com",
        description: "Artisanal organic products and sustainable culinary innovations."
      },
      {
        name: "Vogue Apparel",
        email: "exhibitor3@demo.com",
        password: "Demo@123",
        role: "exhibitor",
        company: "Vogue Fashion House",
        category: "Fashion",
        phone: "+1 555-0103",
        website: "https://vogue-example.com",
        description: "Eco-friendly sustainable apparel and contemporary fashion designs."
      },
      {
        name: "EduSphere Learning",
        email: "exhibitor4@demo.com",
        password: "Demo@123",
        role: "exhibitor",
        company: "EduSphere Global",
        category: "Education",
        phone: "+1 555-0104",
        website: "https://edusphere-example.com",
        description: "Next-generation interactive EdTech tools and virtual classrooms."
      },
      {
        name: "BioHealth Innovations",
        email: "exhibitor5@demo.com",
        password: "Demo@123",
        role: "exhibitor",
        company: "BioHealth Sciences",
        category: "Health",
        phone: "+1 555-0105",
        website: "https://biohealth-example.com",
        description: "Medical devices, wearable diagnostics, and wellness systems."
      },
      {
        name: "AutoDrive Dynamics",
        email: "exhibitor6@demo.com",
        password: "Demo@123",
        role: "exhibitor",
        company: "AutoDrive Motors",
        category: "Automotive",
        phone: "+1 555-0106",
        website: "https://autodrive-example.com",
        description: "Electric mobility solutions and autonomous driving technologies."
      }
    ];

    const exhibitors = [];
    for (const ex of exhibitorData) {
      const userDoc = await User.create(ex);
      exhibitors.push(userDoc);
    }

    // 2. Create Attendees
    console.log("Seeding attendees...");
    const attendees = [];
    for (let i = 1; i <= 8; i++) {
      const att = await User.create({
        name: `Attendee User ${i}`,
        email: `attendee${i}@demo.com`,
        password: "Demo@123",
        role: "attendee",
        phone: `+1 555-020${i}`
      });
      attendees.push(att);
    }

    // 3. Create Expos
    console.log("Seeding expos & generating booth layouts...");
    const today = new Date();
    const addDays = (d, days) => new Date(d.getTime() + days * 24 * 60 * 60 * 1000);

    const exposData = [
      {
        title: "Global Tech Summit 2026",
        theme: "Artificial Intelligence & Beyond",
        location: "Convention Center Hall A, San Francisco",
        description: "The largest gathering of tech visionaries, startups, and enterprise innovators.",
        startDate: addDays(today, 15),
        endDate: addDays(today, 18)
      },
      {
        title: "International Food & Culinary Expo",
        theme: "Sustainable Flavors & Hospitality",
        location: "Grand Exhibition Pavilion, Chicago",
        description: "Showcasing global culinary trends, organic farming, and food technology.",
        startDate: addDays(today, 45),
        endDate: addDays(today, 48)
      },
      {
        title: "Healthcare & MedTech Expo 2026",
        theme: "Innovations in Digital Medicine",
        location: "Metropolitan Expo Center, Boston",
        description: "Connecting healthcare leaders, medical researchers, and health tech pioneers.",
        startDate: addDays(today, 75),
        endDate: addDays(today, 78)
      }
    ];

    const createdExpos = [];
    const allBooths = [];

    for (const expoDef of exposData) {
      const expo = await Expo.create(expoDef);
      createdExpos.push(expo);

      // Generate 20 booths A1-A20
      const expoBooths = [];
      for (let b = 1; b <= 20; b++) {
        const boothNumber = `A${b}`;
        const price = b <= 5 ? 1200 : b <= 12 ? 800 : 500;
        const size = b <= 5 ? "6x6 m" : "3x3 m";
        const booth = await Booth.create({
          expo: expo._id,
          boothNumber,
          size,
          price,
          status: "available"
        });
        expoBooths.push(booth);
        allBooths.push(booth);
      }
    }

    // 4. Create Applications & Link Booths
    console.log("Seeding applications & booth bookings...");

    // Expo 1 Applications:
    // Exhibitor 1 (TechCorp) -> Approved & Booked Booth A1
    const app1 = await Application.create({
      expo: createdExpos[0]._id,
      exhibitor: exhibitors[0]._id,
      companyName: exhibitors[0].company,
      products: "Enterprise AI Platform & Cloud Suite",
      status: "approved"
    });
    const boothA1 = allBooths.find(
      (b) => b.expo.toString() === createdExpos[0]._id.toString() && b.boothNumber === "A1"
    );
    boothA1.status = "booked";
    boothA1.exhibitor = exhibitors[0]._id;
    await boothA1.save();
    app1.booth = boothA1._id;
    await app1.save();

    // Exhibitor 4 (EduSphere) -> Approved & Reserved Booth A2
    const app2 = await Application.create({
      expo: createdExpos[0]._id,
      exhibitor: exhibitors[3]._id,
      companyName: exhibitors[3].company,
      products: "Virtual Classroom AI Software",
      status: "approved"
    });
    const boothA2 = allBooths.find(
      (b) => b.expo.toString() === createdExpos[0]._id.toString() && b.boothNumber === "A2"
    );
    boothA2.status = "reserved";
    boothA2.exhibitor = exhibitors[3]._id;
    await boothA2.save();
    app2.booth = boothA2._id;
    await app2.save();

    // Exhibitor 6 (AutoDrive) -> Pending
    await Application.create({
      expo: createdExpos[0]._id,
      exhibitor: exhibitors[5]._id,
      companyName: exhibitors[5].company,
      products: "Autonomous Navigation Hardware",
      status: "pending"
    });

    // Expo 2 Applications:
    // Exhibitor 2 (Gourmet) -> Approved & Booked Booth A1
    const app3 = await Application.create({
      expo: createdExpos[1]._id,
      exhibitor: exhibitors[1]._id,
      companyName: exhibitors[1].company,
      products: "Organic Artisan Cheeses & Wines",
      status: "approved"
    });
    const boothExp2A1 = allBooths.find(
      (b) => b.expo.toString() === createdExpos[1]._id.toString() && b.boothNumber === "A1"
    );
    boothExp2A1.status = "booked";
    boothExp2A1.exhibitor = exhibitors[1]._id;
    await boothExp2A1.save();
    app3.booth = boothExp2A1._id;
    await app3.save();

    // Exhibitor 3 (Vogue) -> Rejected
    await Application.create({
      expo: createdExpos[1]._id,
      exhibitor: exhibitors[2]._id,
      companyName: exhibitors[2].company,
      products: "Organic Cotton Chef Aprons",
      status: "rejected"
    });

    // Expo 3 Applications:
    // Exhibitor 5 (BioHealth) -> Approved & Booked Booth A1
    const app4 = await Application.create({
      expo: createdExpos[2]._id,
      exhibitor: exhibitors[4]._id,
      companyName: exhibitors[4].company,
      products: "Smart Glucose Monitors & Bio-sensors",
      status: "approved"
    });
    const boothExp3A1 = allBooths.find(
      (b) => b.expo.toString() === createdExpos[2]._id.toString() && b.boothNumber === "A1"
    );
    boothExp3A1.status = "booked";
    boothExp3A1.exhibitor = exhibitors[4]._id;
    await boothExp3A1.save();
    app4.booth = boothExp3A1._id;
    await app4.save();

    // 5. Create Sessions
    console.log("Seeding sessions...");
    const createdSessions = [];

    // Expo 1 Sessions (5 sessions)
    const expo1Start = createdExpos[0].startDate;
    const sessionsExpo1 = [
      {
        expo: createdExpos[0]._id,
        title: "Opening Keynote: Future of Generative AI",
        speaker: "Dr. Sarah Lin (Chief Scientist, TechCorp)",
        topic: "Artificial Intelligence",
        location: "Main Auditorium",
        startTime: new Date(expo1Start.getTime() + 9 * 3600000),
        endTime: new Date(expo1Start.getTime() + 10.5 * 3600000)
      },
      {
        expo: createdExpos[0]._id,
        title: "Building Scalable Cloud Microservices",
        speaker: "Marcus Vance (Principal Architect)",
        topic: "Cloud Architecture",
        location: "Room 101",
        startTime: new Date(expo1Start.getTime() + 11 * 3600000),
        endTime: new Date(expo1Start.getTime() + 12 * 3600000)
      },
      {
        expo: createdExpos[0]._id,
        title: "Cybersecurity in the Quantum Era",
        speaker: "Elena Rostova (Security Director)",
        topic: "Cybersecurity",
        location: "Room 102",
        startTime: new Date(expo1Start.getTime() + 13 * 3600000),
        endTime: new Date(expo1Start.getTime() + 14 * 3600000)
      },
      {
        expo: createdExpos[0]._id,
        title: "EdTech: Transforming K-12 Classrooms",
        speaker: "Prof. James Miller",
        topic: "Educational Tech",
        location: "Room 101",
        startTime: new Date(expo1Start.getTime() + 14.5 * 3600000),
        endTime: new Date(expo1Start.getTime() + 15.5 * 3600000)
      },
      {
        expo: createdExpos[0]._id,
        title: "Autonomous Vehicles & Smart Cities",
        speaker: "David Kim (VP Robotics)",
        topic: "Automotive Tech",
        location: "Main Auditorium",
        startTime: new Date(expo1Start.getTime() + 16 * 3600000),
        endTime: new Date(expo1Start.getTime() + 17 * 3600000)
      }
    ];

    for (const s of sessionsExpo1) {
      const sessDoc = await Session.create(s);
      createdSessions.push(sessDoc);
    }

    // Expo 2 Sessions (5 sessions)
    const expo2Start = createdExpos[1].startDate;
    const sessionsExpo2 = [
      {
        expo: createdExpos[1]._id,
        title: "Farm to Table: Sustainable Food Systems",
        speaker: "Chef Anita Roy",
        topic: "Sustainability",
        location: "Culinary Stage",
        startTime: new Date(expo2Start.getTime() + 10 * 3600000),
        endTime: new Date(expo2Start.getTime() + 11.5 * 3600000)
      },
      {
        expo: createdExpos[1]._id,
        title: "Plant-Based Protein Innovations",
        speaker: "Dr. Kevin Zhang",
        topic: "Food Science",
        location: "Seminar Room B",
        startTime: new Date(expo2Start.getTime() + 13 * 3600000),
        endTime: new Date(expo2Start.getTime() + 14 * 3600000)
      },
      {
        expo: createdExpos[1]._id,
        title: "Wine & Cheese Pairing Masterclass",
        speaker: "Sommelier Jean-Luc",
        topic: "Gastronomy",
        location: "Culinary Stage",
        startTime: new Date(expo2Start.getTime() + 15 * 3600000),
        endTime: new Date(expo2Start.getTime() + 16.5 * 3600000)
      }
    ];

    for (const s of sessionsExpo2) {
      const sessDoc = await Session.create(s);
      createdSessions.push(sessDoc);
    }

    // 6. Create Registrations
    console.log("Seeding attendee registrations and bookmarks...");
    // Register attendees for Expo 1
    for (let i = 0; i < 5; i++) {
      await Registration.create({
        user: attendees[i]._id,
        expo: createdExpos[0]._id,
        type: "expo",
        registered: true
      });

      // Register for first session
      await Registration.create({
        user: attendees[i]._id,
        expo: createdExpos[0]._id,
        session: createdSessions[0]._id,
        type: "session",
        registered: true
      });
    }

    // Bookmark second session for some attendees
    await Registration.create({
      user: attendees[0]._id,
      expo: createdExpos[0]._id,
      session: createdSessions[1]._id,
      type: "session",
      registered: false,
      bookmarked: true
    });
    await Registration.create({
      user: attendees[1]._id,
      expo: createdExpos[0]._id,
      session: createdSessions[2]._id,
      type: "session",
      registered: false,
      bookmarked: true
    });

    // 7. Create Messages
    console.log("Seeding messages...");
    await Message.create({
      sender: attendees[0]._id,
      receiver: admin._id,
      subject: "Inquiry about Global Tech Summit",
      body: "Hello Admin, will there be student discount passes available for the summit?",
      read: true
    });
    await Message.create({
      sender: admin._id,
      receiver: attendees[0]._id,
      subject: "Re: Inquiry about Global Tech Summit",
      body: "Hi Attendee! Yes, student passes will be released next week on the portal.",
      read: false
    });
    await Message.create({
      sender: exhibitors[0]._id,
      receiver: admin._id,
      subject: "Booth Setup Request",
      body: "Hi Admin, could we request extra power outlets for Booth A1?",
      read: false
    });

    // 8. Create Feedback
    console.log("Seeding feedback...");
    const feedbackList = [
      {
        user: attendees[0]._id,
        type: "suggestion",
        message: "It would be great to have a mobile app map for finding booths easily."
      },
      {
        user: attendees[1]._id,
        type: "issue",
        message: "The search bar on the exhibitors page was taking a bit long to filter results."
      },
      {
        user: exhibitors[0]._id,
        type: "suggestion",
        message: "Consider extending floor hours on Day 2 so we have more networking time."
      },
      {
        user: exhibitors[1]._id,
        type: "suggestion",
        message: "Please add a category filter dropdown for the food section on the floor plan."
      },
      {
        user: attendees[2]._id,
        type: "issue",
        message: "I didn't receive a confirmation email when bookmarking a session."
      },
      {
        user: attendees[3]._id,
        type: "suggestion",
        message: "Loved the schedule layout! Would like an export to Google Calendar option."
      }
    ];

    await Feedback.insertMany(feedbackList);

    // 9. Create Notifications
    console.log("Seeding notifications...");
    await Notification.create({
      user: admin._id,
      message: "New application received from AutoDrive Motors",
      link: "/admin/applications",
      read: false
    });
    await Notification.create({
      user: exhibitors[0]._id,
      message: "Your application for Global Tech Summit 2026 was approved.",
      link: "/exhibitor/applications",
      read: true
    });
    await Notification.create({
      user: attendees[0]._id,
      message: "Reminder: Keynote starts at 9:00 AM in Main Auditorium",
      link: `/expos/${createdExpos[0]._id}?tab=schedule`,
      read: false
    });

    // 10. Summary Output
    console.log("\n=======================================================");
    console.log("        EVENTSPHERE DEMO DATA SEEDED SUCCESSFULLY       ");
    console.log("=======================================================");

    const counts = {
      Users: await User.countDocuments(),
      Expos: await Expo.countDocuments(),
      Booths: await Booth.countDocuments(),
      Applications: await Application.countDocuments(),
      Sessions: await Session.countDocuments(),
      Registrations: await Registration.countDocuments(),
      Messages: await Message.countDocuments(),
      Feedback: await Feedback.countDocuments(),
      Notifications: await Notification.countDocuments()
    };

    console.table(counts);

    console.log("\n---------------- DEMO LOGIN CREDENTIALS ---------------");
    console.log("Role        | Email                  | Password ");
    console.log("------------|------------------------|----------");
    console.log("Admin       | admin@eventsphere.com  | Admin@123");
    console.log("Exhibitor 1 | exhibitor1@demo.com    | Demo@123");
    console.log("Exhibitor 2 | exhibitor2@demo.com    | Demo@123");
    console.log("Attendee 1  | attendee1@demo.com     | Demo@123");
    console.log("Attendee 2  | attendee2@demo.com     | Demo@123");
    console.log("-------------------------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding demo data:", error);
    process.exit(1);
  }
};

seedDemoData();
