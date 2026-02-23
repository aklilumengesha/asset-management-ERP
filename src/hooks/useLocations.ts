import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AssetLocation } from '@/types/asset';

export function useLocations() {
  const [locations, setLocations] = useState<AssetLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Note: Adjust the table name if your locations table has a different name
      // Common names: locations, company_locations, branches
      const { data, error: fetchError } = await supabase
        .from('locations')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      // Map the data to the expected format
      const mappedLocations: AssetLocation[] = (data || []).map((loc: any) => ({
        id: loc.id?.toString() || '',
        name: loc.name || '',
        code: loc.code || '',
        type: loc.type || loc.location_type || '',
        country: loc.country || '',
        city: loc.city || '',
        address: loc.address,
        status: loc.status,
      }));

      setLocations(mappedLocations);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError(err as Error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    locations,
    loading,
    error,
    refetch: fetchLocations,
  };
}
