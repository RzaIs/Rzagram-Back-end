import { Post, PostType, User } from '@prisma/client';

export class PostResponseModel {
  id: String;
  title: String;
  content: String;
  type: PostType;
  created: Date;
  updated: Date;
  author: {
    id: String;
    username: String;
  };

  constructor(post: Post & { author: User }) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.type = post.type;
    this.created = post.created;
    this.updated = post.updated;
    this.author = {
      id: post.authorID,
      username: post.author.username
    };
  }
}
