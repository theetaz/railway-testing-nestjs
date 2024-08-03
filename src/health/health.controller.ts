import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';
import * as osUtils from 'os-utils';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return new Promise((resolve) => {
      osUtils.cpuUsage((cpuUsage) => {
        resolve(
          this.health.check([
            () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
            () =>
              this.disk.checkStorage('disk', {
                thresholdPercent: 0.5,
                path: '/',
              }),
            () => ({
              cpuUsage: {
                status: 'up',
                cpuUsage: cpuUsage * 100,
              },
            }),
            () => ({
              environment: {
                status: 'up',
                environment: this.configService.get('NODE_ENV'),
              },
            }),
            () => ({
              port: {
                status: 'up',
                port: this.configService.get('PORT') || 3000,
              },
            }),
            () => ({
              server: {
                status: 'up',
                os: os.type(),
                arch: os.arch(),
                nodeVersion: process.version,
                hostname: os.hostname(),
              },
            }),
          ]),
        );
      });
    });
  }
}
