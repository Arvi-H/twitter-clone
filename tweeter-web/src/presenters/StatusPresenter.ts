import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface StatusItemView {
  addItems: (newItems: Status[]) => void;
  displayErrorMessage: (message: string) => void;
  setHasMoreItems: (hasMore: boolean) => void;
  setLastItem: (item: Status | null) => void;
  setChangedDisplayedUser: (changed: boolean) => void;
}

export interface PostStatusView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  clearPost: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class StatusPresenter {
  private statusService: StatusService;
  private view: StatusItemView | PostStatusView;
  private readonly PAGE_SIZE = 10;

  public constructor(view: StatusItemView | PostStatusView) {
    this.statusService = new StatusService();
    this.view = view;
  }

  public async loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
    lastItem: Status | null,
    isFeed: boolean
  ): Promise<void> {
    try {
      const [newItems, hasMore] = isFeed
        ? await this.statusService.loadMoreFeedItems(
            authToken,
            userAlias,
            this.PAGE_SIZE,
            lastItem
          )
        : await this.statusService.loadMoreStoryItems(
            authToken,
            userAlias,
            this.PAGE_SIZE,
            lastItem
          );

      if (this.isStatusItemView(this.view)) {
        this.view.setHasMoreItems(hasMore);
        this.view.setLastItem(newItems[newItems.length - 1]);
        this.view.addItems(newItems);
        this.view.setChangedDisplayedUser(false);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load ${isFeed ? "feed" : "story"} items because of exception: ${error}`
      );
    }
  }

  public async postStatus(
    authToken: AuthToken,
    currentUser: User,
    post: string
  ): Promise<void> {
    if (this.isPostStatusView(this.view)) {
      try {
        this.view.displayInfoMessage("Posting status...", 0);
        const status = new Status(post, currentUser, Date.now());
        await this.statusService.postStatus(authToken, status);
        this.view.clearPost();
        this.view.displayInfoMessage("Status posted!", 2000);
      } catch (error) {
        this.view.displayErrorMessage(
          `Failed to post status because of exception: ${error}`
        );
      } finally {
        this.view.clearLastInfoMessage();
      }
    }
  }

  private isStatusItemView(view: StatusItemView | PostStatusView): view is StatusItemView {
    return 'addItems' in view;
  }

  private isPostStatusView(view: StatusItemView | PostStatusView): view is PostStatusView {
    return 'clearPost' in view;
  }

  public validatePost(post: string, authToken: AuthToken | null, currentUser: User | null): boolean {
    return !!post.trim() && !!authToken && !!currentUser;
  }

  public clearPost(): void {
    if (this.isPostStatusView(this.view)) {
      this.view.clearPost();
    }
  }
}
