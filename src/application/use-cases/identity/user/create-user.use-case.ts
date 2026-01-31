import { Injectable, Inject, ConflictException } from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories';
import { UserEntity } from '@/domain/entities';
import { CreateUserDto } from '@/application/dto/user';
import {
  EmailValueObject,
  PasswordValueObject,
  PhoneValueObject,
} from '@/domain/value-objects';
import { generateUserId } from '@/shared/utils';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    const email = new EmailValueObject(dto.email);
    if (await this.userRepository.existsByEmail(email)) {
      throw new ConflictException('User with this email already exists.');
    }

    const password = PasswordValueObject.fromHash('');
    const phone = dto.phone ? new PhoneValueObject(dto.phone) : null;
    const userId = generateUserId();

    const user = new UserEntity(
      userId,
      dto.firstName,
      dto.lastName,
      email,
      password,
      phone,
    );

    return this.userRepository.save(user);
  }
}
