import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';
import { UserEntity } from './entities/user.entity';
import { Sequelize } from 'sequelize-typescript';
export declare class UsersService {
    private sequelize;
    constructor(sequelize: Sequelize);
    private get userRepository();
    create(createUserDto: CreateUserDto): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findAllWithDeleted(): Promise<UserEntity[]>;
    findOne(id: string): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    remove(id: string): Promise<void>;
    hardRemove(id: string): Promise<void>;
    toggleActive(id: string): Promise<UserEntity>;
    restore(id: string): Promise<UserEntity>;
    findAdmins(): Promise<UserEntity[]>;
    findByRole(role: UserRole): Promise<UserEntity[]>;
}
