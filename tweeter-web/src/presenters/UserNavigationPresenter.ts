import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
  displayErrorMessage: (message: string) => void;
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter {
  private userService: UserService;
  private view: UserNavigationView;

  public constructor(view: UserNavigationView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async getUser(authToken: AuthToken, alias: string): Promise<void> {
    try {
      const user = await this.userService.getUser(authToken, alias);
      if (user) {
        this.view.setDisplayedUser(user);
      } else {
        this.view.displayErrorMessage("User not found");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }

  public switchToUser(user: User): void {
    this.view.setDisplayedUser(user);
  }
}
