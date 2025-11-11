export interface AuthState {
  userId?: string;
  email?: string;
  accessToken?: string;
  isLoading?: boolean;
  error?: string | null;
}
