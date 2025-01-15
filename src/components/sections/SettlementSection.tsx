import React from 'react';
import { useCalculatorStore } from '@/store/calculator';
import { formatCurrency } from '@/lib/utils';

interface YearBreakdown {
  year: number;
  amount: number;
  monthsRemaining: number;
  isCompleted: boolean;
  startDate: Date;
  endDate: Date;
}

export function SettlementSection() {
  const [startDate, setStartDate] = React.useState('');
  const [rentalAmount, setRentalAmount] = React.useState('');
  const [escalationRate, setEscalationRate] = React.useState('0');
  const [rentalTerm, setRentalTerm] = React.useState('60');
  const [rentalType, setRentalType] = React.useState('starting');
  const [calculations, setCalculations] = React.useState<YearBreakdown[]>([]);
  const [totalSettlement, setTotalSettlement] = React.useState(0);

  const calculateSettlement = () => {
    const currentDate = new Date('2025-01-04');
    const start = new Date(startDate);
    const rental = parseFloat(rentalAmount);
    const escalation = parseFloat(escalationRate) / 100;
    const term = parseInt(rentalTerm);

    if (!startDate || isNaN(rental)) return;

    let currentRental = rental;
    let newCalculations: YearBreakdown[] = [];
    let totalSettlementAmount = 0;

    // If using current rental, we need to de-escalate to get the starting rental
    if (rentalType === 'current') {
      // Calculate completed years
      const completedYears = Math.floor(
        (currentDate.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );
      for (let i = 0; i < completedYears; i++) {
        currentRental = currentRental / (1 + escalation);
      }
    }

    // Calculate year boundaries and remaining months
    for (let year = 1; year <= Math.ceil(term / 12); year++) {
      const yearStartDate = new Date(start);
      yearStartDate.setFullYear(start.getFullYear() + year - 1);
      const yearEndDate = new Date(start);
      yearEndDate.setFullYear(start.getFullYear() + year);

      if (currentDate >= yearEndDate) {
        // Year is completely in the past
        newCalculations.push({
          year,
          amount: 0,
          monthsRemaining: 0,
          isCompleted: true,
          startDate: yearStartDate,
          endDate: yearEndDate
        });
        currentRental *= (1 + escalation);
      } else if (currentDate < yearStartDate) {
        // Year is completely in the future
        const monthsInYear = 12;
        const yearAmount = currentRental * monthsInYear;
        totalSettlementAmount += yearAmount;

        newCalculations.push({
          year,
          amount: yearAmount,
          monthsRemaining: monthsInYear,
          isCompleted: false,
          startDate: yearStartDate,
          endDate: yearEndDate
        });
        currentRental *= (1 + escalation);
      } else {
        // Year is partially complete
        const monthsRemaining = Math.ceil(
          (yearEndDate.getTime() - currentDate.getTime()) / (30.44 * 24 * 60 * 60 * 1000)
        );
        const yearAmount = currentRental * monthsRemaining;
        totalSettlementAmount += yearAmount;

        newCalculations.push({
          year,
          amount: yearAmount,
          monthsRemaining,
          isCompleted: false,
          startDate: yearStartDate,
          endDate: yearEndDate
        });
        currentRental *= (1 + escalation);
      }
    }

    setCalculations(newCalculations);
    setTotalSettlement(totalSettlementAmount);
    useCalculatorStore.getState().updateDealDetails({ settlement: totalSettlementAmount });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-black">Settlement Calculator</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-black">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-2 text-black">Rental Type</label>
          <select
            value={rentalType}
            onChange={(e) => setRentalType(e.target.value)}
            className="w-full p-2 border rounded text-black"
          >
            <option value="starting">Starting Rental</option>
            <option value="current">Current Rental</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2 text-black">Rental Amount</label>
          <input
            type="number"
            value={rentalAmount}
            onChange={(e) => setRentalAmount(e.target.value)}
            className="w-full p-2 border rounded text-black"
            placeholder="Enter amount in Rands"
          />
        </div>

        <div>
          <label className="block mb-2 text-black">Escalation Rate</label>
          <select
            value={escalationRate}
            onChange={(e) => setEscalationRate(e.target.value)}
            className="w-full p-2 border rounded text-black"
          >
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="15">15%</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-black">Rental Term</label>
          <select
            value={rentalTerm}
            onChange={(e) => setRentalTerm(e.target.value)}
            className="w-full p-2 border rounded text-black"
          >
            <option value="12">12 Months</option>
            <option value="24">24 Months</option>
            <option value="36">36 Months</option>
            <option value="48">48 Months</option>
            <option value="60">60 Months</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculateSettlement}
        className="btn"
      >
        Calculate Settlement
      </button>

      {calculations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-black">Settlement Breakdown</h3>
          <div className="space-y-2">
            {calculations.map(({ year, amount, monthsRemaining, isCompleted, startDate, endDate }) => (
              <div key={year} className="flex justify-between text-black">
                <span>
                  Year {year}: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                </span>
                <span>
                  {isCompleted 
                    ? 'Completed'
                    : `${formatCurrency(amount)} (${monthsRemaining} Months Remaining)`
                  }
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-4 border-t text-black">
              <span>Total Settlement:</span>
              <span>{formatCurrency(totalSettlement)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
