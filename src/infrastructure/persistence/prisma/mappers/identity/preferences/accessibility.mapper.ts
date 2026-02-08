import { Injectable } from '@nestjs/common';
import { AccessibilitySettings as PrismaAccessibilitySettings } from '@prisma/client';

export interface AccessibilitySettingsDomain {
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
}

@Injectable()
export class AccessibilityMapper {
  toDomain(model: PrismaAccessibilitySettings): AccessibilitySettingsDomain {
    return {
      id: model.id,
      language: model.language,
      timezone: model.timezone,
      dateFormat: model.dateFormat,
      numberFormat: model.numberFormat,
      currency: model.currency,
      timeFormat: model.timeFormat,
      highContrastMode: model.highContrastMode,
      reducedMotion: model.reducedMotion,
      screenReaderOptimized: model.screenReaderOptimized,
      fontSize: model.fontSize,
      keyboardNavigation: model.keyboardNavigation,
      colorBlindMode: model.colorBlindMode,
    };
  }
}
