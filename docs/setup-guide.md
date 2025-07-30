# 🚀 Carbon Coin Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com

# Encryption Configuration
# Generate this key using: npm run generate-key
NEXT_PUBLIC_CRYPTO_SECRET_KEY=your_generated_encryption_key_here
```

### 3. Generate Encryption Key

Run the key generation script:
```bash
npm run generate-key
```

Copy the generated key and add it to your `.env.local` file.

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Your Browser
Navigate to `http://localhost:9002`

## 🔐 Encryption System Setup

The encryption system is automatically enabled once you:

1. ✅ Generate an encryption key (`npm run generate-key`)
2. ✅ Add the key to your `.env.local` file
3. ✅ Restart the development server

### Testing the Encryption System

1. **Manual Testing**:
   - Go to the project details page
   - Select a location on the map
   - Save the project
   - Check that coordinates are encrypted in Firebase

2. **Console Testing**:
   ```javascript
   // In browser console
   import { testEncryptionSystem } from '@/lib/crypto.test';
   testEncryptionSystem().then(success => {
     console.log('Encryption tests:', success ? 'PASSED' : 'FAILED');
   });
   ```

### Verification Steps

1. **Check Firebase Data**: Look for `encryptedLocation` and `locationIV` fields
2. **Test Duplicate Detection**: Try to save the same location twice
3. **Test Report Generation**: Generate a report and verify coordinates display correctly
4. **Test Legacy Data**: The system should handle existing unencrypted data

## 🛠️ Development Commands

```bash
# Development
npm run dev                    # Start development server
npm run build                 # Build for production
npm run start                 # Start production server
npm run lint                  # Run ESLint
npm run typecheck             # Run TypeScript checks

# Encryption
npm run generate-key          # Generate new encryption key

# AI Development
npm run genkit:dev           # Start AI development server
npm run genkit:watch         # Start AI with file watching
```

## 🔧 Troubleshooting

### Common Issues

1. **"Encryption key generation failed"**
   - Check that `NEXT_PUBLIC_CRYPTO_SECRET_KEY` is set in `.env.local`
   - Restart development server after adding key

2. **"Browser doesn't support encryption"**
   - Use Chrome, Firefox, Safari, or Edge
   - Ensure HTTPS in production (required for Web Crypto API)

3. **"Failed to encrypt location data"**
   - Check browser console for detailed error
   - Verify coordinates are valid numbers

4. **"Duplicate location" errors**
   - This is expected behavior - select a different location
   - System prevents multiple projects at same coordinates

### Debug Mode

Enable debug logging by checking browser console for detailed error messages.

## 📁 File Structure

```
src/
├── lib/
│   ├── crypto.ts           # 🔐 Encryption utilities
│   ├── crypto.test.ts      # 🧪 Encryption tests
│   └── firebase.ts         # Firebase configuration
├── components/
│   └── project-details-form.tsx  # Updated with encryption
├── app/(main)/
│   └── report/page.tsx     # Updated with decryption
└── scripts/
    └── generate-crypto-key.js  # Key generation script
```

## 🔒 Security Notes

- ✅ Never commit `.env.local` to version control
- ✅ Use different keys for development and production
- ✅ Rotate keys periodically for enhanced security
- ✅ Always use HTTPS in production
- ✅ Keep encryption keys secure and backed up

## 🎯 Next Steps

After setup, you can:

1. **Test the full workflow**:
   - User registration/login
   - Project creation with location
   - Carbon calculations
   - Report generation

2. **Explore features**:
   - AgriPV calculator
   - SOC sequestration
   - Interventions tracking
   - Report downloads

3. **Customize**:
   - Modify calculation formulas
   - Add new intervention types
   - Customize report templates

## 📞 Support

If you encounter issues:

1. Check the [encryption setup guide](encryption-setup.md)
2. Review browser console for errors
3. Verify environment variable setup
4. Test with different browsers
5. Contact the development team

---

**Happy coding! 🌱** 