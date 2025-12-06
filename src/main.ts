import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Droplinked - Product Service')
    .setDescription('A test project')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, documentFactory);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT, '0.0.0.0', () => console.log(`Listening on port ${PORT}.`));
}
bootstrap();