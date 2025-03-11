import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrainingService } from './training/training.service';
import { TrainingController } from './training/training.controller';
import { LlamaService } from './llm/lllama.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController, TrainingController],
  providers: [AppService, TrainingService, LlamaService],
})
export class AppModule {}
