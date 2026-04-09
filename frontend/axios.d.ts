import type { AxiosInstance } from 'axios'

declare module '#app' {
    interface NuxtApp {
        $axios: AxiosInstance
        $socket: {
            connect: () => void
            disconnect: () => void
            emit: (event: string, data: unknown) => void
        }
    }
}

export {}
