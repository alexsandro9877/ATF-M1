export interface UsersResponse {
  result: {
    users: FirebaseUser[];
  };
}

export interface FirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  disabled: boolean;
  photoURL?: string;
  metadata: UserMetadata;
  passwordHash: string;
  passwordSalt: string;
  tokensValidAfterTime: string;
  providerData: ProviderData[];
  customClaims?: Record<string, any>;
}

export interface UserMetadata {
  lastSignInTime: string;
  creationTime: string;
  lastRefreshTime: string;
}

export interface ProviderData {
  uid: string;
  email: string;
  providerId: string;
  photoURL?: string;
}
