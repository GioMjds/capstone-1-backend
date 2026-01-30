export * from './create-user.use-case';
export * from './archive-user.use-case';
export * from './get-user.use-case';
export * from './update-user.use-case';
export * from './get-user-by-id.use-case';

import { CreateUserUseCase } from './create-user.use-case';
import { ArchiveUserUseCase } from './archive-user.use-case';
import { GetUserUseCase } from './get-user.use-case';
import { UpdateUserUseCase } from './update-user.use-case';
import { GetUserByIdUseCase } from './get-user-by-id.use-case';

export const USER_USE_CASES = [
  CreateUserUseCase,
  ArchiveUserUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  GetUserByIdUseCase,
]