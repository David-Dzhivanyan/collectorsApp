import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CollectionTypesEntity } from './collectionTypes.entity';

@Entity()
@Unique(['collection_type_id', 'user_id', 'name'])
export class UserCollectionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @ManyToOne(() => CollectionTypesEntity)
  @JoinColumn({ name: 'collection_type_id' })
  collection_type_id: CollectionTypesEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
