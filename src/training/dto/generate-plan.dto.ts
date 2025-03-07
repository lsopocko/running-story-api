import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class GeneratePlanDto {
  @IsString()
  @IsNotEmpty()
  race_distance: string; // Example: '21k'

  @IsString()
  @IsNotEmpty()
  experience: string; // Example: 'beginner', 'intermediate', 'advanced'

  @IsNumber()
  @IsNotEmpty()
  current_best_time: number; // In minutes (e.g., 95 for a 1h35m half-marathon)

  @IsNumber()
  @IsNotEmpty()
  max_heart_rate: number; // In bpm (e.g., 180)
}
