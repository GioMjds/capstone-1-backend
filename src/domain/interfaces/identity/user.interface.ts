export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export type UserPreferencesProps = {
  theme?: Theme;
  language?: string;
  notifications?: boolean;
}

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}