import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY not set, OpenAI features will be mocked');
    }
    this.openai = apiKey ? new OpenAI({ apiKey }) : null as any;
  }

  /**
   * Generate post content using OpenAI
   */
  async generatePostContent(hotTopics: any[], images: any[]): Promise<{
    title: string;
    body: string;
    type: 'CAT' | 'LIFE';
  }> {
    if (!this.openai) {
      // Mock response if API key not set
      return {
        title: '今日貓咪日常',
        body: '今天天氣真好，貓咪們都在曬太陽呢！',
        type: 'CAT' as const,
      };
    }

    try {
      const prompt = `請根據以下熱門話題和圖片，生成一篇適合在 Facebook/Instagram 發布的貼文：

熱門話題：
${hotTopics.map(t => `- ${t.title}`).join('\n')}

圖片數量：${images.length} 張

請生成：
1. 一個吸引人的標題（可選）
2. 一段生動有趣的內文（100-200字）
3. 貼文類型：CAT（貓咪相關）或 LIFE（生活日常）

請以 JSON 格式回應：
{
  "title": "標題",
  "body": "內文",
  "type": "CAT" 或 "LIFE"
}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是一個專業的社群媒體內容創作者，專門撰寫關於貓咪和日常生活的貼文。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content from OpenAI');
      }

      const result = JSON.parse(content);
      return {
        title: result.title || null,
        body: result.body,
        type: result.type || 'CAT',
      };
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      // Fallback to mock
      return {
        title: '今日貓咪日常',
        body: '今天天氣真好，貓咪們都在曬太陽呢！',
        type: 'CAT' as const,
      };
    }
  }
}

