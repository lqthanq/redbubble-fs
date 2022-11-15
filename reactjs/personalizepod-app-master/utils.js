export const isAdministrator = (user) => {
  if (!user) {
    return false;
  }
  if (!user.roles) {
    return false;
  }

  let isAdmin = false;
  user.roles.forEach((r) => {
    if (r === "Administrator") {
      isAdmin = true;
      return isAdmin;
    }
  });
  return isAdmin;
};
