import { formatCurrency } from "@/lib/utils";
import { useCalculatorStore } from "@/store/calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GenerateProposalButton from "../GenerateProposalButton";

export function TotalCostsSection() {
  const { calculateTotalCosts } = useCalculatorStore();
  const totals = calculateTotalCosts();

  return (
    <div className="space-y-4 max-w-full overflow-x-hidden">
      <h2 className="text-2xl font-semibold text-black">Total Costs</h2>
      
      {/* Hardware & Installation */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Hardware & Installation</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-black">Hardware Total</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.hardwareTotal)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block mb-2 text-black">Number of Extensions</label>
              <input
                type="text"
                readOnly
                value={totals.extensions}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-black">Distance Cost</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.distanceCost)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block mb-2 text-black">Extensions Cost</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.extensionsCost)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-black">Installation Cost</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.slidingScaleCost)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block mb-2 text-black font-semibold">Total</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.hardwareInstallTotal)}
                className="w-full p-2 border rounded bg-gray-100 text-black font-semibold"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Finance Details */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Finance Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-black">Finance Fee</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.financeFee)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block mb-2 text-black">Selected Factor</label>
              <input
                type="text"
                readOnly
                value={totals.selectedFactor.toFixed(5)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-black">Settlement Amount</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.settlementAmount)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block mb-2 text-black">Finance Amount</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.financeAmount)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-black font-semibold">Total Payout</label>
            <input
              type="text"
              readOnly
              value={formatCurrency(totals.totalPayout)}
              className="w-full p-2 border rounded bg-gray-100 text-black font-semibold"
            />
          </div>
        </CardContent>
      </Card>

      {/* Monthly Costs */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Monthly Costs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-black">Hardware Rental</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.hardwareRental)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block mb-2 text-black">Connectivity Cost</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.connectivityCost)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-black">Licensing Cost</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.licensingCost)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block mb-2 text-black font-semibold">Total MRC</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.totalMRC)}
                className="w-full p-2 border rounded bg-gray-100 text-black font-semibold"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gross Profit */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Gross Profit</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-black">Base Gross Profit</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.baseGrossProfit)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block mb-2 text-black">Additional Profit</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.additionalProfit)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-black font-semibold">Total Gross Profit</label>
            <input
              type="text"
              readOnly
              value={formatCurrency(totals.totalGrossProfit)}
              className="w-full p-2 border rounded bg-gray-100 text-black font-semibold"
            />
          </div>
        </CardContent>
      </Card>

      {/* Final Totals */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Final Totals</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-black">Total Ex VAT</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.totalExVat)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block mb-2 text-black">VAT Amount (15%)</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.vatAmount)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label className="block mb-2 text-black font-semibold">Total Inc VAT</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.totalIncVat)}
                className="w-full p-2 border rounded bg-gray-100 text-black font-semibold"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Costs Summary */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Total Costs Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-black">Hardware Rental</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.hardwareRental)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block mb-2 text-black">Connectivity Cost</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.connectivityCost)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-black">Licensing Cost</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.licensingCost)}
                className="w-full p-2 border rounded bg-gray-100 text-black"
              />
            </div>
            <div>
              <label className="block mb-2 text-black font-semibold">Total Monthly Cost</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.totalMRC)}
                className="w-full p-2 border rounded bg-gray-100 text-black font-semibold"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-black font-semibold">Total Ex VAT</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.totalExVat)}
                className="w-full p-2 border rounded bg-gray-100 text-black font-semibold"
              />
            </div>
            <div>
              <label className="block mb-2 text-black font-semibold">Total Inc VAT</label>
              <input
                type="text"
                readOnly
                value={formatCurrency(totals.totalIncVat)}
                className="w-full p-2 border rounded bg-gray-100 text-black font-semibold"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end space-x-4">
        <GenerateProposalButton />
      </div>
    </div>
  );
}
