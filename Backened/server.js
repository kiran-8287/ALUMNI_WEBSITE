require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { admin, firestore, auth } = require("./firebase");

const app = express();
const PORT = process.env.PORT || 5175;

// Middleware
app.use(cors());
app.use(express.json());

// Simulate a connection check for the Firestore database
firestore
    .collection("students")
    .limit(1)
    .get()
    .then(() => {
        console.log("Firebase db connection successful");
    })
    .catch((err) => {
        console.error("Failed to connect to Firestore database:", err);
    });

// /* -------------------------------------------------------------------------- */
// /*                            🔐 Email Configuration                          */
// /* -------------------------------------------------------------------------- */

// const transporter = nodemailer.createTransport({
//     // service: "gmail",
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // Verify transporter (optional but useful)
// transporter.verify((error, success) => {
//     if (error) {
//         console.error("❌ Email transporter config error:", error);
//     } else {
//         console.log("✅ Ready to send OTP emails");
//     }
// });

// /* -------------------------------------------------------------------------- */
// /*                                🔢 OTP Logic                                */
// /* -------------------------------------------------------------------------- */

// // const otpStore = {}; // { email: { code: '123456', expiresAt: Date } }
// const otpStore = new Map();

// function generateOTP() {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // POST /send-otp
// app.post("/send-otp", async(req, res) => {
//     const { email } = req.body;
//     console.log("Sending OTP to:", email);

//     if (!email) return res.status(400).json({ error: "Email is required" });

//     // Generate OTP and expiration time
//     const otp = generateOTP();
//     const ttl = 5 * 60 * 1000; //5 minutes
//     // otpStore[email] = { code: otp, expiresAt };
//     otpStore.set(email, { otp, expiresAt: Date.now() + ttl });

//     // Prepare email
//     const mailOptions = {
//         from: `"IIT Palakkad Alumni Portal" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: "Your OTP for IIT Palakkad Alumni Portal",
//         html: `
//             <div style="font-family:Arial,sans-serif;padding:20px;">
//                 <h2>🔐 One-Time Password (OTP)</h2>
//                 <p style="font-size:18px;">
//                 Hello,<br><br>
//                 Your OTP is: <strong style="font-size:24px;">${otp}</strong><br><br>
//                 This code expires in <b>5 minutes</b>.<br><br>
//                 If you did not request this, please ignore this email.
//                 </p>
//                 <hr>
//                 <p style="font-size:12px;color:gray;">IIT Palakkad Alumni Authentication System</p>
//             </div>
//             `,
//     };
//     try {
//         await transporter.sendMail(mailOptions);
//         console.log(`✅ OTP sent to ${email}`);
//         res.json({ success: true, message: "OTP sent successfully" });
//     } catch (err) {
//         console.error("❌ Failed to send email:", err);
//         res
//             .status(500)
//             .json({ success: false, message: "Failed to send OTP email" });
//     }
// });

// app.post("/verify-otp", (req, res) => {
//     const { email, otp } = req.body;
//     if (!email || !otp)
//         return res.status(400).json({ error: "Email and OTP are required" });

//     const record = otpStore.get(email);
//     if (!record)
//         return res
//             .status(400)
//             .json({ success: false, message: "No OTP found for this email" });

//     if (Date.now() > record.expiresAt) {
//         // delete otpStore[email];
//         otpStore.delete(email);
//         return res.status(400).json({ success: false, message: "OTP expired" });
//     }

//     if (otp !== record.otp) {
//         return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }

//     // delete otpStore[email];
//     otpStore.delete(email);
//     return res.json({ success: true, message: "OTP verified successfully" });
// });

/* -------------------------------------------------------------------------- */
/*                         🔐 Firebase Auth Middleware                         */
/* -------------------------------------------------------------------------- */
async function verifyFirebaseToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = await auth.verifyIdToken(token);
        req.user = decoded; // uid, email
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

/* -------------------------------------------------------------------------- */
/*                           🧠 Firestore Utilities                           */
/* -------------------------------------------------------------------------- */

