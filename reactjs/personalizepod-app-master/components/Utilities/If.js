import PropTypes from "prop-types";
import { get } from "lodash";
const If = (props) => {
  return props.if
    ? props.children.filter(
        (child) => get(child, "type.displayName") !== "Else"
      )
    : props.children.filter(
        (child) => get(child, "type.displayName") === "Else"
      );
};
If.propTypes = {
  if: PropTypes.bool,
};

export default If;
