import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TrainingService } from './training.service';
import { GeneratePlanDto } from './dto/generate-plan.dto';

@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post('generate-plan')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  generatePlan(@Body() generatePlanDto: GeneratePlanDto) {
    const { race_distance, experience, current_best_time, max_heart_rate } =
      generatePlanDto;
    return this.trainingService.generateTrainingPlan(
      race_distance,
      experience,
      current_best_time,
      max_heart_rate,
    );
  }
}
