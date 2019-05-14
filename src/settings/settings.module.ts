import { Module } from '@nestjs/common';

import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

import { QuestionsModule } from '../questions/questions.module';

@Module({
  controllers: [SettingsController],
  imports: [QuestionsModule],
  providers: [SettingsService],
})
export class SettingsModule {}
