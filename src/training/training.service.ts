import { Injectable } from '@nestjs/common';
import {
  Distance,
  Experience,
  GeneratePlanResponse,
  HR,
  IntervalWorkout,
  RunType,
  TrainingDay,
  TrainingPlan,
  TrainingWeek,
  Weekday,
} from './types';
import { k5raceSpecific } from './calculators/raceSpecific/k5';
import { k10raceSpecific } from './calculators/raceSpecific/k10';
import { marathonRaceSpecific } from './calculators/raceSpecific/marathon';
import { halfMarathonRaceSpecific } from './calculators/raceSpecific/halfMarathon';

function formatPace(pace: number): string {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
}

function round2(num: number): number {
  return Math.round(num * 100) / 100;
}

@Injectable()
export class TrainingService {
  constructor() {}

  predictRaceTime(currentTime: number, currentDistance: number): number {
    const fatigueFactor = 1.06;
    const predictedTime =
      currentTime * Math.pow(10 / currentDistance, fatigueFactor);

    return Math.round(predictedTime * 100) / 100;
  }

  getExperienceLevelFrom10kTime(time10k: number): Experience {
    const isFirstTimer = time10k >= 65;
    const isBeginner = time10k >= 55 && time10k < 65;
    const isIntermediate = time10k >= 45 && time10k < 55;
    const isAdvanced = time10k >= 37.5 && time10k < 45;

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

  getSuggestedNumberOfTrainingDays(experience: Experience): [number, number] {
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

  getTrainingBlockLength(
    experience: Experience,
    distance: Distance,
  ): [number, number] {
    switch (experience) {
      case Experience.FirstTimer:
        return {
          [Distance.k5]: [8, 12],
          [Distance.k10]: [12, 16],
          [Distance.HalfMarathon]: [16, 20],
          [Distance.Marathon]: [20, 24],
        }[distance] as [number, number];
      case Experience.Beginner:
        return {
          [Distance.k5]: [6, 10],
          [Distance.k10]: [10, 14],
          [Distance.HalfMarathon]: [14, 18],
          [Distance.Marathon]: [18, 22],
        }[distance] as [number, number];
      case Experience.Intermediate:
        return {
          [Distance.k5]: [6, 8],
          [Distance.k10]: [8, 12],
          [Distance.HalfMarathon]: [12, 16],
          [Distance.Marathon]: [16, 20],
        }[distance] as [number, number];
      case Experience.Advanced:
        return {
          [Distance.k5]: [4, 6],
          [Distance.k10]: [6, 10],
          [Distance.HalfMarathon]: [10, 14],
          [Distance.Marathon]: [12, 16],
        }[distance] as [number, number];
      case Experience.Elite:
        return {
          [Distance.k5]: [3, 6],
          [Distance.k10]: [4, 8],
          [Distance.HalfMarathon]: [8, 12],
          [Distance.Marathon]: [10, 14],
        }[distance] as [number, number];
      default:
        throw new Error(`Invalid experience level`);
    }
  }

  calculateHR(runnerLevel: Experience, age: number): HR {
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
      max: Math.round(hrMax),
      easy: [easyHRMin, easyHRMax],
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
      paceFormatted: `${formatPace(tempoRunPace)} - ${formatPace(tempoRunPace * 1.05)} km`,
      distanceFormatted: `${tempoRunDistance.toFixed(1)} km`,
      pace: [round2(tempoRunPace), round2(tempoRunPace * 1.05)],
      distance_km: round2(tempoRunDistance),
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
      paceFormatted: `${formatPace(easyRunPace)} - ${formatPace(easyRunPace * 1.05)}`,
      distanceFormatted: `${easyRunDistance.toFixed(1)} km`,
      distance_km: round2(easyRunDistance),
      pace: [round2(easyRunPace), round2(easyRunPace * 1.05)],
    };
  }

  generateTrainingWeek(
    trainingDaysRange: [number, number], // Min and max training days
    runTypes: RunType[], // Run types for the runner level
    trainingWeek: number, // Current week in training block
    trainingBlockLength: number, // Total weeks in training block
  ): TrainingDay[] {
    const weekDays: Weekday[] = [
      Weekday.Monday,
      Weekday.Tuesday,
      Weekday.Wednesday,
      Weekday.Thursday,
      Weekday.Friday,
      Weekday.Saturday,
      Weekday.Sunday,
    ];
    const minTrainingDays = trainingDaysRange[0]; // Required training days
    const maxTrainingDays = trainingDaysRange[1]; // Maximum possible training days
    const optionalDays = maxTrainingDays - minTrainingDays; // Number of optional training days

    const plan: TrainingDay[] = [];

    // Always include Long Run on Sunday if possible
    if (minTrainingDays >= 3) {
      plan.push({ day: Weekday.Sunday, workout: { type: RunType.Long } });
    }

    // Determine when to introduce Race-Specific Workouts
    const raceSpecificStart = Math.floor(trainingBlockLength * 0.4); // 40% into the plan

    let remainingDays = minTrainingDays - 1; // Already used for Long Run
    let lastWorkoutDay: Weekday | null = null;

    for (let i = 0; i < weekDays.length && remainingDays > 0; i++) {
      if (weekDays[i] === Weekday.Sunday) continue; // Skip, reserved for Long Run

      let selectedWorkout: RunType;

      // Introduce Race-Specific Runs only after a certain week
      if (
        trainingWeek >= raceSpecificStart &&
        runTypes.includes(RunType.RaceSpecific) &&
        !plan.some((w) => w.workout.type === RunType.RaceSpecific)
      ) {
        selectedWorkout = RunType.RaceSpecific;
      } else {
        // Select a workout that hasn't been assigned yet
        const availableWorkouts = runTypes.filter(
          (r) =>
            r !== RunType.RaceSpecific &&
            r !== RunType.Recovery &&
            !plan.some((w) => w.workout.type === r),
        );

        if (availableWorkouts.length === 0)
          availableWorkouts.push(RunType.Easy);

        selectedWorkout =
          availableWorkouts[
            Math.floor(Math.random() * availableWorkouts.length)
          ];
      }

      // Ensure no more than 3 consecutive training days
      if (lastWorkoutDay) {
        const lastWorkoutIndex = weekDays.indexOf(lastWorkoutDay);
        if (
          i - lastWorkoutIndex === 1 &&
          plan.length >= 2 &&
          plan[plan.length - 1].workout.type !== RunType.Rest
        ) {
          plan.push({ day: weekDays[i], workout: { type: RunType.Rest } });
          lastWorkoutDay = null;
          continue;
        }
      }

      plan.push({ day: weekDays[i], workout: { type: selectedWorkout } });
      lastWorkoutDay = weekDays[i];
      remainingDays--;
    }

    // Assign optional workouts for extra training days (Only Easy or Recovery)
    let optionalCount = optionalDays;
    for (let i = 0; i < weekDays.length && optionalCount > 0; i++) {
      if (!plan.some((w) => w.day === weekDays[i])) {
        const optionalWorkout = RunType.Recovery;
        plan.push({
          day: weekDays[i],
          workout: { type: optionalWorkout },
          optional: true,
        });
        optionalCount--;
      }
    }

    // Fill remaining days with "Rest"
    return weekDays.map(
      (day) =>
        plan.find((w) => w.day === day) || {
          day,
          workout: { type: RunType.Rest },
        },
    );
  }

  fillWorkoutDetails(trainingPlan: TrainingPlan, experience): TrainingPlan {
    for (const week of trainingPlan) {
      for (const day of week.days) {
        switch (day.workout.type) {
          case RunType.Easy: {
            const { distance_km, pace, distanceFormatted, paceFormatted } =
              this.calculateEasyRun(
                experience,
                trainingPlan.length,
                week.week,
                42,
                170,
              );
            day.workout.pace = pace as [number, number];
            day.workout.distance_km = distance_km;
            day.workout.formatted = {
              distance: distanceFormatted,
              pace: paceFormatted,
            };
            break;
          }

          case RunType.Tempo: {
            const { distance_km, pace, distanceFormatted, paceFormatted } =
              this.calculateTempoRun(
                experience,
                trainingPlan.length,
                week.week,
                42,
                170,
              );
            day.workout.pace = pace as [number, number];
            day.workout.distance_km = distance_km;
            day.workout.formatted = {
              distance: distanceFormatted,
              pace: paceFormatted,
            };
            break;
          }

          default:
            break;
        }
      }
    }

    return trainingPlan;
  }

  generateTrainingPlan(
    raceDistance: Distance,
    prTime: number,
    desiredPrTime: number,
  ): GeneratePlanResponse {
    const trainingPlan: TrainingPlan = [];

    const distanceInMeters = {
      [Distance.k5]: 5,
      [Distance.k10]: 10,
      [Distance.HalfMarathon]: 21.09,
      [Distance.Marathon]: 42.2,
    }[raceDistance];

    const predictedTime = this.predictRaceTime(prTime, distanceInMeters);

    const experience = this.getExperienceLevelFrom10kTime(predictedTime);
    const numberOfTrainingDays =
      this.getSuggestedNumberOfTrainingDays(experience);
    const trainingBlockLength = this.getTrainingBlockLength(
      experience,
      raceDistance,
    );

    const runTypes = this.getRunTypes(experience);

    const heart_rate = this.calculateHR(experience, 36);

    for (let week = 1; week <= trainingBlockLength[1]; week++) {
      const trainingWeek: TrainingWeek = {
        week,
        days: this.generateTrainingWeek(
          numberOfTrainingDays,
          runTypes,
          week,
          trainingBlockLength[0],
        ),
      };

      trainingPlan.push(trainingWeek);
    }

    this.fillWorkoutDetails(trainingPlan, experience);

    return {
      user: {
        experience,
        heart_rate,
        race_distance: raceDistance,
        current_best_time: prTime,
      },
      training_plan: trainingPlan,
    };
  }
}
