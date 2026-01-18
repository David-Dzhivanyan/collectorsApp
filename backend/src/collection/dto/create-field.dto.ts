// create-collection-type.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFieldDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  field_type: 'string' | 'number' | 'date' | 'select' | 'boolean';
}
