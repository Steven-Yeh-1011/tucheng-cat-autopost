import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  async getAvailable() {
    return this.prisma.image.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to 50 images
    });
  }
}

