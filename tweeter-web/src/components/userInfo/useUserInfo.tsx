import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";

const useUserInfo = () => {
  const {
    currentUser,
    displayedUser,
    authToken,
    updateUserInfo,
    clearUserInfo,
    setDisplayedUser,
  } = useContext(UserInfoContext);

  return {
    currentUser,
    displayedUser,
    authToken,
    updateUserInfo,
    clearUserInfo,
    setDisplayedUser,
    isAuthenticated: (): boolean => {
      return !!currentUser && !!authToken;
    },
  };
};

export default useUserInfo; 