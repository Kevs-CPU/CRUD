import { AuthRepository } from "../repositories/AuthRepository";

export class LogoutUseCase {
  constructor(private repository: AuthRepository) {}

  async execute() {
    // ✅ BUSINESS LOGIC #1: Check if user is authenticated (sa repository)
    // ✅ BUSINESS LOGIC #2: Clear user session (sa repository)

    return await this.repository.logout();
  }
}