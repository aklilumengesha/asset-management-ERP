import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CurrencyCode {
  id: string;
  code: string;
  name: string;
  symbol: string | null;
  numericCode: string | null;
  decimalPlaces: number;
  countries: string[] | null;
  isActive: boolean;
  displayOrder: number;
}

const FALLBACK_CURRENCIES: CurrencyCode[] = [
  { id: 'fallback-1', code: 'USD', name: 'US Dollar', symbol: '$', numericCode: '840', decimalPlaces: 2, countries: ['US'], isActive: true, displayOrder: 1 },
  { id: 'fallback-2', code: 'EUR', name: 'Euro', symbol: '€', numericCode: '978', decimalPlaces: 2, countries: ['DE', 'FR', 'IT', 'ES'], isActive: true, displayOrder: 2 },
  { id: 'fallback-3', code: 'GBP', name: 'British Pound Sterling', symbol: '£', numericCode: '826', decimalPlaces: 2, countries: ['UK'], isActive: true, displayOrder: 3 },
  { id: 'fallback-4', code: 'JPY', name: 'Japanese Yen', symbol: '¥', numericCode: '392', decimalPlaces: 0, countries: ['JP'], isActive: true, displayOrder: 4 },
  { id: 'fallback-5', code: 'CNY', name: 'Chinese Yuan', symbol: '¥', numericCode: '156', decimalPlaces: 2, countries: ['CN'], isActive: true, displayOrder: 5 },
  { id: 'fallback-6', code: 'AUD', name: 'Australian Dollar', symbol: 'A$', numericCode: '036', decimalPlaces: 2, countries: ['AU'], isActive: true, displayOrder: 6 },
  { id: 'fallback-7', code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', numericCode: '124', decimalPlaces: 2, countries: ['CA'], isActive: true, displayOrder: 7 },
  { id: 'fallback-8', code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', numericCode: '230', decimalPlaces: 2, countries: ['ET'], isActive: true, displayOrder: 10 },
  { id: 'fallback-9', code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', numericCode: '404', decimalPlaces: 2, countries: ['KE'], isActive: true, displayOrder: 11 },
  { id: 'fallback-10', code: 'ZAR', name: 'South African Rand', symbol: 'R', numericCode: '710', decimalPlaces: 2, countries: ['ZA'], isActive: true, displayOrder: 12 },
  { id: 'fallback-11', code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', numericCode: '784', decimalPlaces: 2, countries: ['AE'], isActive: true, displayOrder: 13 },
];

export function useCurrencyCodes() {
  const [currencies, setCurrencies] = useState<CurrencyCode[]>(FALLBACK_CURRENCIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('currency_codes')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const transformedData: CurrencyCode[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          symbol: item.symbol,
          numericCode: item.numeric_code,
          decimalPlaces: item.decimal_places,
          countries: item.countries,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));
        setCurrencies(transformedData);
      } else {
        setCurrencies(FALLBACK_CURRENCIES);
      }
    } catch (err) {
      console.error('Error fetching currency codes:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch currency codes'));
      setCurrencies(FALLBACK_CURRENCIES);
    } finally {
      setLoading(false);
    }
  };

  const getCurrencyByCode = (code: string): CurrencyCode | undefined => {
    return currencies.find(currency => currency.code === code);
  };

  const getCurrencyById = (id: string): CurrencyCode | undefined => {
    return currencies.find(currency => currency.id === id);
  };

  const getCurrenciesByCountry = (countryCode: string): CurrencyCode[] => {
    return currencies.filter(currency => 
      currency.countries?.includes(countryCode)
    );
  };

  const formatAmount = (amount: number, currencyCode: string): string => {
    const currency = getCurrencyByCode(currencyCode);
    if (!currency) return amount.toFixed(2);

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces,
    }).format(amount);
  };

  // Convert to Option format for Select components
  const getCurrenciesAsOptions = () => {
    return currencies.map(currency => ({
      value: currency.code,
      label: `${currency.name} (${currency.code})`
    }));
  };

  // Get currency codes only (for type unions)
  const getCurrencyCodes = (): string[] => {
    return currencies.map(c => c.code);
  };

  return {
    currencies,
    loading,
    error,
    refetch: fetchCurrencies,
    getCurrencyByCode,
    getCurrencyById,
    getCurrenciesByCountry,
    formatAmount,
    getCurrenciesAsOptions,
    getCurrencyCodes,
  };
}
