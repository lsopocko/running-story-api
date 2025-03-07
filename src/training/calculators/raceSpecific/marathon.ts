import { Experience, RestType } from 'src/training/types';

export function marathonRaceSpecific(racePace: number) {
  return {
    [Experience.FirstTimer]: [
      {
        reps: 4,
        interval: 3000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 180,
      },
      {
        reps: 2,
        interval: 20000, //easy pace
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        progression: true,
      },
      {
        reps: 1,
        interval: 25000,
        pace: racePace * 1.1,
        restType: RestType.None,
        rest: 0,
      },
      {
        reps: 3,
        interval: 10000,
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        alternating: true,
      },
    ],
    [Experience.Beginner]: [
      {
        reps: 5,
        interval: 3000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 600,
      },
      {
        reps: 2,
        interval: 22000, //easy pace
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        progression: true,
      },
      {
        reps: 1,
        interval: 28000,
        pace: racePace * 1.1,
        restType: RestType.None,
        rest: 0,
      },
      {
        reps: 3,
        interval: 12000,
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        alternating: true,
      },
    ],
    [Experience.Intermediate]: [
      {
        reps: 4,
        interval: 5000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 600,
      },
      {
        reps: 2,
        interval: 24000, //easy
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        progression: true,
      },
      {
        reps: 1,
        interval: 30000,
        pace: racePace * 1.1,
        restType: RestType.None,
        rest: 0,
      },
      {
        reps: 3,
        interval: 14000,
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        alternating: true,
      },
    ],
    [Experience.Advanced]: [
      {
        reps: 3,
        interval: 7000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 600,
      },
      {
        reps: 2,
        interval: 26000, //easy
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        progression: true,
      },
      {
        reps: 1,
        interval: 32000,
        pace: racePace * 1.1,
        restType: RestType.None,
        rest: 0,
      },
      {
        reps: 3,
        interval: 16000,
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        alternating: true,
      },
    ],
    [Experience.Elite]: [
      {
        reps: 5,
        interval: 3000,
        pace: racePace,
        restType: RestType.Jog,
        rest: 600,
      },
      {
        reps: 2,
        interval: 28000, //easy
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        progression: true,
      },
      {
        reps: 1,
        interval: 35000,
        pace: racePace,
        restType: RestType.None,
        rest: 0,
      },
      {
        reps: 3,
        interval: 16000,
        pace: racePace,
        restType: RestType.None,
        rest: 0,
        alternating: true,
      },
    ],
  };
}
