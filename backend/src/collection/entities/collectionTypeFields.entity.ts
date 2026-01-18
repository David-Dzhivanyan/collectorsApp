import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { CollectionTypesEntity } from './collectionTypes.entity';
import { FieldsEntity } from './fields.entity';

@Entity()
@Unique(['collection_type_id', 'field_id'])
export class CollectionTypeFieldsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CollectionTypesEntity)
  @JoinColumn({ name: 'collection_type_id' })
  collection_type_id: CollectionTypesEntity;

  @ManyToOne(() => FieldsEntity)
  @JoinColumn({ name: 'field_id' })
  field_id: FieldsEntity;

  @Column({ nullable: true })
  is_required: boolean;
}
