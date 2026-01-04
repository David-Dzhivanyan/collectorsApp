import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateCollectionTypeDto } from './dto/create-collection-type.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CollectionService } from './collection.service';
import { User } from '../users/entities/user.entity';
export interface RequestWithUser extends Request {
  user: User;
}
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionTypesService: CollectionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreateCollectionTypeDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    return this.collectionTypesService.create(dto, user);
  }

  @Get()
  async findAll() {
    return this.collectionTypesService.findAll();
  }
}
