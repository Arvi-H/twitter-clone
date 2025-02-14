import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  setIsFollower: (isFollower: boolean) => void;
  setFollowerCount: (count: number) => void;
  setFolloweeCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter {
  private followService: FollowService;
  private view: UserInfoView;

  public constructor(view: UserInfoView) {
    this.view = view;
    this.followService = new FollowService();
  }

  public async updateFollowInfo(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    await Promise.all([
      this.setIsFollowerStatus(authToken, currentUser, displayedUser),
      this.updateFollowerCount(authToken, displayedUser),
      this.updateFolloweeCount(authToken, displayedUser)
    ]);
  }

  private async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    try {
      const isFollower = currentUser === displayedUser 
        ? false 
        : await this.followService.isFollower(authToken, currentUser, displayedUser);
      this.view.setIsFollower(isFollower);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  private async updateFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<void> {
    try {
      const count = await this.followService.getFollowerCount(authToken, user.alias);
      this.view.setFollowerCount(count);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  private async updateFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<void> {
    try {
      const count = await this.followService.getFolloweeCount(authToken, user.alias);
      this.view.setFolloweeCount(count);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async follow(authToken: AuthToken, userToFollow: User): Promise<void> {
    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${userToFollow.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.follow(
        authToken,
        userToFollow
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }

  public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<void> {
    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Unfollowing ${userToUnfollow.name}...`, 0);

      const [followerCount, followeeCount] = await this.followService.unfollow(
        authToken,
        userToUnfollow
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
