import React, { useState, useMemo, FC } from 'react';
import { defaultQuoteData } from '../quoteDefaults';
import { QuoteItem, QuoteData } from '../types';
import { PlusIcon, TrashIcon, DownloadIcon } from './icons';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// ===== Constants =====
const MM2_TO_SQFT = 92903.04;
const GST_RATE = 0.18;
const LOGO_URL =
  'https://amazmodularinterior.com/wp-content/uploads/2024/07/Grey_Orange_Modern_Circle_Class_Logo__7_-removebg-preview-e1739462864846.png';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// ===== Helpers =====
const formatCurrency = (amount: number) =>
  amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const calculateArea = (w: number, h: number) => (w * h) / MM2_TO_SQFT;
const calculateAmount = (area: number, rate: number) => area * rate;

// ===== Style Modes =====
type StyleMode = 'light' | 'boldHeader' | 'zebra';

const QuotePage: FC = () => {
  const [quote, setQuote] = useState<QuoteData>(defaultQuoteData);
  const [isLoading, setIsLoading] = useState(false);
  const [styleMode, setStyleMode] = useState<StyleMode>('light'); // NEW: Style options

  // Handlers
  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuote(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (catIndex: number, itemIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newCategories = [...quote.categories];
    const newItems = [...newCategories[catIndex].items];
    const currentItem = newItems[itemIndex];

    if (name === 'description' || name === 'bwpGrade') {
      newItems[itemIndex] = { ...currentItem, [name]: value };
    } else {
      newItems[itemIndex] = { ...currentItem, [name]: parseFloat(value) || 0 };
    }

    newCategories[catIndex] = { ...newCategories[catIndex], items: newItems };
    setQuote(prev => ({ ...prev, categories: newCategories }));
  };

  const handleAddItem = (catIndex: number) => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}`,
      description: '',
      width: 0,
      height: 0,
      bwpGrade: 'MR',
      rate: 0
    };
    const newCategories = [...quote.categories];
    newCategories[catIndex].items.push(newItem);
    setQuote(prev => ({ ...prev, categories: newCategories }));
  };

  const handleDeleteItem = (catIndex: number, itemIndex: number) => {
    const newCategories = [...quote.categories];
    newCategories[catIndex].items.splice(itemIndex, 1);
    setQuote(prev => ({ ...prev, categories: newCategories }));
  };

  const calculations = useMemo(() => {
    const categoryTotals = quote.categories.map(cat =>
      cat.items.reduce((total, item) => {
        const area = calculateArea(item.width, item.height);
        return total + calculateAmount(area, item.rate);
      }, 0)
    );
    const grandTotal = categoryTotals.reduce((acc, total) => acc + total, 0);
    const gstAmount = grandTotal * GST_RATE;
    const finalAmount = grandTotal + gstAmount;
    return { categoryTotals, grandTotal, gstAmount, finalAmount };
  }, [quote.categories]);

  // ===== PDF =====
  const handleGeneratePDF = async () => {
    setIsLoading(true);
    const doc = new jsPDF();
    const blackColor: [number, number, number] = [0, 0, 0];
    const whiteColor: [number, number, number] = [255, 255, 255];
    const grayColor: [number, number, number] = [245, 245, 245];

    try {
      // Fetch logo (CORS-safe)
      const response = await fetch(`${CORS_PROXY}${encodeURIComponent(LOGO_URL)}`);
      if (!response.ok) throw new Error('Logo fetch failed');
      const blob = await response.blob();
      const logoBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      let yPos = 20;

      // Enforce black text globally
      doc.setTextColor(0, 0, 0);

      // Centered Header
      const logoSize = 30;
      const logoX = (pageWidth - logoSize) / 2;
      doc.addImage(logoBase64, 'PNG', logoX, yPos - 10, logoSize, logoSize);
      yPos += logoSize;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Your Family Interior', pageWidth / 2, yPos, { align: 'center' });
      yPos += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(
        'Office Address: 811 Krishna Complex 1st Floor Arumbakkam Main Road Chennai: 600106',
        pageWidth / 2, yPos, { align: 'center' }
      );
      yPos += 4;
      doc.text('An ISO 9001 - 2015 Company | www.amazmodularinterior.com', pageWidth / 2, yPos, { align: 'center' });
      yPos += 8;

      // Client Info
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      autoTable(doc, {
        body: [
          [{ content: 'Client Name:', styles: { fontStyle: 'bold' as const } }, quote.clientName],
          [{ content: 'Site Location:', styles: { fontStyle: 'bold' as const } }, quote.siteLocation],
          [{ content: 'Date:', styles: { fontStyle: 'bold' as const } }, new Date(quote.date).toLocaleDateString('en-GB')]
        ],
        startY: yPos,
        theme: 'plain',
        styles: { cellPadding: 1, textColor: 0 }
      });
      yPos = (doc as any).lastAutoTable.finalY + 10;

      // Styles based on styleMode
      const isBoldHeader = styleMode === 'boldHeader';
      const isZebra = styleMode === 'zebra';

      const tableBaseStyles = {
        theme: 'grid' as const,
        headStyles: {
          fillColor: isBoldHeader ? blackColor : whiteColor,
          textColor: isBoldHeader ? whiteColor : 0,
          fontStyle: 'bold' as const,
          lineColor: 0,
          lineWidth: 0.1,
          halign: 'center' as const
        },
        bodyStyles: {
          textColor: 0,
          lineColor: 0,
          lineWidth: 0.1,
          cellPadding: 1.5,
          fontSize: 8
        },
        footStyles: {
          fillColor: false as const,
          textColor: 0,
          fontStyle: 'bold' as const,
          lineColor: 0,
          lineWidth: 0.1
        },
        alternateRowStyles: isZebra ? { fillColor: grayColor } : { fillColor: false as const }
      };

      // Categories
      quote.categories.forEach((cat, catIndex) => {
        if (cat.items.length === 0) return;

        if (yPos > pageHeight - 60) {
          doc.addPage();
          doc.setTextColor(0, 0, 0);
          yPos = margin;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(cat.title, margin, yPos);
        yPos += 6;

        const head = [['S.No', 'ITEM', 'BWP Grade', 'Width (mm)', 'Height (mm)', 'Area (sqft)', 'Rate (₹/sqft)', 'Amount (₹)']];
        const body = cat.items.map((item, itemIndex) => {
          const area = calculateArea(item.width, item.height);
          const amount = calculateAmount(area, item.rate);
          return [
            itemIndex + 1,
            item.description,
            item.bwpGrade,
            item.width,
            item.height,
            area.toFixed(2),
            formatCurrency(item.rate),
            formatCurrency(amount)
          ];
        });

        const catTotal = calculations.categoryTotals[catIndex];
        const foot = [
          [
            { content: 'Section Total', colSpan: 7, styles: { halign: 'right' as const, fontStyle: 'bold' as const } },
            { content: formatCurrency(catTotal), styles: { halign: 'right' as const, fontStyle: 'bold' as const } }
          ]
        ];

        autoTable(doc, {
          head,
          body,
          foot,
          startY: yPos,
          ...tableBaseStyles
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
      });

      if (yPos > pageHeight - 80) {
        doc.addPage();
        doc.setTextColor(0, 0, 0);
        yPos = margin;
      }

      // Totals
      autoTable(doc, {
        body: [
          [{ content: 'Grand Total', styles: { fontStyle: 'bold' as const } }, { content: `₹ ${formatCurrency(calculations.grandTotal)}`, styles: { halign: 'right' as const } }],
          [{ content: `GST @ ${GST_RATE * 100}%`, styles: { fontStyle: 'bold' as const } }, { content: `₹ ${formatCurrency(calculations.gstAmount)}`, styles: { halign: 'right' as const } }],
          [{ content: 'Final Amount', styles: { fontStyle: 'bold' as const } }, { content: `₹ ${formatCurrency(calculations.finalAmount)}`, styles: { halign: 'right' as const, fontStyle: 'bold' as const } }]
        ],
        startY: yPos,
        theme: 'grid',
        styles: { lineColor: 0, lineWidth: 0.1, textColor: 0 },
        tableWidth: 110,
        margin: { left: pageWidth - 110 - margin }
      });
      yPos = (doc as any).lastAutoTable.finalY + 15;

      // Footer / Terms
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Warranty:', margin, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.text(quote.warranty || '5 years on all woodwork against manufacturing defects.', margin, yPos);
      yPos += 10;

      doc.setFont('helvetica', 'bold');
      doc.text('Terms & Conditions:', margin, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.text(quote.terms || '—', margin, yPos, { lineHeightFactor: 1.5 });

      // Page footer (updated)
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(0);
        doc.text('Copyright 2025 Amaz Modular Interior All Rights Reserved', pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      doc.save(`Quote-${quote.clientName.replace(/\s/g, '_')}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Failed to generate PDF. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Inputs (force black text on white)
  const inputClass =
    'w-full p-1 bg-white border border-black text-black text-sm placeholder-black/60 focus:outline-none focus:ring-1 focus:ring-black';
  const textRightClass = `${inputClass} text-right`;

  // Conditional table classes by styleMode
  const theadClass =
    styleMode === 'boldHeader'
      ? 'thead-dark'
      : 'thead-light';
  const tbodyClass =
    styleMode === 'zebra'
      ? 'tbody-zebra'
      : '';

  return (
    <div className="bg-white text-black font-sans p-2 sm:p-4 md:p-6">
      {/* STRICT LIGHT CSS (prevents white-on-white + dark-mode inversion) */}
      <style>{`
        .strict-light,
        .strict-light * {
          color: #000000 !important;
          background-color: #FFFFFF !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-scheme: light !important;
          box-shadow: none !important;
        }
        .strict-light table, 
        .strict-light th, 
        .strict-light td {
          border: 1px solid #000000 !important;
          border-collapse: collapse !important;
        }
        .strict-light th, .strict-light td { padding: 6px !important; }

        /* Header variants */
        .strict-light .thead-light th {
          background-color: #FFFFFF !important;
          color: #000000 !important;
          font-weight: 700 !important;
          text-align: left !important;
        }
        .strict-light .thead-dark th {
          background-color: #000000 !important;
          color: #FFFFFF !important;
          font-weight: 700 !important;
          text-align: left !important;
        }

        /* Zebra rows (overrides global) */
        .strict-light .tbody-zebra tr:nth-child(even) td {
          background-color: #F5F5F5 !important;
        }

        /* Inputs always readable */
        .strict-light input[type="text"],
        .strict-light input[type="number"],
        .strict-light input[type="date"] {
          background-color: #FFFFFF !important;
          color: #000000 !important;
        }

        /* Buttons readable */
        .strict-light .btn-black {
          background-color: #000000 !important;
          color: #FFFFFF !important;
          border: 1px solid #000000 !important;
        }
        .strict-light .btn-outline {
          background-color: #FFFFFF !important;
          color: #000000 !important;
          border: 1px solid #000000 !important;
        }
      `}</style>

      <div className="max-w-7xl mx-auto strict-light">
        {/* Header */}
        <header className="flex flex-col items-center gap-4 mb-4 p-4 border border-black">
            {/* Logo and company info in the center */}
            <div className="text-center">
                <img src={LOGO_URL} alt="Company Logo" className="h-24 w-24 object-contain mx-auto" />
                <h1 className="text-2xl font-bold mt-2">Your Family Interior</h1>
                <p className="text-sm">
                    Office Address: 811 Krishna Complex 1st Floor Arumbakkam Main Road Chennai: 600106
                </p>
                <p className="text-sm">An ISO 9001 - 2015 Company</p>
                <p className="text-sm">www.amazmodularinterior.com</p>
            </div>

            {/* Style Options and download button */}
            <div className="w-full flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-2 pt-4 border-t border-black mt-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Style:</label>
                    <select
                        value={styleMode}
                        onChange={e => setStyleMode(e.target.value as StyleMode)}
                        className="border border-black text-black bg-white text-sm p-1"
                    >
                        <option value="light">Light (Black text / White header)</option>
                        <option value="boldHeader">Bold Header (Black header / White text)</option>
                        <option value="zebra">Zebra Rows (High readability)</option>
                    </select>
                </div>
                <button
                    onClick={handleGeneratePDF}
                    disabled={isLoading}
                    className="btn-black flex-shrink-0 inline-flex items-center px-4 py-2 rounded-md shadow-sm transition-colors disabled:opacity-60 text-sm font-medium"
                >
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    {isLoading ? 'Generating…' : 'Download PDF'}
                </button>
            </div>
        </header>

        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border border-black">
          <div>
            <label className="block text-sm font-bold mb-1">Client Name</label>
            <input name="clientName" value={quote.clientName} onChange={handleClientInfoChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Site Location</label>
            <input name="siteLocation" value={quote.siteLocation} onChange={handleClientInfoChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Date</label>
            <input type="date" name="date" value={quote.date} onChange={handleClientInfoChange} className={inputClass} />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {quote.categories.map((cat, catIndex) => (
            <div key={cat.title} className="border border-black">
              <h2 className="text-lg font-bold p-2 border-b border-black">{cat.title}</h2>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className={`${theadClass} border-b-2 border-black`}>
                    <tr>
                      <th className="p-2 text-left text-xs font-bold w-12">S.No</th>
                      <th className="p-2 text-left text-xs font-bold">ITEM</th>
                      <th className="p-2 text-left text-xs font-bold w-24">BWP Grade</th>
                      <th className="p-2 text-right text-xs font-bold w-24">Width (mm)</th>
                      <th className="p-2 text-right text-xs font-bold w-24">Height (mm)</th>
                      <th className="p-2 text-right text-xs font-bold w-24">Area (sqft)</th>
                      <th className="p-2 text-right text-xs font-bold w-32">Rate (₹/sqft)</th>
                      <th className="p-2 text-right text-xs font-bold w-32">Amount (₹)</th>
                      <th className="p-2 text-center text-xs font-bold w-12"></th>
                    </tr>
                  </thead>

                  <tbody className={tbodyClass}>
                    {cat.items.map((item, itemIndex) => {
                      const area = calculateArea(item.width, item.height);
                      const amount = calculateAmount(area, item.rate);
                      return (
                        <tr key={item.id} className="border-b border-black">
                          <td className="p-2 text-sm text-center">{itemIndex + 1}</td>
                          <td className="p-1">
                            <input
                              name="description"
                              value={item.description}
                              onChange={e => handleItemChange(catIndex, itemIndex, e)}
                              className={inputClass}
                              placeholder="Item description"
                            />
                          </td>
                          <td className="p-1">
                            <input
                              name="bwpGrade"
                              value={item.bwpGrade}
                              onChange={e => handleItemChange(catIndex, itemIndex, e)}
                              className={inputClass}
                            />
                          </td>
                          <td className="p-1">
                            <input
                              type="number"
                              name="width"
                              value={item.width}
                              onChange={e => handleItemChange(catIndex, itemIndex, e)}
                              className={textRightClass}
                            />
                          </td>
                          <td className="p-1">
                            <input
                              type="number"
                              name="height"
                              value={item.height}
                              onChange={e => handleItemChange(catIndex, itemIndex, e)}
                              className={textRightClass}
                            />
                          </td>
                          <td className="p-2 text-sm text-right">{area.toFixed(2)}</td>
                          <td className="p-1">
                            <input
                              type="number"
                              name="rate"
                              value={item.rate}
                              onChange={e => handleItemChange(catIndex, itemIndex, e)}
                              className={textRightClass}
                            />
                          </td>
                          <td className="p-2 text-sm text-right">{formatCurrency(amount)}</td>
                          <td className="p-1 text-center">
                            <button
                              onClick={() => handleDeleteItem(catIndex, itemIndex)}
                              className="text-black hover:text-gray-700"
                              title="Delete row"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  <tfoot>
                    <tr className="border-t-2 border-black">
                      <td colSpan={7} className="p-2 text-right font-bold">
                        Section Total
                      </td>
                      <td className="p-2 text-right font-bold">
                        {formatCurrency(calculations.categoryTotals[catIndex])}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="p-2 border-t border-black">
                <button
                  onClick={() => handleAddItem(catIndex)}
                  className="btn-outline inline-flex items-center px-2 py-1 rounded-sm text-sm font-medium"
                >
                  <PlusIcon className="h-4 w-4 mr-1" /> Add Row
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-6">
          <div className="w-full max-w-sm border border-black">
            <div className="flex justify-between p-2 border-b border-black">
              <span className="font-medium">Grand Total</span>
              <span>₹ {formatCurrency(calculations.grandTotal)}</span>
            </div>
            <div className="flex justify-between p-2 border-b border-black">
              <span className="font-medium">GST ({GST_RATE * 100}%)</span>
              <span>₹ {formatCurrency(calculations.gstAmount)}</span>
            </div>
            <div className="flex justify-between p-2 font-bold text-lg">
              <span>Final Amount</span>
              <span>₹ {formatCurrency(calculations.finalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-6 p-4 border border-black text-sm space-y-4">
          <div>
            <h3 className="font-bold mb-1">Warranty</h3>
            <p>{quote.warranty}</p>
          </div>
          <div>
            <h3 className="font-bold mb-1">GST Note</h3>
            <p>{quote.gstNote}</p>
          </div>
          <div>
            <h3 className="font-bold mb-1">Terms & Conditions</h3>
            <p className="whitespace-pre-wrap">{quote.terms}</p>
          </div>
        </div>

        <footer className="text-center text-sm mt-6 py-4">Copyright 2025 Amaz Modular Interior All Rights Reserved</footer>
      </div>
    </div>
  );
};

export default QuotePage;