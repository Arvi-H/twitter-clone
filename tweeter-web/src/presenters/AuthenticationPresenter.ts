import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface AuthenticationView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void;
  clearLastInfoMessage: () => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (url: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class AuthenticationPresenter {
  private userService: UserService;
  private view: AuthenticationView;

  public constructor(view: AuthenticationView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async login(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ): Promise<void> {
    try {
      const [user, authToken] = await this.userService.login(alias, password);
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(originalUrl || "/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
      throw error;
    }
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ): Promise<void> {
    try {
      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
      throw error;
    }
  }

  public validateLogin(alias: string, password: string): boolean {
    return !!alias && !!password;
  }

  public validateRegistration(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    imageFileExtension: string
  ): boolean {
    return !!(
      firstName &&
      lastName &&
      alias &&
      password &&
      imageUrl &&
      imageFileExtension
    );
  }
}

// file reader