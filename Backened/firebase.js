const admin = require("firebase-admin");
require("dotenv").config();

if (!process.env.FIREBASE_CONFIG) {
    throw new Error("FIREBASE_CONFIG env variable is missing");
}

const serviceAccount = JSON.parse(
    process.env.FIREBASE_CONFIG.replace(/^"|"$/g, "").replace(/\\n/g, "\n"),
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const auth = admin.auth();

module.exports = { admin, firestore, auth };