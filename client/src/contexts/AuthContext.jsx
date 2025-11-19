import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { firebaseAuth } from '../config/firebase-config';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


// Sign up with email and password
// Creates user in Firebase, then registers in backend
  async function signUp(email, password, name, role = 'user') {
    try {
      setError(null);
      
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      
      // Update Firebase profile with name
      await updateProfile(userCredential.user, { displayName: name });
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Register user in backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/auth/firebase-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ idToken, name, role })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      const data = await response.json();
      
      // Set the user role
      setUserRole(data.user.role);
      
      return data;
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message);
      throw err;
    }
  }

// Sign in with email and password
  async function signIn(email, password) {
    try {
      setError(null);
      
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Login to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/auth/firebase-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ idToken })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      
      // Set the user role 
      setUserRole(data.user.role);
      
      return data;
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message);
      throw err;
    }
  }


// Sign in with Google
// TODO: Enable this auth in Firebase console. (Not implemented)
  async function signInWithGoogle() {
    try {
      setError(null);
      
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(firebaseAuth, provider);
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Login to our backend (TODO: auto-create user if first time)
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/auth/firebase-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ idToken })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(err.message);
      throw err;
    }
  }


  // Sign out
  async function logout() {
    try {
      setError(null);
      
      // Call backend logout endpoint
      await fetch(`${import.meta.env.VITE_API_URL || ''}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      // Sign out from Firebase
      await signOut(firebaseAuth);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      throw err;
    }
  }

  // Get current Firebase ID token
  async function getIdToken() {
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  }

  // Fetch user data from backend
  async function getUserData() {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        return null;
      }

      const idToken = await user.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserRole(data.user.role);
      return data.user;
    } catch (err) {
      console.error('Get user data error:', err);
      return null;
    }
  }

  // Update user profile (name)
  async function updateUserProfile(name) {
    try {
      setError(null);
      
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Update Firebase profile
      await updateProfile(currentUser, { displayName: name });
      
      // Get Firebase ID token
      const idToken = await currentUser.getIdToken();
      
      // Update backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ idToken, name })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Profile update failed');
      }

      const data = await response.json();
      
      // Trigger a refresh of the current user
      await currentUser.reload();
      setCurrentUser({ ...currentUser });
      
      return data;
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message);
      throw err;
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user role from backend
        await getUserData();
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    getIdToken,
    updateUserProfile,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
