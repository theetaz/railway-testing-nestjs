import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { HelloController } from './hello/hello.controller';
import { HelloModule } from './hello/hello.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    HelloModule,
  ],
  controllers: [AppController, HelloController],
  providers: [AppService],
})
export class AppModule {}
