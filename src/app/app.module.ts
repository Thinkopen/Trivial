import { AxiosRequestConfig } from 'axios';
import { HttpModule, HttpService, Module, OnModuleInit } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

import { LoggerService } from '../shared/utils/logger.service';

type AxiosRequestConfigWithStartTimeAndId = AxiosRequestConfig & {
  startTime: [number, number];
  uuid: string;
};

@Module({
  imports: [HttpModule],
})
export class AppModule implements OnModuleInit {
  private readonly loggerHttp: LoggerService = new LoggerService('http');

  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {
    this.httpService.axiosRef.interceptors.request.use((config) => {
      const id = randomStringGenerator();

      this.loggerHttp.verboseMeta('request', {
        id,

        method: config.method,
        url: config.url,
        params: config.params,
        data: config.data,
      });

      (config as AxiosRequestConfigWithStartTimeAndId).startTime = process.hrtime();
      (config as AxiosRequestConfigWithStartTimeAndId).uuid = id;

      return config;
    });

    this.httpService.axiosRef.interceptors.response.use((response) => {
      const isError = response.status >= 400;
      const method = isError ? 'warnMeta' : 'verboseMeta';

      const [durationSeconds, durationNanoseconds] = process.hrtime((response.config as AxiosRequestConfigWithStartTimeAndId).startTime);
      const durationMicroseconds = durationSeconds * 1000000 + Math.floor(durationNanoseconds / 1000);
      const durationMilliseconds = durationMicroseconds / 1000;

      this.loggerHttp[method]('response', {
        id: (response.config as AxiosRequestConfigWithStartTimeAndId).uuid,

        status: response.status,
        duration: durationMilliseconds,

        ...isError && { data: response.data },
      });

      return response;
    });
  }
}
