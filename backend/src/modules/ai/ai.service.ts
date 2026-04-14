import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAiProvider } from './providers/openai.provider';
import { OllamaProvider } from './providers/ollama.provider';
import { AiProvider } from './providers/ai-provider.interface';
import {
  WORKOUT_GENERATION_PROMPT,
  WORKOUT_ADJUSTMENT_PROMPT,
  PROGRESS_SUMMARY_PROMPT,
} from './prompts/templates';
import {
  GenerateWorkoutDto,
  AdjustWorkoutDto,
  GenerateSummaryDto,
  AiChatDto,
} from './dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private provider: AiProvider;

  constructor(
    private openAiProvider: OpenAiProvider,
    private ollamaProvider: OllamaProvider,
    private configService: ConfigService,
  ) {
    const providerName = this.configService.get<string>('AI_PROVIDER', 'openai');
    this.provider = providerName === 'ollama' ? this.ollamaProvider : this.openAiProvider;
    this.logger.log(`AI provider: ${this.provider.name}`);
  }

  async generateWorkout(dto: GenerateWorkoutDto) {
    const prompt = `Generate a ${dto.weeks || 12}-week workout program with ${dto.days_per_week || 4} days per week.

Client goal: ${dto.fitness_goal}
Difficulty: ${dto.difficulty || 'intermediate'}
${dto.client_info ? `Client info: ${JSON.stringify(dto.client_info)}` : ''}`;

    return this.provider.generateJSON(prompt, WORKOUT_GENERATION_PROMPT);
  }

  async adjustWorkout(dto: AdjustWorkoutDto) {
    const prompt = `Client progress: ${dto.client_progress}
${dto.current_workout ? `Current workout: ${dto.current_workout}` : ''}
${dto.specific_issue ? `Specific issue: ${dto.specific_issue}` : ''}

Suggest adjustments to optimize their program.`;

    return this.provider.generateJSON(prompt, WORKOUT_ADJUSTMENT_PROMPT);
  }

  async generateSummary(dto: GenerateSummaryDto) {
    const prompt = `Analyze this client's progress data:
${dto.weight_data ? `Weight data: ${JSON.stringify(dto.weight_data)}` : ''}
${dto.workout_compliance ? `Workout compliance: ${JSON.stringify(dto.workout_compliance)}` : ''}
${dto.client_goals ? `Client goals: ${dto.client_goals}` : ''}`;

    return this.provider.generateJSON(prompt, PROGRESS_SUMMARY_PROMPT);
  }

  async chat(dto: AiChatDto) {
    const systemPrompt = `You are FitLab AI, a knowledgeable and supportive fitness coaching assistant. You help coaches with:
- Workout programming advice
- Exercise selection and form tips
- Nutrition guidance
- Client management tips
- Fitness science questions

Be concise, evidence-based, and practical. If asked about medical conditions, remind the user to consult a healthcare professional.`;

    return this.provider.generateText(dto.message, dto.context ? `${systemPrompt}\n\nContext: ${dto.context}` : systemPrompt);
  }
}