import { Injectable } from '@nestjs/common';

@Injectable()
export class ViewActiveSessionsUseCase {
  constructor() {}

  async execute(): Promise<any[]> {
    return [];
  }
}