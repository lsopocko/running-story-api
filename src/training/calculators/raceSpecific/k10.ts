import { Experience, RestType } from 'src/training/types';

export function k10raceSpecific(racePace: number) {
  return {
    [Experience.FirstTimer]: [
      {
        reps: 4,
        interval: 200,
        pace: racePace,
        restType: RestType.Jog,
        rest: 200,
      },
      {
        reps: 4,
        interval: 400,
        pace: racePace,
        restType: RestType.Jog,
        rest: 200,
      },
      {
        reps: 3,
        interval: 800,
        pace: racePace,
        restType: RestType.Break,
        rest: 60,
      },
      {
        reps: 3,
        interval: 2000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 500,
      },
    ],
    [Experience.Beginner]: [
      {
        reps: 5,
        interval: 400,
        pace: racePace,
        restType: RestType.Jog,
        rest: 200,
      },
      {
        reps: 4,
        interval: 600,
        pace: racePace,
        restType: RestType.Jog,
        rest: 200,
      },
      {
        reps: 3,
        interval: 1000,
        pace: racePace,
        restType: RestType.Break,
        rest: 120,
      },
      {
        reps: 4,
        interval: 2000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 500,
      },
    ],
    [Experience.Intermediate]: [
      {
        reps: 6,
        interval: 600,
        pace: racePace,
        restType: RestType.Jog,
        rest: 200,
      },
      {
        reps: 5,
        interval: 800,
        pace: racePace,
        restType: RestType.Jog,
        rest: 400,
      },
      {
        reps: 3,
        interval: 1500,
        pace: racePace,
        restType: RestType.Break,
        rest: 120,
      },
      {
        reps: 3,
        interval: 2000,
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        progression: true,
      },
    ],
    [Experience.Advanced]: [
      {
        reps: 8,
        interval: 400,
        pace: racePace,
        restType: RestType.Jog,
        rest: 200,
      },
      {
        reps: 5,
        interval: 1500,
        pace: racePace,
        restType: RestType.Break,
        rest: 120,
      },
      {
        reps: 3,
        interval: 2000,
        pace: racePace,
        restType: RestType.Break,
        rest: 180,
      },
      {
        reps: 3,
        interval: 3000,
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        progression: true,
      },
    ],
    [Experience.Elite]: [
      {
        reps: 8,
        interval: 1000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 400,
      },
      {
        reps: 5,
        interval: 1500,
        pace: racePace,
        restType: RestType.Break,
        rest: 120,
      },
      {
        reps: 3,
        interval: 3000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 500,
      },
      {
        reps: 3,
        interval: 5000,
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        progression: true,
      },
    ],
  };
}
