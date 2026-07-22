import { AuthRepository } from "../repositories/AuthRepository";

export class GetOrCreateUserProfileUseCase {
  constructor(private repository: AuthRepository) {
    console.log("[GetOrCreateUserProfileUseCase] Initialized");
  }

  async execute(user: any) {
    console.log(
      "[GetOrCreateUserProfileUseCase] Started:",
      user?.uid
    );

    if (!user?.uid) {
      console.error("[GetOrCreateUserProfileUseCase] User ID is required");
      throw new Error("User ID is required.");
    }

    console.log("[GetOrCreateUserProfileUseCase] Valid user ID:", user.uid);

    console.log("[GetOrCreateUserProfileUseCase] Checking for existing profile...");
    const existingProfile = await this.repository.getUserProfile(user.uid);

    if (existingProfile) {
      console.log(
        "[GetOrCreateUserProfileUseCase] Existing profile found:",
        existingProfile
      );
      return existingProfile;
    }

    console.log(
      "[GetOrCreateUserProfileUseCase] No profile found, creating default"
    );

    const username =
      user.displayName ||
      user.email?.split("@")[0] ||
      "User";

    const email = user.email || "";

    console.log(
      "[GetOrCreateUserProfileUseCase] Creating profile with:",
      { username, email, uid: user.uid }
    );

    console.log("[GetOrCreateUserProfileUseCase] Saving new profile to database...");
    
    const newProfile = await this.repository.saveUserProfile(
      user.uid,
      username,
      email
    );


    console.log(
      "[GetOrCreateUserProfileUseCase] New profile created successfully:",
      newProfile
    );

    return newProfile;
  }
}