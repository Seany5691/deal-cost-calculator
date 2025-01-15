import { useCalculatorStore } from '@/store/calculator';

export function DealDetailsSection() {
  const { sections, dealDetails, updateDealDetails } = useCalculatorStore();

  // Calculate number of extensions
  const hardwareSection = sections.find(s => s.id === 'hardware');
  const extensions = hardwareSection?.items.reduce((sum, item) => {
    if (['switchboard', 'desktop-phone', 'cordless-phone', 'mobile-apps'].includes(item.id)) {
      return sum + item.quantity;
    }
    return sum;
  }, 0) || 0;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-black">Deal Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block mb-2 text-black">Customer Name</label>
          <input
            type="text"
            value={dealDetails.customerName}
            onChange={(e) => updateDealDetails({ customerName: e.target.value })}
            className="w-full p-2 border rounded text-black"
            placeholder="Enter customer name"
          />
        </div>
        <div>
          <label className="block mb-2 text-black">Distance To Install (KM)</label>
          <input
            type="number"
            min="0"
            value={dealDetails.distanceToInstall}
            onChange={(e) => updateDealDetails({ distanceToInstall: parseFloat(e.target.value) || 0 })}
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div>
          <label className="block mb-2 text-black">Term</label>
          <select
            value={dealDetails.term}
            onChange={(e) => updateDealDetails({ term: parseInt(e.target.value) })}
            className="w-full p-2 border rounded text-black"
          >
            <option value="60">60 months</option>
            <option value="48">48 months</option>
            <option value="36">36 months</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-black">Escalation</label>
          <select
            value={dealDetails.escalation}
            onChange={(e) => updateDealDetails({ escalation: parseFloat(e.target.value) })}
            className="w-full p-2 border rounded text-black"
          >
            <option value="0">0%</option>
            <option value="10">10%</option>
            <option value="15">15%</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-black">Additional Gross Profit</label>
          <input
            type="number"
            min="0"
            value={dealDetails.additionalGrossProfit}
            onChange={(e) => updateDealDetails({ additionalGrossProfit: parseFloat(e.target.value) || 0 })}
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div>
          <label className="block mb-2 text-black">Number Of Extensions</label>
          <input
            type="number"
            readOnly
            value={extensions}
            className="w-full p-2 border rounded bg-gray-100 text-black"
          />
        </div>
        <div>
          <label className="block mb-2 text-black">Settlement</label>
          <input
            type="number"
            min="0"
            value={dealDetails.settlement}
            onChange={(e) => updateDealDetails({ settlement: parseFloat(e.target.value) || 0 })}
            className="w-full p-2 border rounded text-black"
          />
        </div>
      </div>
    </div>
  );
}
