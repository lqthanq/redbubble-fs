import _ from "lodash";

export const userHasPermission = (permissions, name) => {
  if (!permissions) {
    return false;
  }
  if (permissions.length === 0) {
    return false;
  }
  if (name && _.isArray(name) && name.length) {
    for (let i = 0; i < permissions.length; i++) {
      if (name.includes(permissions[i])) {
        return true;
      }
    }
  }
  if (!name) {
    return true;
  }
  for (let i = 0; i < permissions.length; i++) {
    if (permissions[i] === name) {
      return true;
    }
  }
  return false;
};
