# Global Duplicate Detection - Firebase Rules

## Database Structure

```
users/{uid}/
├── projectDetails/
│   ├── projectName
│   ├── location
│   ├── encryptedLocation
│   ├── locationIV
│   └── keyVersion

locations/{locationHash}/
├── userId
├── timestamp
└── projectName
```

## Firebase Security Rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid",
        "projectDetails": {
          ".validate": "newData.hasChildren(['encryptedLocation', 'locationIV', 'projectName', 'location']) && newData.child('encryptedLocation').isString() && newData.child('encryptedLocation').val().length > 0 && newData.child('locationIV').isString() && newData.child('locationIV').val().length > 0 && newData.child('projectName').isString() && newData.child('projectName').val().length > 0 && newData.child('location').isString() && newData.child('location').val().length > 0"
        }
      }
    },
    "anonymousUsers": {
      "$anonId": {
        ".read": true,
        ".write": true,
        "projectDetails": {
          ".validate": "newData.hasChildren(['encryptedLocation', 'locationIV', 'projectName', 'location']) && newData.child('encryptedLocation').isString() && newData.child('encryptedLocation').val().length > 0 && newData.child('locationIV').isString() && newData.child('locationIV').val().length > 0 && newData.child('projectName').isString() && newData.child('projectName').val().length > 0 && newData.child('location').isString() && newData.child('location').val().length > 0"
        }
      }
    },
    "locations": {
      "$locationHash": {
        ".read": true,
        ".write": "!data.exists()",
        ".validate": "newData.hasChildren(['userId', 'timestamp', 'projectName']) && newData.child('userId').isString() && newData.child('timestamp').isNumber() && newData.child('projectName').isString()"
      }
    }
  }
}
```

## Key Features

1. **Global Duplicate Prevention**: `".write": "!data.exists()"` ensures only one user can write to each location hash
2. **Data Validation**: Ensures all required fields are present and of correct types
3. **User Tracking**: Records which user claimed each location
4. **Timestamp Tracking**: Records when the location was claimed

## How It Works

- **First User**: Can save any coordinates ✅
- **Second User**: Cannot save same coordinates ❌ (gets "Location Already Taken" error)
- **Any User**: Can read location data to check availability ✅ 