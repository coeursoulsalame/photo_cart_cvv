import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	generateAccessToken(payload: any): string {
		const expiresIn = this.configService.get('JWT_EXPIRES_IN', '168h');
		return this.jwtService.sign(payload, { expiresIn });
	}

	verifyToken(token: string): any {
		try {
			return this.jwtService.verify(token);
		} catch (err) {
			return null;
		}
	}
}