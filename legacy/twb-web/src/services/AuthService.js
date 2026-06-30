import cryptoJs from "crypto-js";
import { authenticate } from "../store/AppSlice";
import { store } from "../store/Index";
import { http } from "./HttpService";

export async function register(user) {
    const response = await http().post("/auth/register", user);
    if (response.status === 201) {
        setToken(response.data);
    }

    return response;
}

export async function registerVendor(user) {
    const response = await http().post("/auth/register-vendor", user);
    if (response.status === 201) {
        setToken(response.data);
    }

    return response;
}

export async function login(user) {
    const response = await http().post("/auth/login", user);
    if (response.status === 200) {
        setToken(response.data);
    }

    return response;
}

export function setToken(data) {
    const tokenData = {
        token: data.token,
        user: data.user,
    };
    var token = cryptoJs.AES.encrypt(
        JSON.stringify(tokenData),
        process.env.REACT_APP_CRYPTO_JS_KEY
    ).toString();

    localStorage.setItem("tamil-wedding-book", token);
    store.dispatch(authenticate(data.user));
}

export function isLoggedIn() {
    const token = localStorage.getItem("tamil-wedding-book");
    return token !== null;
}

export async function logout() {
    localStorage.removeItem("tamil-wedding-book");
    store.dispatch(authenticate({}));
}

export function getAccessToken() {
    const token = localStorage.getItem("tamil-wedding-book");
    if (!token) {
        return null;
    }

    let decryptedToken = cryptoJs.AES.decrypt(
        token,
        process.env.REACT_APP_CRYPTO_JS_KEY
    );
    let tokenData = JSON.parse(decryptedToken.toString(cryptoJs.enc.Utf8));

    return tokenData.token;
}

export function getUserId() {
    const token = localStorage.getItem("tamil-wedding-book");
    if (!token) {
        return null;
    }

    let decryptedToken = cryptoJs.AES.decrypt(
        token,
        process.env.REACT_APP_CRYPTO_JS_KEY
    );
    let tokenData = JSON.parse(decryptedToken.toString(cryptoJs.enc.Utf8));

    return tokenData.user.id;
}

export function getUserRole() {
    const token = localStorage.getItem("tamil-wedding-book");
    if (!token) {
        return null;
    }

    let decryptedToken = cryptoJs.AES.decrypt(
        token,
        process.env.REACT_APP_CRYPTO_JS_KEY
    );
    let tokenData = JSON.parse(decryptedToken.toString(cryptoJs.enc.Utf8));
    return tokenData.user.role;
}

export function getProfile() {
    return http().get("/auth/profile");
}

export function requestResetPassword(user) {
    return http().post("/auth/request-reset-password", user);
}

export function resendVerificationEmail() {
    return http().get("/auth/resend-verification-email");
}

export function verifyUser(hash) {
    return http().post("/auth/verify-user", hash);
}

export async function resetPassword(user) {
    const response = await http().post("auth/reset-password", user);
    if (response.status === 200) {
        setToken(response.data);
    }

    return response;
}

export function changePassword(user) {
    return http().post("/auth/change-password", user);
}
