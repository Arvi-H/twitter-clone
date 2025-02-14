import { AuthToken, FakeData, User } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    userAlias: string
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(userAlias);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    userAlias: string
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(userAlias);
  }

  public async isFollower(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Simulate server delay
    await new Promise((f) => setTimeout(f, 2000));

    const followerCount = await this.getFollowerCount(authToken, userToFollow.alias);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow.alias);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Simulate server delay
    await new Promise((f) => setTimeout(f, 2000));

    const followerCount = await this.getFollowerCount(authToken, userToUnfollow.alias);
    const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow.alias);

    return [followerCount, followeeCount];
  }
}
