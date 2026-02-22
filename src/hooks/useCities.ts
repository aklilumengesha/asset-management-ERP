import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface City {
  id: string;
  countryId: string;
  name: string;
  stateProvince: string | null;
  latitude: number | null;
  longitude: number | null;
  population: number | null;
  isCapital: boolean;
  isActive: boolean;
  displayOrder: number;
}

const FALLBACK_CITIES: City[] = [
  // US Cities
  { id: 'fallback-1', countryId: 'US', name: 'New York', stateProvince: 'New York', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 1 },
  { id: 'fallback-2', countryId: 'US', name: 'Los Angeles', stateProvince: 'California', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 2 },
  { id: 'fallback-3', countryId: 'US', name: 'Chicago', stateProvince: 'Illinois', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 3 },
  { id: 'fallback-4', countryId: 'US', name: 'Houston', stateProvince: 'Texas', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 4 },
  { id: 'fallback-5', countryId: 'US', name: 'Phoenix', stateProvince: 'Arizona', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 5 },
  // CA Cities
  { id: 'fallback-6', countryId: 'CA', name: 'Toronto', stateProvince: 'Ontario', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 1 },
  { id: 'fallback-7', countryId: 'CA', name: 'Vancouver', stateProvince: 'British Columbia', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 2 },
  { id: 'fallback-8', countryId: 'CA', name: 'Montreal', stateProvince: 'Quebec', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 3 },
  { id: 'fallback-9', countryId: 'CA', name: 'Calgary', stateProvince: 'Alberta', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 4 },
  { id: 'fallback-10', countryId: 'CA', name: 'Ottawa', stateProvince: 'Ontario', latitude: null, longitude: null, population: null, isCapital: true, isActive: true, displayOrder: 5 },
  // UK Cities
  { id: 'fallback-11', countryId: 'UK', name: 'London', stateProvince: 'England', latitude: null, longitude: null, population: null, isCapital: true, isActive: true, displayOrder: 1 },
  { id: 'fallback-12', countryId: 'UK', name: 'Manchester', stateProvince: 'England', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 2 },
  { id: 'fallback-13', countryId: 'UK', name: 'Birmingham', stateProvince: 'England', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 3 },
  { id: 'fallback-14', countryId: 'UK', name: 'Liverpool', stateProvince: 'England', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 4 },
  { id: 'fallback-15', countryId: 'UK', name: 'Edinburgh', stateProvince: 'Scotland', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 5 },
  // AU Cities
  { id: 'fallback-16', countryId: 'AU', name: 'Sydney', stateProvince: 'New South Wales', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 1 },
  { id: 'fallback-17', countryId: 'AU', name: 'Melbourne', stateProvince: 'Victoria', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 2 },
  { id: 'fallback-18', countryId: 'AU', name: 'Brisbane', stateProvince: 'Queensland', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 3 },
  { id: 'fallback-19', countryId: 'AU', name: 'Perth', stateProvince: 'Western Australia', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 4 },
  { id: 'fallback-20', countryId: 'AU', name: 'Adelaide', stateProvince: 'South Australia', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 5 },
  // ET Cities
  { id: 'fallback-21', countryId: 'ET', name: 'Addis Ababa', stateProvince: 'Addis Ababa', latitude: null, longitude: null, population: null, isCapital: true, isActive: true, displayOrder: 1 },
  { id: 'fallback-22', countryId: 'ET', name: 'Dire Dawa', stateProvince: 'Dire Dawa', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 2 },
  { id: 'fallback-23', countryId: 'ET', name: 'Bahir Dar', stateProvince: 'Amhara', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 3 },
  { id: 'fallback-24', countryId: 'ET', name: 'Hawassa', stateProvince: 'Sidama', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 4 },
  { id: 'fallback-25', countryId: 'ET', name: 'Mekelle', stateProvince: 'Tigray', latitude: null, longitude: null, population: null, isCapital: false, isActive: true, displayOrder: 5 },
];

export function useCities(countryCode?: string) {
  const [cities, setCities] = useState<City[]>(FALLBACK_CITIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCities();
  }, [countryCode]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('cities')
        .select(`
          *,
          country:countries(code)
        `)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const transformedData: City[] = data.map((item: any) => ({
          id: item.id,
          countryId: item.country?.code || item.country_id,
          name: item.name,
          stateProvince: item.state_province,
          latitude: item.latitude,
          longitude: item.longitude,
          population: item.population,
          isCapital: item.is_capital,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));
        
        // Filter by country code if provided
        const filteredData = countryCode 
          ? transformedData.filter(city => city.countryId === countryCode)
          : transformedData;
        
        setCities(filteredData);
      } else {
        const fallbackData = countryCode 
          ? FALLBACK_CITIES.filter(city => city.countryId === countryCode)
          : FALLBACK_CITIES;
        setCities(fallbackData);
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch cities'));
      const fallbackData = countryCode 
        ? FALLBACK_CITIES.filter(city => city.countryId === countryCode)
        : FALLBACK_CITIES;
      setCities(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const getCitiesByCountry = (countryCodeOrId: string): City[] => {
    return cities.filter(city => 
      city.countryId === countryCodeOrId
    );
  };

  const getCityById = (id: string): City | undefined => {
    return cities.find(city => city.id === id);
  };

  const getCapitalCities = (): City[] => {
    return cities.filter(city => city.isCapital);
  };

  // Convert to Option format for Select components
  const getCitiesAsOptions = (countryCodeFilter?: string) => {
    const filteredCities = countryCodeFilter 
      ? cities.filter(city => city.countryId === countryCodeFilter)
      : cities;
    
    return filteredCities.map(city => ({
      value: city.name,
      label: city.name
    }));
  };

  return {
    cities,
    loading,
    error,
    refetch: fetchCities,
    getCitiesByCountry,
    getCityById,
    getCapitalCities,
    getCitiesAsOptions,
  };
}
