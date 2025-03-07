export interface GeneratePlanRequest {
  race_distance: string; // '5k' | '10k' | '21k' | '42k'
  experience: string; // 'beginner' | 'intermediate' | 'advanced'
  current_best_time: number; // In minutes
  max_heart_rate: number; // In bpm
}

export interface Workout {
  type: string;
  distance_km?: number;
  pace?: string;
  details?: string;
}

export interface TrainingDay {
  day: string;
  workout: Workout;
}

export interface TrainingWeek {
  week: number;
  days: TrainingDay[];
}

export interface GeneratePlanResponse {
  user: {
    experience: string;
    race_distance: string;
    current_best_time: number;
    max_heart_rate: number;
    weekly_distance: number;
  };
  training_plan: TrainingWeek[];
}

export const enum Experience {
  FirstTimer,
  Beginner,
  Intermediate,
  Advanced,
  Elite,
}

export const enum RunType {
  RunWalkIntervals,
  Easy,
  Speedwork,
  Tempo,
  Long,
  RaceSpecific,
  Recovery,
}

export const enum Distance {
  k5,
  k10,
  HalfMarathon,
  Marathon,
}

export const enum RestType {
  Jog,
  Break,
  None,
}

export interface IntervalWorkout {
  reps: number; // Number of intervals
  interval: number; // Distance per rep (meters)
  pace: number;
  restType: RestType;
  rest: number;
  progresion?: boolean;
  alternating?: boolean;
}
