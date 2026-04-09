import type { AxiosError } from 'axios'
import type { User } from '@/store/user'
import type { ApiError, LoginData, RegData } from '@/types'
import { notify } from '@kyvg/vue3-notification'
import { useModalStore } from '@/store/modal'
import { useUserStore } from '@/store/user'
import { useCollectionStore } from '@/store/collection'
import { useChatStore } from '@/store/chat'

export const useAuthStore = defineStore('auth', () => {
    const isAuth = ref<boolean>(false)
    const { currentUser } = storeToRefs(useUserStore())

    const login = async (data: LoginData) => {
        const { $axios } = useNuxtApp()

        const { data: user } = await $axios.post<User>('/login', data)
        isAuth.value = true
        currentUser.value = user

        notify({
            title: 'Вы успешно вошли!',
            type: 'success',
        })

        const chatStore = useChatStore()
        chatStore.fetchUnreadCount()
        const { $socket } = useNuxtApp()
        $socket.connect()
    }

    const logout = async () => {
        const { $axios } = useNuxtApp()

        await $axios.post('/logout')
        isAuth.value = false
        currentUser.value = null

        useCollectionStore().resetState()
        useChatStore().resetState()
        const { $socket } = useNuxtApp()
        $socket.disconnect()

        notify({
            title: 'Вы вышли!',
            type: 'success',
        })
    }

    const register = async (data: RegData) => {
        try {
            const { open } = useModalStore()

            const { $axios } = useNuxtApp()

            await $axios.post<unknown>('/register', data)

            notify({
                title: 'Вы успешно зарегистрировались!',
                type: 'success',
            })
            open('login')
        } catch (e) {
            const error = e as AxiosError<ApiError>
            notify({
                title: error.response?.data.message,
                type: 'error',
            })
          throw e
        }
    }

    return {
        isAuth,
        login,
        logout,
        register,
    }
})
