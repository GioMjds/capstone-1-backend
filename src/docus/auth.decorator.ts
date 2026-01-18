import { LoginUserDto, RegisterUserDto, ResendVerificationDto, VerifyUserDto } from '@/modules/auth/dto';
import { GoogleLoginOAuthDto } from '@/modules/auth/dto/oauth.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiTooManyRequestsResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiNotFoundResponse
} from '@nestjs/swagger';

export const RegisterDocs = () => applyDecorators(
  ApiOperation({
    summary: 'Register a new user account',
    description: `
      Registers a new user and initiates email verification flow via OTP.
      
      **Feature:** Authentication > User Registration
      **Module:** auth
      
      **Flow:**
      1. Validate email format and password strength
      2. Check if email already exists in the system
      3. Hash password using secure algorithm
      4. Create user record in database
      5. Generate 6-digit OTP code
      6. Send OTP via email to user
      
      **Related Endpoints:**
      - POST /auth/verify-email - Verify the OTP code
      - POST /auth/resend-verif - Resend OTP email
      
      **Business Rules:**
      - Email must be unique across all users
      - Password must meet complexity requirements (min 8 chars, uppercase, lowercase, number, special char)
      - Confirmation password must match password
      - OTP expires in 10 minutes
    `
  }),
  ApiBody({ 
    type: RegisterUserDto,
    description: 'User registration credentials including first name, last name, email, password, and password confirmation'
  }),
  ApiOkResponse({
    description: 'User registered successfully. A verification email has been sent to the provided email address.'
  }),
  ApiBadRequestResponse({ 
    description: 'Invalid input data. Email format invalid, password does not meet requirements, or passwords do not match.' 
  }),
  ApiConflictResponse({ 
    description: 'Email address is already registered in the system.' 
  }),
  ApiTooManyRequestsResponse({ 
    description: 'Too many registration attempts. Please try again later.' 
  }),
  ApiInternalServerErrorResponse({
    description: 'Unexpected server error occurred during registration.'
  })
);

export const LoginDocs = () => applyDecorators(
  ApiOperation({
    summary: 'Authenticate user and get access token',
    description: `
      Authenticates user credentials and returns JWT access token via HTTP-only cookie.
      
      **Feature:** Authentication > User Login
      **Module:** auth
      
      **Flow:**
      1. Validate email format and password
      2. Find user by email in database
      3. Verify password hash matches
      4. Check if user email is verified
      5. Generate JWT access token
      6. Set token in HTTP-only cookie
      7. Return success response
      
      **Related Endpoints:**
      - POST /auth/logout - Clear access token
      - POST /auth/register - Create new account
      
      **Business Rules:**
      - Email must be verified before login is allowed
      - Token expires based on JWT configuration
      - Failed login attempts may trigger rate limiting
      - Access token stored in HTTP-only cookie for security
    `
  }),
  ApiBody({ 
    type: LoginUserDto,
    description: 'User login credentials (email and password)'
  }),
  ApiOkResponse({
    description: 'Login successful. Access token set in HTTP-only cookie.'
  }),
  ApiBadRequestResponse({ 
    description: 'Invalid email format or password format.' 
  }),
  ApiUnauthorizedResponse({ 
    description: 'Invalid credentials or email not verified.' 
  }),
  ApiTooManyRequestsResponse({ 
    description: 'Too many login attempts. Please try again later.' 
  }),
  ApiInternalServerErrorResponse({
    description: 'Unexpected server error occurred during login.'
  })
);

export const LogoutDocs = () => applyDecorators(
  ApiOperation({
    summary: 'Logout user and clear session',
    description: `
      Logs out the current user by clearing the access token cookie.
      
      Feature: Authentication > User Logout
      Module: auth
      
      **Flow:**
      1. Validate user is authenticated
      2. Clear access_token cookie
      3. Return success response
      
      **Business Rules:**
      - User must be authenticated to logout
      - Cookie is cleared regardless of token validity
    `
  }),
  ApiBearerAuth(),
  ApiOkResponse({
    description: 'Logout successful. Access token cookie cleared.'
  }),
  ApiUnauthorizedResponse({ 
    description: 'Access token is missing, invalid, or expired.' 
  }),
  ApiInternalServerErrorResponse({
    description: 'Unexpected server error occurred during logout.'
  })
);

