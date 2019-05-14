import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { SettingsService } from './settings.service';

import { SettingsListDto } from './dto/settingsList.dto';

@ApiUseTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ title: 'Settings list', description: 'Retrieves the settings of the application' })
  @ApiOkResponse({ description: 'The settings', type: SettingsListDto })
  async list(): Promise<SettingsListDto> {
    return this.settingsService.list();
  }
}
