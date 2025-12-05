import { Module } from '@nestjs/common';
import { WebhookModule } from './webhook/webhook.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // accesible en toda la app
    }),
    WebhookModule,
  ],
})
export class AppModule {}
