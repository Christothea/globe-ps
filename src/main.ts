import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { HttpErrorsFilter } from './http-errors/http-errors.filter';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  ConfigService.init();

  const loggingService: LoggingService = new LoggingService('Globe-ps-Bootstrap');

  const app = await NestFactory.create(AppModule, { logger: loggingService });
  app.enableShutdownHooks(ConfigService.AppEnv.APP_SHUTDOWN_SIGNALS);
  app.useGlobalFilters(new HttpErrorsFilter());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    validateCustomDecorators: true,
  }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const options = new DocumentBuilder()
    .setTitle('Globe Payment Services API')
    .setDescription('Globe Payment Services API description')
    .setVersion('1.0')
    .addTag('Globe Payment Services')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);
  await app.listen(ConfigService.AppEnv.APP_PORT, ConfigService.AppEnv.APP_HOST);
}
bootstrap();
