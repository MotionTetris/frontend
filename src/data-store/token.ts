import { jwtDecode } from "jwt-decode";

/**
 * @returns empty string when there is no token in localStorage, otherwise returns nickname
 */
export function getUserNickname() {
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
 * @returns 0 when there is no token in localStorage, otherwise returns exp 
 */
export function getExpiresAt() {
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

export function removeToken() {
    localStorage.removeItem('token');
}

export function setToken(token: string) {
    localStorage.setItem('token', token);
}

export function getToken() {
    return localStorage.getItem('token');
}