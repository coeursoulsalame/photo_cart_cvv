import { Controller, Get, Query, Res, UsePipes, ValidationPipe, Patch, Body, Delete } from '@nestjs/common';
import { Response } from 'express';
import { GalleryService } from './gallery.service';
import { GetPhotosResponse, GetPhotosQueryDto, GetPhotoQueryDto, UpdateValueDto, DeletePhotoDto } from './gallery.dto';

@Controller('gallery')
export class GalleryController {
    constructor(private readonly galleryService: GalleryService) {}

    @Get('get-all')
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }))
    async getPhotos(@Query() query: GetPhotosQueryDto): Promise<GetPhotosResponse> {
        return await this.galleryService.getPhotos(query);
    }

    @Patch('update-value')
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateValue(@Body() updateValueDto: UpdateValueDto): Promise<{ success: boolean; message: string }> {
        return await this.galleryService.updateValue(updateValueDto.id, updateValueDto.value);
    }

    @Delete('delete-photo')
    @UsePipes(new ValidationPipe({ transform: true }))
    async deletePhoto(@Body() deletePhotoDto: DeletePhotoDto): Promise<{ success: boolean; message: string }> {
        return await this.galleryService.deletePhoto(deletePhotoDto.id, deletePhotoDto.fileName);
    }

    @Get('thumbnail')
    async getThumbnail(@Query() query: GetPhotoQueryDto, @Res() res: Response): Promise<void> {
        const thumbnailBuffer = await this.galleryService.getThumbnail(query.filename);
        
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(thumbnailBuffer);
    }

    @Get('photo')
    async getPhoto(@Query() query: GetPhotoQueryDto, @Res() res: Response): Promise<void> {
        const photoStream = await this.galleryService.getPhoto(query.filename);
        
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        
        photoStream.pipe(res);
    }
}