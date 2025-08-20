import { createContext, ReactNode } from 'react';

export type User = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  [key: string]: any; // Allow for additional Cognito user attributes
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: Error | null;
};

export type AuthContextType = AuthState & {
  refreshAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export type AuthProviderProps = {
  children: ReactNode;
  initialAuthState?: Partial<AuthState>;
};
