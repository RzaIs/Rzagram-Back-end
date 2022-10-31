import { IsNotEmpty } from "class-validator"

export class UserAuthModel {
  @IsNotEmpty() username: string
  @IsNotEmpty() encryptedPassword: string
  @IsNotEmpty() keyID: string
}

