import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { hashPassword } from './password.util.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    await this.ensureEmailAvailable(dto.email);
    const user = this.usersRepository.create({
      ...dto,
      password: await hashPassword(dto.password),
    });
    const saved = await this.usersRepository.save(user);
    return this.findOne(saved.id);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (dto.email && dto.email !== user.email) {
      await this.ensureEmailAvailable(dto.email);
    }
    const changes: Partial<User> = { ...dto };
    if (dto.password) {
      changes.password = await hashPassword(dto.password);
    }
    await this.usersRepository.update(id, changes);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }

  private async ensureEmailAvailable(email: string): Promise<void> {
    if (await this.usersRepository.existsBy({ email })) {
      throw new ConflictException('Email already in use');
    }
  }
}
