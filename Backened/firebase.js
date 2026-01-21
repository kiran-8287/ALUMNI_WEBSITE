const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

let serviceAccount;

// =======================
// LOCAL DEVELOPMENT
// =======================
if (process.env.NODE_ENV !== "production") {
    const keyPath = path.join(__dirname, "firebase_auttentication.json");

    if (!fs.existsSync(keyPath)) {
        throw new Error("❌ serviceAccount.json not found (local)");
    }

    serviceAccount = require(keyPath);
}

// =======================
// PRODUCTION (Render)
// =======================
else {
    if (!process.env.FIREBASE_CONFIG) {
        throw new Error("❌ FIREBASE_CONFIG missing in production");
    }

    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

    // 🔥 FIX PRIVATE KEY NEWLINES
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

// =======================
// INIT FIREBASE
// =======================
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const auth = admin.auth();

module.exports = { admin, firestore, auth };