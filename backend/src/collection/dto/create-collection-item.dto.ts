import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateCollectionItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  user_collection_id: number;
}
