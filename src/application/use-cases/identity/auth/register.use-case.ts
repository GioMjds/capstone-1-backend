import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IUserRepository } from '@/domain/repositories';
import { UserEntity } from '@/domain/entities';
import {
  EmailValueObject,
  PasswordValueObject,
  PhoneValueObject,
} from '@/domain/value-objects/identity';
import { RegisterUserDto } from '@/application/dto/identity/auth';
import { generateUserId, OtpService } from '@/shared/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserResponseDto } from '@/application/dto/responses';
import { Roles } from '@/domain/interfaces';
import { UserCreatedEvent } from '@/application/events/identity';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly otpService: OtpService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    dto: RegisterUserDto,
  ): Promise<{ message: string; user: UserResponseDto }> {
    const email = new EmailValueObject(dto.email);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser)
      throw new BadRequestException('User with this email already exists');

    const password = await PasswordValueObject.fromPlainText(dto.password);
    const phone = dto.phone ? new PhoneValueObject(dto.phone) : null;

    const userId = generateUserId();

    const user = new UserEntity(
      userId,
      dto.firstName,
      dto.lastName,
      email,
      password,
      phone,
      true,
      false,
      Roles.USER,
      null,
      null,
      new Date(),
      new Date(),
    );

    const savedUser = await this.userRepository.save(user);

    await this.processPostRegistration(savedUser);

    return {
      message: 'User registered successfully. Please verify your email.',
      user: this.mapToResponse(savedUser),
    };
  }

  private mapToResponse(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.getValue(),
      phone: user.phone?.getValue() || null,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: user.role,
      archivedAt: user.archivedAt,
    };
  }

  private async processPostRegistration(user: UserEntity): Promise<void> {
    const otp = this.otpService.generate();
    await this.otpService.store(user.email.getValue(), otp);

    this.eventEmitter.emit('email.sendOtp', {
      to: user.email.getValue(),
      name: user.getFullName(),
      otp,
    });

    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(
        user.id,
        user.email.getValue(),
        user.firstName,
        user.lastName,
        user.createdAt,
      ),
    );
  }
}
