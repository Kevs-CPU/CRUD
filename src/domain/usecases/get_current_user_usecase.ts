import { AuthRepository } from "../repositories/AuthRepository";

export class GetCurrentUserUseCase {
  constructor(private repository: AuthRepository) {}

  async execute() {
    return await this.repository.getCurrentUser();
  }
}