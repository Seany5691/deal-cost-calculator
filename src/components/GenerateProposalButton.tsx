import { PDFDocument } from 'pdf-lib';
import { useCalculatorStore } from '../store/calculator';

interface Item {
  id: string;
  name: string;
  cost: number;
  quantity: number;
  locked?: boolean;
}

interface DealDetails {
  customerName: string;
  distanceToInstall: number;
  term: number;
  escalation: number;
  additionalGrossProfit: number;
  settlement: number;
}

const formatHardwareItems = (items: Item[]) => {
  return items
    .filter(item => item.quantity > 0)
    .map(item => `${item.quantity} x ${item.name}`)
    .join(', ');
};

const formatConnectivityItems = (items: Item[]) => {
  return items
    .filter(item => item.quantity > 0)
    .map(item => `${item.quantity} x ${item.name}`)
    .join(', ');
};

const formatLicensingItems = (items: Item[]) => {
  return items
    .filter(item => item.quantity > 0)
    .map(item => `${item.quantity} x ${item.name}`)
    .join(', ');
};

const getSolutionSummary = (items: Item[], dealDetails: DealDetails) => {
  const hardwareList = items
    .filter(item => item.quantity > 0)
    .map(item => `${item.quantity} x ${item.name}`)
    .join(', ');
  return `We will be implementing the following: ${hardwareList} \nThis agreement will be over a ${dealDetails.term} month period.\nWith an escalation of ${dealDetails.escalation}% per annum.`;
};

const downloadPDF = (pdfBytes: Uint8Array, filename: string) => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

async function fillAndDownloadProposal(clientName: string, email: string) {
  const store = useCalculatorStore.getState();
  const hardwareItems = store.sections.find(s => s.id === 'hardware')?.items || [];
  const connectivityItems = store.sections.find(s => s.id === 'connectivity')?.items || [];
  const licensingItems = store.sections.find(s => s.id === 'licensing')?.items || [];
  const totalCosts = store.calculateTotalCosts();
  
  try {
    // Load PDF
    const existingPdfBytes = await fetch('/SI Proposal Form.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // Fill form fields
    form.getTextField('Cover Name').setText(store.dealDetails.customerName || '');
    form.getTextField('Hardware 1').setText(formatHardwareItems(hardwareItems.filter(item => item.locked)));
    form.getTextField('Hardware 2').setText(formatHardwareItems(hardwareItems.filter(item => !item.locked)));
    form.getTextField('Hardware Term 1').setText(`${store.dealDetails.term} Months`);
    form.getTextField('Hardware Term 2').setText(`${store.dealDetails.term} Months`);
    form.getTextField('MRC 1').setText(formatConnectivityItems(connectivityItems));
    form.getTextField('License 1').setText(formatLicensingItems(licensingItems));
    form.getTextField('Total Hardware').setText(totalCosts.hardwareRental.toFixed(2));
    form.getTextField('Total Hardware Term').setText(`${store.dealDetails.term} Months`);
    form.getTextField('Total MRC').setText(totalCosts.totalMRC.toFixed(2));
    form.getTextField('Total MRC Term').setText(`${store.dealDetails.term} Months`);
    form.getTextField('Grand Total').setText(totalCosts.totalExVat.toFixed(2));
    form.getTextField('Client Name').setText(clientName);
    form.getTextField('Solution Summary').setText(getSolutionSummary(hardwareItems, store.dealDetails));
    form.getTextField('Email').setText(email);

    // Save and download PDF
    const pdfBytes = await pdfDoc.save();
    downloadPDF(pdfBytes, `${store.dealDetails.customerName} Proposal.pdf`);
  } catch (error) {
    console.error('Error generating proposal:', error);
    alert('Error generating proposal. Please ensure the PDF template is available and try again.');
  }
}

const GenerateProposalButton: React.FC = () => {
  const handleGenerate = async () => {
    const clientName = prompt('Enter Client Full Name');
    const email = prompt('Enter Solution Specialist Email');
    if (clientName && email) {
      await fillAndDownloadProposal(clientName, email);
    } else {
      alert('Client Full Name and Solution Specialist Email are required to generate the proposal.');
    }
  };

  return (
    <button
      onClick={handleGenerate}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
    >
      Generate Proposal
    </button>
  );
};

export default GenerateProposalButton;
