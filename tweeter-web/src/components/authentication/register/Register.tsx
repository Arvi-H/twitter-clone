import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { Buffer } from "buffer";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/useUserInfo";
import { AuthenticationPresenter, AuthenticationView } from "../../../presenters/AuthenticationPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileExtension, setImageFileExtension] = useState<string>("");
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

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result instanceof ArrayBuffer) {
          setImageBytes(new Uint8Array(fileReader.result));
          setImageUrl(URL.createObjectURL(file));
          setImageFileExtension(file.name.split('.').pop() || "");
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const inputFieldGenerator = () => (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="firstNameInput"
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="firstNameInput">First Name</label>
      </div>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="lastNameInput"
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />
        <label htmlFor="lastNameInput">Last Name</label>
      </div>
      <AuthenticationFields
        setAlias={setAlias}
        setPassword={setPassword}
        onKeyDown={(e) => e.key === "Enter" && 
          presenter.validateRegistration(firstName, lastName, alias, password, imageUrl, imageFileExtension) &&
          presenter.register(firstName, lastName, alias, password, imageBytes, imageFileExtension, rememberMe)
        }
      />
      <div className="form-floating mb-3">
        <input
          type="file"
          className="d-inline-block py-5 px-4 form-control bottom"
          id="imageFileInput"
          onChange={handleFileChange}
        />
        <label htmlFor="imageFileInput">User Image</label>
        <img src={imageUrl} className="img-thumbnail" alt=""></img>
      </div>
    </>
  );

  const switchAuthenticationMethodGenerator = () => (
    <div className="mb-3">
      Already registered? <Link to="/login">Sign in</Link>
    </div>
  );

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      isLoading={isLoading}
      submitButtonDisabled={() => !presenter.validateRegistration(firstName, lastName, alias, password, imageUrl, imageFileExtension)}
      submit={() => presenter.register(firstName, lastName, alias, password, imageBytes, imageFileExtension, rememberMe)}
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
    />
  );
};

export default Register;
