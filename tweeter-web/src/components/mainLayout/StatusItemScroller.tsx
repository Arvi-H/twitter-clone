import { Status } from "tweeter-shared";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import StatusItem from "../statusItem/StatusItem";
import useUserInfo from "../userInfo/useUserInfo";
import { StatusPresenter, StatusItemView } from "../../presenters/StatusPresenter";

export const PAGE_SIZE = 10;

interface Props {
  itemDescription: string;
  isFeed?: boolean;
}

const StatusItemScroller = ({ itemDescription, isFeed = true }: Props) => {
  const { displayedUser, authToken } = useUserInfo();
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<Status[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<Status | null>(null);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

  const listener: StatusItemView = {
    addItems: (newItems) => setItems((old) => [...old, ...newItems]),
    displayErrorMessage,
    setHasMoreItems,
    setLastItem,
    setChangedDisplayedUser
  };

  const [presenter] = useState(new StatusPresenter(listener));

  useEffect(() => {
    setItems([]);
    setHasMoreItems(true);
    setLastItem(null);
    setChangedDisplayedUser(true);
  }, [displayedUser]);

  useEffect(() => {
    if (changedDisplayedUser && authToken && displayedUser) {
      presenter.loadMoreItems(authToken, displayedUser.alias, lastItem, isFeed);
    }
  }, [changedDisplayedUser, authToken, displayedUser, isFeed, lastItem, presenter]);

  const loadMoreItems = () => {
    if (authToken && displayedUser) {
      presenter.loadMoreItems(authToken, displayedUser.alias, lastItem, isFeed);
    }
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <StatusItem value={item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller; 