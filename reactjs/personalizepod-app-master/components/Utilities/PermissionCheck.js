import { useAppValue } from "context";
import { userHasPermission } from "./Auth";

export const permissionCheck = (name) => {
  const [{ currentUser }] = useAppValue();
  return userHasPermission(currentUser?.permissions, name);
};
