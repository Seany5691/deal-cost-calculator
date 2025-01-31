import { create } from 'zustand';
import { API_URL } from '../config';

interface DealDetails {
  customerName: string;
  distanceToInstall: number;
  term: number;
  escalation: number;
  additionalGrossProfit: number;
  settlement: number;
}

interface Item {
  id: string;
  name: string;
  cost: number;
  quantity: number;
  locked?: boolean;
}

interface Section {
  id: string;
  name: string;
  items: Item[];
}

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
  setSections: (sections: Section[]) => void;
  setBaseGrossProfit: (profit: { [key: string]: number }) => void;
  setFinanceScales: (scales: { [key: string]: number }) => void;
  setInstallationScales: (scales: { [key: string]: number }) => void;
  setFactorScales: (scales: { [key: string]: { [key: string]: number } }) => void;
  setAdditionalCosts: (costs: { cost_per_kilometer: number; cost_per_point: number }) => void;
  addSessionItem: (sectionId: string, name: string, cost: number) => void;
  updateQuantity: (sectionId: string, itemId: string, quantity: number) => void;
  updateDealDetails: (details: Partial<DealDetails>) => void;
  updateItemCost: (sectionId: string, itemId: string, cost: number) => void;
  updateItemName: (sectionId: string, itemId: string, name: string) => void;
  updateItems: (sectionId: string, items: Item[]) => void;
  calculateTotalCosts: () => {
    extensions: number;
    hardwareTotal: number;
    distanceCost: number;
    extensionsCost: number;
    slidingScaleCost: number;
    hardwareInstallTotal: number;
    baseGrossProfit: number;
    additionalProfit: number;
    totalGrossProfit: number;
    financeFee: number;
    settlementAmount: number;
    financeAmount: number;
    totalPayout: number;
    selectedFactor: number;
    hardwareRental: number;
    connectivityCost: number;
    licensingCost: number;
    totalMRC: number;
    totalExVat: number;
    totalIncVat: number;
    vatAmount: number;
  };
  initializeStore: () => Promise<void>;
}

const defaultDealDetails: DealDetails = {
  customerName: '',
  distanceToInstall: 0,
  term: 60,
  escalation: 0,
  additionalGrossProfit: 0,
  settlement: 0,
};

