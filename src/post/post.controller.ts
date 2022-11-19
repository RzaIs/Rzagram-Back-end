import { Body, Controller, Delete, Get, Inject, Param, Post as NestPost, UseGuards } from "@nestjs/common";
import { GetUser } from "src/auth/auth.decorators";
import { AuthStrategy } from "src/auth/auth.strategy";
import { PaginatedModel } from "src/global/models/paginated.model";
import { PostCreateModel } from "./models/post.create.model";
import { PostPaginationModel } from "./models/post.pagination.model";
import { PostResponseModel } from "./models/post.response.model";
import { PostServiceAC } from "./post.service";


@UseGuards(AuthStrategy.JwtGuard)
@Controller('post')
export class PostController {
  constructor(@Inject(PostServiceAC) private service: PostServiceAC) {}

  @Get(':id')
  getPost(@Param('id') id: string): Promise<PostResponseModel> {
    return this.service.getPost(id)
  }

  @NestPost('paginated')
  getPaginatedPosts(@Body() body: PostPaginationModel): Promise<PaginatedModel<PostResponseModel[]>> {
    return this.service.getPaginatedPosts(body)
  }

  @NestPost()
  createPost(@Body() body: PostCreateModel, @GetUser('id') userID: string): Promise<PostResponseModel> {
    return this.service.createPost(body, userID)
  }

  @Delete(':id')
  deletePost(@Param('id') id: string): Promise<void> {
    return this.service.deletePost(id)
  }
}
