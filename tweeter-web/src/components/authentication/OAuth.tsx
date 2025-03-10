import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import useToastListener from "../toaster/ToastListenerHook";
import { IconName } from "@fortawesome/fontawesome-svg-core";

interface OAuthButtonConfig {
  id: string;
  icon: IconName;
  label: string;
}

const OAuth = () => {
  const { displayInfoMessage } = useToastListener();
  
  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(message, 3000, "text-white bg-primary");
  };

  const oAuthButtons: OAuthButtonConfig[] = [
    { id: "google", icon: "google" as IconName, label: "Google" },
    { id: "facebook", icon: "facebook" as IconName, label: "Facebook" },
    { id: "twitter", icon: "twitter" as IconName, label: "Twitter" },
    { id: "linkedin", icon: "linkedin" as IconName, label: "LinkedIn" },
    { id: "github", icon: "github" as IconName, label: "GitHub" }
  ];

  return (
    <div className="text-center mb-3">
      {oAuthButtons.map((button) => (
        <button
          key={button.id}
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() =>
            displayInfoMessageWithDarkBackground(
              `${button.label} registration is not implemented.`
            )
          }
        >
          <OverlayTrigger placement="top" overlay={<Tooltip id={`${button.id}Tooltip`}>{button.label}</Tooltip>}>
            <FontAwesomeIcon icon={["fab", button.icon]} />
          </OverlayTrigger>
        </button>
      ))}
    </div>
  );
};

export default OAuth; 