const DEFAULT_SECTIONS: Section[] = [
  {
    id: 'hardware',
    name: 'Hardware',
    items: [
      { id: 'yealink-t31p', name: 'Yealink T31P (B&W desk- excludes PSU)', cost: 808.96, quantity: 0, locked: true },
      { id: 'yealink-t34w', name: 'Yealink T34W (Colour desk- includes PSU)', cost: 1213.44, quantity: 0, locked: true },
      { id: 'yealink-t43u', name: 'Yealink T43U Switchboard (B&W- excludes PSU)', cost: 1693.76, quantity: 0, locked: true },
      { id: 'yealink-t44u', name: 'Yealink T44U Switchboard (Colour- excludes PSU)', cost: 1693.76, quantity: 0, locked: true },
      { id: 'yealink-w73p', name: 'Yealink W73P Cordless (Handset & base)', cost: 1820.16, quantity: 0, locked: true },
      { id: 'yealink-w73h', name: 'Yealink W73H (Handset only)', cost: 1137.60, quantity: 0, locked: true },
      { id: 'mobile-app', name: 'Additional Mobile App', cost: 0, quantity: 0, locked: true }
    ]
  },
  {
    id: 'connectivity',
    name: 'Connectivity',
    items: [
      { id: 'lte', name: 'LTE', cost: 0, quantity: 0, locked: false },
      { id: 'router', name: 'Router', cost: 0, quantity: 0, locked: false }
    ]
  },
  {
    id: 'licensing',
    name: 'Licensing',
    items: [
      { id: 'premium', name: 'Premium', cost: 0, quantity: 0, locked: false },
      { id: 'standard', name: 'Standard', cost: 0, quantity: 0, locked: false }
    ]
  }
];

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  sections: [],
  dealDetails: defaultDealDetails,
  baseGrossProfit: {},
  financeScales: {},
  installationScales: {},
  factorScales: {},
  additionalCosts: {
    cost_per_kilometer: 15,
    cost_per_point: 250
  },
  setSections: (sections) => set({ sections }),
  setBaseGrossProfit: (profit) => set({ baseGrossProfit: profit }),
  setFinanceScales: (scales) => set({ financeScales: scales }),
  setInstallationScales: (scales) => set({ installationScales: scales }),
  setFactorScales: (scales) => set({ factorScales: scales }),
  setAdditionalCosts: (costs) => set({ additionalCosts: costs }),
  addSessionItem: (sectionId, name, cost) => {
    const state = get();
    const sections = state.sections.map(section => {
      if (section.id === sectionId) {
        const newItem: Item = {
          id: `session-${Date.now()}`, // Unique ID for session items
          name,
          cost,
          quantity: 0
        };
        return {
          ...section,
          items: [...section.items, newItem]
        };
      }
      return section;
    });
    set({ sections });
  },

  updateQuantity: (sectionId, itemId, quantity) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
              ),
            }
          : section
      ),
    })),

  updateDealDetails: (details) =>
    set((state) => ({
      dealDetails: { ...state.dealDetails, ...details },
    })),

  updateItemCost: (sectionId, itemId, cost) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, cost } : item
              ),
            }
          : section
      ),
    })),

  updateItemName: (sectionId, itemId, name) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, name } : item
              ),
            }
          : section
      ),
    })),

  updateItems: (sectionId, items) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId ? { ...section, items } : section
      ),
    })),

  calculateTotalCosts: () => {
    const state = get();
    const { sections, dealDetails, financeScales, baseGrossProfit, installationScales, factorScales, additionalCosts } = state;

    // Calculate number of extensions
    const hardwareSection = sections.find(s => s.id === 'hardware');
    const extensions = hardwareSection?.items.reduce((sum, item) => {
      if (['yealink-t31p', 'yealink-t34w', 'yealink-t43u', 'yealink-t44u', 'yealink-w73p', 'yealink-w73h', 'mobile-app'].includes(item.id)) {
        return sum + (Number(item.quantity) || 0);
      }
      return sum;
    }, 0) || 0;

    // Calculate hardware total with proper number conversion
    const hardwareTotal = hardwareSection?.items.reduce((sum, item) => 
      sum + (Number(item.cost) || 0) * (Number(item.quantity) || 0), 0) || 0;

    // Calculate installation costs using configurable values
    const distanceCost = (Number(dealDetails.distanceToInstall) || 0) * additionalCosts.cost_per_kilometer;
    const extensionsCost = extensions * additionalCosts.cost_per_point;
    
    // Calculate sliding scale cost for installation based on extensions
    let slidingScaleCost = 0;
    if (extensions > 0 && installationScales) {
      const extensionRanges = {
        '0-4': { min: 0, max: 4 },
        '5-8': { min: 5, max: 8 },
        '9-16': { min: 9, max: 16 },
        '17-32': { min: 17, max: 32 },
        '33-48': { min: 33, max: 48 }
      };

      // Find the matching range for the number of extensions
      let matchingRange = null;
      for (const [range, { min, max }] of Object.entries(extensionRanges)) {
        if (extensions >= min && extensions <= max) {
          matchingRange = range;
          break;
        }
      }

      if (matchingRange && installationScales[matchingRange]) {
        slidingScaleCost = Number(installationScales[matchingRange]);
      } else {
        console.warn(`No installation scale found for ${extensions} extensions`);
      }
    }

    // Calculate hardware and installation total
    const hardwareInstallTotal = hardwareTotal + distanceCost + extensionsCost + slidingScaleCost;

    // Calculate base gross profit based on number of extensions
    let currentGrossProfit = 0;
    if (extensions > 0) {
      const grossProfitRanges = {
        '0-4': { min: 0, max: 4 },
        '5-8': { min: 5, max: 8 },
        '9-16': { min: 9, max: 16 },
        '17-32': { min: 17, max: 32 },
        '33-48': { min: 33, max: 48 }
      };

      // Find the matching range for gross profit
      let matchingRange = null;
      for (const [range, { min, max }] of Object.entries(grossProfitRanges)) {
        if (extensions >= min && extensions <= max) {
          matchingRange = range;
          break;
        }
      }

      if (matchingRange && baseGrossProfit[matchingRange]) {
        currentGrossProfit = Number(baseGrossProfit[matchingRange]);
      } else {
        console.warn(`No gross profit scale found for ${extensions} extensions`);
      }
    }

    const additionalProfit = Number(dealDetails.additionalGrossProfit) || 0;

    const totalGrossProfit = currentGrossProfit + additionalProfit;

    // Calculate settlement amount
    const settlementAmount = Number(dealDetails.settlement) || 0;

    // Calculate initial finance amount (before finance fee)
    const initialFinanceAmount = hardwareInstallTotal + totalGrossProfit + settlementAmount;

    // Calculate finance fee based on initial finance amount
    let financeFee = 0;
    if (financeScales && Object.keys(financeScales).length > 0) {
      const amountRanges = {
        '0-20000': { min: 0, max: 20000 },
        '20001-50000': { min: 20001, max: 50000 },
        '50001-100000': { min: 50001, max: 100000 },
        '100001+': { min: 100001, max: Infinity }
      };

      // Find the matching range for the finance amount
      let matchingRange = null;
      for (const [range, { min, max }] of Object.entries(amountRanges)) {
        if (initialFinanceAmount >= min && initialFinanceAmount <= max) {
          matchingRange = range;
          break;
        }
      }

      if (matchingRange && financeScales[matchingRange] !== undefined) {
        financeFee = Number(financeScales[matchingRange]);
      } else {
        console.warn(`No finance fee found for amount: ${initialFinanceAmount}`);
      }
    }

    // Calculate final finance amount (including finance fee)
    const financeAmount = initialFinanceAmount + financeFee;

    // Calculate total payout (should match finance amount)
    const totalPayout = financeAmount;

    // Get selected factor based on term and escalation
    let selectedFactor = 0;
    const factorKey = `${dealDetails.term}-${dealDetails.escalation}`;
    console.log('Looking for factor with key:', factorKey);
    console.log('Available factor scales:', factorScales);
    
    if (factorScales && factorScales[factorKey]) {
      console.log('Found factor scales for key:', factorScales[factorKey]);
      const ranges = Object.entries(factorScales[factorKey])
        .map(([range, factor]) => {
          const [minStr, maxStr] = range.split('-');
          const min = Number(minStr);
          const max = maxStr === 'Infinity' ? Infinity : Number(maxStr);
          console.log('Processing range:', range, 'min:', min, 'max:', max, 'factor:', factor);
          return { min, max, factor: Number(factor) };
        })
        .sort((a, b) => a.min - b.min);

      console.log('Sorted ranges:', ranges);
      console.log('Finance amount:', financeAmount);

      // Find the matching range for the finance amount
      for (const { min, max, factor } of ranges) {
        console.log('Checking range - min:', min, 'max:', max, 'financeAmount:', financeAmount);
        if (financeAmount >= min && financeAmount <= max) {
          console.log('Found matching factor:', factor);
          selectedFactor = factor;
          break;
        }
      }

      if (selectedFactor === 0) {
        console.warn('No matching range found for finance amount:', financeAmount);
      }
    } else {
      console.warn('No factor found for key:', factorKey, 'Available keys:', Object.keys(factorScales || {}));
    }

    // Calculate hardware rental
    const hardwareRental = selectedFactor > 0 ? financeAmount * selectedFactor : 0;

    // Calculate MRC components
    const connectivitySection = sections.find(s => s.id === 'connectivity');
    const connectivityCost = connectivitySection?.items.reduce((sum, item) => 
      sum + (Number(item.cost) || 0) * (Number(item.quantity) || 0), 0) || 0;

    const licensingSection = sections.find(s => s.id === 'licensing');
    const licensingCost = licensingSection?.items.reduce((sum, item) => 
      sum + (Number(item.cost) || 0) * (Number(item.quantity) || 0), 0) || 0;

    // Calculate total MRC
    const totalMRC = connectivityCost + licensingCost;

    // Calculate total ex VAT
    const totalExVat = hardwareRental + totalMRC;

    // Calculate VAT amount (15%)
    const vatAmount = totalExVat * 0.15;

    // Calculate total inc VAT
    const totalIncVat = totalExVat + vatAmount;

    return {
      extensions,
      hardwareTotal,
      distanceCost,
      extensionsCost,
      slidingScaleCost,
      hardwareInstallTotal,
      baseGrossProfit: currentGrossProfit,
      additionalProfit,
      totalGrossProfit,
      financeFee,
      settlementAmount,
      financeAmount,
      totalPayout,
      selectedFactor,
      hardwareRental,
      connectivityCost,
      licensingCost,
      totalMRC,
      totalExVat,
      totalIncVat,
      vatAmount
    };
  },

  initializeStore: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      // Fetch sections
      const sectionsResponse = await fetch(`${API_URL}/api/admin/items`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!sectionsResponse.ok) {
        throw new Error('Failed to fetch sections');
      }

      const sectionsData = await sectionsResponse.json();
      const sections = sectionsData.map((section: Section) => ({
        ...section,
        items: section.items.map((item: Item) => ({
          ...item,
          locked: section.id === 'hardware' && ['yealink-t31p', 'yealink-t34w', 'yealink-t43u', 'yealink-t44u', 'yealink-w73p', 'yealink-w73h', 'mobile-app'].includes(item.id)
        }))
      }));
      set({ sections });

      // Fetch all scales in parallel
      const [scalesResponse, factorsResponse] = await Promise.all([
        fetch(`${API_URL}/api/admin/scales`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }),
        fetch(`${API_URL}/api/admin/factors`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
      ]);

      if (!scalesResponse.ok || !factorsResponse.ok) {
        throw new Error('Failed to fetch scales or factors');
      }

      const scalesData = await scalesResponse.json();
      const factorsData = await factorsResponse.json();

      // Convert factors to the correct format
      const convertedFactors: { [key: string]: { [key: string]: number } } = {};
      Object.entries(factorsData as Record<string, Record<string, Record<string, number>>>).forEach(([term, escalationObj]) => {
        Object.entries(escalationObj).forEach(([escalation, rangeObj]) => {
          const termValue = term.split('_')[0];  // "36_months" -> "36"
          const escalationValue = escalation.replace('%', ''); // "0%" -> "0"
          const key = `${termValue}-${escalationValue}`;
          
          convertedFactors[key] = {};
          Object.entries(rangeObj).forEach(([range, factor]) => {
            if (range === '100000+') {
              convertedFactors[key]['100001-Infinity'] = factor;
            } else {
              convertedFactors[key][range] = factor;
            }
          });
        });
      });

      set({
        baseGrossProfit: scalesData.gross_profit || {},
        financeScales: scalesData.finance_fee || {},
        installationScales: scalesData.installation || {},
        factorScales: convertedFactors || {},
        additionalCosts: scalesData.additional_costs || {
          cost_per_kilometer: 15,
          cost_per_point: 250
        }
      });
    } catch (error) {
      console.error('Store initialization failed:', error);
      set({
        sections: DEFAULT_SECTIONS,
        baseGrossProfit: {},
        financeScales: {},
        installationScales: {},
        factorScales: {},
        additionalCosts: {
          cost_per_kilometer: 15,
          cost_per_point: 250
        }
      });
    }
  },
}));