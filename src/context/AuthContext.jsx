import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Sync with MongoDB backend
                    // Note for User: This endpoint MUST exist on your backend

                    // V1.1.0 REQUEST: "Only for register it should post first then fetch"
                    // If we are on the register page, we SKIP this initial fetch to avoid race condition 404s.
                    // The Register component will manually call user.reload() / refreshUser() after the POST is successful.
                    if (window.location.pathname.includes('register')) {
                        console.log('Skipping auto-fetch on register page (waiting for POST)');
                        setUser({ ...firebaseUser }); // Set basic firebase user so loading false
                        return;
                    }

                    const { data } = await api.get('/user/me');
                    setUser(data);
                } catch (error) {
                    console.error('Failed to sync user with backend:', error);
                    // Do NOT logout immediately. Registration might be in progress (creating DB entry).
                    // Just set user to firebase info temporarily or null if strict.
                    // For a smooth UX, we can keep the firebase user logged in and try to refetch later.
                    // But to respect the "SINGLE SOURCE" rule, maybe allow a grace period?
                    // Let's just NOT sign out here. Register.jsx will handle the specific sync/redirect.
                    setUser({ ...firebaseUser }); // Fallback to firebase data so UI doesn't flicker "Logged out"
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        }
    };

    // Manual refetch function (useful after profile updates)
    const refreshUser = async () => {
        if (auth.currentUser) {
            try {
                const { data } = await api.get('/user/me');
                setUser(data);
            } catch (error) {
                console.error('Refetch failed', error);
            }
        }
    };

    const authInfo = {
        user,
        loading,
        logout,
        refreshUser
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
