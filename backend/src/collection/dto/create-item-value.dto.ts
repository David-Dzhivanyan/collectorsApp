// create-collection-type.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateItemValueDto {
  @IsString()
  @IsNotEmpty()
  collection_item_id: number;

  @IsString()
  @IsNotEmpty()
  field_id: number;

  @IsString()
  @IsNotEmpty()
  value: string;
}
