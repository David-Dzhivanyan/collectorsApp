import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity('chats')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user1_id' })
  user1: User

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user2_id' })
  user2: User

  @CreateDateColumn()
  created_at: Date
}
