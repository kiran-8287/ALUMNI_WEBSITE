const admin = require("firebase-admin");
const serviceAccount = require("./Key.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized successfully.");
}

const firestore = admin.firestore();
module.exports = { firestore, admin };
