const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

module.exports = { firestore, admin };