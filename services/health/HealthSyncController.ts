import { HealthPermissionService } from './HealthPermissionService';
import { HealthDataReaderService } from './HealthDataReaderService';
import { HealthDataMapper } from './HealthDataMapper';
import { HealthPermissionStatus, NormalizedActivity } from './types';

/**
 * HealthSyncController is the main entry point for the app 
 * to interact with health data.
 */
export class HealthSyncController {
  static async sync(): Promise<NormalizedActivity | null> {
    try {
      let status = await HealthPermissionService.getStatus();

      if (status !== HealthPermissionStatus.GRANTED) {
        const result = await HealthPermissionService.requestAccess();
        if (!result) return null;
      }

      const rawData = await HealthDataReaderService.readDailyData();
      const normalized = HealthDataMapper.normalize(rawData);

      if (HealthDataMapper.validate(normalized)) {
        return normalized;
      }

      return null;
    } catch (error) {
      console.error("HealthSyncController Error:", error);
      return null;
    }
  }

  static async isConnected(): Promise<boolean> {
    const status = await HealthPermissionService.getStatus();
    return status === HealthPermissionStatus.GRANTED;
  }
}
