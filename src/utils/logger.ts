import * as winston from 'winston';
import { Logger } from '@nestjs/common';

const customFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.prettyPrint(),
  winston.format.printf((info) => JSON.stringify(info)),
);

export class SilentLogger extends Logger {
  private readonly ctx: string;
  public static winstonLogger = winston.createLogger({
    level: 'silly',
    format: customFormat,
    transports: [
      new winston.transports.File({
        filename: 'logs/server.tail.log',
        tailable: true,
        level: 'verbose',
        maxFiles: 10,
        maxsize: 5 * 1024 * 1024, // 5 MB
      }),
      new winston.transports.File({
        filename: 'logs/serverAll.tail.log',
        tailable: true,
        level: 'silly',
        maxFiles: 10,
        maxsize: 5 * 1024 * 1024, // 5 MB
      }),
      new winston.transports.File({
        filename: 'logs/server.log',
        format: winston.format.combine(winston.format.uncolorize()),
        tailable: false,
        level: 'verbose',
        maxFiles: 10,
        maxsize: 5 * 1024 * 1024, // 5 MB
      }),
      new winston.transports.File({
        filename: 'logs/serverAll.log',
        format: winston.format.combine(winston.format.uncolorize()),
        tailable: false,
        level: 'silly',
        maxFiles: 10,
        maxsize: 5 * 1024 * 1024, // 5 MB
      }),
    ],
  });

  constructor(context: string) {
    super(context);
    this.ctx = context;
  }

  silly(message: string) {
    this.winstonLog(message, 'silly');
    super.log(message);
  }

  debug(message: string) {
    this.winstonLog(message, 'debug');
    super.log(message);
  }

  log(message: string) {
    this.winstonLog(message, 'verbose');
    super.log(message);
  }

  warn(message: string) {
    this.winstonLog(message, 'warn');
    super.warn(message);
  }

  error(message: string, trace: string) {
    this.winstonLog(message, 'error', trace);
    super.error(message, trace);
  }

  winstonLog(
    message: string,
    level: 'silly' | 'verbose' | 'debug' | 'warn' | 'error',
    trace?: string,
  ) {
    SilentLogger.winstonLogger.log({
      level,
      message,
      trace,
      context: this.ctx,
    });
  }
}
