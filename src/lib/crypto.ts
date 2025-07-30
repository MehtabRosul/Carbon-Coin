
// Crypto utility functions for location encryption/decryption
// Uses Web Crypto API with AES-CBC algorithm

interface EncryptedLocation {
  data: string; // Base64 encoded encrypted data
  iv: string;   // Base64 encoded initialization vector
  keyVersion: string; // For key rotation support
}

interface LocationData {
  latitude: number;
  longitude: number;
}

// Cache for the crypto key to avoid regenerating it
let cachedKey: CryptoKey | null = null;
let keyGenerationPromise: Promise<CryptoKey> | null = null;

/**
 * Get the encryption key from environment variables and prepare it for Web Crypto API
 */
const getKey = async (): Promise<CryptoKey> => {
  // Return cached key if available
  if (cachedKey) {
    return cachedKey;
  }

  // If key generation is already in progress, wait for it
  if (keyGenerationPromise) {
    return keyGenerationPromise;
  }

  // Start key generation
  keyGenerationPromise = (async () => {
    try {
      const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;
      
      if (!secretKey) {
        throw new Error('CRYPTO_SECRET_KEY environment variable is not set');
      }

      // Convert the secret key string to ArrayBuffer
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretKey);
      
      // Ensure the key is exactly 16 bytes (128-bit) for AES-128
      let keyBytes = keyData;
      if (keyData.length < 16) {
        // Pad with zeros if too short
        keyBytes = new Uint8Array(16);
        keyBytes.set(keyData);
      } else if (keyData.length > 16) {
        // Truncate if too long
        keyBytes = keyData.slice(0, 16);
      }

      // Import the key for AES-CBC
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-CBC' },
        false,
        ['encrypt', 'decrypt']
      );

      cachedKey = cryptoKey;
      return cryptoKey;
    } catch (error) {
      console.error('Failed to generate crypto key:', error);
      throw new Error('Encryption key generation failed');
    } finally {
      keyGenerationPromise = null;
    }
  })();

  return keyGenerationPromise;
};

/**
 * Encrypt latitude and longitude coordinates
 */
export const encryptLocation = async (
  latitude: number, 
  longitude: number
): Promise<EncryptedLocation> => {
  try {
    // Validate inputs
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new Error('Invalid coordinates: latitude and longitude must be numbers');
    }

    if (latitude < -90 || latitude > 90) {
      throw new Error('Invalid latitude: must be between -90 and 90');
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error('Invalid longitude: must be between -180 and 180');
    }

    // Combine coordinates into a single string
    const locationString = `lat:${latitude.toFixed(6)},lng:${longitude.toFixed(6)}`;
    
    // Get the encryption key
    const key = await getKey();
    
    // Generate a random 16-byte IV
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    
    // Convert the location string to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(locationString);
    
    // Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      key,
      data
    );
    
    // Convert to Base64 strings for storage
    const encryptedData = btoa(Array.from(new Uint8Array(encryptedBuffer), byte => String.fromCharCode(byte)).join(''));
    const ivString = btoa(Array.from(iv, byte => String.fromCharCode(byte)).join(''));
    
    return {
      data: encryptedData,
      iv: ivString,
      keyVersion: 'v1' // For future key rotation
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt location data');
  }
};

/**
 * Decrypt latitude and longitude coordinates
 */
export const decryptLocation = async (
  encryptedData: string,
  iv: string,
  keyVersion: string = 'v1'
): Promise<LocationData> => {
  try {
    // Validate inputs
    if (!encryptedData || !iv) {
      throw new Error('Missing encrypted data or IV');
    }

    // Get the encryption key
    const key = await getKey();
    
    // Convert Base64 strings back to ArrayBuffer
    const encryptedBytes = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: ivBytes },
      key,
      encryptedBytes
    );
    
    // Convert back to string
    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedBuffer);
    
    // Parse the coordinates
    const match = decryptedString.match(/lat:([-\d.]+),lng:([-\d.]+)/);
    if (!match) {
      throw new Error('Invalid decrypted location format');
    }
    
    const latitude = parseFloat(match[1]);
    const longitude = parseFloat(match[2]);
    
    // Validate the parsed coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Invalid coordinate values after decryption');
    }
    
    return { latitude, longitude };
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt location data');
  }
};

/**
 * Generate a hash of encrypted data for duplicate detection
 */
export const hashData = async (data: string): Promise<string> => {
  try {
    // Convert the data string to ArrayBuffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Generate SHA-256 hash
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  } catch (error) {
    console.error('Hashing failed:', error);
    throw new Error('Failed to generate hash');
  }
};

/**
 * Check if Web Crypto API is available
 */
export const isCryptoSupported = (): boolean => {
  return typeof window !== 'undefined' && 
         window.crypto && 
         window.crypto.subtle &&
         typeof window.crypto.subtle.encrypt === 'function';
};

/**
 * Clear the cached key (useful for testing or key rotation)
 */
export const clearCachedKey = (): void => {
  cachedKey = null;
  keyGenerationPromise = null;
};

/**
 * Get current key version
 */
export const getCurrentKeyVersion = (): string => {
  return 'v1';
}; 