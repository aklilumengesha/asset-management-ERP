import { supabase } from '@/integrations/supabase/client';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface UserDetails {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<any> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (data.session) {
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('userEmail', credentials.email);
        
        // Log login activity
        await supabase.from('activity_logs').insert({
          user_id: data.user?.id,
          action: 'login',
          module: 'auth',
          description: 'User logged in successfully'
        });
      }

      return { access_token: data.session?.access_token };
    } catch (error: any) {
      console.error('Login Error:', error);
      throw { response: { data: { detail: error.message || 'Invalid credentials' } } };
    }
  },

  async signup(credentials: SignupCredentials, invitationToken?: string | null, invitationData?: any): Promise<any> {
    try {
      // Check if this is the first user
      const { data: profilesCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      
      const isFirst = (profilesCount as any)?.count === 0;
      
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.first_name,
            last_name: credentials.last_name,
            is_first_user: isFirst
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        throw error;
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation required
        return { 
          access_token: null, 
          requiresEmailConfirmation: true,
          message: 'Please check your email to confirm your account'
        };
      }

      // Create profile with role
      if (data.user) {
        let roleId;
        let departmentId = null;

        // Determine role based on invitation or first user
        if (invitationData && invitationToken) {
          roleId = invitationData.role_id || invitationData.role?.id;
          departmentId = invitationData.department_id || invitationData.department?.id || null;
        } else {
          // Get role ID for first user (super_admin) or regular user (employee)
          const { data: roles, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('name', isFirst ? 'super_admin' : 'employee')
            .single();
          
          if (roleError) {
            throw roleError;
          }
          
          roleId = roles?.id;
        }

        if (roleId) {
          // Create profile
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            email: credentials.email,
            first_name: credentials.first_name,
            last_name: credentials.last_name,
            role_id: roleId,
            department_id: departmentId,
            is_active: true
          });

          if (profileError) {
            throw profileError;
          }
        } else {
          throw new Error('Failed to determine user role');
        }
      }

      if (data.session) {
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('userName', `${credentials.first_name} ${credentials.last_name}`);
      }

      return { 
        access_token: data.session?.access_token,
        requiresEmailConfirmation: false,
        isFirstUser: isFirst
      };
    } catch (error: any) {
      console.error('Signup Error:', error);
      throw { response: { data: { detail: error.message || 'Failed to create account' } } };
    }
  },
  
  async getUserDetails(): Promise<UserDetails> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw error;
      if (!user) throw new Error('No user found');

      return {
        id: user.id,
        email: user.email || '',
        first_name: user.user_metadata?.first_name || 'User',
        last_name: user.user_metadata?.last_name || ''
      };
    } catch (error: any) {
      console.error('Get User Error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Log logout activity before signing out
      if (user) {
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          action: 'logout',
          module: 'auth',
          description: 'User logged out'
        });
      }
      
      await supabase.auth.signOut();
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  }
};
