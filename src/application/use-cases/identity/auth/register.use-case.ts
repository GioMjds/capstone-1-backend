import { Injectable, Inject, ConflictException } from "@nestjs/common";
import type { IUserRepository } from "@/domain/repositories";
import { UserEntity } from "@/domain/entities";
import { EmailValueObject, PasswordValueObject, PhoneValueObject } from "@/domain/value-objects";
import { RegisterUserDto } from "@/application/dto/auth";
import { generateUserId, OtpService } from "@/shared/utils";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AuthResponseDto } from "@/application/dto/responses";

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    private readonly otpService: OtpService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: RegisterUserDto): Promise<AuthResponseDto> {
    const email = new EmailValueObject(dto.email);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new ConflictException("User with this email already exists");

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
    )

    const savedUser = await this.userRepository.save(user);
    const otp = this.otpService.generate();
    await this.otpService.store(savedUser.email.getValue(), otp);

    this.eventEmitter.emit('email.sendOtp', {
      to: savedUser.email.getValue(),
      name: savedUser.getFullName(),
      otp,
    })

    return {
      user: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email.getValue(),
        phone: savedUser.phone?.getValue() || null,
        isActive: savedUser.isActive,
        isEmailVerified: savedUser.isEmailVerified,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
    }
  }
}