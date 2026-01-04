import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MyString {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;
}
