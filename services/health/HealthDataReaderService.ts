import { RawHealthData } from './types';

/**
 * HealthDataReaderService performs the actual read operations
 * from the platform's health database.
 */
export class HealthDataReaderService {
  /**
   * Reads data for the current day.
   */
  static async readDailyData(): Promise<RawHealthData> {
    // Simulated reading from native health bridge
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generates realistic variation for the demo
        const baseSteps = 4000;
        const randomBonus = Math.floor(Math.random() * 2000);
        
        resolve({
          steps: baseSteps + randomBonus,
          distance: 4.2,
          calories: 180,
          source: 'watch',
          timestamp: Date.now()
        });
      }, 1200);
    });
  }

  /**
   * Reads a range of data (e.g. for weekly trends).
   */
  static async readRangeData(days: number): Promise<RawHealthData[]> {
    // Mocking historical data
    return Array.from({ length: days }).map((_, i) => ({
      steps: 5000 + Math.floor(Math.random() * 3000),
      source: 'phone',
      timestamp: Date.now() - (i * 86400000)
    }));
  }
}
