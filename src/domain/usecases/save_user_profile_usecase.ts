import { AuthRepository } from "../repositories/AuthRepository";

export class SaveUserProfileUseCase {
  constructor(private repository: AuthRepository) {}

  async execute(uid: string, username: string, email: string) {
    if (!uid) {
      throw new Error('User ID is required.');
    }

    if (!username || !username.trim()) {
      throw new Error('Username is required.');
    }

    if (!email || !email.trim()) {
      throw new Error('Email is required.');
    }

    return await this.repository.saveUserProfile(uid, username, email);
  }
}