# 🌱 Carbon Coin

**Unlock the Value of Your Green Initiatives**

Carbon Coin is a comprehensive web application that helps users quantify, track, and report their carbon savings from agricultural and technological interventions. The platform turns sustainability efforts into measurable impact and generates professional reports for carbon credit markets.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login with email/password and Google OAuth
- **AgriCarbon Wizard**: Guided data entry for land use, soil type, and farming practices
- **Interventions Tracking**: Log sustainable interventions with type-specific calculators
- **Interactive Dashboard**: Visualize total CO₂e savings with detailed breakdowns
- **Report Generation**: Download professional PDF reports with impact metrics

### 🔐 Security Features
- **Client-side Encryption**: All location data encrypted before transmission
- **AES-CBC Algorithm**: Industry-standard encryption for sensitive data
- **Duplicate Detection**: Prevents duplicate locations without revealing coordinates
- **Key Rotation Support**: Future-proof architecture for security updates

### Calculators
- **AgriPV Calculator**: Solar, agroforestry, drip irrigation, biogas, and EV savings
- **SOC Calculator**: Soil organic carbon sequestration calculations
- **AgriCarbon Plots**: Plot-based carbon tracking with land use classification
- **AgriPV Feasibility**: Technical assessment for solar implementation

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Firebase (Auth, Realtime Database)
- **Encryption**: Web Crypto API (AES-CBC)
- **Maps**: Leaflet.js with geolocation
- **PDF Generation**: jsPDF with html2canvas
- **AI Integration**: Genkit AI with Google Gemini

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Carbon-Coin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Add your Firebase configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
   ```

4. **Generate encryption key**
   ```bash
   npm run generate-key
   ```
   
   Add the generated key to your `.env.local`:
   ```env
   NEXT_PUBLIC_CRYPTO_SECRET_KEY=your_generated_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:9002`

## 🔐 Encryption Setup

Carbon Coin includes a robust client-side encryption system for protecting sensitive location data. See [Encryption Setup Guide](docs/encryption-setup.md) for detailed instructions.

### Quick Setup
```bash
# Generate encryption key
npm run generate-key

# Add to .env.local
NEXT_PUBLIC_CRYPTO_SECRET_KEY=your_generated_key

# Restart development server
npm run dev
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (main)/            # Main application routes
│   ├── login/             # Authentication pages
│   └── learn-more/        # Educational content
├── components/            # Reusable UI components
│   ├── ui/               # Radix UI components
│   └── sdg-icons/        # SDG icon management
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── crypto.ts         # Encryption utilities
│   ├── firebase.ts       # Firebase configuration
│   └── utils.ts          # General utilities
├── types/                # TypeScript definitions
└── ai/                   # AI integration files
```

## 🗄️ Database Schema

### User Data Structure
```json
{
  "users/{uid}": {
    "name": "User Name",
    "phone": "Phone Number",
    "email": "user@example.com",
    "projectDetails": {
      "projectName": "Green Pastures Farm",
      "location": "Anytown, State",
      "encryptedLocation": "base64_encrypted_data",
      "locationIV": "base64_iv",
      "keyVersion": "v1"
    },
    "calculations": {
      "solarCarbon": {
        "results": {
          "solar": 82.0,
          "agro": 70.0,
          "drip": 49.2,
          "bio": 0.9,
          "ev": 1.8,
          "total": 203.9
        }
      }
    },
    "agriCarbonPlots": {
      "plot1": {
        "plotId": "PLOT001",
        "co2e": 45.2
      }
    }
  }
}
```

### Location Tracking
```json
{
  "locations/{hash}": {
    "userId": "user_uid",
    "timestamp": 1703123456789,
    "projectName": "Green Pastures Farm"
  }
}
```

## 🧪 Testing

### Manual Testing
1. Generate encryption key: `npm run generate-key`
2. Add key to `.env.local`
3. Start development server: `npm run dev`
4. Test user registration and login
5. Test location selection and encryption
6. Test duplicate location detection
7. Test report generation

### Encryption Testing
```typescript
// Import test function
import { testEncryptionSystem } from '@/lib/crypto.test';

// Run tests in browser console
testEncryptionSystem().then(success => {
  console.log('Encryption tests:', success ? 'PASSED' : 'FAILED');
});
```

## 🚀 Deployment

### Production Setup
1. **Generate production encryption key**
   ```bash
   npm run generate-key
   ```

2. **Set environment variables** in your hosting platform
   - All Firebase configuration
   - `NEXT_PUBLIC_CRYPTO_SECRET_KEY`

3. **Build and deploy**
   ```bash
   npm run build
   npm start
   ```

### Security Checklist
- [ ] HTTPS enabled in production
- [ ] Environment variables secured
- [ ] Encryption key rotated periodically
- [ ] Firebase security rules configured
- [ ] `.env` files in `.gitignore`

## 📊 Carbon Calculation Formulas

### AgriPV Calculator
- **Solar**: `MWh × 0.82 = tCO₂e/year`
- **Agroforestry**: `Area (ha) × 7 = tCO₂e/year`
- **Drip Irrigation**: `(Area × 1200) / 1000 × 0.82 = tCO₂e/year`
- **Biogas**: `(Volume × 1.8) / 1000 = tCO₂e/year`
- **EV Savings**: `Distance (km/year) × 0.12 = tCO₂e/year`

### SOC Calculator
- **SOC Sequestration**: `ΔSOC × Bulk Density × Depth × Area × Soil Factor × 3.67 = tCO₂e`

## 🎨 Design System

### Colors
- **Primary**: Forest green (#38A3A5)
- **Background**: Light beige (#F5F5DC)
- **Accent**: Terracotta (#E07A5F)

### Typography
- **Headlines**: Belleza sans-serif
- **Body**: Alegreya serif

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
1. Check the [documentation](docs/)
2. Review [encryption setup](docs/encryption-setup.md)
3. Check browser console for errors
4. Contact the development team

## 🔮 Roadmap

- [ ] Mobile app support
- [ ] Advanced key rotation
- [ ] Audit trail logging
- [ ] Enhanced AI features
- [ ] Carbon credit marketplace integration
- [ ] Real-time collaboration features

---

**Carbon Coin** - Making sustainability measurable and profitable 🌱 