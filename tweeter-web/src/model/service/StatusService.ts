import { AuthToken, Status, FakeData } from "tweeter-shared";

export class StatusService {
  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // TODO: Replace with actual server call
    await new Promise((f) => setTimeout(f, 2000));
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }
}