import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private readonly userService: UserService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					if (request && request.cookies && request.cookies['token-photochki']) {
						return request.cookies['token-photochki'];
					}
					return null;
				},
				ExtractJwt.fromAuthHeaderAsBearerToken()
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get('ACCESS_TOKEN_SECRET', '0987654321'),
		});
	}

	async validate(payload: any) {
		try {
			const user = await this.userService.findById(payload.id);
			
			if (!user) {
				throw new UnauthorizedException('Пользователь не найден');
			}
			
			return { 
				...payload,
				roleId: user.roleId, 
				roleRuName: user.roleRuName,
				locationId: user.locationId,
				locationName: user.locationName
			};
		} catch (error) {
			throw new UnauthorizedException('Недействительный токен');
		}
	}
}