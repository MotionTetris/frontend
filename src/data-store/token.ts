import { jwtDecode } from "jwt-decode";

/**
 * Get the current user's nickname from the token in local storage.
 * @returns empty string when there is no token in localStorage, otherwise returns nickname
 */
export function getUserNickname(): string {
    const token = localStorage.getItem('token');
    if (!token) {
        return '';
    }

    const tokenPayload = jwtDecode(token);
    if (!tokenPayload.sub) {
        return '';
    }

    return tokenPayload.sub;
}

/**
 * Get the token expiration time from local storage.
 * @returns 0 when there is no token in localStorage, otherwise returns exp 
 */
export function getExpiresAt(): number | undefined {
    const token = localStorage.getItem('token');
    if (!token) {
        return 0;
    }

    const tokenPayload = jwtDecode(token);
    if (!tokenPayload.exp) {
        return 0;
    }

    return tokenPayload.exp;
}

/**
 * Delete the token from local storage.
 */
export function removeToken(): void {
    localStorage.removeItem('token');
}

/**
 * Set the token for local storage.
 * @param token 
 */
export function setToken(token: string): void {
    localStorage.setItem('token', token);
}

/**
 * Get a token from local storage.
 * @returns {string | null} token
 */
export function getToken(): string | null {
    return localStorage.getItem('token');
}