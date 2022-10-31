import { IsEmail, IsNotEmpty } from "class-validator"


export class UserCreateModel {
  @IsEmail()
  @IsNotEmpty() email: string
  @IsNotEmpty() username: string
  @IsNotEmpty() encryptedPassword: string
  @IsNotEmpty() keyID: string
}