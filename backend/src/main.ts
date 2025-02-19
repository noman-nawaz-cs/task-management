import { NestFactory } from '@nestjs/core';
import { TasksModule } from './tasks/tasks.module';

async function bootstrap() {
  const app = await NestFactory.create(TasksModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
