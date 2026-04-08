import { IsBoolean, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateCollectionTypeFieldDto {
  @IsNumber()
  @IsPositive()
  collection_type_id: number;

  @IsNumber()
  @IsPositive()
  field_id: number;

  @IsOptional()
  @IsBoolean()
  is_required?: boolean;
}
