import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrainingService } from './training/training.service';
import { TrainingController } from './training/training.controller';

@Module({
  imports: [],
  controllers: [AppController, TrainingController],
  providers: [AppService, TrainingService],
})
export class AppModule {}
