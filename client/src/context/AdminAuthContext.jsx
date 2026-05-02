import { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../lib/axios';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [shopkeeper, setShopkeeper] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shopkeeper')) || null;
    } catch {
      return null;
    }
  });

  const register = async (name, email, password, contact) => {
    const { data } = await adminApi.post('/admin/auth/register', { name, email, password, contact });
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('shopkeeper', JSON.stringify(data.shopkeeper));
    setShopkeeper(data.shopkeeper);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await adminApi.post('/admin/auth/login', { email, password });
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('shopkeeper', JSON.stringify(data.shopkeeper));
    setShopkeeper(data.shopkeeper);
    return data;
  };

  const googleLogin = async (token) => {
    const { data } = await adminApi.post('/admin/auth/google', { token });
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('shopkeeper', JSON.stringify(data.shopkeeper));
    setShopkeeper(data.shopkeeper);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('shopkeeper');
    setShopkeeper(null);
  };

  return (
    <AdminAuthContext.Provider value={{ shopkeeper, login, register, googleLogin, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
