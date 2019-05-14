import { ApiModelProperty } from '@nestjs/swagger';

class QuizSettingsDto {
  @ApiModelProperty()
  nextQuestionTimeout: number;

  @ApiModelProperty()
  questionsCount: number;
}

export class SettingsListDto {
  @ApiModelProperty({ enum: ['development', 'certification', 'production'] })
  environment: string;

  @ApiModelProperty()
  quiz: QuizSettingsDto;

  @ApiModelProperty()
  facebookClientId: string;

  @ApiModelProperty()
  questionsCount: number;
}
