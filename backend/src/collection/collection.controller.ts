import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { CreateCollectionTypeDto } from './dto/create-collection-type.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CollectionService } from './collection.service'
import { User } from '../users/entities/user.entity'
import { CreateFieldDto } from './dto/create-field.dto'
import { CreateCollectionTypeFieldDto } from './dto/create-collection-type-field.dto'
import { CreateUserCollectionDto } from './dto/create-user-collection.dto'
import { CreateCollectionItemDto } from './dto/create-collection-item.dto'
import { CreateItemValueDto } from './dto/create-item-value.dto'
import { CollectionTableResponseDto } from './dto/collection-table.dto'
import { CollectionTypeTableRow } from './dto/collection-types-table.dto'
import { UpdateUserCollectionDto } from './dto/update-user-collection.dto'
import { UpdateCollectionItemDto } from './dto/update-collection-item.dto'
import { UpdateFieldDto } from './dto/update-field.dto'

export interface RequestWithUser extends Request {
  user: User & { id: number }
}

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  // ─── Collection Types ────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post()
  async createType(
    @Body() dto: CreateCollectionTypeDto,
    @Req() req: RequestWithUser,
  ) {
    return this.collectionService.createType(dto, req.user)
  }

  @Get('stats')
  async getStats() {
    return this.collectionService.getStats()
  }

  @Get('search')
  async searchCollections(@Query('q') q: string) {
    return this.collectionService.searchCollections(q ?? '')
  }

  @Get('items/search')
  async searchItems(@Query('q') q: string) {
    return this.collectionService.searchItems(q ?? '')
  }

  @Get()
  async findAllType() {
    return this.collectionService.findAllType()
  }

  @Get('types/table')
  async getCollectionTypesTable(): Promise<CollectionTypeTableRow[]> {
    return this.collectionService.getCollectionTypesTable()
  }

  @UseGuards(JwtAuthGuard)
  @Delete('type/:typeId')
  @HttpCode(204)
  async deleteCollectionType(
    @Param('typeId') typeId: number,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.collectionService.deleteCollectionType(typeId, req.user.id)
  }

  // ─── Fields ──────────────────────────────────────────────────────────────────

  @Get('fields')
  async findAllFields() {
    return this.collectionService.findAllFields()
  }

  @UseGuards(JwtAuthGuard)
  @Post('field')
  async createField(
    @Body() dto: CreateFieldDto,
    @Req() req: RequestWithUser,
  ) {
    return this.collectionService.createField(dto, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('field/:id')
  @HttpCode(204)
  async updateField(
    @Param('id') id: number,
    @Body() dto: UpdateFieldDto,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.collectionService.updateField(id, dto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('field/:fieldId')
  @HttpCode(204)
  async deleteField(
    @Param('fieldId') fieldId: number,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.collectionService.deleteField(fieldId, req.user.id)
  }

  // ─── Collection Type Fields ──────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('field/create')
  async createCollectionTypeField(
    @Body() dto: CreateCollectionTypeFieldDto,
    @Req() req: RequestWithUser,
  ) {
    return this.collectionService.createCollectionTypeField(dto, req.user.id)
  }

  @Get(':collectionTypeId/fields')
  async findByCollectionTypeId(
    @Param('collectionTypeId') collectionTypeId: number,
  ) {
    return this.collectionService.findAllFieldsByCollectionTypeId(
      collectionTypeId,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Delete('type-field/:collectionTypeFieldId')
  @HttpCode(204)
  async deleteCollectionTypeField(
    @Param('collectionTypeFieldId') collectionTypeFieldId: number,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.collectionService.deleteCollectionTypeField(
      collectionTypeFieldId,
      req.user.id,
    )
  }

  // ─── User Collections ────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('user/create')
  async createUserCollection(
    @Body() dto: CreateUserCollectionDto,
    @Req() req: RequestWithUser,
  ) {
    return this.collectionService.createUserCollection(dto, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/my')
  async findMyCollections(@Req() req: RequestWithUser) {
    return this.collectionService.findUserCollections(req.user.id)
  }

  @Get('user/:userId')
  async findUserCollections(@Param('userId') userId: number) {
    return this.collectionService.findUserCollections(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user-collection/:id')
  @HttpCode(204)
  async updateUserCollection(
    @Param('id') id: number,
    @Body() dto: UpdateUserCollectionDto,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.collectionService.updateUserCollection(id, dto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user-collection/:id')
  @HttpCode(204)
  async deleteUserCollection(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.collectionService.deleteUserCollection(id, req.user.id)
  }

  // ─── Collection Items ────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('item/create')
  async createCollectionItem(
    @Body() dto: CreateCollectionItemDto,
    @Req() req: RequestWithUser,
  ) {
    return this.collectionService.createCollectionItem(dto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('items/:userCollectionId')
  async findCollectionItemsById(
    @Param('userCollectionId') userCollectionId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.collectionService.findCollectionItemsById(
      userCollectionId,
      req.user.id,
    )
  }

  @UseGuards(JwtAuthGuard)
  @Patch('item/:id')
  @HttpCode(204)
  async updateCollectionItem(
    @Param('id') id: number,
    @Body() dto: UpdateCollectionItemDto,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.collectionService.updateCollectionItem(id, dto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('item/:itemId/photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
          cb(null, `${unique}${extname(file.originalname)}`)
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          )
        }
        cb(null, true)
      },
    }),
  )
  async uploadItemPhoto(
    @Param('itemId') itemId: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ): Promise<{ filename: string }> {
    if (!file) throw new BadRequestException('No file provided')
    return this.collectionService.addPhotoToItem(itemId, file.filename, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('item/:itemId/photo/:filename')
  @HttpCode(204)
  async deleteItemPhoto(
    @Param('itemId') itemId: number,
    @Param('filename') filename: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.collectionService.removePhotoFromItem(itemId, filename, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('item/:itemId')
  @HttpCode(204)
  async deleteCollectionItem(
    @Param('itemId') itemId: number,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.collectionService.deleteCollectionItem(itemId, req.user.id)
  }

  // ─── Collection Item Values ──────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('item-value/create')
  async createItemValue(
    @Body() dto: CreateItemValueDto,
    @Req() req: RequestWithUser,
  ) {
    return this.collectionService.createItemValue(dto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('item-values/:collectionItemId')
  async findItemValues(
    @Param('collectionItemId') collectionItemId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.collectionService.findItemValues(collectionItemId, req.user.id)
  }

  // ─── Complex Queries ─────────────────────────────────────────────────────────

  @Get('user-collection/:userCollectionId/table/public')
  async getCollectionTablePublic(
    @Param('userCollectionId') userCollectionId: number,
  ): Promise<CollectionTableResponseDto> {
    const result = await this.collectionService.getCollectionTable(
      userCollectionId,
      null,
    )
    if (!result) {
      throw new NotFoundException(
        `User collection ${userCollectionId} not found`,
      )
    }
    return result
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-collection/:userCollectionId/table')
  async getCollectionTable(
    @Param('userCollectionId') userCollectionId: number,
    @Req() req: RequestWithUser,
  ): Promise<CollectionTableResponseDto> {
    const result = await this.collectionService.getCollectionTable(
      userCollectionId,
      req.user.id,
    )
    if (!result) {
      throw new NotFoundException(
        `User collection ${userCollectionId} not found`,
      )
    }
    return result
  }
}
