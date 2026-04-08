import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
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
import { CollectionTableResponseDto } from './dto/collection-table.dto';
import { CollectionTypeTableRow } from './dto/collection-types-table.dto';
import { UpdateUserCollectionDto } from './dto/update-user-collection.dto';
import { UpdateCollectionItemDto } from './dto/update-collection-item.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
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

  @Get('types/table')
  async getCollectionTypesTable(): Promise<CollectionTypeTableRow[]> {
    return this.collectionService.getCollectionTypesTable();
  }

  @Delete('type/:typeId')
  @HttpCode(204)
  async deleteCollectionType(@Param('typeId') typeId: number): Promise<void> {
    await this.collectionService.deleteCollectionType(typeId);
  }

  @Delete('field/:fieldId')
  @HttpCode(204)
  async deleteField(@Param('fieldId') fieldId: number): Promise<void> {
    await this.collectionService.deleteField(fieldId);
  }

  @Delete('type-field/:collectionTypeFieldId')
  @HttpCode(204)
  async deleteCollectionTypeField(
    @Param('collectionTypeFieldId') collectionTypeFieldId: number,
  ): Promise<void> {
    await this.collectionService.deleteCollectionTypeField(collectionTypeFieldId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user-collection/:id')
  @HttpCode(204)
  async deleteUserCollection(@Param('id') id: number): Promise<void> {
    await this.collectionService.deleteUserCollection(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user-collection/:id')
  @HttpCode(204)
  async updateUserCollection(
    @Param('id') id: number,
    @Body() dto: UpdateUserCollectionDto,
  ): Promise<void> {
    await this.collectionService.updateUserCollection(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('item/:id')
  @HttpCode(204)
  async updateCollectionItem(
    @Param('id') id: number,
    @Body() dto: UpdateCollectionItemDto,
  ): Promise<void> {
    await this.collectionService.updateCollectionItem(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('field/:id')
  @HttpCode(204)
  async updateField(
    @Param('id') id: number,
    @Body() dto: UpdateFieldDto,
  ): Promise<void> {
    await this.collectionService.updateField(id, dto);
  }

  @Delete('item/:itemId')
  @HttpCode(204)
  async deleteCollectionItem(@Param('itemId') itemId: number): Promise<void> {
    await this.collectionService.deleteCollectionItem(itemId);
  }

  @Get('user-collection/:userCollectionId/table')
  async getCollectionTable(
    @Param('userCollectionId') userCollectionId: number,
  ): Promise<CollectionTableResponseDto> {
    const result =
      await this.collectionService.getCollectionTable(userCollectionId);
    if (!result) {
      throw new NotFoundException(
        `User collection ${userCollectionId} not found`,
      );
    }
    return result;
  }
}
