import { ISessionService } from '@/modules/sessions/domain/interfaces/session-service.interface';
import { SESSION_SERVICE } from '@/modules/sessions/domain/interfaces/session.tokens';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../../infra/logger/logger.service';

@Injectable()
export class ExpiredSessionTask {
  constructor(
    @Inject(SESSION_SERVICE)
    private readonly sessionService: ISessionService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Deletes expired sessions
   * @description This task is used to delete expired sessions
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
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
