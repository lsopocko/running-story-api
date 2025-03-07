export interface PaceCalculations {
  easy_run: string; // Formula: "current_pr_pace + 0.50"
  tempo_run: string; // Formula: "current_pr_pace - 0.10"
  speed_workout: string; // Formula: "max_heart_rate * 0.85"
}

export interface SpeedWorkout {
  type: string; // e.g., "intervals"
  formula: string; // e.g., "6 * (1000, speed_workout_pace, 90)"
}

export interface TempoRun {
  distance_km: number;
  pace: string; // e.g., "tempo_run_pace"
}

export interface EasyRun {
  distance_km: number;
  pace: string; // e.g., "easy_run_pace"
}

export interface TrainingLevel {
  weekly_distance: number;
  training_days: number;
  long_run_km: number;
  pace_calculations: PaceCalculations;
  speed_workout: SpeedWorkout;
  tempo_run: TempoRun;
  easy_runs: EasyRun[];
}

export interface TrainingRules {
  [raceDistance: string]: {
    [experience: string]: TrainingLevel;
  };
}
