export interface TokenPayload {
  userId: string;
  email: string;
}

export interface ITokenService {
  generateAccessToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload>;
  getTokenExpiresIn(): number;
}