import { Controller, Get, Query, Res, UsePipes, ValidationPipe, Patch, Body, Delete, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GalleryService } from './gallery.service';
import { GetPhotosResponse, GetPhotosQueryDto, GetPhotoQueryDto, UpdateValueDto, DeletePhotoDto } from './gallery.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gallery')
@UseGuards(JwtAuthGuard)
export class GalleryController {
    constructor(private readonly galleryService: GalleryService) {}

    @Get('get-all')
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }))
    async getPhotos(
        @Query() query: GetPhotosQueryDto,
        @GetUser('locationId') locationId: number,
    ): Promise<GetPhotosResponse> {
        return await this.galleryService.getPhotos(query, locationId);
    }

    @Patch('update-value')
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateValue(
        @Body() updateValueDto: UpdateValueDto,
        @GetUser('locationId') locationId: number,
    ): Promise<{ success: boolean; message: string }> {
        return await this.galleryService.updateValue(updateValueDto.id, updateValueDto.value, locationId);
    }

    @Delete('delete-photo')
    @UsePipes(new ValidationPipe({ transform: true }))
    async deletePhoto(
        @Body() deletePhotoDto: DeletePhotoDto,
        @GetUser('locationId') locationId: number,
    ): Promise<{ success: boolean; message: string }> {
        return await this.galleryService.deletePhoto(deletePhotoDto.id, deletePhotoDto.fileName, locationId);
    }

    @Get('thumbnail')
    async getThumbnail(
        @Query() query: GetPhotoQueryDto,
        @GetUser('locationId') locationId: number,
        @Res() res: Response
    ): Promise<void> {
        const thumbnailBuffer = await this.galleryService.getThumbnail(query.filename, locationId);
        
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(thumbnailBuffer);
    }

    @Get('photo')
    async getPhoto(
        @Query() query: GetPhotoQueryDto,
        @GetUser('locationId') locationId: number,
        @Res() res: Response
    ): Promise<void> {
        const photoStream = await this.galleryService.getPhoto(query.filename, locationId);
        
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        
        photoStream.pipe(res);
    }
}