import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const createOrUpdateUser = useMutation(api.modules.users.users.createOrUpdateUser);
  const createOrUpdateAdmin = useMutation(api.modules.auth.admins.createOrUpdateAdmin);
  const createOrUpdateDelivery = useMutation(api.modules.delivery.deliveryPersonnel.createOrUpdateDelivery);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        let role = 'user';
        if (user.email === 'admin@test.com') {
          role = 'admin';
        } else if (user.email === 'delivery@test.com') {
          role = 'delivery';
        }
        setUserRole(role);

        try {
          if (role === 'admin') {
            await createOrUpdateAdmin({
              firebaseUid: user.uid,
              email: user.email,
              name: user.displayName || 'Admin User',
              role: 'admin',
              permissions: ['all'],
            });
          } else if (role === 'delivery') {
            await createOrUpdateDelivery({
              firebaseUid: user.uid,
              email: user.email,
              name: user.displayName || 'Delivery Person',
              phone: user.phoneNumber || '',
              role: 'delivery',
              isAvailable: true,
            });
          } else {
            await createOrUpdateUser({
              firebaseUid: user.uid,
              email: user.email,
              name: user.displayName || 'User',
              phone: user.phoneNumber || '',
              role: 'user',
            });
          }
        } catch (error) {
          console.warn('Convex sync failed (will retry):', error.message);
        }
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [createOrUpdateUser, createOrUpdateAdmin, createOrUpdateDelivery]);

  const signIn = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email, password, userData = {}) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    if (userData.name && result.user) {
      await updateProfile(result.user, {
        displayName: userData.name
      });
    }

    try {
      await createOrUpdateUser({
        firebaseUid: result.user.uid,
        email: result.user.email,
        name: userData.name || '',
        phone: userData.phone || '',
        role: 'user',
      });
    } catch (error) {
      console.warn('Convex sync failed (user created in Firebase):', error.message);
    }

    return result;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserRole(null);
  };

  const value = {
    currentUser,
    userRole,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