// Example: check email
app.post("/check-email", verifyFirebaseToken, async(req, res) => {
    const email = req.user.email;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        // 🔍 Check ADMINS
        const adminSnap = await firestore
            .collection("admin")
            .where("Email", "==", email)
            .limit(1)
            .get();

        if (!adminSnap.empty) {
            return res.json({
                exists: true,
                role: "admin",
            });
        }
        // 🔍 Check STUDENTS
        const studentSnap = await firestore
            .collection("students")
            .where("Email", "==", email)
            .limit(1)
            .get();

        if (!studentSnap.empty) {
            return res.json({
                exists: true,
                role: "alumni",
            });
        }

        // ❌ Not authorized
        return res.json({
            exists: false,
            role: null,
        });
    } catch (error) {
        console.error("check-email error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post("/check-duplicate", async(req, res) => {
    const { email, campusID } = req.body;
    if (!email || !campusID)
        return res.status(400).json({ error: "Email and CampusID are required" });

    try {
        const emailSnap = await firestore
            .collection("students")
            .where("Email", "==", email)
            .limit(1)
            .get();

        const idSnap = await firestore
            .collection("students")
            .where("CampusID", "==", campusID)
            .limit(1)
            .get();

        res.json({
            emailExists: !emailSnap.empty,
            idExists: !idSnap.empty,
        });
    } catch (e) {
        console.error("Error checking duplicates:", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/register", async(req, res) => {
    const data = req.body;

    const requiredFields = [
        "CampusID",
        "Name",
        "Email",
        "ContactNumber1",
        "WhatsAppNumber",
        "CountryCode",
        "Department",
        "Degree",
        "YearOfPassOut",
        "Hostel",
        "CurrentLocation",
    ];
    for (const field of requiredFields) {
        if (!data[field]) {
            return res
                .status(400)
                .json({ error: `Missing required field: ${field}` });
        }
    }

    try {
        // Check if document with this CampusID already exists
        const docRef = firestore.collection("students").doc(data.CampusID);
        const docSnapshot = await docRef.get();

        if (docSnapshot.exists) {
            return res
                .status(400)
                .json({ error: "A record with this CampusID already exists" });
        }

        // Create new document with CampusID as document ID
        await docRef.set({
            ...data,
            verified: false,
            testimonial: "",
        });

        res.json({
            success: true,
            message: "User registered successfully with campusID as document ID",
        });
    } catch (err) {
        console.error("Error adding user to Firestore:", err);
        res.status(500).json({ error: "Failed to store user data" });
    }
});
/* -------------------------------------------------------------------------- */
/*                         👤 Get Logged-in Profile                            */
/* -------------------------------------------------------------------------- */
app.get("/api/profile", verifyFirebaseToken, async(req, res) => {
    const email = req.user.email;

    const snapshot = await firestore
        .collection("students")
        .where("Email", "==", email)
        .limit(1)
        .get();

    if (snapshot.empty) {
        return res.status(404).json({ error: "Profile not found" });

    }

    res.json(snapshot.docs[0].data());
});


// cache to store dropdown metadata
const metaCache = {
    years: null,
    degrees: null,
    departments: null,
    lastFetched: 0,
};
const META_TTL = 10 * 60 * 1000; // 10 minutes

async function getMetaWithCache() {
    const now = Date.now();
    if (now - metaCache.lastFetched < META_TTL && metaCache.years) {
        return metaCache;
    }

    try {
        const doc = await firestore.doc("metadata/dropdowns").get();
        const data = doc.data();

        if (data) {
            metaCache.years = data.years || [];
            metaCache.degrees = data.degrees || [];
            metaCache.departments = data.departments || [];
            metaCache.lastFetched = now;
        }

        return metaCache;
    } catch (err) {
        console.error("Error fetching metadata from Firestore:", err);
        throw err;
    }
}

app.get("/alumni-metadata", async(_, res) => {
    try {
        const { years, degrees, departments } = await getMetaWithCache();

        res.json({
            years: years.map((y) => ({ YearOfPassOut: y })),
            degrees: degrees.map((d) => ({ Degree: d })),
            departments: departments.map((d) => ({ Department: d })),
        });
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("/passout-years", async(_, res) => {
    try {
        const { years } = await getMetaWithCache();
        res.json(years.map((y) => ({ YearOfPassOut: y })));
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/degrees", async(_, res) => {
    try {
        const { degrees } = await getMetaWithCache();
        res.json(degrees.map((d) => ({ Degree: d })));
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/departments", async(_, res) => {
    try {
        const { departments } = await getMetaWithCache();
        res.json(departments.map((d) => ({ Department: d })));
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//API to Get Alumni Data with Filters
//Filters: name, campusID, yearOfPassOut, degree, department
app.get("/alumni", verifyFirebaseToken, async(req, res) => {
    try {
        const { name, campusID, yearOfPassOut, degree, department, lastDocId } = req.query;

        let query = firestore.collection("students");

        if (campusID) query = query.where("CampusID", "==", campusID);
        if (yearOfPassOut)
            query = query.where("YearOfPassOut", "==", yearOfPassOut);
        if (degree) query = query.where("Degree", "==", degree);
        if (department) query = query.where("Department", "==", department);

        if (name) {
            query = query
                .orderBy("Name")
                .startAt(name)
                .endAt(name + "\uf8ff");
        }
        query = query.limit(50);


        if (lastDocId) {
            const lastDoc = await firestore
                .collection("students")
                .doc(lastDocId)
                .get();
            if (lastDoc.exists) {
                query = query.startAfter(lastDoc);
            }
        }

        const snapshot = await query.get();

        let results = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Name filtering (client-side)
        if (name) {
            const lower = name.toLowerCase();
            results = results.filter(
                (alumni) => alumni.Name && alumni.Name.toLowerCase().includes(lower),
            );
        }

        const nextCursor =
            snapshot.docs.length > 0 ?
            snapshot.docs[snapshot.docs.length - 1].id :
            null;

        res.json({
            results,
            nextCursor,
        });
    } catch (error) {
        console.error("Error fetching alumni:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//api to fetch user profile by email
// API to update user profile by email
app.patch("/api/profile/", verifyFirebaseToken, async(req, res) => {
    const email = req.user.email;
    const updatedData = req.body;

    try {
        const snapshot = await firestore
            .collection("students")
            .where("Email", "==", email)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ error: "Profile not found" });
        }

        // Get document ID to update
        const docId = snapshot.docs[0].id;

        // Update document with new data
        await firestore.collection("students").doc(docId).set(updatedData, { merge: true });

        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});