import { useAppValue } from "context";

export const isAdmin = () => {
  const [{ currentUser }] = useAppValue();
  return currentUser?.roles?.some((role) => role === "Administrator");
};
