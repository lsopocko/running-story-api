import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Distance } from '../types';

export class GeneratePlanDto {
  @IsEnum(Distance)
  @IsNotEmpty()
  race_distance: Distance; // Example: '21k'

  @IsString()
  @IsNotEmpty()
  experience: string; // Example: 'beginner', 'intermediate', 'advanced'

  @IsNumber()
  @IsNotEmpty()
  current_best_time: number; // In minutes (e.g., 95 for a 1h35m half-marathon)

  @IsNumber()
  @IsNotEmpty()
  desired_best_time: number; // In minutes (e.g., 95 for a 1h35m half-marathon)

  @IsNumber()
  @IsNotEmpty()
  max_heart_rate: number; // In bpm (e.g., 180)

  @IsDateString()
  birthdate: Date; // In bpm (e.g., 180)

  @IsDateString()
  @IsNotEmpty()
  race_date: Date; // In bpm (e.g., 180)
}
