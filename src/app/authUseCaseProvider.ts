import { FirebaseAuthRepository } from '../data/repositories/FirebaseAuthRepository';
import { RegisterUseCase } from '../domain/usecases/register_usecase';
import { LoginUseCase } from '../domain/usecases/login_usecase';
import { LogoutUseCase } from '../domain/usecases/logout_usecase';
import { ResetPasswordUseCase } from '../domain/usecases/reset_password_usecase';
import { GetUserProfileUseCase } from '../domain/usecases/get_user_profile_usecase';
import { SaveUserProfileUseCase } from '../domain/usecases/save_user_profile_usecase';
import { UpdateVerifiedEmailUseCase } from '../domain/usecases/update_verified_email_usecase';
import { GetCurrentUserUseCase } from '../domain/usecases/get_current_user_usecase';

export const authRepository = new FirebaseAuthRepository();

export const registerUseCase = new RegisterUseCase(authRepository);
export const loginUseCase = new LoginUseCase(authRepository);
export const logoutUseCase = new LogoutUseCase(authRepository);
export const resetPasswordUseCase = new ResetPasswordUseCase(authRepository);
export const getUserProfileUseCase = new GetUserProfileUseCase(authRepository);
export const saveUserProfileUseCase = new SaveUserProfileUseCase(authRepository);
export const updateVerifiedEmailUseCase = new UpdateVerifiedEmailUseCase(authRepository);
export const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);