import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './controllers/user.controller';
import { TokenController } from './controllers/token.controller';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('ACCESS_TOKEN_SECRET', '0987654321'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRES_IN', '168h'),
                },
            }),
        }),
    ],
    providers: [TokenService, UserService, JwtStrategy],
    controllers: [UserController, TokenController],
    exports: [TokenService, UserService, JwtStrategy]
})
export class AuthModule {}