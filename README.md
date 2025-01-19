# Deal Cost Calculator

A comprehensive React-based calculator application for computing deal costs, including hardware, connectivity, licensing, and settlement calculations. This document serves as the complete technical specification and user guide.

## Core Features and Implementation Details

### 1. Deal Details Section (`DealDetailsSection.tsx`)
- **Customer Information**
  - Customer name input (stored in `dealDetails.customerName`)
  - Used in PDF generation and quote identification
- **Installation Details**
  - Distance to installation (stored in `dealDetails.distanceToInstall`)
  - Affects cost calculations based on `additionalCosts.cost_per_kilometer`
- **Term Configuration**
  - Selectable terms: 36, 48, or 60 months
  - Stored in `dealDetails.term`
  - Impacts rental factor calculations
- **Escalation Settings**
  - Options: 0%, 5%, 10%, 15%
  - Stored in `dealDetails.escalation`
  - Used in settlement and rental calculations
- **Financial Inputs**
  - Additional gross profit input (`dealDetails.additionalGrossProfit`)
  - Settlement amount input (`dealDetails.settlement`)

### 2. Hardware Section (`HardwareSection.tsx`)
- **Pre-configured Items**
  ```typescript
  interface Item {
    id: string;
    name: string;
    cost: number;
    quantity: number;
    locked?: boolean;
  }
  ```
- **Default Hardware Options**
  - Yealink T31P: Entry-level IP phone
  - Yealink T34W: Mid-range wireless IP phone
  - Yealink T43U: Advanced IP phone
  - Yealink T44U: Premium IP phone
  - W73P: DECT base station
  - W73H: DECT handset
  - Mobile app licenses
- **Cost Calculations**
  ```typescript
  hardwareCost = sum(items.map(item => item.cost * item.quantity));
  distanceCost = dealDetails.distanceToInstall * additionalCosts.cost_per_kilometer;
  extensionCost = totalExtensions * additionalCosts.cost_per_point;
  ```
- **Installation Scale Logic**
  ```typescript
  const getInstallationCost = (extensions: number) => {
    if (extensions <= 4) return installationScales['0-4'];
    if (extensions <= 8) return installationScales['5-8'];
    if (extensions <= 16) return installationScales['9-16'];
    if (extensions <= 32) return installationScales['17-32'];
    return installationScales['33+'];
  };
  ```

### 3. Connectivity Section (`ConnectivitySection.tsx`)
- **Provider Options**
  - MTN APN
  - Vodacom APN
  - Rain
  - Fibre (various speeds)
- **Monthly Cost Structure**
  ```typescript
  monthlyConnectivityCost = sum(connectivityItems.map(item => item.cost * item.quantity));
  ```

### 4. Licensing Section (`LicensingSection.tsx`)
- **License Types**
  - Premium: Full feature set
  - Standard: Basic features
  - Custom: Configurable options
- **Pricing Model**
  ```typescript
  monthlyLicensingCost = sum(licenseItems.map(item => item.cost * item.quantity));
  ```

### 5. Settlement Calculator (`SettlementSection.tsx`)
- **Date-based Calculations**
  ```typescript
  const calculateSettlement = (
    startDate: Date,
    currentDate: Date,
    term: number,
    escalation: number,
    rental: number
  ) => {
    const completedYears = Math.floor(monthsDiff / 12);
    const remainingMonths = monthsDiff % 12;
    const futureYears = Math.ceil((term - monthsDiff) / 12);
    // ... settlement calculation logic
  };
  ```

### 6. Total Costs Display (`TotalCostsSection.tsx`)
- **Cost Breakdowns**
  ```typescript
  interface TotalCosts {
    hardware: number;
    installation: {
      distance: number;
      extensions: number;
      scale: number;
    };
    grossProfit: number;
    financeFee: number;
    settlement: number;
    monthly: {
      hardware: number;
      connectivity: number;
      licensing: number;
      total: number;
    };
    vat: {
      hardware: number;
      monthly: number;
    };
  }
  ```

### 7. PDF Generation (`GeneratePDFButton.tsx`)
- **Implementation Details**
  ```typescript
  const generatePDF = async () => {
    const doc = new jsPDF();
    // Header
    doc.setFontSize(20);
    doc.text('Deal Cost Calculator Quote', 20, 20);
    // Customer Details
    doc.setFontSize(12);
    doc.text(`Customer: ${dealDetails.customerName}`, 20, 40);
    // ... more PDF generation logic
  };
  ```

## State Management

