import { IsOptional } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends CreateUserDto {
  @IsOptional()
  role?: string;
}