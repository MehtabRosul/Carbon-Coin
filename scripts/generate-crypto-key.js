#!/usr/bin/env node

/**
 * Script to generate a secure 16-byte encryption key for Carbon Coin
 * Run this script to generate a key for your .env file
 */

const crypto = require('crypto');

// Generate a random 16-byte key
const key = crypto.randomBytes(16);

// Convert to base64 for easy storage in environment variables
const base64Key = key.toString('base64');

console.log('🔐 Carbon Coin Encryption Key Generator');
console.log('=====================================');
console.log('');
console.log('Generated 16-byte encryption key:');
console.log('');
console.log(`NEXT_PUBLIC_CRYPTO_SECRET_KEY=${base64Key}`);
console.log('');
console.log('📝 Instructions:');
console.log('1. Copy the line above');
console.log('2. Add it to your .env file');
console.log('3. Make sure .env is in your .gitignore');
console.log('4. Restart your development server');
console.log('');
console.log('⚠️  Security Notes:');
console.log('- Keep this key secret and secure');
console.log('- Use different keys for development and production');
console.log('- Rotate keys periodically for enhanced security');
console.log('- Never commit the .env file to version control');
console.log('');
console.log('✅ Key generation complete!'); 