// Currency conversion and localization utilities

interface CurrencyRates {
  [key: string]: number;
}

interface CurrencyInfo {
  symbol: string;
  name: string;
  code: string;
}

const CURRENCY_SYMBOLS: { [key: string]: CurrencyInfo } = {
  'GBP': { symbol: '£', name: 'British Pound', code: 'GBP' },
  'USD': { symbol: '$', name: 'US Dollar', code: 'USD' },
  'EUR': { symbol: '€', name: 'Euro', code: 'EUR' },
  'CAD': { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' },
  'AUD': { symbol: 'A$', name: 'Australian Dollar', code: 'AUD' },
  'JPY': { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
  'CHF': { symbol: 'CHF', name: 'Swiss Franc', code: 'CHF' },
  'SEK': { symbol: 'kr', name: 'Swedish Krona', code: 'SEK' },
  'NOK': { symbol: 'kr', name: 'Norwegian Krone', code: 'NOK' },
  'DKK': { symbol: 'kr', name: 'Danish Krone', code: 'DKK' }
};

// Base prices in GBP
const BASE_PRICES = {
  monthly: 4,
  yearly: 29,
  lifetime: 59.99
};

// Map country codes to currencies
const COUNTRY_CURRENCY_MAP: { [key: string]: string } = {
  'US': 'USD', 'United States': 'USD',
  'GB': 'GBP', 'United Kingdom': 'GBP',
  'CA': 'CAD', 'Canada': 'CAD',
  'AU': 'AUD', 'Australia': 'AUD',
  'DE': 'EUR', 'Germany': 'EUR',
  'FR': 'EUR', 'France': 'EUR',
  'IT': 'EUR', 'Italy': 'EUR',
  'ES': 'EUR', 'Spain': 'EUR',
  'NL': 'EUR', 'Netherlands': 'EUR',
  'BE': 'EUR', 'Belgium': 'EUR',
  'AT': 'EUR', 'Austria': 'EUR',
  'IE': 'EUR', 'Ireland': 'EUR',
  'FI': 'EUR', 'Finland': 'EUR',
  'PT': 'EUR', 'Portugal': 'EUR',
  'JP': 'JPY', 'Japan': 'JPY',
  'CH': 'CHF', 'Switzerland': 'CHF',
  'SE': 'SEK', 'Sweden': 'SEK',
  'NO': 'NOK', 'Norway': 'NOK',
  'DK': 'DKK', 'Denmark': 'DKK'
};

// Get user's location via IP (primary method)
async function getUserLocationByIP(): Promise<string> {
  try {
    // Try multiple IP geolocation services for reliability
    const services = [
      'https://ipapi.co/json/',
      'https://ip-api.com/json/',
      'https://freegeoip.app/json/'
    ];
    
    for (const service of services) {
      try {
        const response = await fetch(service);
        if (!response.ok) continue;
        
        const data = await response.json();
        
        // Handle different API response formats
        const countryCode = data.country_code || data.countryCode || data.country;
        const countryName = data.country_name || data.country;
        
        // Try country code first, then country name
        if (countryCode && COUNTRY_CURRENCY_MAP[countryCode]) {
          console.log(`Currency detected via IP: ${countryCode} -> ${COUNTRY_CURRENCY_MAP[countryCode]}`);
          return COUNTRY_CURRENCY_MAP[countryCode];
        }
        
        if (countryName && COUNTRY_CURRENCY_MAP[countryName]) {
          console.log(`Currency detected via IP: ${countryName} -> ${COUNTRY_CURRENCY_MAP[countryName]}`);
          return COUNTRY_CURRENCY_MAP[countryName];
        }
      } catch (error) {
        console.log(`Failed to fetch from ${service}:`, error);
        continue;
      }
    }
    
    throw new Error('All IP services failed');
  } catch (error) {
    console.log('IP-based location detection failed:', error);
    throw error;
  }
}

// Get user's currency from browser locale (fallback method)
function getUserCurrencyFromLocale(): string {
  try {
    const locale = navigator.language || 'en-GB';
    
    // Extract currency from locale
    if (locale.includes('-')) {
      const region = locale.split('-')[1];
      if (COUNTRY_CURRENCY_MAP[region]) {
        console.log(`Currency detected via locale: ${region} -> ${COUNTRY_CURRENCY_MAP[region]}`);
        return COUNTRY_CURRENCY_MAP[region];
      }
    }
    
    return 'GBP';
  } catch (error) {
    console.log('Locale-based currency detection failed:', error);
    return 'GBP';
  }
}

// Get user's currency (IP-based with locale fallback)
export async function getUserCurrency(): Promise<string> {
  try {
    // Try IP-based detection first (more accurate)
    return await getUserLocationByIP();
  } catch {
    // Fallback to browser locale detection
    console.log('Using locale fallback for currency detection');
    return getUserCurrencyFromLocale();
  }
}

// Get currency rates (you could replace this with a real API)
export async function getCurrencyRates(): Promise<CurrencyRates> {
  try {
    // In production, you'd use a real currency API like:
    // const response = await fetch('https://api.exchangerate-api.com/v4/latest/GBP');
    // const data = await response.json();
    // return data.rates;
    
    // For now, using approximate static rates (updated periodically)
    return {
      'GBP': 1.0,
      'USD': 1.27,
      'EUR': 1.17,
      'CAD': 1.71,
      'AUD': 1.93,
      'JPY': 188.5,
      'CHF': 1.13,
      'SEK': 13.8,
      'NOK': 13.6,
      'DKK': 8.7
    };
  } catch (error) {
    console.error('Failed to fetch currency rates:', error);
    // Return default rates
    return {
      'GBP': 1.0,
      'USD': 1.27,
      'EUR': 1.17,
      'CAD': 1.71,
      'AUD': 1.93,
      'JPY': 188.5,
      'CHF': 1.13,
      'SEK': 13.8,
      'NOK': 13.6,
      'DKK': 8.7
    };
  }
}

// Convert price from GBP to target currency
export function convertPrice(gbpPrice: number, targetCurrency: string, rates: CurrencyRates): number {
  if (targetCurrency === 'GBP') return gbpPrice;
  
  const rate = rates[targetCurrency];
  if (!rate) return gbpPrice;
  
  return gbpPrice * rate;
}

// Format price with currency symbol
export function formatPrice(price: number, currency: string): string {
  const currencyInfo = CURRENCY_SYMBOLS[currency];
  if (!currencyInfo) {
    return `£${price.toFixed(2)}`;
  }
  
  // Special formatting for JPY (no decimals)
  if (currency === 'JPY') {
    return `${currencyInfo.symbol}${Math.round(price)}`;
  }
  
  // Special formatting for currencies with symbol after amount
  if (currency === 'SEK' || currency === 'NOK' || currency === 'DKK') {
    return `${price.toFixed(2)} ${currencyInfo.symbol}`;
  }
  
  return `${currencyInfo.symbol}${price.toFixed(2)}`;
}

// Get localized prices for all plans
export async function getLocalizedPrices(currency?: string): Promise<{
  currency: string;
  monthly: string;
  yearly: string;
  lifetime: string;
  rates: CurrencyRates;
}> {
  // Resolve the target currency (handle both sync and async cases)
  const targetCurrency = currency || await getUserCurrency();
  const rates = await getCurrencyRates();
  
  const monthlyPrice = convertPrice(BASE_PRICES.monthly, targetCurrency, rates);
  const yearlyPrice = convertPrice(BASE_PRICES.yearly, targetCurrency, rates);
  const lifetimePrice = convertPrice(BASE_PRICES.lifetime, targetCurrency, rates);
  
  return {
    currency: targetCurrency,
    monthly: formatPrice(monthlyPrice, targetCurrency),
    yearly: formatPrice(yearlyPrice, targetCurrency),
    lifetime: formatPrice(lifetimePrice, targetCurrency),
    rates
  };
}
