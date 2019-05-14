import { Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiImplicitFile,
  ApiImplicitParam,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';

import { Question } from './entities/question.entity';

@ApiUseTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({ title: 'Questions list', description: 'Retrieves the complete list of questions (with their answers)' })
  @ApiOkResponse({ description: 'All the questions (with answers)', isArray: true, type: Question })
  async list(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ title: 'Retrieves a question', description: 'Retrieves a single question (with its answers)' })
  @ApiImplicitParam({ name: 'id', description: 'The id of the question you want to retrieve', required: true, type: 'string' })
  @ApiOkResponse({ description: 'Retrieves the single question (with its answers) having the specified "id"', type: Question })
  async retrieve(@Param('id') id: string): Promise<Question> {
    return this.questionsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ title: 'Deletes a question', description: 'Deletes an answer' })
  @ApiImplicitParam({ name: 'id', description: 'The id of the question you want to delete', required: true, type: 'string' })
  async destroy(@Param('id') id: string): Promise<void> {
    return this.questionsService.destroy(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('questions'))
  @ApiOperation({ title: 'Imports new questions and answers', description: 'Via a single CSV file it imports questions' })
  @ApiImplicitFile({ name: 'questions', required: true, description: 'CSV containing the list of questions and answers' })
  @ApiOkResponse({ description: 'Inserts the questions specified in the CSV and returns them', isArray: true, type: Question })
  async import(@UploadedFile() file): Promise<Question[]> {
    const csv = file.buffer.toString();

    return this.questionsService.importFromCsv(csv);
  }
}
