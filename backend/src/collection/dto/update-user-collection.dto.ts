import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserCollectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
