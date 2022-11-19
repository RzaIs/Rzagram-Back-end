import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService, PostServiceAC } from "./post.service";


@Module({
  controllers: [PostController],
  providers: [
    {
      provide: PostServiceAC,
      useClass: PostService
    }
  ]
})
export class PostModule {}