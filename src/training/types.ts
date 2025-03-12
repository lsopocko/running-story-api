export interface GeneratePlanRequest {
  race_distance: string; // '5k' | '10k' | '21k' | '42k'
  experience: string; // 'beginner' | 'intermediate' | 'advanced'
  current_best_time: number; // In minutes
  max_heart_rate: number; // In bpm
}

export interface Workout {
  type: RunType;
  distance_km?: number;
  pace?: [number, number];
  formatted?: {
    distance: string;
    pace: string;
  };
  warmup?: {
    pace: number;
    time: number;
  };
  cooldown?: {
    pace: number;
    time: number;
  };
  sections?: {
    reps: number;
    interval: number;
    pace: number;
    restType: RestType;
    rest: number;
    progression?: boolean;
    alternating?: boolean;
  };
}

export const enum Weekday {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export interface TrainingDay {
  day: Weekday;
  workout: Workout;
  optional?: boolean;
}

export interface TrainingWeek {
  week: number;
  days: TrainingDay[];
}

export interface HR {
  max: number;
  easy: number[];
}

export type TrainingPlan = TrainingWeek[];

export interface GeneratePlanResponse {
  user: {
    experience: Experience;
    race_distance: Distance;
    current_best_time: number;
    heart_rate?: HR;
  };
  training_plan: TrainingPlan;
}

export const enum Experience {
  FirstTimer = 'FirstTimer',
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Elite = 'Elite',
}

export const enum RunType {
  RunWalkIntervals = 'RunWalkIntervals',
  Easy = 'Easy',
  Speedwork = 'Speedwork',
  Tempo = 'Tempo',
  Long = 'Long',
  RaceSpecific = 'RaceSpecific',
  Recovery = 'Recovery',
  Rest = 'Rest',
}

export enum Distance {
  k5 = '5k',
  k10 = '10k',
  HalfMarathon = 'HalfMarathon',
  Marathon = 'Marathon',
}

export const enum RestType {
  Jog = 'Jog',
  Break = 'Break',
  None = 'None',
}

export interface IntervalWorkout {
  reps: number; // Number of intervals
  interval: number; // Distance per rep (meters)
  pace: number;
  restType: RestType;
  rest: number;
  progression?: boolean;
  alternating?: boolean;
}
