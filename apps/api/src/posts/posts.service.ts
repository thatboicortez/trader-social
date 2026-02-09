import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  async list() {
    return []; // временно, чтобы не было 404
  }
}