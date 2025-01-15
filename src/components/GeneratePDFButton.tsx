import { Button } from '@/components/ui/button';
import { useCalculatorStore } from '@/store/calculator';
import { useToast as useToastHook } from '@/components/ui/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '@/lib/utils';

export function GeneratePDFButton() {
  const { sections, dealDetails, calculateTotalCosts } = useCalculatorStore();
  const { toast } = useToastHook();

  const generatePDF = async () => {
    try {
      const totals = calculateTotalCosts();

      const doc = new jsPDF();
      let yPos = 20;
      const leftMargin = 20;

      // Add customer name at the top
      if (dealDetails.customerName) {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(dealDetails.customerName, leftMargin, yPos);
        yPos += 10;
      }

      // Add title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text('Deal Cost Calculator Report', leftMargin, yPos);
      yPos += 10;

      // Hardware Section
      const hardwareSection = sections.find(s => s.id === 'hardware');
      if (hardwareSection) {
        doc.text('Hardware', leftMargin, yPos);
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
        doc.text('Connectivity', leftMargin, yPos);
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
        doc.text('Licensing', leftMargin, yPos);
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
      doc.text('Deal Details', leftMargin, yPos);
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
      doc.text('Total Costs', leftMargin, yPos);
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

      // Save the PDF with customer name if available
      const fileName = dealDetails.customerName 
        ? `${dealDetails.customerName.trim()} Breakdown.pdf`
        : 'Deal Cost Calculator Report.pdf';
      doc.save(fileName);

      toast({
        title: "Success",
        description: "PDF generated successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
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
