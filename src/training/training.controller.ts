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
    const {
      race_distance,
      current_best_time,
      desired_best_time,
      birthdate,
      race_date,
    } = generatePlanDto;

    const getAge = (birthDate) =>
      Math.floor((Date.now() - new Date(birthDate).getTime()) / 3.15576e10);

    return this.trainingService.generateTrainingPlan(
      race_distance,
      current_best_time,
      desired_best_time,
      getAge(birthdate),
    );
  }

  @Post('analize-plan')
  async analizePlan(@Body() plan: any) {
    const { data } = await firstValueFrom(this.llamaService.analyzePlan(plan));
    return data;
  }
}
