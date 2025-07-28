import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheckResponse, HealthService } from './health.service';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Get health check' })
  @ApiResponse({ status: 200, description: 'Health check response' })
  async healthCheck(): Promise<HealthCheckResponse> {
    return this.healthService.getHealthCheck();
  }

  @Get('simple')
  @ApiOperation({ summary: 'Get simple health check' })
  @ApiResponse({ status: 200, description: 'Simple health check response' })
  async simpleHealthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.healthService.getSimpleHealthCheck();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Get readiness check' })
  @ApiResponse({ status: 200, description: 'Readiness check response' })
  async readinessCheck(): Promise<{ status: string; timestamp: string }> {
    return this.healthService.getReadinessCheck();
  }

  @Get('live')
  @ApiOperation({ summary: 'Get liveness check' })
  @ApiResponse({ status: 200, description: 'Liveness check response' })
  livenessCheck(): { status: string; timestamp: string } {
    return this.healthService.getLivenessCheck();
  }
}
