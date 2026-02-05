import { Theme } from "@/domain/interfaces";
import { UserPreferencesValueObject } from "@/domain/value-objects/identity";

export class UserPreferencesEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    private theme: Theme = Theme.LIGHT,
    private language: string,
    private notifications: boolean = true,
  ) {
    this.validate();
  }

  static reconstitute(payload: {
    id: string;
    userId: string;
    theme: string;
    language?: string;
    notifications: boolean;
  }): UserPreferencesEntity {
    const themeValue = Object.values(Theme).includes(payload.theme as Theme)
      ? (payload.theme as Theme)
      : Theme.LIGHT;

    return new UserPreferencesEntity(
      payload.id,
      payload.userId,
      themeValue,
      payload.language ?? 'en',
      !!payload.notifications,
    )
  }

  toValueObject(): UserPreferencesValueObject {
    return UserPreferencesValueObject.fromPersistence({
      theme: this.theme,
      language: this.language,
      notifications: this.notifications,
    });
  }

  getTheme(): Theme {
    return this.theme;
  }

  getLanguage(): string {
    return this.language;
  };

  isNotificationsEnabled(): boolean {
    return this.notifications;
  }

  updateTheme(theme: Theme): void {
    if (!Object.values(Theme).includes(theme)) 
      throw new Error('Invalid theme');
    this.theme = theme;
  }

  updateLanguage(language: string): void {
    if (typeof language !== 'string' || language.length < 2) 
      throw new Error('Invalid language');
    this.language = language;
  }

  setNotifications(enabled: boolean): void {
    this.notifications = !!enabled;
  }

  private validate(): void {
    if (!Object.values(Theme).includes(this.theme)) 
      throw new Error('Invalid theme');
    if (typeof this.language !== 'string' || this.language.length < 2)
      throw new Error('Invalid language');
    if (typeof this.notifications !== 'boolean') 
      throw new Error('Invalid notifications flag');
  }
}