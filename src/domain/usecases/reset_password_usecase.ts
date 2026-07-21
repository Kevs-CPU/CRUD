import { AuthRepository } from "../repositories/AuthRepository";

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export class ResetPasswordUseCase {
  constructor(private repository: AuthRepository) {}

  async execute(gmail: string) {

    const cleanGmail = gmail.trim().toLowerCase();
    if (!cleanGmail) {
      throw new Error('Gmail address is required.');
    }

    if (!GMAIL_REGEX.test(cleanGmail)) {
      throw new Error('Please enter a valid Gmail address (example@gmail.com).');
    }

    return await this.repository.resetPassword(cleanGmail);
  }
}