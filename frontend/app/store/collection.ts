import type { User } from '@/store/user'

export type CreateCollectionTypeRequest = {
  name: string
  description: string
}

export type CreateCollectionFieldRequest = {
  collection_type_id: number
  field_id: number
  is_required?: boolean
}

export type CreateFieldRequest = {
  name: string
  description: string
  field_type: 'string' | 'number' | 'date' | 'select' | 'boolean'
}

export type CollectionType = {
  id: number
  name: string
  description: string
  created_by: User
}

export type Field = {
  id: number
  name: string
  description: string
  field_type: 'string' | 'number' | 'date' | 'select' | 'boolean'
  created_by: User
}

export type CollectionField = {
  id: number
  collection_type_id: CollectionType
  field_id: Field
  is_required: boolean | null
}

export type UserCollection = {
  id: number
  collection_type_id: CollectionType
  name: string
  user_id: User
}

export type CollectionItem = {
  id: number
  name: string
  user_collection_id: {
    id: number
    name: string
  }
}

export const useCollectionStore = defineStore('collection', () => {
  const collectionTypeList = ref<CollectionType[] | null>(null)
  const fieldsList = ref<Field[] | null>(null)
  const currentCollection = ref<CollectionType | null>(null)
  const currentCollectionFields = ref<CollectionField[] | null>(null)
  const userCollections = ref<UserCollection[] | null>(null)
  const currentUserCollection = ref<UserCollection | null>(null)
  const currentCollectionItems = ref<CollectionItem[] | null>(null)

  const getCollectionTypes = async () => {
    const { $axios } = useNuxtApp()

    const { data } = await $axios.get<CollectionType[]>('/collection')
    collectionTypeList.value = data
  }

  const getFields = async () => {
    const { $axios } = useNuxtApp()

    const { data } = await $axios.get<Field[]>('/collection/fields')
    fieldsList.value = data
  }

  const getCurrentCollectionTypeField = async (id: number) => {
    const { $axios } = useNuxtApp()

    const { data } = await $axios.get<CollectionField>(`/collection/${id}/fields`)
    currentCollectionFields.value = data
  }

  const getUserCollections = async (userId: number) => {
    const { $axios } = useNuxtApp()

    const { data } = await $axios.get<UserCollection[]>(`/collection/user/${userId}`)
    userCollections.value = data
  }

  const getCollectionItems = async (userCollectionId: number) => {
    const { $axios } = useNuxtApp()

    const { data } = await $axios.get<CollectionItem[]>(`/collection/items/${userCollectionId}`)
    currentCollectionItems.value = data
  }

  const getItemValues = async (collectionItemId: number) => {
    const { $axios } = useNuxtApp()

    const { data } = await $axios.get<unknown[]>(`/collection/item-values/${collectionItemId}`)
    return data
  }

  const createCurrentCollectionField = async (request: CreateCollectionFieldRequest) => {
    const { $axios } = useNuxtApp()

    const { data } = await $axios.post<CollectionType>(`/collection/field/create`, {
      ...request,
    })
  }

  const createCollectionType = async (request: CreateCollectionTypeRequest) => {
    const { $axios } = useNuxtApp()

    await $axios.post('/collection', {
      ...request,
    })
  }

  const createUserCollection = async (request: {
    collection_type_id: number
  }) => {
    const { $axios } = useNuxtApp()

    await $axios.post('/collection/user/create', {
      ...request,
    })
  }

  const createField = async (request: CreateFieldRequest) => {
    const { $axios } = useNuxtApp()

    await $axios.post('/collection/field', {
      ...request,
    })
  }

  const createCollectionItem = async (request: { name: string, user_collection_id: number }) => {
    const { $axios } = useNuxtApp()

    if (currentUserCollection.value) {
      const { data }: {
        data: {
          id: number,
          name: string,
          user_collection_id: { id: number }
        }
      } = await $axios.post('/collection/item/create', {
        ...request,
      })

      return data
    }
  }

  const createItemValue = async (request: { collection_item_id: number, field_id: number, value: string }) => {
    const { $axios } = useNuxtApp()

    await $axios.post('/collection/item-value/create', {
      ...request,
    })
  }

  return {
    collectionTypeList,
    fieldsList,
    currentCollection,
    currentCollectionFields,
    userCollections,
    currentUserCollection,
    currentCollectionItems,
    getCollectionTypes,
    getFields,
    getCurrentCollectionTypeField,
    getUserCollections,
    getCollectionItems,
    createUserCollection,
    createCollectionType,
    createCurrentCollectionField,
    createField,
    createCollectionItem,
    createItemValue,
    getItemValues,
  }
})
