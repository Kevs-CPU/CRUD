import { AuthRepository } from "../repositories/AuthRepository";

export class UpdateVerifiedEmailUseCase {
  constructor(private repository: AuthRepository) {}

  async execute(uid: string, email: string) {
    if (!uid) {
      throw new Error('User ID is required.');
    }

    if (!email || !email.trim()) {
      throw new Error('Email is required.');
    }

    return await this.repository.updateVerifiedEmail(uid, email);
  }
}