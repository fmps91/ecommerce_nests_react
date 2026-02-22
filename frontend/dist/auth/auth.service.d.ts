import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        name: string;
        roleId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    login(loginDto: LoginDto): Promise<{
        access_token: any;
        user: {
            id: string;
            email: string;
            name: string;
            roleId: string;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: any;
        user: {
            id: string;
            email: string;
            name: string;
            roleId: string;
        };
    }>;
}
