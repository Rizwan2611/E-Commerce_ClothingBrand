import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('customer')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('customerToken', data.token);
    localStorage.setItem('customer', JSON.stringify(data.customer));
    setCustomer(data.customer);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('customerToken', data.token);
    localStorage.setItem('customer', JSON.stringify(data.customer));
    setCustomer(data.customer);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customer');
    // Clear cart too
    localStorage.removeItem('cart');
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ customer, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
