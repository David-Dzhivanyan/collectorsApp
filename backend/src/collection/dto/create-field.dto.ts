import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFieldDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  field_type: 'string' | 'number' | 'date' | 'select' | 'boolean';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];
}
