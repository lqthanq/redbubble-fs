import { useEffect } from "react";
import useImage from "use-image";

const UseImage = ({ url, onLoad }) => {
  const [img] = useImage(url, "http://localhost:3000");
  useEffect(() => {
    if (img) {
      onLoad(img);
    }
  }, [img]);
  return null;
};
export default UseImage;
