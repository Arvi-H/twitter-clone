import { AuthToken } from "tweeter-shared";

export interface AppNavbarView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  clearUserInfo: () => void;
}

export class AppNavbarPresenter {
  private view: AppNavbarView;

  constructor(view: AppNavbarView) {
    this.view = view;
  }

  public async logout(authToken: AuthToken): Promise<void> {
    try {
      this.view.displayInfoMessage("Logging Out...", 0);
      // TODO: Implement server call
      await new Promise((res) => setTimeout(res, 1000));
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}