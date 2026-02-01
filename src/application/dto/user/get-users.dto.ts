import { UserResponseDto } from "../responses";

export class GetUsersResponseDto {
  page?: number;
  limit?: number;
  users: UserResponseDto[];
}