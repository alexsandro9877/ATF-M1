
export type TokenDataResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  created_at: number;
  user_id: number;
  refresh_token: string;
};


let token: TokenDataResponse | null = null;

export function setToken(data: TokenDataResponse) {
  token = data;
}

export function getToken(): TokenDataResponse | null {
  return token;
}

export function getAccessToken(): string | null {
  return token?.access_token || null;
}

export function getRefreshToken(): string | null {
  return token?.refresh_token || null;
}
