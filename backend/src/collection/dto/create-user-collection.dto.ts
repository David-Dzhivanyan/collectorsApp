// create-collection-type.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserCollectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  collection_type_id: number;
}
