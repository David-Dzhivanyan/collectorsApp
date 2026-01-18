// create-collection-type.dto.ts
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateCollectionTypeFieldDto {
  @IsString()
  @IsNotEmpty()
  collection_type_id: number;

  @IsString()
  @IsNotEmpty()
  field_id: number;

  @IsOptional()
  @IsBoolean()
  is_required: boolean;
}
