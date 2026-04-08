import {
  Allow,
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemValuePatchDto {
  @IsNumber()
  @IsPositive()
  field_id: number;

  @Allow()
  value: unknown;
}

export class UpdateCollectionItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemValuePatchDto)
  values?: ItemValuePatchDto[];
}
