import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TrainingService } from './training.service';
import { GeneratePlanDto } from './dto/generate-plan.dto';
import { LlamaService } from 'src/llm/lllama.service';
import { firstValueFrom } from 'rxjs';

@Controller('training')
export class TrainingController {
  constructor(
    private readonly trainingService: TrainingService,
    private readonly llamaService: LlamaService,
  ) {}

  @Post('generate-plan')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  generatePlan(@Body() generatePlanDto: GeneratePlanDto) {
    const { race_distance, current_best_time, desired_best_time } =
      generatePlanDto;
    return this.trainingService.generateTrainingPlan(
      race_distance,
      current_best_time,
      desired_best_time,
    );
  }

  @Post('analize-plan')
  async analizePlan(@Body() plan: any) {
    const { data } = await firstValueFrom(this.llamaService.analyzePlan(plan));
    return data;
  }
}
