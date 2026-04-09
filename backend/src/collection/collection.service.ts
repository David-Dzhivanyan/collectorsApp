import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { CollectionTypesEntity } from './entities/collectionTypes.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { CreateCollectionTypeDto } from './dto/create-collection-type.dto'
import { User } from '../users/entities/user.entity'
import { FieldsEntity } from './entities/fields.entity'
import { CreateFieldDto } from './dto/create-field.dto'
import { CreateCollectionTypeFieldDto } from './dto/create-collection-type-field.dto'
import { CollectionTypeFieldsEntity } from './entities/collectionTypeFields.entity'
import { CreateUserCollectionDto } from './dto/create-user-collection.dto'
import { UserCollectionsEntity } from './entities/userCollections.entity'
import { CreateCollectionItemDto } from './dto/create-collection-item.dto'
import { CollectionItemsEntity } from './entities/collectionItems.entity'
import { CreateItemValueDto } from './dto/create-item-value.dto'
import { CollectionItemValuesEntity } from './entities/collectionItemValues.entity'
import { CollectionTableResponseDto } from './dto/collection-table.dto'
import { CollectionTypeTableRow } from './dto/collection-types-table.dto'
import { UpdateUserCollectionDto } from './dto/update-user-collection.dto'
import { UpdateCollectionItemDto } from './dto/update-collection-item.dto'
import { UpdateFieldDto } from './dto/update-field.dto'

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionTypesEntity)
    private readonly collectionTypesRepo: Repository<CollectionTypesEntity>,

    @InjectRepository(FieldsEntity)
    private readonly fieldsRepo: Repository<FieldsEntity>,

    @InjectRepository(CollectionTypeFieldsEntity)
    private readonly collectionTypeFieldsRepo: Repository<CollectionTypeFieldsEntity>,

    @InjectRepository(UserCollectionsEntity)
    private readonly userCollectionsRepo: Repository<UserCollectionsEntity>,

    @InjectRepository(CollectionItemsEntity)
    private readonly collectionItemsRepo: Repository<CollectionItemsEntity>,

    @InjectRepository(CollectionItemValuesEntity)
    private readonly collectionItemValuesRepo: Repository<CollectionItemValuesEntity>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private async deletePhotosFromDisk(photos: string[]): Promise<void> {
    for (const filename of photos) {
      try {
        await unlink(join(process.cwd(), 'uploads', filename))
      } catch {
        // file already gone — not an error
      }
    }
  }

  private async verifyUserCollectionOwnership(
    userCollectionId: number,
    userId: number,
  ): Promise<UserCollectionsEntity> {
    const uc = await this.userCollectionsRepo.findOne({
      where: { id: userCollectionId },
      relations: { user_id: true },
    })
    if (!uc)
      throw new NotFoundException(
        `User collection ${userCollectionId} not found`,
      )
    if (uc.user_id.id !== userId) throw new ForbiddenException('Access denied')
    return uc
  }

  private async verifyItemOwnership(
    itemId: number,
    userId: number,
  ): Promise<CollectionItemsEntity> {
    const item = await this.collectionItemsRepo.findOne({
      where: { id: itemId },
      relations: { user_collection_id: { user_id: true } },
    })
    if (!item) throw new NotFoundException(`Item ${itemId} not found`)
    if (item.user_collection_id.user_id.id !== userId)
      throw new ForbiddenException('Access denied')
    return item
  }

  // ─── Collection Types ────────────────────────────────────────────────────────

  async createType(
    dto: CreateCollectionTypeDto,
    user: User,
  ): Promise<CollectionTypesEntity> {
    const newType = this.collectionTypesRepo.create({
      ...dto,
      created_by: user,
    })
    return this.collectionTypesRepo.save(newType)
  }

  async findAllType(): Promise<CollectionTypesEntity[]> {
    return this.collectionTypesRepo.find({ relations: ['created_by'] })
  }

  async getCollectionTypesTable(): Promise<CollectionTypeTableRow[]> {
    const [types, allTypeFields] = await Promise.all([
      this.collectionTypesRepo.find({ relations: { created_by: true } }),
      this.collectionTypeFieldsRepo.find({
        relations: { collection_type_id: true, field_id: true },
      }),
    ])

    return types.map((type) => ({
      id: type.id,
      name: type.name,
      description: type.description,
      created_by: `${type.created_by.firstName} ${type.created_by.lastName}`.trim(),
      created_at: type.created_at,
      fields: allTypeFields
        .filter((ctf) => ctf.collection_type_id.id === type.id)
        .map((ctf) => ({
          id: ctf.id,
          fieldId: ctf.field_id.id,
          name: ctf.field_id.name,
          field_type: ctf.field_id.field_type,
          is_required: ctf.is_required,
          options: ctf.field_id.options,
        })),
    }))
  }

  async deleteCollectionType(typeId: number, userId: number): Promise<void> {
    const type = await this.collectionTypesRepo.findOne({
      where: { id: typeId },
      relations: { created_by: true },
    })
    if (!type) throw new NotFoundException(`Collection type ${typeId} not found`)
    if (type.created_by.id !== userId)
      throw new ForbiddenException('Вы не являетесь создателем этого типа коллекции')

    const userCollections = await this.userCollectionsRepo.find({
      where: { collection_type_id: { id: typeId } },
      relations: { user_id: true },
    })

    const usedByOthers = userCollections.some((uc) => uc.user_id.id !== userId)
    if (usedByOthers)
      throw new ForbiddenException(
        'Этот тип коллекции используется другими пользователями',
      )

    for (const uc of userCollections) {
      const items = await this.collectionItemsRepo.find({
        where: { user_collection_id: { id: uc.id } },
      })
      for (const item of items) {
        await this.deletePhotosFromDisk((item.photos ?? []).filter(Boolean))
        await this.collectionItemValuesRepo.delete({
          collection_item_id: { id: item.id },
        })
      }
      if (items.length) {
        await this.collectionItemsRepo.delete(items.map((i) => i.id))
      }
    }

    if (userCollections.length) {
      await this.userCollectionsRepo.delete(userCollections.map((uc) => uc.id))
    }

    await this.collectionTypeFieldsRepo.delete({
      collection_type_id: { id: typeId },
    })
    await this.collectionTypesRepo.delete(typeId)
  }

  // ─── Fields ──────────────────────────────────────────────────────────────────

  async createField(dto: CreateFieldDto, user: User): Promise<FieldsEntity> {
    const newField = this.fieldsRepo.create({
      ...dto,
      created_by: user,
    })
    return this.fieldsRepo.save(newField)
  }

  async findAllFields(): Promise<FieldsEntity[]> {
    return this.fieldsRepo.find({ relations: ['created_by'] })
  }

  async updateField(id: number, dto: UpdateFieldDto, userId: number): Promise<void> {
    const field = await this.fieldsRepo.findOne({
      where: { id },
      relations: { created_by: true },
    })
    if (!field) throw new NotFoundException(`Field ${id} not found`)
    if (field.created_by.id !== userId)
      throw new ForbiddenException('Вы не являетесь создателем этого поля')

    const typeFields = await this.collectionTypeFieldsRepo.find({
      where: { field_id: { id } },
      relations: { collection_type_id: { created_by: true } },
    })
    const usedByOtherType = typeFields.some(
      (tf) => tf.collection_type_id.created_by.id !== userId,
    )
    if (usedByOtherType)
      throw new ForbiddenException(
        'Поле используется в типах коллекций других пользователей',
      )

    const itemValues = await this.collectionItemValuesRepo.find({
      where: { field_id: { id } },
      relations: { collection_item_id: { user_collection_id: { user_id: true } } },
    })
    const usedByOtherUser = itemValues.some(
      (iv) => iv.collection_item_id.user_collection_id.user_id.id !== userId,
    )
    if (usedByOtherUser)
      throw new ForbiddenException(
        'Поле используется в коллекциях других пользователей',
      )

    const update: Partial<FieldsEntity> = {}
    if (dto.name !== undefined) update.name = dto.name
    if (dto.description !== undefined) update.description = dto.description
    if (Object.keys(update).length) {
      await this.fieldsRepo.update(id, update)
    }
  }

  async deleteField(fieldId: number, userId: number): Promise<void> {
    // Check if any collection type using this field was created by another user
    const typeFields = await this.collectionTypeFieldsRepo.find({
      where: { field_id: { id: fieldId } },
      relations: { collection_type_id: { created_by: true } },
    })

    const usedByOtherType = typeFields.some(
      (tf) => tf.collection_type_id.created_by.id !== userId,
    )
    if (usedByOtherType) {
      throw new ForbiddenException(
        'Поле используется в типах коллекций, созданных другими пользователями',
      )
    }

    // Check if any item values for this field belong to another user's collections
    const itemValues = await this.collectionItemValuesRepo.find({
      where: { field_id: { id: fieldId } },
      relations: {
        collection_item_id: { user_collection_id: { user_id: true } },
      },
    })

    const usedByOtherUser = itemValues.some(
      (iv) =>
        iv.collection_item_id.user_collection_id.user_id.id !== userId,
    )
    if (usedByOtherUser) {
      throw new ForbiddenException(
        'Поле используется в коллекциях других пользователей',
      )
    }

    await this.collectionItemValuesRepo.delete({ field_id: { id: fieldId } })
    await this.collectionTypeFieldsRepo.delete({ field_id: { id: fieldId } })
    await this.fieldsRepo.delete(fieldId)
  }

  // ─── Collection Type Fields ──────────────────────────────────────────────────

  async createCollectionTypeField(
    dto: CreateCollectionTypeFieldDto,
    userId: number,
  ): Promise<CollectionTypeFieldsEntity> {
    const type = await this.collectionTypesRepo.findOne({
      where: { id: dto.collection_type_id },
      relations: { created_by: true },
    })
    if (!type)
      throw new NotFoundException(
        `Collection type ${dto.collection_type_id} not found`,
      )
    if (type.created_by.id !== userId)
      throw new ForbiddenException('Access denied')

    const newField = this.collectionTypeFieldsRepo.create({
      is_required: dto.is_required,
      collection_type_id: { id: dto.collection_type_id },
      field_id: { id: dto.field_id },
    })
    return this.collectionTypeFieldsRepo.save(newField)
  }

  async findAllFieldsByCollectionTypeId(
    collectionTypeId: number,
  ): Promise<CollectionTypeFieldsEntity[]> {
    return this.collectionTypeFieldsRepo.find({
      where: { collection_type_id: { id: collectionTypeId } },
      relations: { collection_type_id: true, field_id: true },
    })
  }

  async deleteCollectionTypeField(
    collectionTypeFieldId: number,
    userId: number,
  ): Promise<void> {
    const ctf = await this.collectionTypeFieldsRepo.findOne({
      where: { id: collectionTypeFieldId },
      relations: { collection_type_id: { created_by: true } },
    })
    if (!ctf)
      throw new NotFoundException(
        `Collection type field ${collectionTypeFieldId} not found`,
      )
    if (ctf.collection_type_id.created_by.id !== userId)
      throw new ForbiddenException('Access denied')

    await this.collectionTypeFieldsRepo.delete(collectionTypeFieldId)
  }

  // ─── User Collections ────────────────────────────────────────────────────────

  async createUserCollection(
    dto: CreateUserCollectionDto,
    user: User,
  ): Promise<UserCollectionsEntity> {
    const newCollection = this.userCollectionsRepo.create({
      name: dto.name,
      collection_type_id: { id: dto.collection_type_id },
      user_id: user,
    })
    return this.userCollectionsRepo.save(newCollection)
  }

  async findUserCollections(userId: number): Promise<UserCollectionsEntity[]> {
    return this.userCollectionsRepo.find({
      where: { user_id: { id: userId } },
      relations: { collection_type_id: true, user_id: true },
    })
  }

  async updateUserCollection(
    id: number,
    dto: UpdateUserCollectionDto,
    userId: number,
  ): Promise<void> {
    await this.verifyUserCollectionOwnership(id, userId)
    await this.userCollectionsRepo.update(id, { name: dto.name })
  }

  async deleteUserCollection(id: number, userId: number): Promise<void> {
    await this.verifyUserCollectionOwnership(id, userId)

    const items = await this.collectionItemsRepo.find({
      where: { user_collection_id: { id } },
    })
    for (const item of items) {
      await this.deletePhotosFromDisk((item.photos ?? []).filter(Boolean))
      await this.collectionItemValuesRepo.delete({
        collection_item_id: { id: item.id },
      })
    }
    if (items.length) {
      await this.collectionItemsRepo.delete(items.map((i) => i.id))
    }
    await this.userCollectionsRepo.delete(id)
  }

  // ─── Collection Items ────────────────────────────────────────────────────────

  async createCollectionItem(
    dto: CreateCollectionItemDto,
    userId: number,
  ): Promise<CollectionItemsEntity> {
    await this.verifyUserCollectionOwnership(dto.user_collection_id, userId)

    const newItem = this.collectionItemsRepo.create({
      name: dto.name,
      user_collection_id: { id: dto.user_collection_id },
    })
    return this.collectionItemsRepo.save(newItem)
  }

  async findCollectionItemsById(
    userCollectionId: number,
    userId: number,
  ): Promise<CollectionItemsEntity[]> {
    await this.verifyUserCollectionOwnership(userCollectionId, userId)

    return this.collectionItemsRepo.find({
      where: { user_collection_id: { id: userCollectionId } },
      relations: { user_collection_id: true },
    })
  }

  async updateCollectionItem(
    id: number,
    dto: UpdateCollectionItemDto,
    userId: number,
  ): Promise<void> {
    await this.verifyItemOwnership(id, userId)

    if (dto.name) {
      await this.collectionItemsRepo.update(id, { name: dto.name })
    }

    if (dto.values?.length) {
      for (const v of dto.values) {
        const field = await this.fieldsRepo.findOne({ where: { id: v.field_id } })
        if (!field) throw new NotFoundException(`Field ${v.field_id} not found`)

        const normalized = this.validateAndNormalize(
          field.field_type,
          v.value,
          field.options,
        )

        const existing = await this.collectionItemValuesRepo.findOne({
          where: {
            collection_item_id: { id },
            field_id: { id: v.field_id },
          },
        })

        if (existing) {
          await this.collectionItemValuesRepo.update(existing.id, {
            value: normalized as any,
          })
        } else {
          const entity = this.collectionItemValuesRepo.create({
            collection_item_id: { id },
            field_id: { id: v.field_id },
            value: normalized,
          })
          await this.collectionItemValuesRepo.save(entity)
        }
      }
    }
  }

  async deleteCollectionItem(itemId: number, userId: number): Promise<void> {
    const item = await this.verifyItemOwnership(itemId, userId)
    await this.deletePhotosFromDisk((item.photos ?? []).filter(Boolean))
    await this.collectionItemValuesRepo.delete({
      collection_item_id: { id: itemId },
    })
    await this.collectionItemsRepo.delete(itemId)
  }

  // ─── Collection Item Values ──────────────────────────────────────────────────

  async createItemValue(
    dto: CreateItemValueDto,
    userId: number,
  ): Promise<CollectionItemValuesEntity> {
    await this.verifyItemOwnership(dto.collection_item_id, userId)

    const field = await this.fieldsRepo.findOne({ where: { id: dto.field_id } })
    if (!field) {
      throw new BadRequestException(`Поле ${dto.field_id} не найдено`)
    }

    const normalized = this.validateAndNormalize(
      field.field_type,
      dto.value,
      field.options,
    )

    const entity = this.collectionItemValuesRepo.create({
      collection_item_id: { id: dto.collection_item_id },
      field_id: { id: dto.field_id },
      value: normalized,
    })
    return this.collectionItemValuesRepo.save(entity)
  }

  async findItemValues(
    collectionItemId: number,
    userId: number,
  ): Promise<CollectionItemValuesEntity[]> {
    await this.verifyItemOwnership(collectionItemId, userId)

    return this.collectionItemValuesRepo.find({
      where: { collection_item_id: { id: collectionItemId } },
      relations: { field_id: true, collection_item_id: true },
    })
  }

  // ─── Complex Queries ─────────────────────────────────────────────────────────

  async getCollectionTable(
    userCollectionId: number,
    userId: number | null,
  ): Promise<CollectionTableResponseDto | null> {
    const userCollection = await this.userCollectionsRepo.findOne({
      where: { id: userCollectionId },
      relations: { collection_type_id: true, user_id: true },
    })

    if (!userCollection) return null
    if (userId !== null && userCollection.user_id.id !== userId)
      throw new ForbiddenException('Access denied')

    const collectionTypeId = userCollection.collection_type_id.id

    const [typeFields, items] = await Promise.all([
      this.collectionTypeFieldsRepo.find({
        where: { collection_type_id: { id: collectionTypeId } },
        relations: { field_id: true },
      }),
      this.collectionItemsRepo.find({
        where: { user_collection_id: { id: userCollectionId } },
      }),
    ])

    const itemIds = items.map((item) => item.id)
    const allValues = itemIds.length
      ? await this.collectionItemValuesRepo.find({
          where: { collection_item_id: { id: In(itemIds) } },
          relations: { field_id: true, collection_item_id: true },
        })
      : []

    const fields = typeFields.map((ctf) => ({
      id: ctf.field_id.id,
      name: ctf.field_id.name,
      field_type: ctf.field_id.field_type,
      is_required: ctf.is_required,
      options: ctf.field_id.options,
    }))

    const valuesByItemId = new Map<number, Record<string, any>>(
      items.map((item) => [item.id, {}]),
    )
    for (const val of allValues) {
      const bucket = valuesByItemId.get(val.collection_item_id.id)
      if (bucket !== undefined) {
        bucket[String(val.field_id.id)] = val.value
      }
    }

    const shapedItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      created_at: item.created_at,
      photos: (item.photos ?? []).filter(Boolean) as string[],
      values: valuesByItemId.get(item.id) ?? {},
    }))

    return { fields, items: shapedItems }
  }

  // ─── Photos ──────────────────────────────────────────────────────────────────

  async addPhotoToItem(
    itemId: number,
    filename: string,
    userId: number,
  ): Promise<{ filename: string }> {
    const item = await this.verifyItemOwnership(itemId, userId)
    const current = (item.photos ?? []).filter(Boolean)
    await this.collectionItemsRepo.update(itemId, {
      photos: [...current, filename],
    })
    return { filename }
  }

  async removePhotoFromItem(
    itemId: number,
    filename: string,
    userId: number,
  ): Promise<void> {
    const item = await this.verifyItemOwnership(itemId, userId)
    const updated = (item.photos ?? []).filter(
      (f) => f && f !== filename,
    )
    await this.collectionItemsRepo.update(itemId, { photos: updated })
    await this.deletePhotosFromDisk([filename])
  }

  // ─── Validation ──────────────────────────────────────────────────────────────

  private validateAndNormalize(
    fieldType: FieldsEntity['field_type'],
    raw: unknown,
    options?: string[],
  ): unknown {
    switch (fieldType) {
      case 'string': {
        if (typeof raw !== 'string' || raw.trim() === '') {
          throw new BadRequestException(
            `Поле типа "string" должно быть непустой строкой`,
          )
        }
        return raw.trim()
      }

      case 'select': {
        if (typeof raw !== 'string' || raw.trim() === '') {
          throw new BadRequestException(`Необходимо выбрать вариант ответа`)
        }
        const value = raw.trim()
        if (options?.length && !options.includes(value)) {
          throw new BadRequestException(
            `Значение "${value}" не входит в список допустимых вариантов`,
          )
        }
        return value
      }

      case 'number': {
        const num = Number(raw)
        if (raw === '' || raw === null || raw === undefined || isNaN(num)) {
          throw new BadRequestException(
            `Поле типа "number" должно быть числом`,
          )
        }
        return num
      }

      case 'date': {
        const d = new Date(raw as string)
        if (isNaN(d.getTime())) {
          throw new BadRequestException(
            `Поле типа "date" должно быть корректной датой`,
          )
        }
        return d.toISOString()
      }

      case 'boolean': {
        if (raw === true || raw === 1 || raw === 'true' || raw === '1')
          return true
        if (raw === false || raw === 0 || raw === 'false' || raw === '0')
          return false
        throw new BadRequestException(
          `Поле типа "boolean" должно быть true или false`,
        )
      }

      default:
        throw new BadRequestException(
          `Неизвестный тип поля: ${String(fieldType)}`,
        )
    }
  }

  // ─── Stats ───────────────────────────────────────────────────────────────────

  async getStats(): Promise<{
    users: number
    collectionTypes: number
    collections: number
    items: number
  }> {
    const [users, collectionTypes, collections, items] = await Promise.all([
      this.userRepo.count(),
      this.collectionTypesRepo.count(),
      this.userCollectionsRepo.count(),
      this.collectionItemsRepo.count(),
    ])
    return { users, collectionTypes, collections, items }
  }

  // ─── Search ──────────────────────────────────────────────────────────────────

  async searchCollections(q: string): Promise<UserCollectionsEntity[]> {
    return this.userCollectionsRepo
      .createQueryBuilder('uc')
      .leftJoinAndSelect('uc.user_id', 'user')
      .leftJoinAndSelect('uc.collection_type_id', 'type')
      .where('LOWER(uc.name) LIKE :q', { q: `%${q.toLowerCase()}%` })
      .take(20)
      .getMany()
  }

  async searchItems(q: string): Promise<
    {
      itemId: number
      itemName: string
      collectionId: number
      collectionName: string
      userId: number
      userFirstName: string
      userLastName: string
      username: string
    }[]
  > {
    if (!q.trim()) return []

    const items = await this.collectionItemsRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.user_collection_id', 'col')
      .leftJoinAndSelect('col.user_id', 'user')
      .where('LOWER(item.name) LIKE :q', { q: `%${q.toLowerCase()}%` })
      .orderBy('item.name', 'ASC')
      .take(15)
      .getMany()

    return items.map((item) => ({
      itemId: item.id,
      itemName: item.name,
      collectionId: (item.user_collection_id as any).id,
      collectionName: (item.user_collection_id as any).name,
      userId: (item.user_collection_id as any).user_id.id,
      userFirstName: (item.user_collection_id as any).user_id.firstName,
      userLastName: (item.user_collection_id as any).user_id.lastName,
      username: (item.user_collection_id as any).user_id.username,
    }))
  }
}
