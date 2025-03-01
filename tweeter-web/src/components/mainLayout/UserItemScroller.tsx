import { User } from "tweeter-shared";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import UserItem from "../userItem/UserItem";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/useUserInfo";
import { UserItemPresenter, UserItemView } from "../../presenters/UserItemPresenter";

interface Props {
  presenterGenerator: (view: UserItemView) => UserItemPresenter;
}

const UserItemScroller = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const { displayedUser, authToken } = useUserInfo();
  const [items, setItems] = useState<User[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

  const listener: UserItemView = {
    addItems: (newItems: User[]) => setItems(oldItems => [...oldItems, ...newItems]),
    displayErrorMessage
  };

  const [presenter] = useState(props.presenterGenerator(listener)); 

  useEffect(() => {
    setItems([]);
    setChangedDisplayedUser(true);
    presenter.reset();
  }, [displayedUser, presenter]);

  useEffect(() => {
    if (changedDisplayedUser && authToken && displayedUser) {
      presenter.loadMoreItems(authToken, displayedUser.alias);
      setChangedDisplayedUser(false);
    }
  }, [changedDisplayedUser, authToken, displayedUser, presenter]);

  const loadMoreItems = () => {
    if (authToken && displayedUser) {
      presenter.loadMoreItems(authToken, displayedUser.alias);
    }
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <UserItem value={item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default UserItemScroller;
