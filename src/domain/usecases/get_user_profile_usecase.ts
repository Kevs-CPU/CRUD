import { AuthRepository } from "../repositories/AuthRepository";

export class GetUserProfileUseCase {
  constructor(private repository: AuthRepository) {}

  async execute(uid: string) {
    if (!uid) {
      throw new Error('User ID is required.');
    }

    return await this.repository.getUserProfile(uid);
  }
}