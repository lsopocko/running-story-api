import { RunType } from './types';

export const enum Intensity {
  Easy = 'Easy',
  Moderate = 'Moderate',
  High = 'High',
}

export function getIntensity(runType: RunType): Intensity {
  switch (runType) {
    case RunType.Tempo:
    case RunType.Long:
      return Intensity.Moderate;
    case RunType.RaceSpecific:
    case RunType.Speedwork:
      return Intensity.High;
    default:
      return Intensity.Easy;
  }
}
