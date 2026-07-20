import { AuthRepository } from "../repositories/AuthRepository";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export class RegisterUseCase {
  constructor(private repository: AuthRepository) {}

  async execute(username: string, gmail: string, password: string) {
    const cleanUsername = username.trim();
    const cleanGmail = gmail.trim().toLowerCase();

    if (!USERNAME_REGEX.test(cleanUsername)) {
      throw new Error('Username must be 3-20 characters (letters, numbers, underscore only).');
    }

    if (!GMAIL_REGEX.test(cleanGmail)) {
      throw new Error('Please enter a valid Gmail address (example@gmail.com).');
    }

    if (!password || !password.trim()) {
      throw new Error('Password is required.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    return await this.repository.register(cleanUsername, cleanGmail, password);
  }
}