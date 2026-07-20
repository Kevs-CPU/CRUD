import { AuthRepository } from "../repositories/AuthRepository";

export class LoginUseCase {
  constructor(private repository: AuthRepository) {}

  async execute(username: string, password: string) {
    // ✅ BUSINESS LOGIC #1: Validate username is provided
    const usernameLower = username.trim().toLowerCase();
    if (!usernameLower) {
      throw new Error('Username is required.');
    }

    // ✅ BUSINESS LOGIC #2: Validate password is provided
    if (!password || !password.trim()) {
      throw new Error('Password is required.');
    }

    // ✅ BUSINESS LOGIC #3: Check if username exists (sa repository)
    // ✅ BUSINESS LOGIC #4: Authenticate user (sa repository)

    return await this.repository.login(usernameLower, password);
  }
}