// src/domain/usecases/get_username_usecase.ts

export class GetUsernameUseCase {
  constructor() {
    console.log("[GetUsernameUseCase] Initialized");
  }

  execute({
    userProfile,
    user
  }: {
    userProfile: any | null;
    user: any | null;
  }): string {
    console.log(
      "[GetUsernameUseCase] Getting username",
      {
        hasProfile: !!userProfile,
        hasUser: !!user
      }
    );

    if (userProfile?.username) {
      console.log(
        "[GetUsernameUseCase] Using username from profile:",
        userProfile.username
      );

      return userProfile.username;
    }

    if (user?.displayName) {
      console.log(
        "[GetUsernameUseCase] Using display name:",
        user.displayName
      );

      return user.displayName;
    }

    // Priority 3: Email prefix
    if (user?.email) {
      const username = user.email.split("@")[0];

      console.log(
        "[GetUsernameUseCase] Using email prefix:",
        username
      );

      return username;
    }

    console.log(
      "[GetUsernameUseCase] Using default fallback: User"
    );

    return "User";
  }
}