import { Experience, RestType } from 'src/training/types';

export function k5SpeedWork(racePace: number) {
  return {
    [Experience.FirstTimer]: [
      {
        reps: 6,
        interval: 200,
        pace: racePace * 0.9, // Faster than race pace
        restType: RestType.Break,
        rest: 90,
      },
      {
        reps: 5,
        interval: 400,
        pace: racePace * 0.95, // VO2 max effort
        restType: RestType.Jog,
        rest: 120,
      },
      {
        reps: 4,
        interval: 600,
        pace: racePace * 0.97,
        restType: RestType.Jog,
        rest: 150,
      },
      {
        reps: 3,
        interval: 1000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 180,
      },
    ],
    [Experience.Beginner]: [
      {
        reps: 8,
        interval: 200,
        pace: racePace * 0.88,
        restType: RestType.Break,
        rest: 90,
      },
      {
        reps: 6,
        interval: 400,
        pace: racePace * 0.94,
        restType: RestType.Jog,
        rest: 120,
      },
      {
        reps: 5,
        interval: 800,
        pace: racePace * 0.97,
        restType: RestType.Jog,
        rest: 180,
      },
      {
        reps: 3,
        interval: 1500,
        pace: racePace,
        restType: RestType.Jog,
        rest: 240,
      },
    ],
    [Experience.Intermediate]: [
      {
        reps: 10,
        interval: 400,
        pace: racePace * 0.87,
        restType: RestType.Break,
        rest: 90,
      },
      {
        reps: 6,
        interval: 800,
        pace: racePace * 0.93,
        restType: RestType.Jog,
        rest: 120,
      },
      {
        reps: 5,
        interval: 1000,
        pace: racePace * 0.96,
        restType: RestType.Jog,
        rest: 180,
      },
      {
        reps: 4,
        interval: 2000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 240,
      },
    ],
    [Experience.Advanced]: [
      {
        reps: 12,
        interval: 400,
        pace: racePace * 0.86,
        restType: RestType.Break,
        rest: 75,
      },
      {
        reps: 8,
        interval: 800,
        pace: racePace * 0.92,
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
        interval: 2500,
        pace: racePace,
        restType: RestType.Jog,
        rest: 240,
      },
    ],
    [Experience.Elite]: [
      {
        reps: 14,
        interval: 400,
        pace: racePace * 0.85,
        restType: RestType.Break,
        rest: 60,
      },
      {
        reps: 10,
        interval: 800,
        pace: racePace * 0.92,
        restType: RestType.Jog,
        rest: 120,
      },
      {
        reps: 6,
        interval: 1500,
        pace: racePace * 0.94,
        restType: RestType.Jog,
        rest: 180,
      },
      {
        reps: 4,
        interval: 3000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 240,
      },
    ],
  };
}
