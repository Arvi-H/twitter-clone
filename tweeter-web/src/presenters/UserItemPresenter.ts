import { AuthToken, User } from "tweeter-shared";

export interface UserItemView {
  addItems: (newItems: User[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class UserItemPresenter {
  private _hasMoreItems: boolean = true;
  private _lastItem: User | null = null;
  private _view: UserItemView;

  protected get view(): UserItemView {
    return this._view;
  }

  protected constructor(view: UserItemView) {
    this._view = view;
  }

  reset(): void {
    this._hasMoreItems = true;
    this.lastItem = null;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem(): User | null {
    return this._lastItem;
  }

  protected set lastItem(value: User | null) {
    this._lastItem = value;
  }

  public abstract loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): void;
}
