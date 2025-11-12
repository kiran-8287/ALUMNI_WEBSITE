const admin = require("firebase-admin");
require("dotenv").config();

const rawConfig = process.env.FIREBASE_CONFIG.trim();
const cleanedConfig = rawConfig
    .replace(/^"|"$/g, "") // Remove wrapping quotes if they exist
    .replace(/\\n/g, "\n"); // Replace escaped newlines

const serviceAccount = JSON.parse(cleanedConfig);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

module.exports = { firestore, admin };