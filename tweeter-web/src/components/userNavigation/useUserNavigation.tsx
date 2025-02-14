import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/useUserInfo";
import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";
import { useState } from "react";

const useUserNavigation = () => {
  const { setDisplayedUser, authToken } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const listener: UserNavigationView = {
    displayErrorMessage,
    setDisplayedUser
  };

  const [presenter] = useState(new UserNavigationPresenter(listener));

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    if (authToken) {
      const alias = extractAlias(event.target.toString());
      await presenter.getUser(authToken, alias);
    }
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  return {
    navigateToUser,
  };
};

export default useUserNavigation; 