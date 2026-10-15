import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

const MULTI_TENANT_AUTHORITIES = ['common', 'organizations', 'consumers'];

export interface MicrosoftIdTokenClaims extends JWTPayload {
  oid: string;
  tid: string;
  name?: string;
  email?: string;
  preferred_username?: string;
}

@Injectable()
export class MicrosoftTokenService {
  private readonly jwks = createRemoteJWKSet(
    new URL('https://login.microsoftonline.com/common/discovery/v2.0/keys'),
  );
  private readonly clientId: string;
  private readonly tenantId: string;

  constructor(config: ConfigService) {
    this.clientId = config.getOrThrow<string>('AZURE_CLIENT_ID');
    this.tenantId = config.get<string>('AZURE_TENANT_ID', 'common');
  }

  async verifyIdToken(idToken: string): Promise<MicrosoftIdTokenClaims> {
    let payload: JWTPayload;
    try {
      ({ payload } = await jwtVerify(idToken, this.jwks, {
        audience: this.clientId,
      }));
    } catch {
      throw new UnauthorizedException('Invalid Microsoft ID token');
    }

    const { oid, tid, iss } = payload;
    if (typeof oid !== 'string' || typeof tid !== 'string') {
      throw new UnauthorizedException('Microsoft ID token is missing claims');
    }
    // The issuer is tenant-specific, so it can only be checked once tid is known.
    if (iss !== `https://login.microsoftonline.com/${tid}/v2.0`) {
      throw new UnauthorizedException('Unexpected Microsoft token issuer');
    }
    if (
      !MULTI_TENANT_AUTHORITIES.includes(this.tenantId) &&
      tid !== this.tenantId
    ) {
      throw new UnauthorizedException('Microsoft tenant is not allowed');
    }
    return payload as MicrosoftIdTokenClaims;
  }
}
