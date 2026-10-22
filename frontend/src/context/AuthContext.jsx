import { createContext, useContext, useState, useEffect } from 'react';
import api, { ApiError } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session from localStorage on initial mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to restore authentication session from localStorage:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Authenticate user against backend POST /api/auth/login
   * Backend returns { _id, name, email, role, token }
   */
  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });

    if (!data || !data.token) {
      throw new ApiError('Invalid response from authentication server', 500, data);
    }

    const { token: receivedToken, ...userData } = data;

    // Persist session tokens and user metadata (passwords are never saved or retained)
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(receivedToken);
    setUser(userData);

    return userData;
  };

  /**
   * Clear session and reset auth state
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  /**
   * Helper to update user state if profile is edited
   */
  const updateUser = (updatedData) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
