import "./PostStatus.css";
import { useState } from "react";
import { StatusPresenter, PostStatusView } from "../../presenters/StatusPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/useUserInfo";

const PostStatus = () => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } = useToastListener();
  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const listener: PostStatusView = {
    displayErrorMessage,
    displayInfoMessage,
    clearLastInfoMessage,
    clearPost: () => setPost(""),
    setIsLoading
  };

  const [presenter] = useState(new StatusPresenter(listener));

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (authToken && currentUser) {
      await presenter.postStatus(authToken, currentUser, post);
    }
  };

  return (
    <form>
      <textarea
        className="form-control"
        placeholder="Post a status"
        value={post}
        onChange={(e) => setPost(e.target.value)}
      />
      <button
        className="btn btn-md btn-primary me-1"
        type="button"
        onClick={submitPost}
        disabled={isLoading}
      >
        Post Status
      </button>
      <button
        className="btn btn-md btn-secondary"
        type="button"
        onClick={() => presenter.clearPost()}
        disabled={isLoading}
      >
        Clear
      </button>
    </form>
  );
};

export default PostStatus;
