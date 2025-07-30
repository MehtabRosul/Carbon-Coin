# 🔐 Carbon Coin Encryption System

## Overview

Carbon Coin now includes a robust client-side encryption system for protecting sensitive location data. This system encrypts latitude and longitude coordinates before they are sent to Firebase, ensuring user privacy and data security.

## Features

- **Client-side encryption** using Web Crypto API
- **AES-CBC algorithm** with 128-bit keys
- **Duplicate location detection** without revealing actual coordinates
- **Automatic fallback** for legacy unencrypted data
- **Key rotation support** for future security updates
- **Atomic database operations** for data consistency

## Architecture

### Encryption Flow
1. User selects location on map or enters coordinates
2. Coordinates are encrypted client-side using AES-CBC
3. Hash of encrypted data is generated for duplicate detection
4. Both encrypted data and hash are stored atomically in Firebase
5. Original coordinates are never sent to the server unencrypted

### Database Structure
```
users/{uid}/
├── projectDetails/
│   ├── projectName
│   ├── location (address string)
│   ├── encryptedLocation (Base64 encrypted data)
│   ├── locationIV (Base64 initialization vector)
│   └── keyVersion (for key rotation)
└── ... other user data

locations/{hash}/
├── userId
├── timestamp
└── projectName
```

## Setup Instructions

### 1. Generate Encryption Key

Run the key generation script:
```bash
npm run generate-key
```

This will output something like:
```
🔐 Carbon Coin Encryption Key Generator
=====================================

Generated 16-byte encryption key:

NEXT_PUBLIC_CRYPTO_SECRET_KEY=YourGeneratedKeyHere

📝 Instructions:
1. Copy the line above
2. Add it to your .env file
3. Make sure .env is in your .gitignore
4. Restart your development server

⚠️  Security Notes:
- Keep this key secret and secure
- Use different keys for development and production
- Rotate keys periodically for enhanced security
- Never commit the .env file to version control

✅ Key generation complete!
```

### 2. Add to Environment Variables

Create or update your `.env` file:
```env
# Add the generated key
NEXT_PUBLIC_CRYPTO_SECRET_KEY=YourGeneratedKeyHere

# Your existing Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ... other Firebase config
```

### 3. Verify Setup

1. Restart your development server
2. Navigate to the project details page
3. Select a location on the map
4. Save the project - encryption should work seamlessly

## Security Features

### Key Management
- **Environment Variables**: Keys stored securely in environment variables
- **Key Caching**: Keys are cached in memory for performance
- **Key Rotation**: Support for future key versioning and rotation
- **Key Validation**: Automatic validation of key format and length

### Data Protection
- **Client-side Only**: Encryption happens entirely in the browser
- **Unique IVs**: Each encryption uses a unique initialization vector
- **Hash-based Detection**: Duplicate detection without revealing coordinates
- **Fallback Support**: Graceful handling of legacy unencrypted data

### Browser Compatibility
- **Web Crypto API**: Uses modern browser crypto capabilities
- **Feature Detection**: Automatic detection of crypto support
- **Graceful Degradation**: Fallback for unsupported browsers

## API Reference

### Core Functions

#### `encryptLocation(latitude: number, longitude: number)`
Encrypts coordinate data for storage.

```typescript
const encrypted = await encryptLocation(40.7128, -74.0060);
// Returns: { data: "encryptedBase64", iv: "ivBase64", keyVersion: "v1" }
```

#### `decryptLocation(encryptedData: string, iv: string, keyVersion?: string)`
Decrypts coordinate data for display.

```typescript
const coordinates = await decryptLocation(encryptedData, iv);
// Returns: { latitude: 40.7128, longitude: -74.0060 }
```

#### `hashData(data: string)`
Generates SHA-256 hash for duplicate detection.

```typescript
const hash = await hashData(encryptedData);
// Returns: "64-character hex string"
```

#### `isCryptoSupported()`
Checks if the browser supports required crypto features.

```typescript
if (isCryptoSupported()) {
  // Proceed with encryption
} else {
  // Show fallback message
}
```

### Utility Functions

#### `clearCachedKey()`
Clears the cached encryption key (useful for testing).

#### `getCurrentKeyVersion()`
Returns the current key version for rotation support.

## Error Handling

### Common Errors

1. **Missing Environment Variable**
   ```
   Error: CRYPTO_SECRET_KEY environment variable is not set
   ```
   **Solution**: Add the key to your `.env` file

2. **Browser Not Supported**
   ```
   Error: Your browser doesn't support encryption
   ```
   **Solution**: Use a modern browser with Web Crypto API support

3. **Invalid Coordinates**
   ```
   Error: Invalid coordinates: latitude and longitude must be numbers
   ```
   **Solution**: Ensure coordinates are valid numbers

4. **Duplicate Location**
   ```
   Error: This plot location is already registered
   ```
   **Solution**: Select a different location

### Fallback Behavior

- **Legacy Data**: Automatically handles existing unencrypted coordinates
- **Crypto Failures**: Falls back to unencrypted data if decryption fails
- **Browser Support**: Shows appropriate error messages for unsupported browsers

## Testing

### Manual Testing
1. Generate a new key: `npm run generate-key`
2. Add key to `.env` file
3. Restart development server
4. Test location selection and saving
5. Verify duplicate detection works
6. Test report generation with encrypted data

### Automated Testing
```typescript
// Test encryption/decryption
const testCoords = { lat: 40.7128, lng: -74.0060 };
const encrypted = await encryptLocation(testCoords.lat, testCoords.lng);
const decrypted = await decryptLocation(encrypted.data, encrypted.iv);
console.log('Test passed:', decrypted.latitude === testCoords.lat);
```

## Production Deployment

### Environment Setup
1. Generate production key: `npm run generate-key`
2. Add production key to your hosting platform's environment variables
3. Ensure `.env` is in `.gitignore`
4. Test encryption in production environment

### Key Rotation Strategy
1. Generate new key: `npm run generate-key`
2. Update environment variable
3. Deploy with new key
4. Migrate existing data (future implementation)

## Troubleshooting

### Common Issues

1. **"Encryption key generation failed"**
   - Check that `NEXT_PUBLIC_CRYPTO_SECRET_KEY` is set in `.env`
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

## Future Enhancements

- **Key Rotation**: Automated key rotation with data migration
- **Enhanced Algorithms**: Support for AES-GCM or ChaCha20-Poly1305
- **Mobile Support**: Native mobile app encryption strategies
- **Audit Trail**: Logging of encryption/decryption operations
- **Performance Optimization**: Web Workers for heavy crypto operations

## Security Best Practices

1. **Keep Keys Secret**: Never commit encryption keys to version control
2. **Use Different Keys**: Separate keys for development and production
3. **Rotate Regularly**: Plan for periodic key rotation
4. **Monitor Usage**: Watch for unusual encryption patterns
5. **Backup Keys**: Securely backup production keys
6. **HTTPS Only**: Always use HTTPS in production (Web Crypto API requirement)

## Support

For issues with the encryption system:
1. Check browser console for error messages
2. Verify environment variable setup
3. Test with different browsers
4. Review this documentation
5. Contact development team with specific error details 