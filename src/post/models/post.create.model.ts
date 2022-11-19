import { PostType } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class PostCreateModel {
  @IsNotEmpty() title: string;
  @IsNotEmpty() content: string;
  @IsNotEmpty() type: PostType;
}
