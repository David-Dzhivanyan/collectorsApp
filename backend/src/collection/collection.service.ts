import { Injectable } from '@nestjs/common';
import { CollectionTypesEntity } from './entities/collectionTypes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionTypeDto } from './dto/create-collection-type.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionTypesEntity)
    private readonly collectionTypesRepo: Repository<CollectionTypesEntity>,
  ) {}

  async create(
    dto: CreateCollectionTypeDto,
    user: User,
  ): Promise<CollectionTypesEntity> {
    const newType = this.collectionTypesRepo.create({
      ...dto,
      created_by: user,
    });

    return this.collectionTypesRepo.save(newType);
  }

  async findAll(): Promise<CollectionTypesEntity[]> {
    return this.collectionTypesRepo.find({ relations: ['created_by'] });
  }
}
