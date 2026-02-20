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
      }

      return { access_token: data.session?.access_token };
    } catch (error: any) {
      console.error('Login Error:', error);
      throw { response: { data: { detail: error.message || 'Invalid credentials' } } };
    }
  },

  async signup(credentials: SignupCredentials): Promise<any> {
    try {
      console.log('Starting signup process...', { email: credentials.email });
      
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.first_name,
            last_name: credentials.last_name,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error from Supabase:', error);
        throw error;
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        console.log('Email confirmation required');
        // Email confirmation required
        return { 
          access_token: null, 
          requiresEmailConfirmation: true,
          message: 'Please check your email to confirm your account'
        };
      }

      if (data.session) {
        console.log('Session created, storing token');
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('userName', `${credentials.first_name} ${credentials.last_name}`);
      }

      return { 
        access_token: data.session?.access_token,
        requiresEmailConfirmation: false
      };
    } catch (error: any) {
      console.error('Signup Error Details:', {
        message: error.message,
        status: error.status,
        error: error
      });
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
      await supabase.auth.signOut();
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  }
};
