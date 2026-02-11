import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 🔒 защищённый POST
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: any, @Body() body: { content: string }) {
    return this.postsService.createPost(req.user.userId, body.content);
  }

  // 🌍 публичный GET (ВАЖНО: БЕЗ @UseGuards)
  @Get()
  feed() {
    return this.postsService.getFeed();
  }
}