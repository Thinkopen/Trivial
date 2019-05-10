import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async findAll(): Promise<Question[]> {
    return this.questionRepository.find({ relations: ['answers'] });
  }

  async findOne(id: string): Promise<Question> {
    return this.questionRepository.findOne(id, { relations: ['answers'] });
  }
}
