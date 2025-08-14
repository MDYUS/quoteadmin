
import { QuoteData } from './types';

// Helper for non-area based items. Rate becomes the cost.
// (304.8mm * 304.8mm) is approx 1 sqft.
const unitWidth = 304.8;
const unitHeight = 304.8;

export const defaultQuoteData: QuoteData = {
  clientName: 'Client Name',
  siteLocation: 'Site Location',
  date: new Date().toISOString().split('T')[0],
  categories: [
    {
      title: 'KITCHEN',
      items: [
        { id: 'k1', description: 'BOTTOM CABINET', width: 2400, height: 850, bwpGrade: 'BWP', rate: 1850 },
        { id: 'k2', description: 'TOP CABINET', width: 2400, height: 700, bwpGrade: 'BWP', rate: 1750 },
        { id: 'k3', description: 'LOFT', width: 2400, height: 600, bwpGrade: 'MR', rate: 1050 },
      ],
    },
    {
      title: 'ACCESSORIES',
      items: [
        { id: 'a1', description: 'CUTLERY', width: unitWidth, height: unitHeight, bwpGrade: 'N/A', rate: 5500 },
        { id: 'a2', description: 'BOTTLE PULLOUT', width: unitWidth, height: unitHeight, bwpGrade: 'N/A', rate: 6500 },
      ],
    },
     {
      title: 'LIVING ROOM',
      items: [],
    },
    {
      title: 'TV UNIT',
      items: [
          { id: 'tv1', description: 'TV BACK PANEL', width: 1800, height: 1500, bwpGrade: 'MR', rate: 1450 },
      ],
    },
    {
      title: 'POOJA UNIT',
      items: [
        { id: 'p1', description: 'POOJA UNIT WITH DOOR', width: 900, height: 2100, bwpGrade: 'MR', rate: 1600 },
      ],
    },
    {
      title: 'BEDROOM 1',
      items: [
        { id: 'b1_1', description: 'WARDROBE', width: 2100, height: 2400, bwpGrade: 'MR', rate: 1550 },
        { id: 'b1_2', description: 'LOFT', width: 2100, height: 600, bwpGrade: 'MR', rate: 1050 },
      ],
    },
    {
      title: 'BEDROOM 2',
      items: [],
    },
    {
      title: 'BEDROOM 3',
      items: [],
    },
  ],
  warranty: 'All wood work comes with a 5-year warranty against manufacturing defects.',
  gstNote: 'GST at 18% will be charged extra on the grand total.',
  terms: '1. 50% advance to start the work.\n2. 40% after delivery of material to site.\n3. 10% on completion of work before handover.',
};
