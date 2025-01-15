import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HardwareSection } from './sections/HardwareSection';
import { ConnectivitySection } from './sections/ConnectivitySection';
import { LicensingSection } from './sections/LicensingSection';
import { SettlementSection } from './sections/SettlementSection';
import { DealDetailsSection } from './sections/DealDetailsSection';
import { TotalCostsSection } from './sections/TotalCostsSection';
import { useCalculatorStore } from '@/store/calculator';
import { GeneratePDFButton } from '@/components/GeneratePDFButton';
import { AdminLoginButton } from '@/components/AdminLoginButton'; // Assuming AdminLoginButton is imported from here

const sectionTitles: { [key: string]: string } = {
  hardware: 'Hardware',
  connectivity: 'Connectivity',
  licensing: 'Licensing'
};

export function Calculator() {
  const { sections } = useCalculatorStore();

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header with title and buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1e90ff]">Deal Cost Calculator</h1>
          <div className="flex flex-row items-center gap-2 sm:gap-4 self-end sm:self-auto">
            <GeneratePDFButton />
            <AdminLoginButton />
          </div>
        </div>
        
        <Tabs defaultValue="hardware" className="space-y-4">
          <div className="overflow-x-auto -mx-2 px-2 bg-white rounded-lg shadow-sm"> 
            <TabsList className="w-max min-w-full flex flex-nowrap justify-start p-1 mb-2">
              <div className="flex flex-nowrap gap-1">
                {sections.map((section) => (
                  <TabsTrigger 
                    key={section.id} 
                    value={section.id}
                    className="px-3 py-1.5 text-sm whitespace-nowrap"
                  >
                    {sectionTitles[section.id] || section.name}
                  </TabsTrigger>
                ))}
                <TabsTrigger 
                  value="settlement" 
                  className="px-3 py-1.5 text-sm whitespace-nowrap"
                >
                  Settlement
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="px-3 py-1.5 text-sm whitespace-nowrap"
                >
                  Deal Details
                </TabsTrigger>
                <TabsTrigger 
                  value="totals" 
                  className="px-3 py-1.5 text-sm whitespace-nowrap"
                >
                  Total Costs
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <div className="mt-4">
            {sections.map((section) => (
              <TabsContent 
                key={section.id} 
                value={section.id} 
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                {section.id === 'hardware' && <HardwareSection />}
                {section.id === 'connectivity' && <ConnectivitySection />}
                {section.id === 'licensing' && <LicensingSection />}
              </TabsContent>
            ))}

            <TabsContent value="settlement" className="bg-white rounded-lg p-4 shadow-sm">
              <SettlementSection />
            </TabsContent>

            <TabsContent value="details" className="bg-white rounded-lg p-4 shadow-sm">
              <DealDetailsSection />
            </TabsContent>

            <TabsContent value="totals" className="bg-white rounded-lg p-4 shadow-sm">
              <TotalCostsSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}