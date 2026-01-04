import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FieldsEntity } from './fields.entity';
import { CollectionItemsEntity } from './collectionItems.entity';

@Entity()
export class CollectionTypeFieldsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CollectionItemsEntity)
  @JoinColumn({ name: 'collection_item_id' })
  collection_item_id: CollectionItemsEntity;

  @ManyToOne(() => FieldsEntity)
  @JoinColumn({ name: 'field_id' })
  field_id: FieldsEntity;

  @Column({ nullable: true })
  value_string?: string;

  @Column({ nullable: true })
  value_number?: number;

  @Column({ nullable: true })
  value_boolean?: boolean;

  @Column({ type: 'timestamp', nullable: true })
  value_date?: Date;

  @Column({ type: 'jsonb', nullable: true })
  value_select?: string[];
}
