let token = null;
function setToken(data) {
    token = data;
}
function getToken() {
    return token;
}
function getAccessToken() {
    return token?.access_token || null;
}
function getRefreshToken() {
    return token?.refresh_token || null;
}
export { setToken, getToken, getAccessToken, getRefreshToken };
