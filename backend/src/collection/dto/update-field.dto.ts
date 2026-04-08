import { IsOptional, IsString } from 'class-validator';

export class UpdateFieldDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
