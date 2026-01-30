import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { VerifyUserEvent } from '../events/verify-user.event';
import { EmailService } from '../email.service';

@Injectable()
export class EmailListener {
  private readonly log = new Logger(EmailListener.name);

  constructor(private readonly emailService: EmailService) {}

  @OnEvent('email.sendOtp', { async: true })
  async handleSendOtpEvent(payload: { to: string; name: string; otp: string }) {
    try {
      const sent = await this.emailService.sendOtpEmail(
        payload.to,
        payload.name,
        payload.otp,
      );
      return sent;
    } catch (error) {
      this.log.error(`Error sending OTP email to ${payload.to}: ${error}`);
      return false;
    }
  }

  @OnEvent('email.sendWelcome', { async: true })
  async handleWelcomeEmailEvent(payload: { to: string; name: string }) {
    try {
      await this.emailService.welcomeUserEmail(payload.to, payload.name);
      return true;
    } catch (error) {
      this.log.error(`Error sending welcome email to ${payload.to}: ${error}`);
      return false;
    }
  }

  @OnEvent('user.verified', { async: true })
  async handleUserVerifiedEvent(event: VerifyUserEvent) {
    try {
      await this.emailService.welcomeUserEmail(event.email, event.name);
      return true;
    } catch (error) {
      this.log.error(
        `Error sending welcome email to verified user ${event.email}: ${error}`,
      );
      return false;
    }
  }
}
