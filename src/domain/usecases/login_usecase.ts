import { AuthRepository } from "../repositories/AuthRepository";

export class LoginUseCase {
  constructor(private repository: AuthRepository) {}

  async execute(username: string, password: string) {

    const usernameLower = username.trim().toLowerCase();
    if (!usernameLower) {
      throw new Error('Username is required.');
    }

    if (!password || !password.trim()) {
      throw new Error('Password is required.');
    }

    return await this.repository.login(usernameLower, password);
  }
}