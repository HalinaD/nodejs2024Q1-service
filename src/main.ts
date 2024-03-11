import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as yaml from 'yaml';

async function bootstrap() {
  const port = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('API description for Home Library Service')
    .setVersion('1.0')
    .addTag('nodejs2024Q1-service')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const pathToSwaggerYaml = join(__dirname, '..', 'doc', 'api.yaml');
  const swaggerYamlContent = readFileSync(pathToSwaggerYaml, 'utf8');
  const parsedSwaggerDocument = yaml.parse(swaggerYamlContent);
  SwaggerModule.setup('doc', app, parsedSwaggerDocument);

  await app.listen(port);
  console.log(`Server started on port ${port}`);
}
bootstrap();
