"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, UserRole } from "../models/types";
import * as localStorageService from "../utils/localStorage";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (email: string, password: string, role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize sample data for development
    localStorageService.initializeData();

    // Check if user is already logged in
    const currentUser = localStorageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const register = async (email: string, password: string, role: UserRole) => {
    try {
      setError(null);

      // Check if user already exists
      const existingUser = localStorageService.getUserByEmail(email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // In a real app, we would hash the password
      // For the MVP with localStorage, we're just storing the email
      // In a real implementation, don't store passwords in localStorage
      const newUser = localStorageService.createUser({ email, role });
      localStorageService.setCurrentUser(newUser.id);
      setUser(newUser);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration"
      );
      throw err;
    }
  };

  const login = async (email: string) => {
    try {
      setError(null);

      // Find user by email
      const user = localStorageService.getUserByEmail(email);
      if (!user) {
        throw new Error("Invalid email or password");
      }

      // In a real app, we would verify the password hash
      // For the MVP, we're just checking if the user exists

      localStorageService.setCurrentUser(user.id);
      setUser(user);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
      throw err;
    }
  };

  const logout = () => {
    localStorageService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
