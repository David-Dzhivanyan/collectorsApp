import { Injectable } from '@nestjs/common';
import { CollectionTypesEntity } from './entities/collectionTypes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionTypeDto } from './dto/create-collection-type.dto';
import { User } from '../users/entities/user.entity';
import { FieldsEntity } from './entities/fields.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { CreateCollectionTypeFieldDto } from './dto/create-collection-type-field.dto';
import { CollectionTypeFieldsEntity } from './entities/collectionTypeFields.entity';
import { CreateUserCollectionDto } from './dto/create-user-collection.dto';
import { UserCollectionsEntity } from './entities/userCollections.entity';
import { CreateCollectionItemDto } from './dto/create-collection-item.dto';
import { CollectionItemsEntity } from './entities/collectionItems.entity';
import { CreateItemValueDto } from './dto/create-item-value.dto';
import { CollectionItemValuesEntity } from './entities/collectionItemValues.entity';

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
  ) {}

  async createType(
    dto: CreateCollectionTypeDto,
    user: User,
  ): Promise<CollectionTypesEntity> {
    const newType = this.collectionTypesRepo.create({
      ...dto,
      created_by: user,
    });

    return this.collectionTypesRepo.save(newType);
  }

  async createField(dto: CreateFieldDto, user: User): Promise<FieldsEntity> {
    const newField = this.fieldsRepo.create({
      ...dto,
      created_by: user,
    });

    return this.fieldsRepo.save(newField);
  }

  async createCollectionTypeField(
    dto: CreateCollectionTypeFieldDto,
  ): Promise<CollectionTypeFieldsEntity> {
    const newField = this.collectionTypeFieldsRepo.create({
      is_required: dto.is_required,
      collection_type_id: { id: dto.collection_type_id },
      field_id: { id: dto.field_id },
    });

    return this.collectionTypeFieldsRepo.save(newField);
  }

  async findAllType(): Promise<CollectionTypesEntity[]> {
    return this.collectionTypesRepo.find({ relations: ['created_by'] });
  }

  async findAllFields(): Promise<FieldsEntity[]> {
    return this.fieldsRepo.find({ relations: ['created_by'] });
  }

  async findAllFieldsByCollectionTypeId(
    collectionTypeId: number,
  ): Promise<CollectionTypeFieldsEntity[]> {
    return this.collectionTypeFieldsRepo.find({
      where: {
        collection_type_id: {
          id: collectionTypeId,
        },
      },
      relations: {
        collection_type_id: true,
        field_id: true,
      },
    });
  }

  async createUserCollection(
    dto: CreateUserCollectionDto,
    user: User,
  ): Promise<UserCollectionsEntity> {
    const newField = this.userCollectionsRepo.create({
      name: dto.name,
      collection_type_id: { id: dto.collection_type_id },
      user_id: user,
    });

    return this.userCollectionsRepo.save(newField);
  }

  async findUserCollections(userId: number): Promise<UserCollectionsEntity[]> {
    return this.userCollectionsRepo.find({
      where: {
        user_id: {
          id: userId,
        },
      },
      relations: {
        collection_type_id: true,
        user_id: true,
      },
    });
  }

  async createCollectionItem(
    dto: CreateCollectionItemDto,
  ): Promise<CollectionItemsEntity> {
    const newField = this.collectionItemsRepo.create({
      name: dto.name,
      user_collection_id: { id: dto.user_collection_id },
    });

    return this.collectionItemsRepo.save(newField);
  }

  async findCollectionItemsById(
    userCollectionId: number,
  ): Promise<CollectionItemsEntity[]> {
    return this.collectionItemsRepo.find({
      where: {
        user_collection_id: {
          id: userCollectionId,
        },
      },
      relations: {
        user_collection_id: true,
      },
    });
  }

  async createItemValue(
    dto: CreateItemValueDto,
  ): Promise<CollectionItemValuesEntity> {
    const newField = this.collectionItemValuesRepo.create({
      collection_item_id: { id: dto.collection_item_id },
      field_id: { id: dto.field_id },
      value: dto.value,
    });

    return this.collectionItemValuesRepo.save(newField);
  }

  async findItemValues(
    collectionItemId: number,
  ): Promise<CollectionItemValuesEntity[]> {
    return this.collectionItemValuesRepo.find({
      where: {
        collection_item_id: {
          id: collectionItemId,
        },
      },
      relations: {
        field_id: true,
        collection_item_id: true,
      },
    });
  }
}
