// create-collection-type.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCollectionItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  user_collection_id: number;
}
