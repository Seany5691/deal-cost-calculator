# Deal Cost Calculator

A modern, React-based calculator application for computing deal costs, including hardware, connectivity, licensing, and settlement calculations.

## Features

### 1. Item Management
- **Hardware Section**
  - Predefined items like Switchboard, Desktop Phone, Cordless Phone, etc.
  - Dynamic quantity adjustment with plus/minus buttons
  - Real-time total cost calculations
  - Ability to add custom items

- **Connectivity Section**
  - LTE options from different providers
  - Router configurations
  - Quantity-based calculations

- **Licensing Section**
  - Various license types (Premium, Standard)
  - SLA and usage-based pricing
  - Per-copy cost calculations

### 2. Deal Details
- Distance calculation with per-kilometer costs
- Configurable term length (12-60 months)
- Escalation rate options (0%, 5%, 10%, 15%)
- Additional gross profit adjustments
- Settlement calculations

### 3. Settlement Calculator
- Precise date-based calculations
- Year-by-year breakdown showing:
  - Start and end dates for each year
  - Completed years
  - Remaining months for current year
  - Future year projections
- Automatic escalation application
- Support for both starting and current rental calculations

### 4. Total Costs Section
Comprehensive cost breakdown including:
- Hardware installation costs
- Connectivity costs
- Licensing costs
- Finance fees
- Gross profit
- Total payout
- Hardware rental
- Monthly Recurring Costs (MRC)
- Total costs (Ex VAT and Inc VAT)

## Technical Implementation

### Frontend
- Built with React and TypeScript
- State management using Zustand
- Modern UI components with shadcn/ui
- Responsive design with Tailwind CSS
- Form handling with React Hook Form and Zod validation

### Key Components
1. **Calculator**
   - Main component orchestrating all sections
   - Tab-based navigation
   - Dynamic section rendering

2. **ItemsTable**
   - Reusable component for all item sections
   - Quantity controls with plus/minus buttons
   - Real-time total calculations
   - Clean, intuitive interface

3. **SettlementSection**
   - Date-based calculations
   - Year-by-year breakdown
   - Automatic updates based on term and escalation

4. **AddItemDialog**
   - Modal for adding new items
   - Form validation
   - Unique ID generation
   - Section-specific item addition

### Calculations
- Hardware costs include:
  - Base item costs
  - Distance-based charges
  - Extension costs
  - Sliding scale installation costs

- Settlement calculations consider:
  - Start date
  - Current date
  - Term length
  - Escalation rate
  - Rental type

- Finance fee determination based on total amount:
  - R0 - R20,000: R1,500
  - R20,001 - R50,000: R2,500
  - R50,001+: R3,500

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Dependencies
- React
- TypeScript
- Tailwind CSS
- Zustand
- shadcn/ui
- React Hook Form
- Zod
- Lucide React (for icons)

## Project Structure
```
src/
├── components/
│   ├── sections/
│   │   ├── HardwareSection.tsx
│   │   ├── ConnectivitySection.tsx
│   │   ├── LicensingSection.tsx
│   │   ├── DealDetailsSection.tsx
│   │   ├── SettlementSection.tsx
│   │   └── TotalCostsSection.tsx
│   ├── tables/
│   │   └── ItemsTable.tsx
│   ├── dialogs/
│   │   └── AddItemDialog.tsx
│   └── ui/
├── store/
│   └── calculator.ts
├── lib/
│   └── utils.ts
└── types/
    └── calculator.ts
```

## Recent Updates
1. Added secure admin panel with authentication
   - Protected routes for managing items, factors, and scales
   - JWT-based authentication
   - Role-based access control
2. Improved CORS configuration for production deployment
   - Support for multiple Netlify domains
   - Secure header handling
3. Enhanced API security
   - Protected admin routes with authentication
   - Proper token validation
4. Fixed deployment issues
   - Resolved authentication in production
   - Corrected store initialization with auth headers
5. Previous Updates:
   - Fixed quantity adjustment functionality
   - Corrected settlement calculations
   - Implemented add item functionality
   - Updated UI for better visibility
   - Streamlined quantity controls

## Deployment

### Frontend (Netlify)

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set environment variables:
   - Go to Site settings > Build & deploy > Environment variables
   - Add `VITE_API_URL` pointing to your backend URL (e.g., `https://your-app-name.onrender.com`)

### Backend (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure build settings:
   - Build command: `pip install -r requirements.txt`
   - Start command: `python app.py`
4. Set environment variables:
   - `FLASK_ENV=production`
   - `SECRET_KEY=your-secret-key`

## Troubleshooting

### Common Issues

1. **Missing Headers/Sections**
   - Clear browser cache and localStorage
   - Verify `VITE_API_URL` is set correctly in Netlify
   - Check browser console for API errors

2. **Admin Login Issues**
   - Ensure backend URL is correct
   - Clear browser cache and localStorage
   - Check CORS configuration on backend
   - Verify credentials are correct

3. **CORS Errors**
   - Verify backend CORS configuration includes Netlify domain
   - Check for trailing slashes in API URLs
   - Ensure proper headers are being sent

### Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Update environment variables as needed
4. Install dependencies: `npm install`
5. Start development server: `npm run dev`

## Deployment

The application is deployed and accessible at:

### Frontend
- Production: https://deal-cost-calculator.netlify.app
- Hosting: Netlify
- Auto-deploys from the main branch

### Backend
- Production: https://deal-cost-calculator.onrender.com
- Hosting: Render
- Auto-deploys from the main branch

### Environment Setup
1. Frontend (.env.production):
   ```
   VITE_API_URL=https://deal-cost-calculator.onrender.com
   ```

2. Backend (.env):
   ```
   SECRET_KEY=your-secret-key
   FLASK_ENV=production
   ```

## Contributing
Feel free to submit issues and enhancement requests.
