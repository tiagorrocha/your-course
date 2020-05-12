import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
if(process.env.NODE_ENV === "test"){
  console.log("---------Testing in progress------");
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
