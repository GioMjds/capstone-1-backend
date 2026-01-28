export interface SendOtpPayload {
  to: string;
  subject: string;
  body: string;
}

export interface SendVerificationPayload {
  to: string;
  name: string;
  verificationToken: string;
}

export interface WelcomeUserPayload {
  to: string;
  name: string;
}

export interface IEmailService {
  sendOtpEmail(payload: SendOtpPayload): Promise<void>;
  sendVerificationEmail(payload: SendVerificationPayload): Promise<void>;
  welcomeUserEmail(payload: WelcomeUserPayload): Promise<void>;
}