import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/axios';
// Firebase Identity Protocol Integration
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('customer')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const { data } = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${idToken}` }
          });
          localStorage.setItem('customerToken', idToken);
          localStorage.setItem('customer', JSON.stringify(data.customer));
          setCustomer(data.customer);
        } catch (error) {
          console.error('Session restoration failed:', error);
          logout();
        }
      } else {
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customer');
        setCustomer(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();
      
      const { data } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      localStorage.setItem('customerToken', idToken);
      localStorage.setItem('customer', JSON.stringify(data.customer));
      setCustomer(data.customer);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import('firebase/auth');
      let idToken;
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        idToken = await result.user.getIdToken();
      } catch (fbError) {
        if (fbError.code === 'auth/email-already-in-use') {
          // If the account already exists in Firebase, just log them in
          const result = await signInWithEmailAndPassword(auth, email, password);
          idToken = await result.user.getIdToken();
        } else {
          throw fbError;
        }
      }
      
      // Hit the register endpoint to sync the extra details (name, phone)
      const { data } = await api.post('/auth/register', { name, phone }, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      
      localStorage.setItem('customerToken', idToken);
      localStorage.setItem('customer', JSON.stringify(data.customer));
      setCustomer(data.customer);
      return data;
    } catch (error) {
      console.error('Registration Failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      console.log('✅ Firebase login successful, syncing with backend...');
      const { data } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      
      localStorage.setItem('customerToken', idToken);
      localStorage.setItem('customer', JSON.stringify(data.customer));
      setCustomer(data.customer);
      return data;
    } catch (error) {
      console.error('❌ Backend Identity Sync Failed:', error.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customer');
    localStorage.removeItem('cart');
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ customer, login, register, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
