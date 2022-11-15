import { useAppValue } from "../../context";
import { userHasPermission } from "../Utilities/Auth";

const AuthElement = ({ name, children }) => {
  const [{ currentUser }] = useAppValue();
  return userHasPermission(currentUser?.permissions, name) ? children : null;
};

export default AuthElement;
