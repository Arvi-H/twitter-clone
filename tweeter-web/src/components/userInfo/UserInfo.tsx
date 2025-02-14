import "./UserInfo.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./useUserInfo";
import { UserInfoPresenter, UserInfoView } from "../../presenters/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } = useToastListener();
  const { currentUser, authToken, displayedUser } = useUserInfo();

  const listener: UserInfoView = {
    displayErrorMessage,
    displayInfoMessage,
    clearLastInfoMessage,
    setIsFollower,
    setFollowerCount,
    setFolloweeCount,
    setIsLoading
  };

  const [presenter] = useState(new UserInfoPresenter(listener));

  useEffect(() => {
    if (authToken && currentUser && displayedUser) {
      presenter.updateFollowInfo(authToken, currentUser, displayedUser);
    }
  }, [authToken, currentUser, displayedUser, presenter]);

  return (
    <div className="container">
      {displayedUser && (
        <>
          <div className="profile-image-container">
            <img src={displayedUser.imageUrl} alt="Profile" className="profile-image" />
          </div>
          <h2>{displayedUser.name}</h2>
          <h3>{displayedUser.alias}</h3>
          {currentUser?.alias !== displayedUser?.alias && (
            <button
              className="btn btn-md btn-primary me-1"
              onClick={(e) => {
                e.preventDefault();
                if (authToken && displayedUser) {
                  isFollower ? 
                    presenter.unfollow(authToken, displayedUser) :
                    presenter.follow(authToken, displayedUser);
                }
              }}
              disabled={isLoading}
            >
              {isFollower ? "Unfollow" : "Follow"}
            </button>
          )}
          <br />
          <div>
            <span>Following: {followeeCount}</span>
            <span> | </span>
            <span>Followers: {followerCount}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default UserInfo;
