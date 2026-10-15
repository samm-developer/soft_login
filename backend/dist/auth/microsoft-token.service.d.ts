import { ConfigService } from '@nestjs/config';
import { type JWTPayload } from 'jose';
export interface MicrosoftIdTokenClaims extends JWTPayload {
    oid: string;
    tid: string;
    name?: string;
    email?: string;
    preferred_username?: string;
}
export declare class MicrosoftTokenService {
    private readonly jwks;
    private readonly clientId;
    private readonly tenantId;
    constructor(config: ConfigService);
    verifyIdToken(idToken: string): Promise<MicrosoftIdTokenClaims>;
}
