import { omit } from "lodash";

export const clearTypeName = (data) => {
  if (data && data.length) {
    return data.map((el) => omit(el, ["__typename"]));
  }
  return [];
};
