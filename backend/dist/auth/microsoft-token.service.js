var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify } from 'jose';
const MULTI_TENANT_AUTHORITIES = ['common', 'organizations', 'consumers'];
let MicrosoftTokenService = class MicrosoftTokenService {
    jwks = createRemoteJWKSet(new URL('https://login.microsoftonline.com/common/discovery/v2.0/keys'));
    clientId;
    tenantId;
    constructor(config) {
        this.clientId = config.getOrThrow('AZURE_CLIENT_ID');
        this.tenantId = config.get('AZURE_TENANT_ID', 'common');
    }
    async verifyIdToken(idToken) {
        let payload;
        try {
            ({ payload } = await jwtVerify(idToken, this.jwks, {
                audience: this.clientId,
            }));
        }
        catch {
            throw new UnauthorizedException('Invalid Microsoft ID token');
        }
        const { oid, tid, iss } = payload;
        if (typeof oid !== 'string' || typeof tid !== 'string') {
            throw new UnauthorizedException('Microsoft ID token is missing claims');
        }
        if (iss !== `https://login.microsoftonline.com/${tid}/v2.0`) {
            throw new UnauthorizedException('Unexpected Microsoft token issuer');
        }
        if (!MULTI_TENANT_AUTHORITIES.includes(this.tenantId) &&
            tid !== this.tenantId) {
            throw new UnauthorizedException('Microsoft tenant is not allowed');
        }
        return payload;
    }
};
MicrosoftTokenService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], MicrosoftTokenService);
export { MicrosoftTokenService };
//# sourceMappingURL=microsoft-token.service.js.map