import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as parse from 'csv-parse/lib/sync';

import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async findAll(): Promise<Question[]> {
    return this.questionRepository.find({ relations: ['answers'] });
  }

  async count(): Promise<number> {
    return this.questionRepository.count();
  }

  async findOne(id: string): Promise<Question> {
    return this.questionRepository.findOne(id, { relations: ['answers'] });
  }

  async destroy(id: string): Promise<void> {
    const question = await this.findOne(id);

    await this.questionRepository.remove(question);
  }

  async importFromCsv(csv: string): Promise<Question[]> {
    const questionsArr = parse(csv, { rtrim: true, relax_column_count: true });

    return this.importFromArray(questionsArr);
  }

  async importFromArray(questions: string[][]): Promise<Question[]> {
    return Promise.all(questions.map(async ([questionText, correctAnswerText, ...wrongAnswerTexts]) => {
      const question = this.questionRepository.create({ text: questionText, answers: [] });

      const correctAnswer = new Answer();
      correctAnswer.text = correctAnswerText;
      correctAnswer.correct = true;
      question.answers.push(correctAnswer);

      wrongAnswerTexts.map((wrongAnswerText) => {
        const wrongAnswer = new Answer();
        wrongAnswer.text = wrongAnswerText;
        question.answers.push(wrongAnswer);
      });

      return this.questionRepository.save(question);
    }));
  }
}
