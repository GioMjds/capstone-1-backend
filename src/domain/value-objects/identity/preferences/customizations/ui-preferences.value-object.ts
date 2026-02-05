import { DomainException } from '@/shared/exceptions';

export class UIPreferencesValueObject {
  constructor(
    private readonly theme: string = 'light',
    private readonly language: string = 'en',
    private readonly timezone?: string,
    private readonly locale?: string,
  ) {
    this.validate();
  }

  static create(props: {
    theme?: string;
    language?: string;
    timezone?: string;
    locale?: string;
  }): UIPreferencesValueObject {
    return new UIPreferencesValueObject(
      props.theme ?? 'light',
      props.language ?? 'en',
      props.timezone,
      props.locale,
    );
  }

  static fromPersistence(data: Record<string, any>): UIPreferencesValueObject {
    return new UIPreferencesValueObject(
      data.theme ?? 'light',
      data.language ?? 'en',
      data.timezone,
      data.locale,
    );
  }

  toPersistence(): Record<string, any> {
    return {
      theme: this.theme,
      language: this.language,
      timezone: this.timezone,
      locale: this.locale,
    };
  }

  getTheme(): string {
    return this.theme;
  }

  getLanguage(): string {
    return this.language;
  }

  getTimezone(): string | undefined {
    return this.timezone;
  }

  getLocale(): string | undefined {
    return this.locale;
  }

  private validate(): void {
    const validThemes = ['light', 'dark', 'system'];
    if (!validThemes.includes(this.theme)) {
      throw new DomainException('Invalid theme value');
    }

    if (typeof this.language !== 'string' || this.language.length < 2) {
      throw new DomainException('Invalid language code');
    }

    if (this.timezone && typeof this.timezone !== 'string') {
      throw new DomainException('Invalid timezone');
    }

    if (this.locale && typeof this.locale !== 'string') {
      throw new DomainException('Invalid locale');
    }
  }
}
