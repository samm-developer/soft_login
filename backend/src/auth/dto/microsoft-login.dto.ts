import { IsJWT } from 'class-validator';

export class MicrosoftLoginDto {
  @IsJWT()
  idToken: string;
}
