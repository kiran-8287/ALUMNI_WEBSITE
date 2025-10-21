require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

// const { firestore } = require("./firebase");

const app = express();
const PORT = process.env.PORT || 5175;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Firestore connection test
// firestore
//     .collection("students")
//     .limit(1)
//     .get()
//     .then(() => console.log("✅ Firebase Firestore connection successful"))
//     .catch((err) => console.error("❌ Failed to connect to Firestore:", err));

/* -------------------------------------------------------------------------- */
/*                            🔐 Email Configuration                          */
/* -------------------------------------------------------------------------- */

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // ✅ use 465 for Gmail with app password
    secure: true, // must be true for port 465
    auth: {
        user: process.env.EMAIL_USER, // e.g. databaseiar@gmail.com
        pass: process.env.EMAIL_PASS, // Gmail App Password
    },
});

// Verify transporter (optional but useful)
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Email transporter config error:", error);
    } else {
        console.log("✅ Ready to send OTP emails");
    }
});

/* -------------------------------------------------------------------------- */
/*                                🔢 OTP Logic                                */
/* -------------------------------------------------------------------------- */

const otpStore = new Map();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/send-otp", async(req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = generateOTP();
    const ttl = 5 * 60 * 1000; // 5 minutes
    otpStore.set(email, { otp, expiresAt: Date.now() + ttl });

    const mailOptions = {
        from: `"IIT Palakkad Alumni Portal" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP for IIT Palakkad Alumni Portal",
        html: `
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <h2>🔐 One-Time Password (OTP)</h2>
        <p style="font-size:18px;">
          Hello,<br><br>
          Your OTP is: <strong style="font-size:24px;">${otp}</strong><br><br>
          This code expires in <b>5 minutes</b>.<br><br>
          If you did not request this, please ignore this email.
        </p>
        <hr>
        <p style="font-size:12px;color:gray;">IIT Palakkad Alumni Authentication System</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent to ${email}`);
        res.json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
        console.error("❌ Failed to send email:", err);
        res
            .status(500)
            .json({ success: false, message: "Failed to send OTP email" });
    }
});

app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp)
        return res.status(400).json({ error: "Email and OTP are required" });

    const record = otpStore.get(email);
    if (!record)
        return res.status(400).json({ success: false, message: "No OTP found" });

    if (Date.now() > record.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (otp !== record.otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    otpStore.delete(email);
    return res.json({ success: true, message: "OTP verified successfully" });
});

/* -------------------------------------------------------------------------- */
/*                           🧠 Firestore Utilities                           */
/* -------------------------------------------------------------------------- */

// Example: check email
app.post("/check-email", async(req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        const snap = await firestore
            .collection("students")
            .where("Email", "==", email)
            .limit(1)
            .get();
        res.json({ exists: !snap.empty });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/* -------------------------------------------------------------------------- */
/*                              🚀 Start Server                              */
/* -------------------------------------------------------------------------- */

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));