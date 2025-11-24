import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { ImageService } from '../images/image.service';
import { MetaService } from '../meta/meta.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private imageService: ImageService,
    private metaService: MetaService,
  ) {}

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        images: {
          include: {
            image: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    // Check if post exists
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Update post basic info
    const updateData: any = {};
    if (updatePostDto.title !== undefined) {
      updateData.title = updatePostDto.title;
    }
    if (updatePostDto.body !== undefined) {
      updateData.body = updatePostDto.body;
    }

    // Update images if provided
    if (updatePostDto.images) {
      // Delete existing post images
      await this.prisma.postImage.deleteMany({
        where: { postId: id },
      });

      // Create new post images
      await this.prisma.postImage.createMany({
        data: updatePostDto.images.map((img) => ({
          postId: id,
          imageId: img.imageId,
          position: img.position,
          cropData: img.cropData || null,
        })),
      });
    }

    // Update post
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        images: {
          include: {
            image: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    return updatedPost;
  }

  async publish(id: string) {
    const post = await this.findOne(id);

    if (post.status === 'PUBLISHED') {
      throw new Error('Post is already published');
    }

    // Process images: convert SVG to PNG with crop data
    const processedImages: Buffer[] = [];
    for (const postImage of post.images) {
      const imageBuffer = await this.imageService.processImageForPublish(
        postImage.image,
        postImage.cropData as any,
      );
      processedImages.push(imageBuffer);
    }

    // Publish to Meta (Facebook/Instagram)
    // Mock implementation - replace with actual Meta API calls
    const publishResult = await this.metaService.publishPost({
      title: post.title || '',
      body: post.body,
      images: processedImages,
    });

    // Update post status
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    // Update image usage stats
    for (const postImage of post.images) {
      await this.prisma.image.update({
        where: { id: postImage.imageId },
        data: {
          usedCount: { increment: 1 },
          lastUsedAt: new Date(),
        },
      });
    }

    return {
      ...updatedPost,
      publishResult,
    };
  }
}

