import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { StringsService } from './strings.service';
import { CreateStringDto } from './dto/create-string.dto';
import { MyString } from './entities/string.entity';

@Controller('strings')
export class StringsController {
  constructor(private readonly stringsService: StringsService) {}

  @Get()
  getAll(): Promise<MyString[]> {
    return this.stringsService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<MyString> {
    const result = await this.stringsService.findOne(+id);
    if (!result) {
      throw new NotFoundException(`String with id ${id} not found`);
    }
    return result;
  }

  @Post()
  create(@Body() dto: CreateStringDto): Promise<MyString> {
    return this.stringsService.create(dto);
  }
}
