import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostgresHandler } from 'src/database/handlers/postgres-handler';
import { TokenService } from './token.service';
import { LoginUserDto } from '../dto/user.dto';
import axios from 'axios';

export class User {
    id: number;
    name: string;
    login: string;
    password: string;
    email?: string;
    locationId?: number;
    locationName?: string | null;
    app_access?: boolean;
    roleId?: number | null;
    roleRuName?: string | null;

    constructor(userData: any) {
        this.id = userData.id;
        this.name = userData.name;
        this.login = userData.login;
        this.password = userData.password;
        this.email = userData.email;
        this.locationId = userData.location_id;
        this.locationName = userData.locationName;
        this.app_access = userData.app_access;
        this.roleId = userData.roleId;
        this.roleRuName = userData.roleRuName;
    }
}

@Injectable()
export class UserService {
    constructor(
        private readonly databaseHandler: PostgresHandler,
        private readonly tokenService: TokenService,
    ) {}

    async findByLogin(login: string): Promise<User | null> {
        try {
            const sql = 'SELECT * FROM users WHERE login = $1';
            const values = [login];
            const result = await this.databaseHandler.queryMain(sql, values);
            
            if (result.rows.length > 0) {
                const user = new User(result.rows[0]);
                const roleInfo = await this.getUserRole(user.id);
                if (roleInfo) {
                    user.roleId = roleInfo.id;
                    user.roleRuName = roleInfo.ru_name;
                }
                
                if (user.locationId) {
                    user.locationName = await this.getLocationName(user.locationId);
                }
                
                return user;
            }
            return null;
        } catch (error) {
            throw new HttpException(
                {
                    error: error.message,
                    details: 'Пользователь не найден'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findById(id: number): Promise<User | null> {
        try {
            const sql = 'SELECT * FROM users WHERE id = $1';
            const values = [id];
            const result = await this.databaseHandler.queryMain(sql, values);
            
            if (result.rows.length > 0) {
                const user = new User(result.rows[0]);
                const roleInfo = await this.getUserRole(user.id);
                if (roleInfo) {
                    user.roleId = roleInfo.id;
                    user.roleRuName = roleInfo.ru_name;
                }
                
                if (user.locationId) {
                    user.locationName = await this.getLocationName(user.locationId);
                }
                
                return user;
            }
            return null;
        } catch (error) {
            throw new HttpException(
                {
                    error: error.message,
                    details: 'Пользователь не найден'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    private async getUserRole(userId: number): Promise<{id: number, ru_name: string} | null> {
        try {
            const sql = `
                SELECT r.id, r.ru_name
                FROM roles r 
                JOIN roles_bind rb ON r.id = rb.role_id 
                WHERE rb.user_id = $1
                LIMIT 1
            `;
            const values = [userId];
            const result = await this.databaseHandler.queryMain(sql, values);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            throw new HttpException(
                {
                    error: error.message,
                    details: 'Ошибка при получении роли пользователя'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    private async getLocationName(locationId: number): Promise<string | null> {
        if (!locationId) return null;
        
        try {
            const sql = `
                SELECT name 
                FROM location 
                WHERE id = $1
                LIMIT 1
            `;
            const values = [locationId];
            const result = await this.databaseHandler.queryMain(sql, values);
            return result.rows.length > 0 ? result.rows[0].name : null;
        } catch (error) {
            console.error('Error getting location name:', error);
            return null;
        }
    }
    
    async login(loginDto: LoginUserDto) {
        try {
            let user = await this.findByLogin(loginDto.login);
            
            if (!user) {
                if (!loginDto.id) {
                    throw new HttpException(
                        {
                            error: 'Invalid user data',
                            details: 'ID пользователя обязателен'
                        },
                        HttpStatus.BAD_REQUEST
                    );
                }
                
                const client = await this.databaseHandler.getClient();
                try {
                    await client.query('BEGIN');
                    
                    const insertUserSql = `
                        INSERT INTO users (id, login, name, email, app_access, location_id)
                        VALUES ($1, $2, $3, $4, true, $5)
                        RETURNING *
                    `;
                    const insertUserValues = [
                        loginDto.id,
                        loginDto.login,
                        loginDto.name, 
                        loginDto.email,
                        loginDto.locationId
                    ];
                    
                    const userResult = await client.query(insertUserSql, insertUserValues);
                    
                    if (userResult.rows.length > 0) {
                        const insertRoleSql = `
                            INSERT INTO roles_bind (user_id, role_id)
                            VALUES ($1, 2)
                        `;
                        await client.query(insertRoleSql, [loginDto.id]);
                        
                        await client.query('COMMIT');
                        
                        user = new User(userResult.rows[0]);
                        user.roleId = 2;
                        user.app_access = true;
                    }
                    
                } catch (error) {
                    await client.query('ROLLBACK');
                    throw new HttpException(
                        {
                            error: error.message,
                            details: 'Ошибка при добавлении пользователя'
                        },
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                } finally {
                    client.release();
                }

                if (!user) {
                    throw new HttpException(
                        {
                            error: 'User creation failed',
                            details: 'Не удалось создать пользователя'
                        },
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                }
            }
            
            if (!user.app_access) {
                throw new HttpException(
                    {
                        error: 'No access',
                        details: 'Нет доступа в приложение'
                    },
                    HttpStatus.FORBIDDEN
                );
            }
            
            try {
                const response = await axios.post('http://10.16.0.39:5000/api/auth/login', {
                    userDN: user.login,
                    password: loginDto.password
                });
                
                if (response.data) {
                    const roleInfo = await this.getUserRole(user.id);
                    const locationName = user.locationId !== undefined ? await this.getLocationName(user.locationId) : null;
                    
                    const userData = {
                        id: user.id,
                        name: user.name,
                        login: user.login,
                        roleId: roleInfo?.id || null,
                        roleRuName: roleInfo?.ru_name || null,
                        email: user.email,
                        locationId: user.locationId,
                        locationName: locationName
                    };
                    
                    const token = this.tokenService.generateAccessToken(userData);
                    
                    return {
                        token,
                        user: userData
                    };
                } else {
                    throw new HttpException(
                        {
                            error: 'Invalid credentials',
                            details: 'Неверный логин или пароль'
                        },
                        HttpStatus.UNAUTHORIZED
                    );
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    throw new HttpException(
                        {
                            error: error.message,
                            details: 'Неверный логин или пароль'
                        },
                        HttpStatus.UNAUTHORIZED
                    );
                }
                
                throw new HttpException(
                    {
                        error: error.message,
                        details: 'Ошибка при получении данных из внешнего API'
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new HttpException(
                {
                    error: error.message,
                    details: 'Ошибка при входе'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    
    async logout() {
        return {
            message: 'successfull logout'
        };
    }
}