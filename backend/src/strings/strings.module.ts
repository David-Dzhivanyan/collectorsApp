import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StringsController } from './strings.controller';
import { StringsService } from './strings.service';
import { MyString } from './entities/string.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MyString])],
  controllers: [StringsController],
  providers: [StringsService],
})
export class StringsModule {}
