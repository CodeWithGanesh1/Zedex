import axios from "axios";

const BACKEND_URL = import.meta.env.PROD 
    ? "https://zedex-1.onrender.com" 
    : "";

const authApiInstance = axios.create({
    baseURL: `${BACKEND_URL}/api/auth/`,
    withCredentials: true,
})


export async function register({ email, contact, password, fullname, isSeller }) {

    const response = await authApiInstance.post("/register", {
        email,
        contact,
        password,
        fullname,
        isSeller
    })
    return response.data
}

export async function login({ email, password }) {
    const response = await authApiInstance.post("/login", {
        email, password
    })

    return response.data
}

export async function getMe() {
    const response = await authApiInstance.get("/me")

    return response.data
}