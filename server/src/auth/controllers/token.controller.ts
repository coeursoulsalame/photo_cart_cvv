import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { UserDto } from '../dto/user.dto';
import { PostgresHandler } from '../../database/handlers/postgres-handler';

@Controller('token')
export class TokenController {
	constructor(
		private readonly tokenService: TokenService,
		private readonly userService: UserService,
		private readonly postgresHandler: PostgresHandler,
	) {}

  	@Post('verify')
	async verifyToken(@Body() body: { token: string }, @Res() res: Response) {
		try {
			const decoded = this.tokenService.verifyToken(body.token);
			if (decoded) {
				const user = await this.userService.findById(decoded.id);
				if (user) {
					const userDto = await UserDto.fromUserModel(user, this.postgresHandler);
					return res.status(HttpStatus.OK).json({ user: userDto });
				} else {
					return res.status(HttpStatus.UNAUTHORIZED).send();
				}
			} else {
				return res.status(HttpStatus.UNAUTHORIZED).send();
			}
		} catch (err) {
			return res.status(HttpStatus.UNAUTHORIZED).send();
		}
	}
}