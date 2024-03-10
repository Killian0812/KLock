const admin = require('firebase-admin');

const setupFirestore = () => {
    try {
        const serviceAccount = require('../klock-firebase-firebase-adminsdk-liqsc-4b5c6c13c6.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: 'gs://klock-firebase.appspot.com'
        });
        console.log("Firebase established successfully");
    } catch (error) {
        console.error("Firebase initialization failed:", error);
    }
};

setupFirestore();
const Firestore = admin.firestore();

const FirebaseStorage = admin.storage();

module.exports = { Firestore, FirebaseStorage };

