import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          is_active,
          created_at,
          role:roles(name, display_name),
          department:departments(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers: User[] = (data || []).map((user: any) => ({
        id: user.id,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A',
        email: user.email,
        role: user.role?.display_name || 'Unknown',
        department: user.department?.name || null,
        status: user.is_active ? 'active' : 'inactive',
        createdAt: user.created_at
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId);

    if (!error) {
      // Log activity
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          action: 'update',
          module: 'users',
          entity_type: 'profile',
          entity_id: userId,
          description: `User status changed to ${isActive ? 'active' : 'inactive'}`
        });
      }
      fetchUsers();
    }

    if (error) throw error;
  };

  const deleteUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (!error) {
      // Log activity
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          action: 'delete',
          module: 'users',
          entity_type: 'profile',
          entity_id: userId,
          description: 'User deleted from system'
        });
      }
      fetchUsers();
    }

    if (error) throw error;
  };

  return {
    users,
    isLoading,
    error,
    updateUserStatus,
    deleteUser,
    refetch: fetchUsers
  };
}
