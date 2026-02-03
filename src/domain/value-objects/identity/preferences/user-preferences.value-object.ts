import { Theme, UserPreferencesProps } from "../../../interfaces";

export class UserPreferencesValueObject {
  constructor(
    private readonly theme: Theme,
    private readonly language: string = 'en',
    private readonly notifications: boolean = true,
  ) {
    this.validate();
  }

  static create(props: UserPreferencesProps = {}): UserPreferencesValueObject {
    return new UserPreferencesValueObject(
      props.theme ?? Theme.SYSTEM,
      props.language ?? 'en',
      props.notifications ?? true,
    );
  }

  static fromPersistence(p: { theme: string; language: string; notifications: boolean; }) {
    const theme = Object.values(Theme).includes(p.theme as Theme) ? p.theme as Theme : Theme.LIGHT;
    return new UserPreferencesValueObject(
      theme,
      p.language,
      p.notifications,
    );
  }

  toPersistence() {
    return {
      theme: this.theme,
      language: this.language,
      notifications: this.notifications,
    }
  }

  getTheme(): Theme {
    return this.theme;
  }
  
  getLanguage(): string {
    return this.language;
  }

  isNotificationsEnabled(): boolean {
    return this.notifications;
  }

  private validate(): void {
    if (!Object.values(Theme).includes(this.theme)) {
      throw new Error('Invalid theme');
    }
    if (typeof this.language !== 'string' || this.language.length < 2) {
      throw new Error('Invalid language');
    }
    if (typeof this.notifications !== 'boolean') {
      throw new Error('Invalid notifications value');
    }
  }
}