import { Injectable, Logger } from '@nestjs/common';
import { AiProvider } from './ai-provider.interface';

@Injectable()
export class OllamaProvider implements AiProvider {
  name = 'ollama';
  private readonly logger = new Logger(OllamaProvider.name);
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || 'llama3.2',
          prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
          stream: false,
        }),
      });

      const data = await response.json() as { response?: string };
      return data.response ?? '';
    } catch (error) {
      this.logger.error(`Ollama error: ${error instanceof Error ? error.message : 'Unknown'}`);
      return 'Ollama is not available. Make sure Ollama is running locally.';
    }
  }

  async generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T> {
    const jsonPrompt = `${prompt}\n\nRespond ONLY with valid JSON. No markdown, no explanation, just JSON.`;
    const text = await this.generateText(jsonPrompt, systemPrompt);
    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned) as T;
    } catch {
      return { error: 'Failed to parse Ollama response as JSON' } as unknown as T;
    }
  }
}