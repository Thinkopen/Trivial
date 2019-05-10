import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('/')
  async list() {
    return this.questionsService.findAll();
  }

  @Get(':id')
  async retrieve(@Param('id') id: string) {

  }

  @Delete(':id')
  async destroy(@Param('id') id: string) {

  }

  @Post('import')
  async import() {

  }
}
