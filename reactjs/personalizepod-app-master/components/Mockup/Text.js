import React from "react";
import { Text as KonvaText } from "react-konva";
const Text = ({ layer, onClick = () => {} }) => {
  return <KonvaText {...layer} onClick={onClick} />;
};

export default Text;
