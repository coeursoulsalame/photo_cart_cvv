import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../services/user.service';
import { LoginUserDto } from '../dto/user.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post('login')
    async login(@Body() loginDto: LoginUserDto, @Res() res: Response) {
        const result = await this.userService.login(loginDto);
        
        res.cookie('token-photochki', result.token, { 
            secure: false, 
            sameSite: 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        
        return res.json(result);
    }

    @Post('logout')
    async logout(@Res() res: Response) {
        const result = await this.userService.logout();
        res.clearCookie('token-photochki');
        return res.json(result);
    }
}