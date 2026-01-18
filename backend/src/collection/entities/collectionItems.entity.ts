import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserCollectionsEntity } from './userCollections.entity';

@Entity()
export class CollectionItemsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => UserCollectionsEntity)
  @JoinColumn({ name: 'user_collection_id' })
  user_collection_id: UserCollectionsEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
