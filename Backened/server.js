require("dotenv").config();
const express = require("express");
// const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5175;


// Middleware
app.use(cors());
app.use(express.json());
// Firebase Admin SDK Initialization for firestore db
// the configuration file with firebase account credentials in the same directory 
const { firestore } = require("./firebase");


// Simulate a connection check for the Firestore database
firestore.collection('students').limit(1).get()
    .then(() => {
        console.log('Firebase db connection successful');
    })
    .catch((err) => {
        console.error('Failed to connect to Firestore database:', err);
    });



// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


// OTP store (in-memory)
const otpStore = {}; // { email: { code: '123456', expiresAt: Date } }

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


// POST /send-otp
app.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    console.log("Sending OTP to:", email);

    if (!email) return res.status(400).json({ error: "Email is required" });

    // Generate OTP and expiration time
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore[email] = { code: otp, expiresAt };

    // Prepare email
    const mailOptions = {
        from: `"IIT Palakkad Portal" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP for IIT Palakkad Alumni Portal",
        html: `
            <div style="font-family:Arial,sans-serif;padding:20px;">
                <h2>🔐 Your OTP Code</h2>
                <p style="font-size:18px;">
                    Hello,<br><br>
                    Your One-Time Password (OTP) is:
                    <strong style="font-size:24px;">${otp}</strong><br><br>
                    This OTP is valid for <b>5 minutes</b>.<br><br>
                    If you did not request this, please ignore this email.
                </p>
                <hr>
                <p style="font-size:12px;color:gray;">IIT Palakkad Alumni Authentication System</p>
            </div>
        `,
    };

    try {
        // Correctly store sendMail response in "info"
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ OTP email sent successfully:", info.response);

        res.json({ success: true, message: "OTP sent via email" });
    } catch (err) {
        console.error("❌ Failed to send OTP email:", err);
        res.status(500).json({ success: false, message: "Failed to send OTP email" });
    }
});


// POST /verify-otp
app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp)
        return res.status(400).json({ error: "Email and OTP are required" });

    const entry = otpStore[email];
    if (!entry)
        return res
            .status(400)
            .json({ success: false, message: "No OTP found for this email" });

    if (Date.now() > entry.expiresAt) {
        delete otpStore[email];
        return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (otp !== entry.code) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    delete otpStore[email];
    res.json({ success: true, message: "OTP verified successfully" });

});




app.post('/check-email', async(req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        const snap = await firestore
            .collection('students')
            .where('Email', '==', email)
            .select() // meta only
            .limit(1).get();
        res.json({ exists: !snap.empty });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/check-duplicate', async(req, res) => {
    const { email, campusID } = req.body;
    if (!email || !campusID)
        return res.status(400).json({ error: 'Email and CampusID are required' });

    try {
        const emailSnap = await firestore
            .collection('students')
            .where('Email', '==', email)
            .limit(1)
            .get();

        const idSnap = await firestore
            .collection('students')
            .where('CampusID', '==', campusID)
            .limit(1)
            .get();

        res.json({
            emailExists: !emailSnap.empty,
            idExists: !idSnap.empty,
        });
    } catch (e) {
        console.error('Error checking duplicates:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/register', async(req, res) => {
    const data = req.body;

    const requiredFields = ['CampusID', 'Name', 'Email', 'ContactNumber1', 'WhatsAppNumber', 'CountryCode', 'Deparment', 'Degree', 'YearOfPassOut', 'Hostel', 'CurrentLocation'];
    for (const field of requiredFields) {
        if (!data[field]) {
            return res.status(400).json({ error: `Missing required field: ${field}` });
        }
    }

    try {
        // Check if document with this CampusID already exists
        const docRef = firestore.collection('students').doc(data.CampusID);
        const docSnapshot = await docRef.get();

        if (docSnapshot.exists) {
            return res.status(400).json({ error: 'A record with this CampusID already exists' });
        }

        // Create new document with CampusID as document ID
        await docRef.set({
            ...data,
            verified: false,
            testimonial: ''
        });

        res.json({
            success: true,
            message: 'User registered successfully with campusID as document ID'
        });
    } catch (err) {
        console.error('Error adding user to Firestore:', err);
        res.status(500).json({ error: 'Failed to store user data' });
    }
});



//api to fetch user profile by email
// API to fetch user profile by email
app.get("/api/profile/:email", async(req, res) => {
    const email = decodeURIComponent(req.params.email);

    try {
        const snapshot = await firestore
            .collection("students")
            .where("Email", "==", email)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ error: "Profile not found" });
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        res.json(data);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
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
        const doc = await firestore.doc('metadata/dropdowns').get();
        const data = doc.data();

        if (data) {
            metaCache.years = data.years || [];
            metaCache.degrees = data.degrees || [];
            metaCache.departments = data.departments || [];
            metaCache.lastFetched = now;
        }

        return metaCache;
    } catch (err) {
        console.error('Error fetching metadata from Firestore:', err);
        throw err;
    }
}


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
        res.json(departments.map((d) => ({ Deparment: d })));
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
});



//API to Get Alumni Data with Filters
//Filters: name, campusID, yearOfPassOut, degree, department
app.get('/alumni', async(req, res) => {
    try {
        const { name, campusID, yearOfPassOut, degree, department } = req.query;

        let query = firestore.collection('students');

        if (campusID) {
            query = query.where('CampusID', '==', campusID);
        }
        if (yearOfPassOut) {
            query = query.where('YearOfPassOut', '==', yearOfPassOut);
        }
        if (degree) {
            query = query.where('Degree', '==', degree);
        }
        if (department) {
            query = query.where('Deparment', '==', department);
        }

        const snapshot = await query.get();

        let results = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            if (name) {
                if (data.Name && data.Name.toLowerCase().includes(name.toLowerCase())) {
                    results.push({ id: doc.id, ...data });
                }
            } else {
                results.push({ id: doc.id, ...data });
            }
        });
        res.json(results);
    } catch (error) {
        console.error('Error fetching alumni:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




//api to fetch user profile by email
// API to update user profile by email
app.patch("/api/profile/:email", async(req, res) => {
    const email = decodeURIComponent(req.params.email);
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
        await firestore.collection("students").doc(docId).update(updatedData);

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