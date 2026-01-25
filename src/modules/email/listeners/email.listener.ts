import { OnEvent } from "@nestjs/event-emitter";
import { Injectable, Logger } from "@nestjs/common";
import { EmailService } from "../email.service";
import { VerifyUserEvent } from "@/events";

@Injectable()
export class EmailListener {
  private readonly log = new Logger(EmailListener.name);

  constructor(private readonly emailService: EmailService) {}

  @OnEvent('email.sendOtp', { async: true })
  async handleSendOtpEvent(payload: { to: string, name: string, otp: string }) {
    try {
      const sent = await this.emailService.sendOtpEmail(payload.to, payload.name, payload.otp);
      if (sent) {
        this.log.log(`OTP email sent to ${payload.to}`);
      } else {
        this.log.warn(`Failed to send OTP email to ${payload.to}`);
      }
      return sent;
    } catch (error) {
      this.log.error(`Error sending OTP email to ${payload.to}: ${error}`);
      return false;
    }
  }

  @OnEvent('email.sendWelcome', { async: true })
  async handleWelcomeEmailEvent(payload: { to: string, name: string }) {
    try {
      await this.emailService.welcomeUserEmail(payload.to, payload.name);
      return true;
    } catch {
      return false;
    }
  }

  @OnEvent('user.verified', { async: true })
  async handleUserVerifiedEvent(event: VerifyUserEvent) {
    try {
      await this.emailService.welcomeUserEmail(event.email, event.name);
      this.log.log(`Welcome email sent to verified user: ${event.email}`);
      return true;
    } catch (error) {
      this.log.error(`Error sending welcome email to verified user ${event.email}: ${error}`);
      return false;
    }
  }
}