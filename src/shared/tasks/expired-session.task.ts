import { SessionService } from '@/sessions/session.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../loggers/logger.service';

@Injectable()
export class ExpiredSessionTask {
  constructor(
    private readonly sessionService: SessionService,
    private readonly logger: LoggerService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  /**
   * Deletes expired sessions
   * @description This task is used to delete expired sessions
   */
  async handleExpiredSession() {
    this.logger.log(
      '🔄 Scheduled expired sessions deletion',
      'ExpiredSessionTask.handleExpiredSession',
    );
    await this.sessionService.deleteExpiredSessions();
    this.logger.log(
      '✅ Expired sessions deletion completed',
      'ExpiredSessionTask.handleExpiredSession',
    );
  }
}