### Calculator Store (`calculator.ts`)
```typescript
interface CalculatorStore {
  sections: Section[];
  dealDetails: DealDetails;
  baseGrossProfit: { [key: string]: number };
  financeScales: { [key: string]: number };
  installationScales: { [key: string]: number };
  factorScales: { [key: string]: { [key: string]: number } };
  additionalCosts: {
    cost_per_kilometer: number;
    cost_per_point: number;
  };
  // ... store methods
}
```

### Configuration (`config.json`)
```json
{
  "scales": {
    "installation": {
      "0-4": 3500,
      "5-8": 3500,
      "9-16": 7000,
      "17-32": 10500,
      "33+": 15000
    },
    "finance_fee": {
      "0-20000": 1000,
      "20001-50000": 1000,
      "50001-100000": 2000,
      "100001+": 3000
    },
    "gross_profit": {
      "0-4": 15000,
      "5-8": 20000,
      "9-16": 25000,
      "17-32": 30000,
      "33+": 35000
    },
    "additional_costs": {
      "cost_per_kilometer": 15,
      "cost_per_point": 250
    }
  }
}
```

## Backend API Structure

### Authentication Endpoints
```typescript
interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: 'admin' | 'user';
  };
}

POST /api/admin/login
Body: { username: string, password: string }
Response: AuthResponse

GET /api/admin/verify
Headers: { Authorization: `Bearer ${token}` }
Response: { valid: boolean }
```

### Admin Endpoints
```typescript
POST /api/admin/items
Headers: { Authorization: `Bearer ${token}` }
Body: { sectionId: string, items: Item[] }

GET /api/admin/scales
Headers: { Authorization: `Bearer ${token}` }
Response: { scales: Scales }

POST /api/admin/scales
Headers: { Authorization: `Bearer ${token}` }
Body: { scales: Scales }
```

## Common Issues and Solutions

### 1. Authentication Issues
- **Symptom**: Admin login fails
- **Solution**: 
  ```typescript
  // 1. Clear localStorage
  localStorage.clear();
  // 2. Check token in localStorage
  const token = localStorage.getItem('adminToken');
  // 3. Verify token is valid
  const response = await fetch(`${API_URL}/api/admin/verify`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  ```

### 2. Calculation Errors
- **Symptom**: Incorrect totals
- **Solution**: 
  1. Verify scales in `config.json`
  2. Check `calculateTotalCosts()` in calculator store
  3. Validate all quantity inputs are numbers
  4. Ensure proper escalation rate is applied

### 3. PDF Generation Fails
- **Symptom**: PDF doesn't generate
- **Solution**:
  1. Check all required fields are filled
  2. Verify customer name is set
  3. Ensure all calculations completed
  4. Check console for jsPDF errors

## Development Environment Setup

### Prerequisites
```bash
node -v  # v16.x or higher
npm -v   # v8.x or higher
```

### Installation
```bash
git clone <repository-url>
cd deal-cost-calculator
npm install
```

### Environment Variables
```bash
# .env.development
VITE_API_URL=http://localhost:5000

# .env.production
VITE_API_URL=https://your-production-api.com
```

## Production Deployment

### Frontend (Netlify)
```bash
# Build command
npm run build

# Environment variables
VITE_API_URL=https://your-backend-url.com
```

### Backend (Render)
```bash
# Build command
pip install -r requirements.txt

# Start command
python app.py

# Environment variables
FLASK_ENV=production
SECRET_KEY=your-secret-key
```

## File Structure
```
/
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── DealDetailsSection.tsx
│   │   │   ├── HardwareSection.tsx
│   │   │   ├── ConnectivitySection.tsx
│   │   │   ├── LicensingSection.tsx
│   │   │   ├── SettlementSection.tsx
│   │   │   └── TotalCostsSection.tsx
│   │   ├── tables/
│   │   │   └── ItemsTable.tsx
│   │   ├── admin/
│   │   │   ├── AdditionalCostsTab.tsx
│   │   │   └── AdminLoginButton.tsx
│   │   └── GeneratePDFButton.tsx
│   ├── store/
│   │   ├── calculator.ts
│   │   └── auth.ts
│   ├── types/
│   │   └── calculator.ts
│   └── config.ts
├── backend/
│   ├── app.py
│   └── config.json
└── public/
```

## Dependencies

### Frontend
```json
{
  "dependencies": {
    "@radix-ui/react-tabs": "^1.0.0",
    "jspdf": "^2.5.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.43.0",
    "tailwindcss": "^3.2.4",
    "zustand": "^4.3.2"
  }
}
```

### Backend
```python
# requirements.txt
flask==2.0.1
flask-cors==3.0.10
python-dotenv==0.19.0
pyjwt==2.3.0
```

## Version Control
```bash
# Create a new feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "Description of changes"

# Push changes
git push origin feature/new-feature
