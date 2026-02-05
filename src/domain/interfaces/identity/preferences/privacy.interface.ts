export enum OnlineStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  OFFLINE = 'offline',
  INVISIBLE = 'invisible',
}

export enum ProfileVisibility {
  PUBLIC = 'public',
  FRIENDS_ONLY = 'friends_only',
  PRIVATE = 'private',
}

export enum VisibilityLevel {
  PUBLIC = 'public',
  FRIENDS_ONLY = 'friends_only',
  PRIVATE = 'private',
  CUSTOM = 'custom',
}

export enum ActivityVisibility {
  EVERYONE = 'everyone',
  FRIENDS_ONLY = 'friends_only',
  NO_ONE = 'no_one',
}

export interface IActivityVisibilitySettings {
  showLoginActivity: boolean;
  showLastSeen: boolean;
  showProfileViews: boolean;
  showContentInteractions: boolean;
}

export interface IFieldLevelVisibility {
  email: VisibilityLevel;
  phone: VisibilityLevel;
  fullName: VisibilityLevel;
  avatar: VisibilityLevel;
  bio: VisibilityLevel;
}

export interface IPrivacySettings {
  id: string;
  userPreferencesId: string;
  profileVisibility: string;
  activityVisibility: IActivityVisibilitySettings;
  fieldLevelVisibility: IFieldLevelVisibility;
  onlinePresence: string;
  allowPublicProfile: boolean;
  allowSearchEngineIndex: boolean;
  allowThirdPartySharing: boolean;
  createdAt: Date;
  updatedAt: Date;
}