import { Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Question } from './entities/question.entity';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('/')
  async list(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

  @Get(':id')
  async retrieve(@Param('id') id: string): Promise<Question> {
    return this.questionsService.findOne(id);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string): Promise<void> {
    return this.questionsService.destroy(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('questions'))
  async import(@UploadedFile() file): Promise<Question[]> {
    const csv = file.buffer.toString();

    return this.questionsService.importFromCsv(csv);
  }
}
