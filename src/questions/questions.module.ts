import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

import { Question } from './entities/question.entity';

@Module({
  controllers: [QuestionsController],
  exports: [QuestionsService],
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionsService],
})
export class QuestionsModule {}
