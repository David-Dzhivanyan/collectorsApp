import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateCollectionTypeDto } from './dto/create-collection-type.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CollectionService } from './collection.service';
import { User } from '../users/entities/user.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { CreateCollectionTypeFieldDto } from './dto/create-collection-type-field.dto';
import { CreateUserCollectionDto } from './dto/create-user-collection.dto';
import { CreateCollectionItemDto } from './dto/create-collection-item.dto';
import { CreateItemValueDto } from './dto/create-item-value.dto';
export interface RequestWithUser extends Request {
  user: User;
}
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createType(
    @Body() dto: CreateCollectionTypeDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    console.log(user);
    return this.collectionService.createType(dto, user);
  }

  @Get()
  async findAllType() {
    return this.collectionService.findAllType();
  }

  @Get('fields')
  async findAllFields() {
    return this.collectionService.findAllFields();
  }

  @UseGuards(JwtAuthGuard)
  @Post('field')
  async createField(@Body() dto: CreateFieldDto, @Req() req: RequestWithUser) {
    const user = req.user;
    return this.collectionService.createField(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('field/create')
  async createCollectionTypeField(@Body() dto: CreateCollectionTypeFieldDto) {
    return this.collectionService.createCollectionTypeField(dto);
  }

  @Get(':collectionTypeId/fields')
  async findByCollectionTypeId(
    @Param('collectionTypeId') collectionTypeId: number,
  ) {
    return this.collectionService.findAllFieldsByCollectionTypeId(
      collectionTypeId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('user/create')
  async createUserCollection(
    @Body() dto: CreateUserCollectionDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    return this.collectionService.createUserCollection(dto, user);
  }

  @Get('user/:userId')
  async findUserCollections(@Param('userId') userId: number) {
    return this.collectionService.findUserCollections(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('item/create')
  async createCollectionItem(@Body() dto: CreateCollectionItemDto) {
    return this.collectionService.createCollectionItem(dto);
  }

  @Get('items/:userCollectionId')
  async findCollectionItemsById(
    @Param('userCollectionId') userCollectionId: number,
  ) {
    return this.collectionService.findCollectionItemsById(userCollectionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('item-value/create')
  async createItemValue(@Body() dto: CreateItemValueDto) {
    return this.collectionService.createItemValue(dto);
  }

  @Get('item-values/:collectionItemId')
  async findItemValues(@Param('collectionItemId') collectionItemId: number) {
    return this.collectionService.findItemValues(collectionItemId);
  }
}
