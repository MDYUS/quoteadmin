import React, { useState, useEffect, useMemo } from 'react';
import { Invoice, InvoiceItem } from '../types';
import { defaultInvoiceData } from './invoiceDefaults';
import { numberToWordsInLakhs } from '../utils';
import { PlusIcon, TrashIcon, DownloadIcon, CheckCircleIcon } from './icons';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LOGO_URL } from '../constants';
import { imageUrlToBase64 } from '../utils';

interface InvoicePageProps {
  invoiceToEdit: Invoice | null;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

const InvoicePage: React.FC<InvoicePageProps> = ({ invoiceToEdit, onSave, onCancel }) => {
  const [invoice, setInvoice] = useState<Invoice>(defaultInvoiceData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (invoiceToEdit) {
      setInvoice(invoiceToEdit);
    } else {
      // Create a new default invoice with a unique number
      setInvoice({
        ...defaultInvoiceData,
        invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
        invoiceDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [invoiceToEdit]);

  const totalAmount = useMemo(() => {
    return invoice.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [invoice.items]);
  
  const totalInWords = useMemo(() => {
      return numberToWordsInLakhs(totalAmount);
  }, [totalAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newItems = [...invoice.items];
    (newItems[index] as any)[name] = name === 'amount' ? parseFloat(value) || 0 : value;
    setInvoice(prev => ({ ...prev, items: newItems }));
  };
  
  const handleAddItem = () => {
    const newItem: InvoiceItem = { id: `item-${Date.now()}`, description: '', qty: '', amount: 0 };
    setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleDeleteItem = (index: number) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const handleGeneratePDF = async () => {
      setIsLoading(true);
      const doc = new jsPDF();
      const margin = 10;
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = margin + 5;

      try {
        const logoBase64 = await imageUrlToBase64(LOGO_URL);
        const signatureBase64 = await imageUrlToBase64('https://res.cloudinary.com/dzvmyhpff/image/upload/v1759808782/Untitled_design_23_mw6kko.png');
        
        // ----- PDF Header -----
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('INVOICE', margin, yPos);
        doc.text('ORIGINAL FOR RECIPIENT', pageWidth - margin, yPos, { align: 'right' });
        yPos += 10;
        
        doc.addImage(logoBase64, margin, yPos, 20, 20);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text("Your Family Interior", margin + 25, yPos + 5);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const companyDetails = [
            'Office adress: 492/961,P.H. Road Arumbakkam, Chennai-106.',
            'An ISO 9001 - 2015 Company',
            'www.amazmodularinterior.com'
        ];
        doc.text(companyDetails, margin + 25, yPos + 10);
        yPos += 40; // Adjusted spacing after removing text logo

        // ----- Invoice Details -----
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.text(`Invoice#: ${invoice.invoiceNumber}`, margin, yPos);
        doc.text(`INVOICE DATE: ${new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}`, pageWidth - margin, yPos, { align: 'right' });
        yPos += 8;

        doc.text('Customer Details:', margin, yPos);
        yPos += 5;
        doc.setFont('helvetica', 'bold');
        doc.text(invoice.customerName, margin, yPos);
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(invoice.customerPhone, margin, yPos);
        yPos += 10;
        
        // ----- Items Table -----
        autoTable(doc, {
            startY: yPos,
            head: [['#', 'Rate/Item', 'Qty', 'Amount']],
            body: invoice.items.map((item, index) => [index + 1, item.description, item.qty, formatCurrency(item.amount)]),
            theme: 'grid',
            headStyles: { fillColor: [224, 231, 255], textColor: [30, 64, 175], fontStyle: 'bold' },
            styles: { lineColor: [203, 213, 225], lineWidth: 0.1 },
            columnStyles: {
                0: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'right' },
            },
        });
        yPos = (doc as any).lastAutoTable.finalY;

        // ----- Totals -----
        autoTable(doc, {
            startY: yPos,
            body: [
                [{ content: 'Total', styles: { fontStyle: 'bold', halign: 'right' } }, { content: formatCurrency(totalAmount), styles: { fontStyle: 'bold', halign: 'right' } }]
            ],
            theme: 'grid',
            styles: { lineColor: [203, 213, 225], lineWidth: 0.1 },
        });
        yPos = (doc as any).lastAutoTable.finalY + 5;
        
        doc.setFontSize(8);
        doc.text(`Total Items / Qty : ${invoice.items.length} / ${invoice.items.length}.000`, margin, yPos);
        doc.text(`TOTAL AMOUNT [IN WORDS] ${totalInWords}`, pageWidth - margin, yPos, { align: 'right', maxWidth: 100 });
        yPos += 20;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('AMOUNT PAID', pageWidth - margin, yPos, { align: 'right' });
        yPos += 10;

        doc.text('For Your Family Interior', pageWidth - margin, yPos, { align: 'right' });
        yPos += 5;
        
        // --- Signature Image ---
        const sigImgWidth = 248; // intrinsic width of signature image
        const sigImgHeight = 85; // intrinsic height
        const sigAspectRatio = sigImgWidth / sigImgHeight;
        
        const sigDisplayWidth = 40;
        const sigDisplayHeight = sigDisplayWidth / sigAspectRatio;
        const sigX = pageWidth - margin - sigDisplayWidth;
        
        doc.addImage(signatureBase64, sigX, yPos, sigDisplayWidth, sigDisplayHeight);
        yPos += sigDisplayHeight + 2;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Authorized Signatory', pageWidth - margin, yPos, { align: 'right' });

        doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);

      } catch (err) {
        console.error("PDF Generation Error:", err);
        alert('Failed to generate PDF. An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
  };

  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return '0.00';
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-neutral-100 min-h-full">
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-md border border-neutral-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <img src={LOGO_URL} alt="Company Logo" className="h-16 w-16 object-contain" />
                    <div>
                        <h1 className="text-xl font-bold text-neutral-800">Your Family Interior</h1>
                        <p className="text-xs text-neutral-500 max-w-xs">
                            Office adress: 492/961,P.H. Road Arumbakkam, Chennai-106.
                            <br/>An ISO 9001 - 2015 Company
                            <br/>www.amazmodularinterior.com
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold uppercase text-neutral-800">Invoice</h2>
                    <p className="text-xs text-neutral-500">ORIGINAL FOR RECIPIENT</p>
                </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                    <label className="text-sm font-semibold">Invoice #</label>
                    <input type="text" name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleInputChange} className="w-full p-1 border-b" />
                </div>
                <div className="text-right">
                    <label className="text-sm font-semibold">Invoice Date</label>
                    <input type="date" name="invoiceDate" value={invoice.invoiceDate} onChange={handleInputChange} className="w-full p-1 border-b text-right" />
                </div>
                <div>
                    <h4 className="font-semibold mb-1">Customer Details:</h4>
                    <input type="text" name="customerName" placeholder="Customer Name" value={invoice.customerName} onChange={handleInputChange} className="w-full p-1 border-b font-bold" />
                    <input type="text" name="customerPhone" placeholder="Customer Phone" value={invoice.customerPhone} onChange={handleInputChange} className="w-full p-1 border-b" />
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-4">
                <thead className="border-b-2 border-t-2 border-sky-200 bg-sky-50">
                    <tr>
                        <th className="p-2 text-left text-sm font-semibold text-sky-800 w-12">#</th>
                        <th className="p-2 text-left text-sm font-semibold text-sky-800">Rate/Item</th>
                        <th className="p-2 text-center text-sm font-semibold text-sky-800 w-24">Qty</th>
                        <th className="p-2 text-right text-sm font-semibold text-sky-800 w-40">Amount</th>
                        <th className="w-10"></th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item, index) => (
                        <tr key={item.id} className="border-b">
                            <td className="p-2">{index + 1}</td>
                            <td><input name="description" value={item.description} onChange={e => handleItemChange(index, e)} className="w-full p-1" /></td>
                            <td><input name="qty" value={item.qty} onChange={e => handleItemChange(index, e)} className="w-full p-1 text-center" /></td>
                            <td><input type="number" name="amount" value={item.amount} onChange={e => handleItemChange(index, e)} className="w-full p-1 text-right" /></td>
                            <td><button onClick={() => handleDeleteItem(index)} className="text-red-500"><TrashIcon className="h-4 w-4" /></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleAddItem} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 font-semibold mb-4"><PlusIcon className="h-4 w-4"/> Add Item</button>


            {/* Totals */}
            <div className="flex justify-end mb-4">
                <div className="w-1/2">
                    <div className="flex justify-between p-2 border-t border-b">
                        <span className="font-bold">Total</span>
                        <span className="font-bold">{formatCurrency(totalAmount)}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-between text-xs text-neutral-600 mb-8">
                <span>Total Items / Qty : {invoice.items.length} / {invoice.items.length}.000</span>
                <span className="text-right font-semibold w-1/2">TOTAL AMOUNT [IN WORDS] {totalInWords}</span>
            </div>

            <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircleIcon className="h-8 w-8"/>
                </div>
                <div className="text-right">
                    <p className="font-semibold">AMOUNT PAID</p>
                    <p className="text-sm mt-8">For Your Family Interior</p>
                    <img src="https://res.cloudinary.com/dzvmyhpff/image/upload/v1759808782/Untitled_design_23_mw6kko.png" alt="Signature" className="w-32 ml-auto" />
                    <p className="text-xs border-t mt-1 pt-1">Authorized Signatory</p>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-6 flex justify-end gap-4">
            <button onClick={onCancel} className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50">Cancel</button>
            <button onClick={() => onSave(invoice)} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">Save Invoice</button>
            <button onClick={handleGeneratePDF} disabled={isLoading} className="inline-flex items-center px-4 py-2 bg-neutral-800 text-white rounded-lg text-sm font-medium hover:bg-neutral-900 disabled:opacity-50">
                <DownloadIcon className="h-5 w-5 mr-2" />
                {isLoading ? 'Generating...' : 'Download PDF'}
            </button>
        </div>
    </div>
  );
};

export default InvoicePage;