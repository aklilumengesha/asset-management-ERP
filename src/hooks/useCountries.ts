import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Country {
  id: string;
  code: string;
  name: string;
  officialName: string | null;
  region: string | null;
  subregion: string | null;
  currencyCode: string | null;
  phoneCode: string | null;
  isActive: boolean;
  displayOrder: number;
}

const FALLBACK_COUNTRIES: Country[] = [
  { id: 'fallback-1', code: 'US', name: 'United States', officialName: 'United States of America', region: 'Americas', subregion: 'Northern America', currencyCode: 'USD', phoneCode: '+1', isActive: true, displayOrder: 1 },
  { id: 'fallback-2', code: 'CA', name: 'Canada', officialName: 'Canada', region: 'Americas', subregion: 'Northern America', currencyCode: 'CAD', phoneCode: '+1', isActive: true, displayOrder: 2 },
  { id: 'fallback-3', code: 'UK', name: 'United Kingdom', officialName: 'United Kingdom of Great Britain and Northern Ireland', region: 'Europe', subregion: 'Northern Europe', currencyCode: 'GBP', phoneCode: '+44', isActive: true, displayOrder: 3 },
  { id: 'fallback-4', code: 'AU', name: 'Australia', officialName: 'Commonwealth of Australia', region: 'Oceania', subregion: 'Australia and New Zealand', currencyCode: 'AUD', phoneCode: '+61', isActive: true, displayOrder: 4 },
  { id: 'fallback-5', code: 'ET', name: 'Ethiopia', officialName: 'Federal Democratic Republic of Ethiopia', region: 'Africa', subregion: 'Eastern Africa', currencyCode: 'ETB', phoneCode: '+251', isActive: true, displayOrder: 5 },
];

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>(FALLBACK_COUNTRIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('countries')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const transformedData: Country[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          officialName: item.official_name,
          region: item.region,
          subregion: item.subregion,
          currencyCode: item.currency_code,
          phoneCode: item.phone_code,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));
        setCountries(transformedData);
      } else {
        setCountries(FALLBACK_COUNTRIES);
      }
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
      setCountries(FALLBACK_COUNTRIES);
    } finally {
      setLoading(false);
    }
  };

  const getCountryByCode = (code: string): Country | undefined => {
    return countries.find(country => country.code === code);
  };

  const getCountryById = (id: string): Country | undefined => {
    return countries.find(country => country.id === id);
  };

  const getCountriesByRegion = (region: string): Country[] => {
    return countries.filter(country => country.region === region);
  };

  // Convert to Option format for Select components
  const getCountriesAsOptions = () => {
    return countries.map(country => ({
      value: country.code,
      label: country.name
    }));
  };

  return {
    countries,
    loading,
    error,
    refetch: fetchCountries,
    getCountryByCode,
    getCountryById,
    getCountriesByRegion,
    getCountriesAsOptions,
  };
}
