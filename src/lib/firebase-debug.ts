// Debug utility to check Firebase configuration
export function debugFirebaseConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    cryptoKey: process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY,
  };

  console.log('🔧 Firebase Configuration Debug:');
  console.log('================================');
  
  const missingVars: string[] = [];
  const presentVars: string[] = [];

  Object.entries(config).forEach(([key, value]) => {
    if (!value || value === 'undefined' || value === '') {
      missingVars.push(key);
    } else {
      presentVars.push(key);
    }
  });

  console.log('✅ Present variables:', presentVars);
  
  if (missingVars.length > 0) {
    console.log('❌ Missing variables:', missingVars);
    console.log('⚠️  Please add these to your .env.local file');
  } else {
    console.log('✅ All Firebase variables are configured!');
  }

  // Show actual values (masked for security)
  console.log('🔍 Environment variable values (masked):');
  Object.entries(config).forEach(([key, value]) => {
    if (value) {
      const masked = value.length > 4 ? value.substring(0, 4) + '***' : '***';
      console.log(`  ${key}: ${masked}`);
    } else {
      console.log(`  ${key}: undefined`);
    }
  });

  // Check for common issues
  if (config.databaseURL && !config.databaseURL.includes('firebaseio.com')) {
    console.log('⚠️  Warning: Database URL might be incorrect');
  }

  if (config.cryptoKey && config.cryptoKey.length < 20) {
    console.log('⚠️  Warning: Crypto key seems too short');
  }

  return {
    isComplete: missingVars.length === 0,
    missing: missingVars,
    present: presentVars
  };
}

// Auto-run in browser
if (typeof window !== 'undefined') {
  debugFirebaseConfig();
} 