export abstract class IAccessibilityRepository {
  abstract getAccessibilitySettings(userId: string): Promise<{
    id: string;
    language: string;
    timezone: string;
    dateFormat: string;
    numberFormat: string;
    currency: string;
    timeFormat: string;
    highContrastMode: boolean;
    reducedMotion: boolean;
    screenReaderOptimized: boolean;
    fontSize: string;
    keyboardNavigation: boolean;
    colorBlindMode: string | null;
  } | null>;

  abstract updateAccessibilitySettings(
    userId: string,
    settings: Partial<{
      language: string;
      timezone: string;
      dateFormat: string;
      numberFormat: string;
      currency: string;
      timeFormat: string;
      highContrastMode: boolean;
      reducedMotion: boolean;
      screenReaderOptimized: boolean;
      fontSize: string;
      keyboardNavigation: boolean;
      colorBlindMode: string | null;
    }>,
  ): Promise<void>;
}
