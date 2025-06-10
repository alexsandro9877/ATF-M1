
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

 function setToken(data: TokenDataResponse) {
  token = data;
}

 function getToken(): TokenDataResponse | null {
  return token;
}

 function getAccessToken(): string | null {
  return token?.access_token || null;
}

 function getRefreshToken(): string | null {
  return token?.refresh_token || null;
}

export{
setToken,getToken,getAccessToken,getRefreshToken
}