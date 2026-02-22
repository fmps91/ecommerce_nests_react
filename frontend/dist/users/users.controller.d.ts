import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    findAll(): Promise<UserResponseDto[]>;
    findOne(id: string): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    remove(id: string): Promise<void>;
    toggleActive(id: string): Promise<UserResponseDto>;
}
