import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider } from './ai-provider.interface';
import OpenAI from 'openai';

@Injectable()
export class OpenAiProvider implements AiProvider {
  name = 'openai';
  private client: OpenAI | null = null;
  private readonly logger = new Logger(OpenAiProvider.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'sk-your-openai-api-key') {
      this.client = new OpenAI({ apiKey });
    } else {
      this.logger.warn('OpenAI API key not configured. AI features will be limited.');
    }
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.client) {
      return this.fallbackResponse(prompt);
    }

    const response = await this.client.chat.completions.create({
      model: this.configService.get<string>('OPENAI_MODEL', 'gpt-4o-mini'),
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content ?? '';
  }

  async generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T> {
    if (!this.client) {
      return this.fallbackJSONResponse(prompt);
    }

    const response = await this.client.chat.completions.create({
      model: this.configService.get<string>('OPENAI_MODEL', 'gpt-4o-mini'),
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content ?? '{}';
    return JSON.parse(content) as T;
  }

  private fallbackResponse(prompt: string): string {
    return `AI is not configured. Please set OPENAI_API_KEY in your environment. Your prompt was: "${prompt.substring(0, 100)}..."`;
  }

  private fallbackJSONResponse<T>(prompt: string): T {
    this.logger.warn(`AI not configured. Prompt was: "${prompt.substring(0, 100)}..."`);
    return { error: 'AI not configured', message: 'Set OPENAI_API_KEY in environment' } as unknown as T;
  }
}