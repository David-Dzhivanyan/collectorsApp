export type ModalName = 'login' | 'confirm' | 'register'

export const useModalStore = defineStore('modal', () => {
    const name = ref<ModalName | null>(null)
    const props = ref<Record<string, any>>({})

    function open(modalName: ModalName, modalProps: Record<string, any> = {}) {
        name.value = modalName
        props.value = modalProps
    }

    function close() {
        name.value = null
        props.value = {}
    }

    return {
        name,
        props,
        open,
        close,
    }
})
