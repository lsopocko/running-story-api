import { Experience, RestType } from 'src/training/types';

export function marathonSpeedWork(racePace: number) {
  return {
    [Experience.FirstTimer]: [
      {
        reps: 8,
        interval: 400,
        pace: racePace * 0.9, // Faster than race pace
        restType: RestType.Break,
        rest: 90,
      },
      {
        reps: 6,
        interval: 800,
        pace: racePace * 0.95, // Threshold pace
        restType: RestType.Jog,
        rest: 120,
      },
      {
        reps: 5,
        interval: 1000,
        pace: racePace * 0.95,
        restType: RestType.Jog,
        rest: 180,
      },
      {
        reps: 3,
        interval: 2000,
        pace: racePace * 1.0,
        restType: RestType.Jog,
        rest: 300,
      },
    ],
    [Experience.Beginner]: [
      {
        reps: 10,
        interval: 400,
        pace: racePace * 0.88,
        restType: RestType.Break,
        rest: 90,
      },
      {
        reps: 8,
        interval: 800,
        pace: racePace * 0.94,
        restType: RestType.Jog,
        rest: 120,
      },
      {
        reps: 6,
        interval: 1000,
        pace: racePace * 0.95,
        restType: RestType.Jog,
        rest: 180,
      },
      {
        reps: 4,
        interval: 2000,
        pace: racePace * 1.0,
        restType: RestType.Jog,
        rest: 300,
      },
    ],
    [Experience.Intermediate]: [
      {
        reps: 12,
        interval: 400,
        pace: racePace * 0.87,
        restType: RestType.Break,
        rest: 90,
      },
      {
        reps: 10,
        interval: 800,
        pace: racePace * 0.93,
        restType: RestType.Jog,
        rest: 120,
      },
      {
        reps: 6,
        interval: 1200,
        pace: racePace * 0.95,
        restType: RestType.Jog,
        rest: 180,
      },
      {
        reps: 4,
        interval: 3000,
        pace: racePace * 1.0,
        restType: RestType.Jog,
        rest: 300,
      },
    ],
    [Experience.Advanced]: [
      {
        reps: 14,
        interval: 400,
        pace: racePace * 0.86,
        restType: RestType.Break,
        rest: 75,
      },
      {
        reps: 10,
        interval: 1000,
        pace: racePace * 0.93,
        restType: RestType.Jog,
        rest: 120,
      },
      {
        reps: 6,
        interval: 1600,
        pace: racePace * 0.95,
        restType: RestType.Jog,
        rest: 180,
      },
      {
        reps: 3,
        interval: 5000,
        pace: racePace * 1.0,
        restType: RestType.Jog,
        rest: 300,
      },
    ],
    [Experience.Elite]: [
      {
        reps: 16,
        interval: 400,
        pace: racePace * 0.85,
        restType: RestType.Break,
        rest: 60,
      },
      {
        reps: 12,
        interval: 1000,
        pace: racePace * 0.92,
        restType: RestType.Jog,
        rest: 120,
      },
      {
        reps: 8,
        interval: 1600,
        pace: racePace * 0.94,
        restType: RestType.Jog,
        rest: 180,
      },
      {
        reps: 4,
        interval: 6000,
        pace: racePace * 1.0,
        restType: RestType.Jog,
        rest: 300,
      },
    ],
  };
}
