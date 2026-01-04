import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CollectionTypesEntity } from './collectionTypes.entity';
import { FieldsEntity } from './fields.entity';

@Entity()
export class CollectionTypeFieldsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CollectionTypesEntity)
  @JoinColumn({ name: 'collection_type_id' })
  collection_type_id: CollectionTypesEntity;

  @ManyToOne(() => FieldsEntity)
  @JoinColumn({ name: 'field_id' })
  field_id: FieldsEntity;

  @Column()
  is_required: boolean;
}
