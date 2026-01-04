import axios from 'axios'
import { useAuthStore } from '@/store/auth'

export default defineNuxtPlugin(() => {
    const { isAuth } = storeToRefs(useAuthStore())

    const instance = axios.create({
        baseURL: 'http://localhost:3001',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    instance.interceptors.response.use(
        response => response,
        error => {
            if (error.response?.status === 401) {
                isAuth.value = false
            }
            return Promise.reject(error)
        },
    )
    return {
        provide: {
            axios: instance,
        },
    }
})
