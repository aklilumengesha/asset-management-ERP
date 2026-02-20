import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

interface SignupCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

// Add this interface after your existing interfaces
interface UserDetails {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<any> {
    // Mock login - simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (credentials.email && credentials.password) {
          const mockToken = btoa(JSON.stringify({
            email: credentials.email,
            exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
          }));
          localStorage.setItem('token', mockToken);
          localStorage.setItem('userEmail', credentials.email);
          resolve({ access_token: mockToken });
        } else {
          reject({ response: { data: { detail: 'Invalid credentials' } } });
        }
      }, 500);
    });
  },

  async signup(credentials: SignupCredentials): Promise<any> {
    // Mock signup - simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple validation
        if (credentials.email && credentials.password && credentials.first_name && credentials.last_name) {
          const mockToken = btoa(JSON.stringify({
            email: credentials.email,
            first_name: credentials.first_name,
            last_name: credentials.last_name,
            exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
          }));
          localStorage.setItem('token', mockToken);
          localStorage.setItem('userEmail', credentials.email);
          localStorage.setItem('userName', `${credentials.first_name} ${credentials.last_name}`);
          resolve({ access_token: mockToken });
        } else {
          reject({ response: { data: { detail: 'All fields are required' } } });
        }
      }, 500);
    });
  },
  
  async getUserDetails(): Promise<UserDetails> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Mock user details from token
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const decoded = JSON.parse(atob(token));
          resolve({
            id: 1,
            email: decoded.email || localStorage.getItem('userEmail') || 'user@example.com',
            first_name: decoded.first_name || 'Demo',
            last_name: decoded.last_name || 'User'
          });
        } catch {
          resolve({
            id: 1,
            email: localStorage.getItem('userEmail') || 'user@example.com',
            first_name: 'Demo',
            last_name: 'User'
          });
        }
      }, 200);
    });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  }
};
