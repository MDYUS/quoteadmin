// Simple key converters for JS object <-> DB records

const toCamelCase = (s: string) => s.replace(/(_\w)/g, k => k[1].toUpperCase());
const toSnakeCase = (s: string) => s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const convertKeys = (obj: any, converter: (key: string) => string): any => {
    if (Array.isArray(obj)) {
        return obj.map(v => convertKeys(v, converter));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = converter(key);
            acc[newKey] = convertKeys(obj[key], converter);
            return acc;
        }, {} as any);
    }
    return obj;
};

export const toCamel = (obj: any) => convertKeys(obj, toCamelCase);
export const toSnake = (obj: any) => convertKeys(obj, toSnakeCase);

export const formatStatus = (status: string): string => {
  if (!status) return '';
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};


export const numberToWordsInLakhs = (num: number): string => {
    if (num === 0) return 'ZERO ONLY';
    const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const toWords = (n: number, suffix: string = ''): string => {
        if (n === 0) return '';
        let str = '';
        if (n > 19) {
            str = b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
        } else {
            str = a[n];
        }
        if (n > 0 && suffix) {
            str += ' ' + suffix;
        }
        return str.trim() + ' ';
    };

    let result = '';
    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const thousand = Math.floor(num / 1000);
    num %= 1000;
    const hundred = Math.floor(num / 100);
    num %= 100;

    if (crore > 0) result += toWords(crore, crore > 1 ? 'crores' : 'crore');
    if (lakh > 0) result += toWords(lakh, lakh > 1 ? 'lakhs' : 'lakh');
    if (thousand > 0) result += toWords(thousand, 'thousand');
    if (hundred > 0) result += toWords(hundred, 'hundred');
    
    if (result && num > 0) {
        result += 'and ';
    }
    if (num > 0) {
        result += toWords(num);
    }
    
    return (result.trim().toUpperCase() + ' ONLY').replace(/\s+/g, ' ');
};

// New function to fetch an image from a URL and convert it to a Base64 string.
// This is necessary for embedding images from URLs into PDFs with jsPDF.
export const imageUrlToBase64 = async (url: string): Promise<string> => {
  // A proxy might be needed if CORS issues arise with your image host.
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};