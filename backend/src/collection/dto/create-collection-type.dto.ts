// create-collection-type.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCollectionTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}
