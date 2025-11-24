import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenAIService } from '../openai/openai.service';
import { LineService } from '../line/line.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private prisma: PrismaService,
    private openaiService: OpenAIService,
    private lineService: LineService,
  ) {}

  /**
   * Generate daily draft: fetch hot topics, select images, generate content, save to DB, notify via LINE
   */
  async generateDailyDraft() {
    this.logger.log('Starting daily draft generation...');

    // 1. Mock: Fetch hot topics
    const hotTopics = await this.fetchHotTopics();
    this.logger.log(`Fetched ${hotTopics.length} hot topics`);

    // 2. Select random images (maintain 50 images, soft delete old ones)
    const images = await this.selectImages();
    this.logger.log(`Selected ${images.length} images`);

    // 3. Generate content using OpenAI
    const content = await this.openaiService.generatePostContent(
      hotTopics,
      images,
    );
    this.logger.log('Generated content');

    // 4. Save to database
    const post = await this.prisma.post.create({
      data: {
        title: content.title,
        body: content.body,
        type: content.type,
        status: 'DRAFT',
        images: {
          create: images.map((image, index) => ({
            imageId: image.id,
            position: index,
          })),
        },
      },
      include: {
        images: {
          include: {
            image: true,
          },
        },
      },
    });
    this.logger.log(`Created draft post: ${post.id}`);

    // 5. Send LINE notification with LIFF link
    const liffUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/editor/${post.id}`;
    await this.lineService.sendDraftNotification(post.id, liffUrl);
    this.logger.log('Sent LINE notification');

    // 6. Clean up old images (soft delete if not used for 2+ weeks)
    await this.cleanupOldImages();

    return {
      success: true,
      postId: post.id,
      liffUrl,
    };
  }

  /**
   * Mock: Fetch hot topics
   */
  private async fetchHotTopics() {
    // TODO: Implement actual hot topic fetching
    // For now, return mock data
    return [
      {
        title: '貓咪日常',
        source: 'mock',
        date: new Date(),
      },
    ];
  }

  /**
   * Select available images
   */
  private async selectImages() {
    const availableImages = await this.prisma.image.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        usedCount: 'asc', // Prefer less used images
      },
      take: 3, // Select 3 images
    });

    return availableImages;
  }

  /**
   * Clean up old images (soft delete if not used for 2+ weeks)
   * Public method for Cron Job to call
   */
  async cleanupOldImages() {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    await this.prisma.image.updateMany({
      where: {
        isDeleted: false,
        OR: [
          {
            lastUsedAt: {
              lt: twoWeeksAgo,
            },
          },
          {
            lastUsedAt: null,
            createdAt: {
              lt: twoWeeksAgo,
            },
          },
        ],
      },
      data: {
        isDeleted: true,
      },
    });

    this.logger.log('Cleaned up old images');
  }
}

