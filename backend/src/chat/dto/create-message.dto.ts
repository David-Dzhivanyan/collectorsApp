import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateMessageDto {
  @IsInt()
  chatId: number

  @IsString()
  content: string

  @IsEnum(['text', 'item'])
  type: 'text' | 'item'

  @IsInt()
  @IsOptional()
  itemId?: number

  @IsInt()
  @IsOptional()
  collectionId?: number

  @IsInt()
  @IsOptional()
  itemOwnerId?: number

  @IsString()
  @IsOptional()
  itemName?: string
}
