import React from "react";
import { useDrag, useDrop } from "react-dnd";

const Container = ({ render, title, children, ...props }) => {
  const [, drop] = useDrop(() => ({
    accept: "our first type",
    drop: () => ({ name: title }),
  }));
  
  return render({
    drop,
    children,

    ...props,
  });
};
export default Container;
