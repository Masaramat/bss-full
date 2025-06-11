import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string): boolean => {
    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        if (!exp) {
            return true;
        }
        return Date.now() >= exp * 1000;
    } catch (error) {
        return true;
    }
};
