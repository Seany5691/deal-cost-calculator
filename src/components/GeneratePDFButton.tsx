import { Button } from '@/components/ui/button';
import { useCalculatorStore } from '@/store/calculator';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '@/lib/utils';

export function GeneratePDFButton() {
  const { sections, dealDetails, calculateTotalCosts } = useCalculatorStore();

  const generatePDF = () => {
    const doc = new jsPDF();
    const totals = calculateTotalCosts();

    // Set title
    doc.setFontSize(20);
    doc.text('Deal Cost Calculator Report', 15, 15);
    doc.setFontSize(12);

    let yPos = 30;

    // Hardware Section
    const hardwareSection = sections.find(s => s.id === 'hardware');
    if (hardwareSection) {
      doc.text('Hardware', 15, yPos);
      const hardwareData = hardwareSection.items
        .filter(item => item.quantity > 0)
        .map(item => [
          item.name,
          formatCurrency(item.cost),
          item.quantity.toString(),
          formatCurrency(item.cost * item.quantity)
        ]);

      if (hardwareData.length > 0) {
        autoTable(doc, {
          startY: yPos + 5,
          head: [['Item', 'Cost', 'Quantity', 'Total']],
          body: hardwareData,
        });
        yPos = (doc as any).lastAutoTable.finalY + 10;
      } else {
        yPos += 15;
      }
    }

    // Connectivity Section
    const connectivitySection = sections.find(s => s.id === 'connectivity');
    if (connectivitySection) {
      doc.text('Connectivity', 15, yPos);
      const connectivityData = connectivitySection.items
        .filter(item => item.quantity > 0)
        .map(item => [
          item.name,
          formatCurrency(item.cost),
          item.quantity.toString(),
          formatCurrency(item.cost * item.quantity)
        ]);

      if (connectivityData.length > 0) {
        autoTable(doc, {
          startY: yPos + 5,
          head: [['Item', 'Cost', 'Quantity', 'Total']],
          body: connectivityData,
        });
        yPos = (doc as any).lastAutoTable.finalY + 10;
      } else {
        yPos += 15;
      }
    }

    // Licensing Section
    const licensingSection = sections.find(s => s.id === 'licensing');
    if (licensingSection) {
      doc.text('Licensing', 15, yPos);
      const licensingData = licensingSection.items
        .filter(item => item.quantity > 0)
        .map(item => [
          item.name,
          formatCurrency(item.cost),
          item.quantity.toString(),
          formatCurrency(item.cost * item.quantity)
        ]);

      if (licensingData.length > 0) {
        autoTable(doc, {
          startY: yPos + 5,
          head: [['Item', 'Cost', 'Quantity', 'Total']],
          body: licensingData,
        });
        yPos = (doc as any).lastAutoTable.finalY + 10;
      } else {
        yPos += 15;
      }
    }

    // Deal Details Section
    doc.text('Deal Details', 15, yPos);
    const dealDetailsData = [
      ['Distance to Install', `${dealDetails.distanceToInstall} KM`],
      ['Term', `${dealDetails.term} months`],
      ['Escalation', `${dealDetails.escalation}%`],
      ['Additional Gross Profit', formatCurrency(dealDetails.additionalGrossProfit)],
      ['Settlement', formatCurrency(dealDetails.settlement)]
    ];

    autoTable(doc, {
      startY: yPos + 5,
      head: [['Detail', 'Value']],
      body: dealDetailsData,
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Total Costs Section
    doc.text('Total Costs', 15, yPos);
    const totalCostsData = [
      ['Hardware Total', formatCurrency(totals.hardwareTotal)],
      ['Hardware & Installation Total', formatCurrency(totals.hardwareInstallTotal)],
      ['Base Gross Profit', formatCurrency(totals.baseGrossProfit)],
      ['Additional Profit', formatCurrency(totals.additionalProfit)],
      ['Total Gross Profit', formatCurrency(totals.totalGrossProfit)],
      ['Finance Fee', formatCurrency(totals.financeFee)],
      ['Settlement Amount', formatCurrency(totals.settlementAmount)],
      ['Finance Amount', formatCurrency(totals.financeAmount)],
      ['Total Payout', formatCurrency(totals.totalPayout)],
      ['Hardware Rental', formatCurrency(totals.hardwareRental)],
      ['Connectivity Cost', formatCurrency(totals.connectivityCost)],
      ['Licensing Cost', formatCurrency(totals.licensingCost)],
      ['Total MRC', formatCurrency(totals.totalMRC)],
      ['Total Ex VAT', formatCurrency(totals.totalExVat)],
      ['Total Inc VAT', formatCurrency(totals.totalIncVat)]
    ];

    autoTable(doc, {
      startY: yPos + 5,
      head: [['Cost Type', 'Amount']],
      body: totalCostsData,
    });

    // Save the PDF
    doc.save('deal-cost-calculator-report.pdf');
  };

  return (
    <Button 
      onClick={generatePDF} 
      variant="default"
      className="whitespace-nowrap"
    >
      Generate PDF
    </Button>
  );
}
