/**
 * AuthProvider — session management
 *
 * Uses sessionStorage (not localStorage) so each browser tab has its own
 * independent session. Two users can be logged in simultaneously in different
 * tabs without interfering with each other.
 *
 * Security:
 * - JWT tokens stored per-tab in sessionStorage
 * - Token validated against backend on mount and every 5 minutes
 * - Role-based routing enforced in ProtectedRoute
 * - Admin and customer pages are completely separate
 */
import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

export type UserRole = 'admin' | 'staff' | 'customer';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{
    success: boolean; message?: string; role?: UserRole; errorType?: string;
  }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{
    success: boolean; message?: string;
  }>;
  updateProfile: (fullName: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  updateUserEmailVerified: (verified: boolean) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isSaving: boolean;
  getToken: () => string | null;
  validateToken: () => Promise<boolean>;
  setAuthSession: (user: any, token: string) => void;
}

// API Base URL — uses VITE_API_URL in production, otherwise defaults to /api
let API = import.meta.env.VITE_API_URL || '/api';
if (API !== '/api' && !API.endsWith('/api')) {
  API = API.replace(/\/$/, '') + '/api';
}

// ── Session helpers (sessionStorage = per-tab isolation) ──────
const session = {
  get: (key: string) => sessionStorage.getItem(key),
  set: (key: string, value: string) => sessionStorage.setItem(key, value),
  remove: (key: string) => sessionStorage.removeItem(key),
  clear: () => { sessionStorage.removeItem('token'); sessionStorage.removeItem('user'); },
};

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (password.length < 6) errors.push('Password must be at least 6 characters');
  if (!/[A-Z]/.test(password)) errors.push('Must contain an uppercase letter');
  if (!/[0-9]/.test(password)) errors.push('Must contain a number');
  return { valid: errors.length === 0, errors };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const userRef = useRef<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getToken = useCallback((): string | null => session.get('token'), []);

  const updateUserEmailVerified = useCallback((verified: boolean) => {
    const u = userRef.current;
    if (u) {
      const updated = { ...u, emailVerified: verified };
      setUser(updated);
      userRef.current = updated;
      session.set('user', JSON.stringify(updated));
    }
  }, []);

  const setAuthSession = useCallback((userData: any, token: string) => {
    const formattedUser: User = {
      id: userData.id || userData.id,
      email: userData.email,
      name: userData.full_name || userData.name,
      role: userData.role as UserRole,
      phone: userData.phone,
      isActive: userData.is_active !== undefined ? userData.is_active : userData.isActive,
      emailVerified: userData.email_verified !== undefined ? userData.email_verified : userData.emailVerified,
      createdAt: userData.created_at || userData.createdAt,
    };
    session.set('token', token);
    session.set('user', JSON.stringify(formattedUser));
    setUser(formattedUser);
    userRef.current = formattedUser;
  }, []);

  // ── Validate JWT against backend ──────────────────────────
  const validateToken = useCallback(async (): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const d = await res.json();
        const userData: User = {
          id: d.id, email: d.email, name: d.full_name,
          role: d.role as UserRole, phone: d.phone,
          isActive: d.is_active, emailVerified: d.email_verified,
          createdAt: d.created_at,
        };
        setUser(userData);
        userRef.current = userData;
        session.set('user', JSON.stringify(userData));
        return true;
      }
      if (res.status === 401 || res.status === 403) {
        session.clear();
        setUser(null);
        userRef.current = null;
      }
      return false;
    } catch {
      return false;
    }
  }, [getToken]);

  // ── Restore session on mount ───────────────────────────────
  useEffect(() => {
    (async () => {
      const storedUser = session.get('user');
      const storedToken = session.get('token');
      if (storedUser && storedToken) {
        try {
          JSON.parse(storedUser);
          const valid = await validateToken();
          if (!valid) { setUser(null); userRef.current = null; }
        } catch {
          setUser(null); userRef.current = null;
        }
      } else {
        userRef.current = null;
      }
      setIsLoading(false);
    })();
  }, [validateToken]);

  // ── Periodic token re-validation (every 5 min) ─────────────
  useEffect(() => {
    if (user && getToken()) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(validateToken, 5 * 60 * 1000);
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [user, getToken, validateToken]);

  // ── Login ──────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password)
      return { success: false, message: 'Email and password are required', errorType: 'network' };
    if (!validateEmail(email))
      return { success: false, message: 'Please enter a valid email address', errorType: 'email' };

    setIsSaving(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const d = await res.json();
      if (res.ok) {
        const u: User = {
          id: d.user.id, email: d.user.email, name: d.user.full_name,
          role: d.user.role as UserRole, phone: d.user.phone,
          isActive: d.user.is_active, emailVerified: d.user.email_verified,
          createdAt: d.user.created_at,
        };
        setUser(u); userRef.current = u;
        session.set('user', JSON.stringify(u));
        session.set('token', d.token);
        return { success: true, role: u.role };
      }
      // Map error messages/codes to typed error types
      let errorType = 'network';
      let message = d.error || 'Login failed';
      const msg = d.message || '';
      const code = d.code || '';
      if (msg.includes('Email not found')) { errorType = 'email'; message = 'No account found with this email address'; }
      else if (msg.includes('Incorrect password')) { errorType = 'password'; message = 'Incorrect password. Please try again'; }
      else if (msg.includes('deactivated')) { errorType = 'deactivated'; message = 'This account has been deactivated'; }
      else if (code === 'EMAIL_NOT_VERIFIED' || msg.includes('not verified') || msg.includes('Email not verified')) {
        errorType = 'email_not_verified';
        message = 'Please verify your email before logging in.';
      }
      return { success: false, message, errorType };
    } catch {
      return { success: false, message: 'Network error. Check your connection and try again.', errorType: 'network' };
    } finally { setIsSaving(false); }
  }, []);

  // ── Register ───────────────────────────────────────────────
  const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
    if (!name || !email || !password) return { success: false, message: 'All fields are required' };
    if (!validateEmail(email)) return { success: false, message: 'Please enter a valid email address' };
    const pv = validatePassword(password);
    if (!pv.valid) return { success: false, message: pv.errors.join('. ') };

    setIsSaving(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, email, phone, password }),
      });
      const d = await res.json();
      if (res.ok) {
        // Clear any old session so the verification screen doesn't mistakenly use it
        session.clear();
        setUser(null);
        userRef.current = null;
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }

        // Save the unverified email for the verify screen in case they refresh the page
        sessionStorage.setItem('unverifiedEmail', email);

        // Do not set user or token yet; registration only initiates email verification.
        return { success: true, message: d.message || 'Registration successful. Please verify your email.' };
      }
      // Map status codes to clear messages
      if (res.status === 409) {
        return { success: false, message: 'An account with this email already exists. Try logging in instead.', errorType: 'email_exists' };
      }
      return { success: false, message: d.error || 'Registration failed. Please try again.' };
    } catch {
      return { success: false, message: 'Network error. Please try again.' };
    } finally { setIsSaving(false); }
  }, []);

  // ── Logout ─────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setIsSaving(true);
    try {
      const token = getToken();
      if (token) {
        await fetch(`${API}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      }
    } catch { /* ignore logout errors */ } finally {
      setUser(null); userRef.current = null;
      session.clear();
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      setIsSaving(false);
    }
  }, [getToken]);

  // ── Update profile ─────────────────────────────────────────
  const updateProfile = useCallback(async (fullName: string, phone?: string) => {
    if (!fullName) return { success: false, message: 'Full name is required' };
    setIsSaving(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/auth/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ fullName, phone }),
      });
      const d = await res.json();
      if (res.ok) {
        const updated: User = {
          id: d.user?.id ?? d.id, email: d.user?.email ?? d.email,
          name: d.user?.full_name ?? d.full_name ?? fullName,
          role: (d.user?.role ?? d.role) as UserRole,
          phone: d.user?.phone ?? d.phone ?? phone, isActive: d.user?.is_active ?? d.is_active,
        };
        setUser(updated); userRef.current = updated;
        session.set('user', JSON.stringify(updated));
        return { success: true, message: 'Profile updated successfully' };
      }
      return { success: false, message: d.error || d.message || 'Failed to update profile' };
    } catch { return { success: false, message: 'Network error' }; }
    finally { setIsSaving(false); }
  }, [getToken]);

  // ── Change password ────────────────────────────────────────
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!currentPassword || !newPassword) return { success: false, message: 'Both passwords are required' };
    if (currentPassword === newPassword) return { success: false, message: 'New password must be different' };
    const pv = validatePassword(newPassword);
    if (!pv.valid) return { success: false, message: pv.errors.join('. ') };

    setIsSaving(true);
    try {
      const token = getToken();
      const res = await fetch(`${API}/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const d = await res.json();
      return res.ok
        ? { success: true, message: 'Password updated successfully' }
        : { success: false, message: d.error || d.message || 'Failed to update password' };
    } catch { return { success: false, message: 'Network error' }; }
    finally { setIsSaving(false); }
  }, [getToken]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      updateProfile,
      changePassword,
      updateUserEmailVerified,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin' || user?.role === 'staff',
      isLoading,
      isSaving,
      getToken,
      validateToken,
      setAuthSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
