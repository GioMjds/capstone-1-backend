import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GoogleLoginOAuthDto {
  @ApiProperty({ 
    description: 'Google OAuth ID token obtained from client-side Google Sign-In',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdka2J0N2RxMTY5MTU0Y2E2YTc2YjEifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMjM0NTY3ODkwLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwi...',
    required: true
  })
  @IsString()
  idToken: string;
}