export const VerifyEmailDocs = () => applyDecorators(
  ApiOperation({
    summary: 'Verify user email address with OTP',
    description: `
      Verifies user email using the 6-digit OTP code sent during registration.
      
      **Feature:** Authentication > Email Verification
      **Module:** auth
      
      **Flow:**
      1. Validate email and OTP format
      2. Find user by email address
      3. Verify OTP code matches
      4. Check if OTP is not expired
      5. Mark user email as verified
      6. Clear OTP from database
      7. Generate access token
      8. Set token in HTTP-only cookie
      
      **Related Endpoints:**
      - POST /auth/register - Initial registration
      - POST /auth/resend-verif - Request new OTP
      
      **Business Rules:**
      - OTP is valid for 10 minutes
      - OTP can only be used once
      - After verification, user is automatically logged in
    `
  }),
  ApiBody({ 
    type: VerifyUserDto,
    description: 'Email address and 6-digit OTP code received via email'
  }),
  ApiOkResponse({
    description: 'Email verified successfully. User is now logged in.'
  }),
  ApiBadRequestResponse({ 
    description: 'Invalid or expired verification token.' 
  }),
  ApiNotFoundResponse({
    description: 'Verification token not found or already used.'
  }),
  ApiTooManyRequestsResponse({ 
    description: 'Too many verification attempts. Please try again later.' 
  }),
  ApiInternalServerErrorResponse({
    description: 'Unexpected server error occurred during verification.'
  })
);

export const ResendVerificationDocs = () => applyDecorators(
  ApiOperation({
    summary: 'Resend email verification OTP',
    description: `
      Resends a new OTP code to a user who has not yet verified their email.
      
      **Feature:** Authentication > Email Verification
      **Module:** auth
      
      **Flow:**
      1. Validate email format
      2. Find user by email
      3. Check if email is not already verified
      4. Generate new 6-digit OTP code
      5. Update user OTP and expiry in database
      6. Send OTP email
      
      **Related Endpoints:**
      - POST /auth/verify-email - Verify the OTP code
      - POST /auth/register - Initial registration
      
      **Business Rules:**
      - User must exist in the system
      - Email must not already be verified
      - Previous OTP is invalidated
      - New OTP expires in 10 minutes
      - Rate limited to prevent email spam
    `
  }),
  ApiBody({ 
    type: ResendVerificationDto,
    description: 'Email address to resend verification to'
  }),
  ApiOkResponse({
    description: 'Verification email sent successfully.'
  }),
  ApiBadRequestResponse({ 
    description: 'Invalid email format or email already verified.' 
  }),
  ApiNotFoundResponse({
    description: 'No user found with this email address.'
  }),
  ApiTooManyRequestsResponse({ 
    description: 'Too many resend attempts. Please try again later.' 
  }),
  ApiInternalServerErrorResponse({
    description: 'Unexpected server error occurred.'
  })
);

export const GoogleOAuthLoginDocs = () => applyDecorators(
  ApiOperation({
    summary: 'Authenticate user via Google OAuth',
    description: `
      Authenticates a user using their Google account ID token.
      
      **Feature:** Authentication > OAuth Login
      **Module:** auth
      
      **Flow:**
      1. Validate Google ID token
      2. Verify token with Google OAuth API
      3. Extract user information from token
      4. Find or create user in database
      5. Generate JWT access token
      6. Return access token
      
      **Related Endpoints:**
      - POST /auth/login - Standard email/password login
      - POST /auth/logout - Clear session
      
      **Business Rules:**
      - Google ID token must be valid and not expired
      - If user doesn't exist, account is created automatically
      - Email from Google is automatically marked as verified
      - Existing users with same email are linked to Google account
    `
  }),
  ApiBody({ 
    type: GoogleLoginOAuthDto,
    description: 'Google OAuth ID token from client-side authentication'
  }),
  ApiOkResponse({
    description: 'Google OAuth login successful. Access token returned.'
  }),
  ApiBadRequestResponse({ 
    description: 'Invalid or malformed Google ID token.' 
  }),
  ApiUnauthorizedResponse({ 
    description: 'Google ID token is invalid, expired, or verification failed.' 
  }),
  ApiTooManyRequestsResponse({ 
    description: 'Too many login attempts. Please try again later.' 
  }),
  ApiInternalServerErrorResponse({
    description: 'Unexpected server error occurred during OAuth login.'
  })
);