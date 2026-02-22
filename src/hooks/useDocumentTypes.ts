import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DocumentType {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  fileExtensions: string[];
  maxFileSizeMb: number;
  isActive: boolean;
  displayOrder: number;
}

// Fallback data for offline scenarios
const FALLBACK_DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'fallback-1',
    code: 'INVOICE',
    name: 'Invoice',
    description: 'Purchase invoice or billing document',
    icon: 'file-text',
    fileExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    maxFileSizeMb: 10,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'fallback-2',
    code: 'RECEIPT',
    name: 'Receipt',
    description: 'Payment receipt or proof of purchase',
    icon: 'receipt',
    fileExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    maxFileSizeMb: 5,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'fallback-3',
    code: 'WARRANTY',
    name: 'Warranty',
    description: 'Warranty certificate or documentation',
    icon: 'shield-check',
    fileExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    maxFileSizeMb: 10,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'fallback-4',
    code: 'MANUAL',
    name: 'Manual',
    description: 'User manual or instruction guide',
    icon: 'book-open',
    fileExtensions: ['pdf', 'doc', 'docx'],
    maxFileSizeMb: 20,
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'fallback-5',
    code: 'CERTIFICATE',
    name: 'Certificate',
    description: 'Certification or compliance document',
    icon: 'award',
    fileExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    maxFileSizeMb: 10,
    isActive: true,
    displayOrder: 5,
  },
  {
    id: 'fallback-6',
    code: 'PURCHASE_ORDER',
    name: 'Purchase Order',
    description: 'Purchase order document',
    icon: 'shopping-cart',
    fileExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    maxFileSizeMb: 10,
    isActive: true,
    displayOrder: 6,
  },
  {
    id: 'fallback-7',
    code: 'SERVICE_REPORT',
    name: 'Service Report',
    description: 'Maintenance or service report',
    icon: 'clipboard-list',
    fileExtensions: ['pdf', 'doc', 'docx'],
    maxFileSizeMb: 15,
    isActive: true,
    displayOrder: 7,
  },
];

export function useDocumentTypes() {
  const [types, setTypes] = useState<DocumentType[]>(FALLBACK_DOCUMENT_TYPES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('document_types')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        // Transform snake_case to camelCase
        const transformedData: DocumentType[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          icon: item.icon,
          fileExtensions: item.file_extensions || [],
          maxFileSizeMb: item.max_file_size_mb,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));

        setTypes(transformedData);
      } else {
        // Use fallback if no data
        setTypes(FALLBACK_DOCUMENT_TYPES);
      }
    } catch (err) {
      console.error('Error fetching document types:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch document types'));
      // Keep fallback data on error
      setTypes(FALLBACK_DOCUMENT_TYPES);
    } finally {
      setLoading(false);
    }
  };

  return {
    types,
    loading,
    error,
    refetch: fetchDocumentTypes,
  };
}
