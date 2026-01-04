import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyString } from './entities/string.entity';
import { CreateStringDto } from './dto/create-string.dto';

@Injectable()
export class StringsService {
  constructor(
    @InjectRepository(MyString)
    private readonly stringRepo: Repository<MyString>,
  ) {}

  async create(dto: CreateStringDto): Promise<MyString> {
    const newString = this.stringRepo.create({ value: dto.value });
    return this.stringRepo.save(newString);
  }

  async findAll(): Promise<MyString[]> {
    return this.stringRepo.find();
  }

  async findOne(id: number): Promise<MyString | null> {
    return this.stringRepo.findOneBy({ id });
  }
}
