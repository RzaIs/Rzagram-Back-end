import { IsNotEmpty, IsOptional } from "class-validator";

export class PostPaginationModel {
  @IsNotEmpty() page: number
  @IsOptional() count: number = 64

  constructor(page: number) {
    this.page = page
    this.count = 64
  }
}