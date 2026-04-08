import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateItemValueDto {
  @IsNumber()
  @IsPositive()
  collection_item_id: number;

  @IsNumber()
  @IsPositive()
  field_id: number;

  @IsNotEmpty()
  value: unknown;
}
