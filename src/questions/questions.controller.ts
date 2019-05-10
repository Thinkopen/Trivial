import { Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiUseTags } from '@nestjs/swagger';

import { Question } from './entities/question.entity';

@ApiUseTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('/')
  @ApiOkResponse({ description: 'Retrieves the complete list of questions (with their answers)', isArray: true, type: Question })
  async list(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Retrieves the single question (with its answers) having the specified "id"', type: Question })
  async retrieve(@Param('id') id: string): Promise<Question> {
    return this.questionsService.findOne(id);
  }

  @Delete(':id')
  async destroy(@Param('id') id: string): Promise<void> {
    return this.questionsService.destroy(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('questions'))
  @ApiOkResponse({ description: 'Inserts the questions specified in the CSV and returns them', isArray: true, type: Question })
  async import(@UploadedFile() file): Promise<Question[]> {
    const csv = file.buffer.toString();

    return this.questionsService.importFromCsv(csv);
  }
}
