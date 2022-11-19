import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedModel } from 'src/global/models/paginated.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostCreateModel } from './models/post.create.model';
import { PostPaginationModel } from './models/post.pagination.model';
import { PostResponseModel } from './models/post.response.model';

export abstract class PostServiceAC {
  abstract getPost(id: string): Promise<PostResponseModel>;
  abstract getPaginatedPosts(body: PostPaginationModel): Promise<PaginatedModel<PostResponseModel[]>>;
  abstract createPost(body: PostCreateModel, authorID: string): Promise<PostResponseModel>;
  abstract deletePost(id: string): Promise<void>
}

@Injectable()
export class PostService implements PostServiceAC {
  constructor(private prisma: PrismaService) {}

  async getPost(id: string): Promise<PostResponseModel> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true
      }
    });
    if (post !== null) {
      return new PostResponseModel(post)
    } else {
      throw new NotFoundException('Post with specified id does not exist!')
    }
  }

  async getPaginatedPosts(body: PostPaginationModel): Promise<PaginatedModel<PostResponseModel[]>> {
    const posts = await this.prisma.post.findMany({
      skip: body.page * body.count,
      take: body.count,
      orderBy: {
        created: 'desc'
      },
      include: {
        author: true
      }
    })

    return new PaginatedModel(
      body.page,
      posts.length,
      posts.length == body.count,
      posts.map((post) => new PostResponseModel(post))
    )
  }

  async createPost(body: PostCreateModel, authorID: string): Promise<PostResponseModel> {
    const post = await this.prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        type: body.type,
        authorID: authorID
      },
      include: {
        author: true
      }
    })
    return new PostResponseModel(post)
  }

  async deletePost(id: string): Promise<void> {
    await this.prisma.post.delete({
      where: { id }
    })
  }
}
