import { RawHealthData, NormalizedActivity } from './types';

/**
 * HealthDataMapper ensures consistent data structures 
 * regardless of the source platform (iOS/Android).
 */
export class HealthDataMapper {
  /**
   * Normalizes raw platform data into our internal NormalizedActivity format.
   */
  static normalize(raw: RawHealthData): NormalizedActivity {
    return {
      steps_per_day: raw.steps,
      calories_burned: raw.calories || (raw.steps * 0.04), // Fallback calculation
      last_sync: raw.timestamp,
      platform_source: raw.source === 'watch' ? 'Smartwatch' : 'Smartphone'
    };
  }

  /**
   * Handles edge cases like missing or corrupt data points.
   */
  static validate(data: NormalizedActivity): boolean {
    if (data.steps_per_day < 0) return false;
    if (data.last_sync > Date.now()) return false;
    return true;
  }
}
