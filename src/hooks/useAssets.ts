import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Asset {
  id: string;
  name: string;
  assetNumber: string;
  category: string;
  categoryId?: string;
  location: {
    id: string;
    name: string;
    code: string;
    type: string;
    country: string;
    city: string;
  } | null;
  locationId?: string;
  status: string;
  statusId?: string;
  value: number;
  purchasePrice?: number;
  purchaseDate?: string;
  currentValue?: number;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAssetData {
  name: string;
  category: string;
  location_id: string;
  purchase_price: number;
  purchase_date: string;
  status?: string;
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('assets')
        .select(`
          *,
          asset_categories(name),
          asset_statuses(name)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Map the data to the expected format
      const mappedAssets: Asset[] = (data || []).map((asset: any) => ({
        id: asset.id,
        name: asset.name,
        assetNumber: asset.asset_number || asset.id,
        category: asset.category || asset.asset_categories?.name || 'Unknown',
        categoryId: asset.category_id,
        location: asset.location_id ? {
          id: asset.location_id,
          name: 'Location', // Will be populated when we join with locations
          code: '',
          type: '',
          country: '',
          city: '',
        } : null,
        locationId: asset.location_id,
        status: asset.status || asset.asset_statuses?.name || 'Unknown',
        statusId: asset.status_id,
        value: asset.current_value || asset.purchase_price || 0,
        purchasePrice: asset.purchase_price,
        purchaseDate: asset.purchase_date,
        currentValue: asset.current_value,
        serialNumber: asset.serial_number,
        model: asset.model,
        manufacturer: asset.manufacturer,
        createdAt: asset.created_at,
        updatedAt: asset.updated_at,
      }));

      setAssets(mappedAssets);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError(err as Error);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const createAsset = async (assetData: CreateAssetData) => {
    try {
      const { data, error: createError } = await supabase
        .from('assets')
        .insert([{
          name: assetData.name,
          category: assetData.category,
          location_id: assetData.location_id,
          purchase_price: assetData.purchase_price,
          purchase_date: assetData.purchase_date,
          current_value: assetData.purchase_price, // Initially same as purchase price
          status: assetData.status || 'Available',
        }])
        .select()
        .single();

      if (createError) throw createError;

      toast.success('Asset created successfully!');
      await fetchAssets(); // Refresh the list
      return { data, error: null };
    } catch (err: any) {
      console.error('Error creating asset:', err);
      toast.error(err.message || 'Failed to create asset');
      return { data: null, error: err };
    }
  };

  const updateAsset = async (id: string, updates: Partial<CreateAssetData>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast.success('Asset updated successfully!');
      await fetchAssets(); // Refresh the list
      return { data, error: null };
    } catch (err: any) {
      console.error('Error updating asset:', err);
      toast.error(err.message || 'Failed to update asset');
      return { data: null, error: err };
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast.success('Asset deleted successfully!');
      await fetchAssets(); // Refresh the list
      return { error: null };
    } catch (err: any) {
      console.error('Error deleting asset:', err);
      toast.error(err.message || 'Failed to delete asset');
      return { error: err };
    }
  };

  return {
    assets,
    loading,
    error,
    fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
  };
}
