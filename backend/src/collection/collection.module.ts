import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionTypesEntity } from './entities/collectionTypes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionTypesEntity])],
  providers: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule {}
