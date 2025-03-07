import { Injectable } from '@nestjs/common';
import {
  Distance,
  Experience,
  GeneratePlanResponse,
  IntervalWorkout,
  RunType,
  TrainingWeek,
} from './types';
import { PaceCalculations, TrainingRules } from './types/trainingRules';
import * as trainingRulesJson from '../training-plan.json';
import { k5raceSpecific } from './calculators/raceSpecific/k5';
import { k10raceSpecific } from './calculators/raceSpecific/k10';
import { marathonRaceSpecific } from './calculators/raceSpecific/marathon';
import { halfMarathonRaceSpecific } from './calculators/raceSpecific/halfMarathon';

function formatPace(pace: number): string {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
}

@Injectable()
export class TrainingService {
  private trainingRules: TrainingRules = trainingRulesJson;

  constructor() {}

  private calculatePaces(
    prTime: number,
    maxHr: number,
    formulas: PaceCalculations,
  ): Record<string, number> {
    const prPace = prTime / 21;
    const paceVars = { current_pr_pace: prPace, max_heart_rate: maxHr };

    return Object.fromEntries(
      Object.entries(formulas).map(([key, formula]: string[]) => [
        key,
        eval(
          formula.replace(/([a-z_]+)/g, (_, v: string) =>
            paceVars[v as keyof typeof paceVars] !== undefined
              ? paceVars[v as keyof typeof paceVars].toString()
              : '0',
          ),
        ),
      ]),
    );
  }

  predictRaceTime(currentTime: number, currentDistance: number): number {
    const fatigueFactor = 1.06;
    const predictedTime =
      currentTime * Math.pow(10 / currentDistance, fatigueFactor);

    return Math.round(predictedTime * 100) / 100;
  }

  getExperienceLevelFrom10kTime(time10k: number): Experience {
    const isFirstTimer = time10k > 65;
    const isBeginner = time10k > 55 && time10k < 65;
    const isIntermediate = time10k > 45 && time10k < 55;
    const isAdvanced = time10k > 37.5 && time10k < 45;

    if (isFirstTimer) return Experience.FirstTimer;
    if (isBeginner) return Experience.Beginner;
    if (isIntermediate) return Experience.Intermediate;
    if (isAdvanced) return Experience.Advanced;

    return Experience.Elite;
  }

  getRunTypes(experience: Experience): RunType[] {
    switch (experience) {
      case Experience.FirstTimer:
        return [RunType.RunWalkIntervals, RunType.Easy, RunType.Long];
      case Experience.Beginner:
        return [RunType.Easy, RunType.Tempo, RunType.Long];
      case Experience.Intermediate:
        return [RunType.Easy, RunType.Speedwork, RunType.Tempo, RunType.Long];
      case Experience.Advanced:
      case Experience.Elite:
        return [
          RunType.Easy,
          RunType.Speedwork,
          RunType.Tempo,
          RunType.Long,
          RunType.RaceSpecific,
          RunType.Recovery,
        ];
      default:
        throw new Error(`Invalid experience level`);
    }
  }

  getSuggestedNumberOfTrainingDays(experience: Experience): number[] {
    switch (experience) {
      case Experience.FirstTimer:
        return [2, 3];
      case Experience.Beginner:
        return [3, 4];
      case Experience.Intermediate:
        return [4, 5];
      case Experience.Advanced:
        return [5, 6];
      case Experience.Elite:
        return [6, 7];
      default:
        throw new Error(`Invalid experience level`);
    }
  }

  getTrainingBlockLength(experience: Experience, distance: Distance): number[] {
    switch (experience) {
      case Experience.FirstTimer:
        return {
          [Distance.k5]: [8 - 12],
          [Distance.k10]: [12, 16],
          [Distance.HalfMarathon]: [16, 20],
          [Distance.Marathon]: [20, 24],
        }[distance];
      case Experience.Beginner:
        return {
          [Distance.k5]: [6 - 10],
          [Distance.k10]: [10, 14],
          [Distance.HalfMarathon]: [14, 18],
          [Distance.Marathon]: [18, 22],
        }[distance];
      case Experience.Intermediate:
        return {
          [Distance.k5]: [6 - 8],
          [Distance.k10]: [8, 12],
          [Distance.HalfMarathon]: [12, 16],
          [Distance.Marathon]: [16, 20],
        }[distance];
      case Experience.Advanced:
        return {
          [Distance.k5]: [4 - 6],
          [Distance.k10]: [6, 10],
          [Distance.HalfMarathon]: [10, 14],
          [Distance.Marathon]: [12, 16],
        }[distance];
      case Experience.Elite:
        return {
          [Distance.k5]: [3 - 6],
          [Distance.k10]: [4, 8],
          [Distance.HalfMarathon]: [8, 12],
          [Distance.Marathon]: [10, 14],
        }[distance];
      default:
        throw new Error(`Invalid experience level`);
    }
  }

