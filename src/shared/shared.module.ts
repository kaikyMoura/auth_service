import { SessionModule } from '@/modules/sessions/session.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuditModule } from '../infra/audit/audit.module';
import { AuditInterceptor } from './interceptors/audit.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { GlobalInterceptor } from './interceptors/global.interceptor';
import { HttpExceptionInterceptor } from './interceptors/http-exception.interceptor';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { MemoryMonitorInterceptor } from './interceptors/memory-monitor.interceptor';
import { MetricsInterceptor } from './interceptors/metrics.interceptor';
import { PrismaExceptionInterceptor } from './interceptors/prisma-exception.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { LoggerModule } from '../infra/logger/logger.module';
import { ExpiredSessionTask } from './tasks/expired-session.task';
import { MemoryMonitorTask } from './tasks/memory-monitor.task';
import { MemoryMonitor } from './utils/memory-monitor';

@Module({
  imports: [ConfigModule, LoggerModule, AuditModule, SessionModule],
  providers: [
    MemoryMonitorInterceptor,
    CacheInterceptor,
    AuditInterceptor,
    ResponseInterceptor,
    HttpExceptionInterceptor,
    PrismaExceptionInterceptor,
    MetricsInterceptor,
    LoggerInterceptor,
    GlobalInterceptor,
    ExpiredSessionTask,
    MemoryMonitorTask,
    MemoryMonitor,
  ],
  exports: [
    LoggerModule,
    MemoryMonitorInterceptor,
    CacheInterceptor,
    AuditInterceptor,
    ResponseInterceptor,
    HttpExceptionInterceptor,
    PrismaExceptionInterceptor,
    MetricsInterceptor,
    LoggerInterceptor,
    GlobalInterceptor,
    ExpiredSessionTask,
    MemoryMonitorTask,
    MemoryMonitor,
  ],
})
export class SharedModule {}
