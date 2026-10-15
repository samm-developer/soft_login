import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { MicrosoftTokenService } from './microsoft-token.service.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [MicrosoftTokenService],
})
export class AuthModule {}
