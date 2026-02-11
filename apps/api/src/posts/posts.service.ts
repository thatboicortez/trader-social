import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, content: string) {
    if (!content?.trim()) {
      throw new ForbiddenException('Post content is empty');
    }

    return this.prisma.post.create({
      data: {
        content,
        authorId: userId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });
  }

  async getFeed() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });
  }
}