  calculateHR(
    runnerLevel: Experience,
    age: number,
  ): { hrMax: number; easyHR: number[] } {
    let hrMax: number;

    switch (runnerLevel) {
      case Experience.FirstTimer:
        hrMax = 220 - age;
        break;
      case Experience.Beginner:
        hrMax = 211 - 0.64 * age;
        break;
      case Experience.Intermediate:
        hrMax = 208 - 0.7 * age;
        break;
      case Experience.Advanced:
        hrMax = 205 - 0.5 * age;
        break;
      case Experience.Elite:
        hrMax = 200 - 0.4 * age;
        break;
      default:
        throw new Error('Invalid runner level');
    }

    const easyHRMin = Math.round(hrMax * 0.5);
    const easyHRMax = Math.round(hrMax * 0.7);

    return {
      hrMax: Math.round(hrMax),
      easyHR: [easyHRMin, easyHRMax],
    };
  }

  calculateRaceSpecificRun(
    experience: Experience,
    trainingWeek: number,
    trainingBlockLength: number,
    raceDistance: Distance,
    racePace: number,
  ) {
    const progress = trainingWeek / trainingBlockLength;

    const raceWorkouts: Record<
      Distance,
      Record<Experience, IntervalWorkout[]>
    > = {
      [Distance.k5]: k5raceSpecific(racePace),
      [Distance.k10]: k10raceSpecific(racePace),
      [Distance.HalfMarathon]: halfMarathonRaceSpecific(racePace),
      [Distance.Marathon]: marathonRaceSpecific(racePace),
    };

    // Select workouts based on race distance and experience level
    const workouts = raceWorkouts[raceDistance]?.[experience];

    if (!workouts) {
      throw new Error('No workout available for this level or race distance.');
    }

    return workouts[
      Math.min(Math.floor(progress * workouts.length), workouts.length - 1)
    ];
  }

  calculateTempoRun(
    experience: Experience,
    trainingBlockLength: number,
    week: number,
    goalDistance: number,
    goalTime: number, // in minutes
  ) {
    // 1️⃣ Calculate Goal Pace (min/km)
    const goalPace = goalTime / goalDistance;

    // 2️⃣ Tempo Run Pace (~10-15% slower than goal pace)
    const tempoPaceMultiplier = 1.1;
    const tempoRunPace = goalPace * tempoPaceMultiplier;

    // 3️⃣ Determine Tempo Run Distance Progression
    const tempoRunMultipliers = {
      [Experience.FirstTimer]: { start: 0.2, peak: 0.5 },
      [Experience.Beginner]: { start: 0.3, peak: 0.6 },
      [Experience.Intermediate]: { start: 0.4, peak: 0.7 },
      [Experience.Advanced]: { start: 0.5, peak: 0.8 },
      [Experience.Elite]: { start: 0.6, peak: 0.9 },
    };

    const levelMultiplier = tempoRunMultipliers[experience];

    // Tempo run distance progression (gradually increases over the block)
    const progress = week / trainingBlockLength;
    const tempoRunDistance =
      goalDistance *
      (levelMultiplier.start +
        progress * (levelMultiplier.peak - levelMultiplier.start));

    return {
      tempoRunPace: formatPace(tempoRunPace),
      tempoRunDistance: `${tempoRunDistance.toFixed(1)} km`,
    };
  }

