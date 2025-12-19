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
                    const { data } = await api.get('/user/me');
                    setUser(data);
                } catch (error) {
                    console.error('Failed to sync user with backend:', error);
                    // If backend sync fails but firebase auth is valid, we might want to logout or handle partially
                    // For safety, let's allow the firebase user but warn, OR logout. 
                    // Rule says: "MongoDB backend response is the SINGLE source of truth".
                    // So if we can't get MongoDB user, we technically shouldn't treat them as fully logged in.
                    // However, for registration flow, checking this might be complex. 
                    // Let's set user to null if backend sync fails to enforce the rule.
                    toast.error('Session sync failed. Please login again.');
                    await signOut(auth);
                    setUser(null);
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
