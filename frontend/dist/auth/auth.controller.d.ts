import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): any;
}
