import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/useUserInfo";
import { AuthenticationPresenter, AuthenticationView } from "../../../presenters/AuthenticationPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } = useToastListener();
  const { updateUserInfo } = useUserInfo();
  const navigate = useNavigate();

  const listener: AuthenticationView = {
    displayErrorMessage,
    displayInfoMessage,
    clearLastInfoMessage,
    updateUserInfo,
    navigate,
    setIsLoading
  };

  const [presenter] = useState(new AuthenticationPresenter(listener));

  const inputFieldGenerator = () => (
    <AuthenticationFields
      setAlias={setAlias}
      setPassword={setPassword}
      onKeyDown={(e) => e.key === "Enter" && presenter.login(alias, password, rememberMe, props.originalUrl)}
    />
  );

  const switchAuthenticationMethodGenerator = () => (
    <div className="mb-3">
      Not registered? <Link to="/register">Register</Link>
    </div>
  );

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      isLoading={isLoading}
      submitButtonDisabled={() => !presenter.validateLogin(alias, password)}
      submit={() => presenter.login(alias, password, rememberMe, props.originalUrl)}
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
    />
  );
};

export default Login;
