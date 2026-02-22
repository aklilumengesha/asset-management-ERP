import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ConditionGrade {
  id: string;
  grade_code: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  affects_value: boolean;
  value_multiplier: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useConditionGrades() {
  const [grades, setGrades] = useState<ConditionGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('condition_grades')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      setGrades(data || []);
    } catch (err) {
      console.error('Error fetching condition grades:', err);
      setError(err as Error);
      
      // Fallback to hardcoded grades if database fetch fails
      setGrades([
        { id: '1', grade_code: 'A', name: 'Excellent (Like New)', description: 'Asset is in excellent condition with no visible wear', color: 'green', icon: 'Star', affects_value: true, value_multiplier: 1.00, is_active: true, display_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', grade_code: 'B', name: 'Good (Minor Wear)', description: 'Asset is in good condition with minor wear', color: 'blue', icon: 'ThumbsUp', affects_value: true, value_multiplier: 0.90, is_active: true, display_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '3', grade_code: 'C', name: 'Fair (Visible Wear)', description: 'Asset shows visible wear but functions properly', color: 'yellow', icon: 'AlertCircle', affects_value: true, value_multiplier: 0.75, is_active: true, display_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '4', grade_code: 'D', name: 'Poor (Significant Wear)', description: 'Asset has significant wear and may have functional issues', color: 'orange', icon: 'AlertTriangle', affects_value: true, value_multiplier: 0.50, is_active: true, display_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '5', grade_code: 'E', name: 'Very Poor (Barely Functional)', description: 'Asset is barely functional with major issues', color: 'red', icon: 'XCircle', affects_value: true, value_multiplier: 0.25, is_active: true, display_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '6', grade_code: 'F', name: 'Non-functional', description: 'Asset is not functional and requires repair or replacement', color: 'gray', icon: 'Ban', affects_value: true, value_multiplier: 0.00, is_active: true, display_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    grades,
    loading,
    error,
    refetch: fetchGrades
  };
}
