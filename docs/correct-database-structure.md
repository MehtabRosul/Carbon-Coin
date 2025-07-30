# Correct Database Structure

## Problem Fixed

The issue was that new data was **overwriting** existing user data instead of **adding to it**. Now the system properly maintains a tree structure where each user's data accumulates over time.

## Correct Database Structure

```
users/
├── BUevzkt35mUMGezmG99CyDmnbdr1/           # User 1
│   ├── name: "test"                        # Step 1: Basic Profile
│   ├── phone: "2527273782"                 # Step 1: Basic Profile
│   ├── email: "rosulmehtab00@gmail.com"    # Step 1: Basic Profile
│   └── projectDetails/                     # Step 2: Project Details
│       ├── projectName: "Green Farm"
│       ├── location: "Guwahati"
│       ├── encryptedLocation: "abc123..."  # Encrypted coordinates
│       ├── locationIV: "xyz789..."         # Initialization Vector
│       └── keyVersion: "v1"                # Encryption key version
│
├── SMSkXnfXn5TvjqsJdW00rND1Q1C2/           # User 2
│   ├── name: "demo"                        # Step 1: Basic Profile
│   ├── phone: "141414"                     # Step 1: Basic Profile
│   ├── email: "daskunal536@gmail.com"      # Step 1: Basic Profile
│   └── projectDetails/                     # Step 2: Project Details
│       ├── projectName: "green"
│       ├── location: "guwahati"
│       ├── encryptedLocation: "/WptBuYV8zkqgGConT7tC7ryKjpl+J43DqQbz40u3VI="
│       ├── locationIV: "rD6DFCTWBqRUDNXAE5Te0A=="
│       └── keyVersion: "v1"
│
└── [future-user-id]/                       # Future users...

locations/                                   # Global duplicate detection
├── [hash1]: { userId: "BUevzkt35mUMGezmG99CyDmnbdr1", timestamp: 1234567890, projectName: "Green Farm" }
├── [hash2]: { userId: "SMSkXnfXn5TvjqsJdW00rND1Q1C2", timestamp: 1234567891, projectName: "green" }
└── [future-hashes]...

anonymousUsers/                              # Anonymous users (if any)
└── [anon-id]/
    ├── name: "Anonymous User"
    ├── phone: "1234567890"
    ├── email: "anon@example.com"
    └── projectDetails/
        └── [same structure as authenticated users]
```

## Data Flow Steps

### Step 1: User Profile Creation (Start Page)
- User enters: name, phone, email
- Data stored at: `users/{uid}/` (name, phone, email)
- Uses `update()` to preserve any existing data

### Step 2: Project Details (Project Details Page)
- User enters: project name, location, coordinates
- Coordinates encrypted and stored
- Data stored at: `users/{uid}/projectDetails/`
- Location hash stored at: `locations/{hash}/` for duplicate detection

### Step 3: Calculations (Future Steps)
- AgriPV calculations, SOC calculations, etc.
- Data stored at: `users/{uid}/calculations/` or similar
- Each step adds to the tree, never overwrites

## Key Changes Made

1. **Start Page**: Changed from `set()` to `update()` to preserve existing data
2. **Project Details**: Changed from overwriting entire user object to adding `projectDetails` sub-object
3. **Atomic Operations**: All updates use Firebase's atomic `update()` operation

## Benefits

- ✅ **Data Preservation**: No data is lost when adding new information
- ✅ **Tree Structure**: Each user has a proper hierarchical data structure
- ✅ **Scalability**: Easy to add new data types (calculations, reports, etc.)
- ✅ **Global Duplicate Detection**: Location coordinates tracked globally
- ✅ **User Isolation**: Each user's data is completely separate

## Future Extensions

The structure supports adding:
- `users/{uid}/calculations/agripv/`
- `users/{uid}/calculations/soc/`
- `users/{uid}/reports/`
- `users/{uid}/settings/`
- etc. 