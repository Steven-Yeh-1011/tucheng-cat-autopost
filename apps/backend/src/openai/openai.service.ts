import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class OpenAIService implements OnModuleInit {
  private readonly logger = new Logger(OpenAIService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  onModuleInit() {
    // 支援 GEMINI_API_KEY 和 GOOGLE_AI_API_KEY 兩種環境變數名稱
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY or GOOGLE_AI_API_KEY is not set. Google AI service will not be available.');
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    // 使用 gemini-1.5-flash：速度快、成本低，適合高頻率的簡單任務
    // 如需更強的推理能力，可改用 gemini-1.5-pro
    // 可以在這裡設定 generationConfig，但為了簡化，我們使用預設值
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        // maxOutputTokens 會在需要時動態設定
      },
    });
    
    this.logger.log('Google AI service initialized with gemini-1.5-flash');
  }

  /**
   * 生成每日草稿內容
   * @param options 生成選項
   * @returns 生成的草稿內容
   */
  async generateDraftContent(options?: {
    topic?: string;
    tone?: string;
    length?: 'short' | 'medium' | 'long';
  }): Promise<string> {
    if (!this.model) {
      throw new Error('Google AI client is not initialized. Please set GEMINI_API_KEY or GOOGLE_AI_API_KEY environment variable.');
    }

    const topic = options?.topic || '土城浪貓';
    const tone = options?.tone || '溫暖、友善';
    const length = options?.length || 'medium';

    const lengthMap = {
      short: '約 100-150 字',
      medium: '約 200-300 字',
      long: '約 400-500 字',
    };

    // 根據指南，直接使用 prompt 字符串，更簡潔
    const prompt = `你是一位關心流浪貓的志工，負責為「土城浪貓」社群撰寫貼文內容。
請用${tone}的語氣，撰寫一篇關於${topic}的貼文。
長度要求：${lengthMap[length]}。
內容應該：
1. 傳達對流浪貓的關愛
2. 鼓勵民眾關注流浪動物議題
3. 可以包含實用的資訊或提醒
4. 語氣親切但不失專業
5. 適合在 Facebook 和 LINE 等社群平台發布

請直接輸出貼文內容，不需要標題或額外說明。

請為今天的貼文生成內容，主題是：${topic}`;

    try {
      this.logger.log(`Generating draft content with topic: ${topic}, tone: ${tone}, length: ${length}`);

      // 根據指南範例，直接傳遞 prompt 字符串
      // 如果需要設定 generationConfig，可以在創建 model 時設定，或使用 startChat 方法
      const result = await this.model.generateContent(prompt);

      const response = await result.response;
      const content = response.text().trim();
      
      if (!content) {
        throw new Error('Google AI returned empty content');
      }

      this.logger.log(`Draft content generated successfully (${content.length} characters)`);
      return content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to generate draft content: ${errorMessage}`);
      throw new Error(`Google AI API 呼叫失敗：${errorMessage}`);
    }
  }

  /**
   * 檢查 Google AI 服務是否可用
   */
  isAvailable(): boolean {
    return this.model !== null;
  }
}

