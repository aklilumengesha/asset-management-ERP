import { supabase } from '@/integrations/supabase/client';
import { useRole } from './useRole';

export function useInvitations() {
  const { profile } = useRole();

  const createInvitation = async (email: string, roleId: string, departmentId: string) => {
    // Generate a unique token
    const token = crypto.randomUUID();
    
    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data, error } = await supabase
      .from('invitations')
      .insert({
        email,
        role_id: roleId,
        department_id: departmentId || null,
        invited_by: profile?.id,
        token,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    return { data, error };
  };

  const getInvitationsByEmail = async (email: string) => {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('email', email)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    return { data, error };
  };

  const getInvitationByToken = async (token: string) => {
    const { data, error } = await supabase
      .from('invitations')
      .select(`
        *,
        role:roles(*),
        department:departments(*)
      `)
      .eq('token', token)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    return { data, error };
  };

  const acceptInvitation = async (token: string) => {
    const { data, error } = await supabase
      .from('invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('token', token)
      .select()
      .single();

    return { data, error };
  };

  return {
    createInvitation,
    getInvitationsByEmail,
    getInvitationByToken,
    acceptInvitation
  };
}
