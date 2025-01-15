export interface Item {
  id: string;
  name: string;
  cost: number;
  quantity: number;
  locked?: boolean;
}

export interface Section {
  id: string;
  name: string;
  items: Item[];
}

export interface DealDetails {
  distanceToInstall: number;
  term: number;
  escalation: number;
  isStartingRental: boolean;
  additionalGrossProfit: number;
  settlement: number;
}

export interface Factor {
  term: number;
  escalation: number;
  minAmount: number;
  maxAmount: number;
  value: number;
}

export interface AdminSettings {
  distanceCost: number;
  extensionCost: number;
  factors: Factor[];
  installationScales: {
    maxExtensions: number;
    cost: number;
  }[];
  financeScales: {
    maxAmount: number;
    fee: number;
  }[];
  profitScales: {
    maxExtensions: number;
    profit: number;
  }[];
}