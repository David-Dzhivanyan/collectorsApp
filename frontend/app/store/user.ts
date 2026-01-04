import { useAuthStore } from '@/store/auth'

export type User = {
    email: string
    firstName: string
    id: number
    lastName: string
    password: string
    phone: string
    username: string
}

export const useUserStore = defineStore('user', () => {
    const currentUser = ref<User | null>(null)

    const getProfile = async () => {
        const { $axios } = useNuxtApp()
        const { isAuth } = storeToRefs(useAuthStore())

        const { data: user } = await $axios.get<User>('/user')
        if (user) {
            isAuth.value = true
            currentUser.value = user
        }
    }

    return {
        currentUser,
        getProfile,
    }
})
