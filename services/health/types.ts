export interface RawHealthData {
  steps: number;
  distance?: number;
  calories?: number;
  source: 'phone' | 'watch' | 'manual';
  timestamp: number;
}

export interface NormalizedActivity {
  steps_per_day: number;
  calories_burned: number;
  last_sync: number;
  platform_source: string;
}

export enum HealthPermissionStatus {
  UNDETERMINED = 'UNDETERMINED',
  GRANTED = 'GRANTED',
  DENIED = 'DENIED',
}
