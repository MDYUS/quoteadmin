
import { WARNING_SOUND_URL } from './constants';

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

// Gets the dimensions of an image from its data URL.
export const getImageDimensions = (dataUrl: string): Promise<{width: number, height: number}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

// Singleton audio instance to manage state
let warningAudio: HTMLAudioElement | null = null;

export const playWarningSound = () => {
    // Safety check for environments without Audio support
    if (typeof Audio === 'undefined') return;

    try {
        if (!warningAudio) {
            warningAudio = new Audio(WARNING_SOUND_URL);
            warningAudio.loop = true; // Loop the audio
        }
        
        // Ensure warningAudio is not null before checking paused
        if (warningAudio && warningAudio.paused) {
            const playPromise = warningAudio.play();
            
            // In modern browsers, play() returns a promise. 
            // We catch errors to prevent unhandled promise rejections if user hasn't interacted with the document.
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Audio playback failed (usually due to lack of user interaction):", error);
                });
            }
        }
    } catch (error) {
        console.error("Failed to initialize audio:", error);
    }
};

export const stopWarningSound = () => {
    if (warningAudio) {
        try {
            warningAudio.pause();
            warningAudio.currentTime = 0; // Reset to the beginning
        } catch (e) {
            console.error("Error stopping audio:", e);
        }
    }
};

// Detect simple device name
export const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    let browser = "Unknown Browser";
    
    if (userAgent.match(/chrome|chromium|crios/i)) {
        browser = "Chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
        browser = "Firefox";
    } else if (userAgent.match(/safari/i)) {
        browser = "Safari";
    } else if (userAgent.match(/opr\//i)) {
        browser = "Opera";
    } else if (userAgent.match(/edg/i)) {
        browser = "Edge";
    } else if (userAgent.match(/android/i)) {
        browser = "Android Web";
    } else if (userAgent.match(/iphone/i)) {
        browser = "iPhone Web";
    }

    const platform = navigator.platform ? ` on ${navigator.platform}` : '';
    return `${browser}${platform}`;
};
