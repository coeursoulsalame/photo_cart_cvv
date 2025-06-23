import { HttpException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class UserDto {
    id: number;
    name: string;
    login: string;
    email: string;
    roleId: number | null;
    roleRuName: string | null;
    locationId: number | null;
    locationName: string | null;
  
    constructor(user: any) {
        this.id = user.id;
        this.name = user.name;
        this.login = user.login;
        this.email = user.email;
        this.roleId = user.roleId;
        this.roleRuName = user.roleRuName;
        this.locationId = user.locationId;
        this.locationName = user.locationName;
    }
  
    static async fromUserModel(user: any, databaseHandler: any): Promise<UserDto> {
        try {
            if (user.roleId && user.roleRuName) {
                return new UserDto(user);
            }
            
            const roleSql = `
                SELECT rb.role_id, r.ru_name 
                FROM roles_bind rb
                JOIN roles r ON rb.role_id = r.id
                WHERE rb.user_id = $1
                LIMIT 1
            `;
            const roleResult = await databaseHandler.queryMain(roleSql, [user.id]);
            
            return new UserDto({ 
                ...user, 
                roleId: roleResult.rows.length > 0 ? roleResult.rows[0].role_id : null, 
                roleRuName: roleResult.rows.length > 0 ? roleResult.rows[0].ru_name : null
            });
        } catch (error: any) {
            throw new HttpException(
                {
                    error: error.message,
                    details: 'Ошибка при получении данных UserDTO.fromUserModel'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
  
    toPlainObject() {
        return {
            id: this.id,
            name: this.name,
            login: this.login,
            email: this.email,
            roleId: this.roleId,
            roleRuName: this.roleRuName,
            locationId: this.locationId,
            locationName: this.locationName,
        };
    }
}
  
export class LoginUserDto {
    @IsNumber()
    @IsOptional()
    id: number;
    
    @IsString()
    @IsNotEmpty({message: 'Логин не может быть пустым'})
    login: string;
    
    @IsString()
    @IsNotEmpty({message: 'Пароль не может быть пустым'})
    password: string;

    @IsString()
    @IsOptional()
    name?: string;
    
    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    locationName?: string;

    @IsNumber()
    @IsOptional()
    locationId?: number;
}