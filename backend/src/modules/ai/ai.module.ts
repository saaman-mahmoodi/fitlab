import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { OpenAiProvider } from './providers/openai.provider';
import { OllamaProvider } from './providers/ollama.provider';

@Module({
  imports: [ConfigModule],
  controllers: [AiController],
  providers: [AiService, OpenAiProvider, OllamaProvider],
  exports: [AiService],
})
export class AiModule {}