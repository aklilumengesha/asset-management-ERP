import { supabase } from '@/integrations/supabase/client';
import { ActivityModule, ActivityAction } from '@/types/activity';

export function useActivityLogger() {
  const logActivity = async (
    action: ActivityAction,
    module: ActivityModule,
    description: string,
    options?: {
      entityType?: string;
      entityId?: string;
      metadata?: Record<string, any>;
    }
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('Cannot log activity: No authenticated user');
        return null;
      }

      const { data, error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action,
          module,
          entity_type: options?.entityType,
          entity_id: options?.entityId,
          description,
          metadata: options?.metadata || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error logging activity:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Activity logging failed:', err);
      return null;
    }
  };

  return { logActivity };
}
