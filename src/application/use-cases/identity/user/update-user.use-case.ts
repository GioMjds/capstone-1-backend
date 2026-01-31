import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories';
import { UpdateUserDto } from '@/application/dto/user';
import { UserEntity } from '@/domain/entities';
import { EmailValueObject, PhoneValueObject } from '@/domain/value-objects';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (dto.email) {
      const emailVo = new EmailValueObject(dto.email);
      const exists = await this.userRepository.findByEmail(emailVo);
      if (exists && exists.id !== id) {
        throw new ConflictException('User with this email already exists.');
      }
      user.changeEmail(emailVo);
    }

    const phoneVo = dto.phone ? new PhoneValueObject(dto.phone) : undefined;
    user.updateProfile(dto.firstName, dto.lastName, phoneVo);

    return this.userRepository.update(user);
  }
}
