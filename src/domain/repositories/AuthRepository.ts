// src/domain/repositories/AuthRepository.ts

export interface AuthRepository {
  register(
    username: string,
    gmail: string,
    password: string
  ): Promise<any>;

  login(
    username: string,
    password: string
  ): Promise<any>;

  logout(): Promise<void>;

  resetPassword(
    gmail: string
  ): Promise<void>;

  getUserProfile(
    uid: string
  ): Promise<any>;

  saveUserProfile(
    uid: string,
    username: string,
    email: string
  ): Promise<any>;

  updateVerifiedEmail(
    uid: string,
    email: string
  ): Promise<void>;

  observeAuthState(
    callback: (user: any) => void
  ): () => void;

  getCurrentUser(): Promise<any>;
}