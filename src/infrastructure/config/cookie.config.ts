import { CookieOptions } from "express";

export class CookieConfig {
  static getAuthCookieOptions(isProduction: boolean): CookieOptions {
    return {
      sameSite: isProduction ? 'strict' : 'lax',
      secure: isProduction,
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }
  }

  static readonly AUTH_COOKIE_NAME = 'access_token';
}