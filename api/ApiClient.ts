import axios from "axios"

export const API_URL="https://api-ecommerce-5aby.onrender.com"

let onUnauthorized: (() => void) | null = null

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
    onUnauthorized = handler
}

export const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 15000
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        const url: string = error.config?.url ?? ""
        const isLogin = url.includes("/auth/login")
        if (status === 401 && !isLogin) {
            console.log("INTERCEPTOR: 401 detectado, cerrando sesion")
            onUnauthorized?.()
        }
        return Promise.reject(error)
    }
)