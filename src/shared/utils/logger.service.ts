import { LoggerService as NestLoggerService } from '@nestjs/common';

import * as winston from 'winston';
import { config } from 'node-config-ts';
import { Logger, QueryRunner } from 'typeorm';

export class LoggerService implements NestLoggerService, Logger {
  private readonly logger: winston.Logger;

  constructor(label: string) {
    const printStandard = info => `[${info.label}] ${info.level}: ${info.message}`;
    const printMetadata = metadataObj => (metadataObj && Object.keys(metadataObj).length ? JSON.stringify(metadataObj) : '');
    const printMsg = info => `${printStandard(info)} ${printMetadata(info.metadata)}`;

    const formatArgs = [
      winston.format.metadata(),
      winston.format.label({ label }),
    ];

    if (true) {
      formatArgs.push(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} ${printMsg(info)}`),
      );
    } else {
      formatArgs.push(winston.format.printf(info => `${printMsg(info)}`));
    }

    this.logger = winston.createLogger({
      format: winston.format.combine(...formatArgs),

      transports: [
        new winston.transports.Console({
          level: config.log[label] && config.log[label].level || config.log.level,
          silent: config.log[label] && config.log[label].silent || config.log.silent,
          stderrLevels: ['error', 'debug'],
        }),
      ],
    });
  }

  log(message: any): void {
    this.logMeta(message);
  }

  logMeta(message: any, meta?: any): void {
    this.logger.info(message, meta);
  }

  error(message: any, trace?: string): void {
    this.errorMeta(message, trace);
  }

  errorMeta(message: any, trace?: string, meta?: any): void {
    this.logger.error(message, Object.assign({}, meta, { trace }));
  }

  warn(message: any): void {
    this.warnMeta(message);
  }

  warnMeta(message: any, meta?: any): void {
    this.logger.warn(message, meta);
  }

  debug(message: any): void {
    this.debugMeta(message);
  }

  debugMeta(message: any, meta?: any): void {
    this.logger.debug(message, meta);
  }

  verbose(message: any): void {
    this.verboseMeta(message);
  }

  verboseMeta(message: any, meta?: any): void {
    this.logger.verbose(message, meta);
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    this.debugMeta(query, { parameters });
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    this.errorMeta(error, undefined, { query, parameters });
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    this.logMeta(`[SLOW QUERY: ${time}] ${query}`, { parameters, time });
  }

  logMigration(message: string, queryRunner?: QueryRunner): void {
    this.verbose(message);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    this.verbose(message);
  }
}
