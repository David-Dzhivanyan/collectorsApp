import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'
import { ChatEntity } from './chat.entity'
import { User } from '../../users/entities/user.entity'

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => ChatEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat: ChatEntity

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User

  @Column({ type: 'text' })
  content: string

  @Column({ type: 'varchar', length: 10, default: 'text' })
  type: 'text' | 'item'

  @Column({ nullable: true, type: 'int' })
  item_id: number | null

  @Column({ nullable: true, type: 'int' })
  collection_id: number | null

  @Column({ nullable: true, type: 'int' })
  item_owner_id: number | null

  @Column({ nullable: true, type: 'varchar' })
  item_name: string | null

  @Column({ default: false })
  is_read: boolean

  @CreateDateColumn()
  created_at: Date
}
