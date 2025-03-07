import { Experience, RestType } from 'src/training/types';

export function k5raceSpecific(racePace: number) {
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
        reps: 5,
        interval: 400,
        pace: racePace,
        restType: RestType.Jog,
        rest: 400,
      },
    ],
    [Experience.Beginner]: [
      {
        reps: 6,
        interval: 400,
        pace: racePace,
        restType: RestType.Jog,
        rest: 200,
      },
      {
        reps: 4,
        interval: 800,
        pace: racePace,
        restType: RestType.Jog,
        rest: 400,
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
        interval: 1500,
        pace: racePace,
        restType: RestType.Break,
        rest: 150,
      },
    ],
    [Experience.Intermediate]: [
      {
        reps: 10,
        interval: 400,
        pace: racePace,
        restType: RestType.Jog,
        rest: 200,
      },
      {
        reps: 5,
        interval: 1000,
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
        reps: 4,
        interval: 2500,
        pace: racePace,
        restType: RestType.Break,
        rest: 240,
      },
    ],
    [Experience.Advanced]: [
      {
        reps: 10,
        interval: 400,
        pace: racePace,
        restType: RestType.Jog,
        rest: 200,
      },
      {
        reps: 5,
        interval: 1000,
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
        reps: 5,
        interval: 2500,
        pace: racePace,
        restType: RestType.Break,
        rest: 240,
      },
    ],
    [Experience.Elite]: [
      {
        reps: 6,
        interval: 1000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 300,
      },
      {
        reps: 12,
        interval: 400,
        pace: racePace * 0.95,
        restType: RestType.Jog,
        rest: 200,
      },
      {
        reps: 3,
        interval: 2000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 600,
      },
      {
        reps: 3,
        interval: 2000,
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        progresion: true,
      },
    ],
  };
}
