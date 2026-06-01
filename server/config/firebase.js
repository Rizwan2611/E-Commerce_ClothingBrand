const admin = require('firebase-admin');

const initializeFirebase = () => {
  if (admin.apps.length > 0) return;

  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, ''),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail) {
      console.log('💎 Firebase Credentials Detected:');
      console.log(`   - Project: ${serviceAccount.projectId}`);
      console.log(`   - Email: ${serviceAccount.clientEmail}`);
      console.log(`   - Key Format: ${serviceAccount.privateKey.startsWith('-----BEGIN PRIVATE KEY-----') ? '✅ Valid Header' : '❌ Invalid Header'}`);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('🔥 Firebase Admin Initialized Successfully');
    } else {
      console.warn('⚠️ Firebase Admin credentials missing in .env');
      if (!serviceAccount.projectId) console.warn('   - Missing: FIREBASE_PROJECT_ID');
      if (!serviceAccount.privateKey) console.warn('   - Missing: FIREBASE_PRIVATE_KEY');
      if (!serviceAccount.clientEmail) console.warn('   - Missing: FIREBASE_CLIENT_EMAIL');
    }
  } catch (error) {
    console.error('❌ Firebase Admin Initialization Error:', error);
  }
};

module.exports = { admin, initializeFirebase };
