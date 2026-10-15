import { UsersService } from '../users/users.service.js';
import { MicrosoftLoginDto } from './dto/microsoft-login.dto.js';
import { MicrosoftTokenService } from './microsoft-token.service.js';
export declare class AuthController {
    private readonly microsoftTokenService;
    private readonly usersService;
    constructor(microsoftTokenService: MicrosoftTokenService, usersService: UsersService);
    microsoftLogin(dto: MicrosoftLoginDto): Promise<import("../users/entities/user.entity.js").User>;
}
