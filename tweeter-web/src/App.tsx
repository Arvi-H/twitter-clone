import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/useUserInfo";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { UserItemView } from "./presenters/UserItemPresenter";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import UserItemScroller from "./components/mainLayout/UserItemScroller";

const App = () => {
  const { isAuthenticated } = useUserInfo();

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <StatusItemScroller
              itemDescription="feed items"
              isFeed={true}
            />
          }
        />
        <Route
          path="story"
          element={
            <StatusItemScroller
              itemDescription="story items"
              isFeed={false}
            />
          }
        />
        <Route
          path="followees"
          element={
            <UserItemScroller
              presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
            />
          }
        />
        <Route
          path="followers"
          element={
            <UserItemScroller
              presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes>
      <Route path="/login" element={<Login originalUrl={location.pathname} />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
