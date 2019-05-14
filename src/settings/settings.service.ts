import { Injectable } from '@nestjs/common';

import { config } from 'node-config-ts';

import { SettingsListDto } from './dto/settingsList.dto';

import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class SettingsService {
  constructor(private readonly questionsService: QuestionsService) {}

  async list(): Promise<SettingsListDto> {
    const environment = config.environment;
    const quiz = config.quiz;
    const facebookClientId = config.facebook.clientId;
    const questionsCount = await this.questionsService.count();

    return {
      environment,
      quiz,
      facebookClientId,
      questionsCount,
    };
  }
}
