import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentTerm {
  id: string;
  code: string;
  name: string;
  description: string | null;
  days: number;
  isDefault: boolean;
  isActive: boolean;
  displayOrder: number;
}

// Fallback data for offline scenarios
const FALLBACK_PAYMENT_TERMS: PaymentTerm[] = [
  {
    id: 'fallback-1',
    code: 'NET_30',
    name: 'Net 30',
    description: 'Payment due within 30 days',
    days: 30,
    isDefault: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'fallback-2',
    code: 'NET_15',
    name: 'Net 15',
    description: 'Payment due within 15 days',
    days: 15,
    isDefault: false,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'fallback-3',
    code: 'NET_45',
    name: 'Net 45',
    description: 'Payment due within 45 days',
    days: 45,
    isDefault: false,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'fallback-4',
    code: 'NET_60',
    name: 'Net 60',
    description: 'Payment due within 60 days',
    days: 60,
    isDefault: false,
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'fallback-5',
    code: 'NET_90',
    name: 'Net 90',
    description: 'Payment due within 90 days',
    days: 90,
    isDefault: false,
    isActive: true,
    displayOrder: 5,
  },
  {
    id: 'fallback-6',
    code: 'DUE_ON_RECEIPT',
    name: 'Due on Receipt',
    description: 'Payment due immediately upon receipt',
    days: 0,
    isDefault: false,
    isActive: true,
    displayOrder: 6,
  },
  {
    id: 'fallback-7',
    code: 'COD',
    name: 'Cash on Delivery',
    description: 'Payment due upon delivery',
    days: 0,
    isDefault: false,
    isActive: true,
    displayOrder: 7,
  },
  {
    id: 'fallback-8',
    code: 'ADVANCE',
    name: 'Advance Payment',
    description: 'Full payment required in advance',
    days: 0,
    isDefault: false,
    isActive: true,
    displayOrder: 8,
  },
  {
    id: 'fallback-9',
    code: 'NET_30_EOM',
    name: 'Net 30 EOM',
    description: 'Payment due 30 days after end of month',
    days: 30,
    isDefault: false,
    isActive: true,
    displayOrder: 9,
  },
  {
    id: 'fallback-10',
    code: '2_10_NET_30',
    name: '2/10 Net 30',
    description: 'Discount 2% if paid within 10 days, otherwise net 30',
    days: 30,
    isDefault: false,
    isActive: true,
    displayOrder: 10,
  },
];

export function usePaymentTerms() {
  const [terms, setTerms] = useState<PaymentTerm[]>(FALLBACK_PAYMENT_TERMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPaymentTerms();
  }, []);

  const fetchPaymentTerms = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('payment_terms')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        // Transform snake_case to camelCase
        const transformedData: PaymentTerm[] = data.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          days: item.days,
          isDefault: item.is_default,
          isActive: item.is_active,
          displayOrder: item.display_order,
        }));

        setTerms(transformedData);
      } else {
        // Use fallback if no data
        setTerms(FALLBACK_PAYMENT_TERMS);
      }
    } catch (err) {
      console.error('Error fetching payment terms:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch payment terms'));
      // Keep fallback data on error
      setTerms(FALLBACK_PAYMENT_TERMS);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get term by code
  const getTermByCode = (code: string): PaymentTerm | undefined => {
    return terms.find(term => term.code === code);
  };

  // Helper function to get term by name
  const getTermByName = (name: string): PaymentTerm | undefined => {
    return terms.find(term => term.name === name);
  };

  // Helper function to get default term
  const getDefaultTerm = (): PaymentTerm | undefined => {
    return terms.find(term => term.isDefault);
  };

  // Helper function to calculate due date
  const calculateDueDate = (termCode: string, startDate: Date = new Date()): Date => {
    const term = getTermByCode(termCode);
    if (!term) return startDate;

    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + term.days);
    return dueDate;
  };

  return {
    terms,
    loading,
    error,
    refetch: fetchPaymentTerms,
    getTermByCode,
    getTermByName,
    getDefaultTerm,
    calculateDueDate,
  };
}
