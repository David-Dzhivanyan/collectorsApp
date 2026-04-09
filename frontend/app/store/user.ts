import { useAuthStore } from '@/store/auth'

export type User = {
    email: string
    firstName: string
    id: number
    lastName: string
    password: string
    phone: string
    username: string
    avatar?: string
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

    const getUsers = async (): Promise<User[]> => {
        const { $axios } = useNuxtApp()
        const { data } = await $axios.get<User[]>('/users')
        return data
    }

    const uploadAvatar = async (file: File): Promise<void> => {
        const { $axios } = useNuxtApp()
        const formData = new FormData()
        formData.append('file', file)
        const { data } = await $axios.post<User>('/users/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (currentUser.value) currentUser.value = data
    }

    const deleteAvatar = async (): Promise<void> => {
        const { $axios } = useNuxtApp()
        await $axios.delete('/users/avatar')
        if (currentUser.value) currentUser.value = { ...currentUser.value, avatar: undefined }
    }

    return {
        currentUser,
        getProfile,
        getUsers,
        uploadAvatar,
        deleteAvatar,
    }
})
