import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateUserCollectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  collection_type_id: number;
}
