import { CurrencyConfig } from '../types/invoice';

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: '$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
];

export const getCurrencySymbol = (code: string): string => {
  const match = CURRENCIES.find((c) => c.code === code);
  return match ? match.symbol : 'R';
};

export const formatCurrency = (amount: number, currencyCode: string = 'ZAR'): string => {
  const symbol = getCurrencySymbol(currencyCode);
  const formattedNumber = Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const space = symbol === 'R' || symbol === 'CHF' ? ' ' : '';
  return `${symbol}${space}${formattedNumber}`;
};

