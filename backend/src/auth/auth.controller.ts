import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { MicrosoftLoginDto } from './dto/microsoft-login.dto.js';
import { MicrosoftTokenService } from './microsoft-token.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly microsoftTokenService: MicrosoftTokenService,
    private readonly usersService: UsersService,
  ) {}

  @Post('microsoft')
  @HttpCode(HttpStatus.OK)
  async microsoftLogin(@Body() dto: MicrosoftLoginDto) {
    const claims = await this.microsoftTokenService.verifyIdToken(dto.idToken);
    const email = claims.email ?? claims.preferred_username;
    if (!email) {
      throw new UnauthorizedException('Microsoft account has no email');
    }
    return this.usersService.findOrCreateMicrosoftUser({
      microsoftId: claims.oid,
      email: email.toLowerCase(),
      name: claims.name ?? email,
    });
  }
}