  calculateLongRun(
    experience: Experience,
    trainingBlockLength: number,
    week: number,
    goalDistance: number,
    goalTime: number, // in minutes
  ) {
    // 1️⃣ Calculate Goal Pace (min/km)
    const goalPace = goalTime / goalDistance;

    // 2️⃣ Calculate Long Run Pace (~35-40% slower than goal pace)
    const longRunPaceMultiplier = 1.35; // Long runs are ~35% slower than goal pace
    const longRunPace = goalPace * longRunPaceMultiplier;

    // 3️⃣ Determine Long Run Distance Progression
    const longRunMultipliers = {
      [Experience.FirstTimer]: { start: 0.4, peak: 0.8 },
      [Experience.Beginner]: { start: 0.5, peak: 0.9 },
      [Experience.Intermediate]: { start: 0.6, peak: 1.0 },
      [Experience.Advanced]: { start: 0.7, peak: 1.1 },
      [Experience.Elite]: { start: 0.8, peak: 1.2 },
    };

    const levelMultiplier = longRunMultipliers[experience];

    // Long run distance progression (gradually increases over the block)
    const progress = week / trainingBlockLength;
    const longRunDistance =
      goalDistance *
      (levelMultiplier.start +
        progress * (levelMultiplier.peak - levelMultiplier.start));

    return {
      longRunPace: formatPace(longRunPace),
      longRunDistance: `${longRunDistance.toFixed(1)} km`,
    };
  }

  calculateEasyRun(
    experience: Experience,
    trainingBlockLength: number,
    week: number,
    goalDistance: number,
    goalTime: number, // in minutes
  ) {
    // 1️⃣ Calculate Goal Pace (min/km)
    const goalPace = goalTime / goalDistance;

    // 2️⃣ Calculate Easy Run Pace (65-75% slower than goal pace)
    const easyPaceMultiplier = 1.3; // Easy runs are ~30% slower than goal pace
    const easyRunPace = goalPace * easyPaceMultiplier;

    // 3️⃣ Determine Easy Run Distance Progression
    const easyRunMultipliers = {
      [Experience.FirstTimer]: { start: 0.3, peak: 0.6 },
      [Experience.Beginner]: { start: 0.4, peak: 0.7 },
      [Experience.Intermediate]: { start: 0.5, peak: 0.8 },
      [Experience.Advanced]: { start: 0.6, peak: 0.9 },
      [Experience.Elite]: { start: 0.7, peak: 1.0 },
    };

    const levelMultiplier = easyRunMultipliers[experience];

    // Easy run distance progression (gradually increases over the block)
    const progress = week / trainingBlockLength;
    const easyRunDistance =
      goalDistance *
      (levelMultiplier.start +
        progress * (levelMultiplier.peak - levelMultiplier.start));

    return {
      easyRunPace: formatPace(easyRunPace),
      easyRunDistance: `${easyRunDistance.toFixed(1)} km`,
    };
  }

  generateTrainingPlan(
    raceDistance: string,
    experience: string,
    prTime: number,
    maxHr: number,
  ): GeneratePlanResponse {
    if (
      !this.trainingRules[raceDistance] ||
      !this.trainingRules[raceDistance][experience]
    ) {
      throw new Error(
        `No training plan found for ${experience} runners at ${raceDistance}`,
      );
    }

    const planTemplate = this.trainingRules[raceDistance][experience];
    const paceValues = this.calculatePaces(
      prTime,
      maxHr,
      planTemplate.pace_calculations,
    );

    const trainingPlan: TrainingWeek[] = [];
    for (let week = 1; week <= 16; week++) {
      trainingPlan.push({
        week,
        days: [
          {
            day: 'Monday',
            workout: {
              type: 'easy',
              distance_km: 12,
              pace: `${paceValues['easy_run'].toFixed(2)} min/km`,
            },
          },
          {
            day: 'Tuesday',
            workout: {
              type: 'speed',
              details: `6x1000m @ ${paceValues['speed_workout'].toFixed(2)} min/km with 90s rest`,
            },
          },
          { day: 'Wednesday', workout: { type: 'rest' } },
          {
            day: 'Thursday',
            workout: {
              type: 'tempo',
              distance_km: 10,
              pace: `${paceValues['tempo_run'].toFixed(2)} min/km`,
            },
          },
          {
            day: 'Friday',
            workout: {
              type: 'easy',
              distance_km: 12,
              pace: `${paceValues['easy_run'].toFixed(2)} min/km`,
            },
          },
          {
            day: 'Saturday',
            workout: {
              type: 'long',
              distance_km: planTemplate.long_run_km,
              pace: '4:30-4:50 min/km',
            },
          },
          { day: 'Sunday', workout: { type: 'rest' } },
        ],
      });
    }

    return {
      user: {
        experience,
        race_distance: raceDistance,
        current_best_time: prTime,
        max_heart_rate: maxHr,
        weekly_distance: planTemplate.weekly_distance,
      },
      training_plan: trainingPlan,
    };
  }
}
