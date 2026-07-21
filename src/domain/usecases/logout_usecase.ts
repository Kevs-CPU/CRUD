import { AuthRepository } from "../repositories/AuthRepository";

export class LogoutUseCase {
  constructor(private repository: AuthRepository) {}

  async execute() {

    return await this.repository.logout();
  }
}