var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { hashPassword } from './password.util.js';
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(dto) {
        await this.ensureEmailAvailable(dto.email);
        const user = this.usersRepository.create({
            ...dto,
            password: await hashPassword(dto.password),
        });
        const saved = await this.usersRepository.save(user);
        return this.findOne(saved.id);
    }
    findAll() {
        return this.usersRepository.find({ order: { createdAt: 'DESC' } });
    }
    async findOne(id) {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User ${id} not found`);
        }
        return user;
    }
    async update(id, dto) {
        const user = await this.findOne(id);
        if (dto.email && dto.email !== user.email) {
            await this.ensureEmailAvailable(dto.email);
        }
        const changes = { ...dto };
        if (dto.password) {
            changes.password = await hashPassword(dto.password);
        }
        await this.usersRepository.update(id, changes);
        return this.findOne(id);
    }
    async remove(id) {
        const result = await this.usersRepository.delete(id);
        if (!result.affected) {
            throw new NotFoundException(`User ${id} not found`);
        }
    }
    async ensureEmailAvailable(email) {
        if (await this.usersRepository.existsBy({ email })) {
            throw new ConflictException('Email already in use');
        }
    }
};
UsersService = __decorate([
    Injectable(),
    __param(0, InjectRepository(User)),
    __metadata("design:paramtypes", [Repository])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map