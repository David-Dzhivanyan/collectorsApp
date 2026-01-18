import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionTypesEntity } from './entities/collectionTypes.entity';
import { FieldsEntity } from './entities/fields.entity';
import { CollectionTypeFieldsEntity } from './entities/collectionTypeFields.entity';
import { UserCollectionsEntity } from './entities/userCollections.entity';
import { CollectionItemsEntity } from './entities/collectionItems.entity';
import { CollectionItemValuesEntity } from './entities/collectionItemValues.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollectionTypesEntity]),
    TypeOrmModule.forFeature([FieldsEntity]),
    TypeOrmModule.forFeature([CollectionTypeFieldsEntity]),
    TypeOrmModule.forFeature([UserCollectionsEntity]),
    TypeOrmModule.forFeature([CollectionItemsEntity]),
    TypeOrmModule.forFeature([CollectionItemValuesEntity]),
  ],
  providers: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule {}
