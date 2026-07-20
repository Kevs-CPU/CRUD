import { AuthRepository } from "../repositories/AuthRepository";

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export class ResetPasswordUseCase {
  constructor(private repository: AuthRepository) {}

  async execute(gmail: string) {
    // ✅ BUSINESS LOGIC #1: Validate gmail is provided
    const cleanGmail = gmail.trim().toLowerCase();
    if (!cleanGmail) {
      throw new Error('Gmail address is required.');
    }

    // ✅ BUSINESS LOGIC #2: Validate gmail format
    if (!GMAIL_REGEX.test(cleanGmail)) {
      throw new Error('Please enter a valid Gmail address (example@gmail.com).');
    }

    // ✅ BUSINESS LOGIC #3: Send password reset email (sa repository)

    return await this.repository.resetPassword(cleanGmail);
  }
}