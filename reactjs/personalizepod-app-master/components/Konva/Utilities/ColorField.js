import { Popover, Button } from "antd";
import { SketchPicker, TwitterPicker } from "react-color";
import { BiFontColor } from "react-icons/bi";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
.twitter-picker {
  box-shadow: none !important;
}
`;

const ColorField = ({
  value,
  onChange,
  type = "font",
  view = "twitterPicker",
  size,
}) => {
  return (
    <Popover
      placement={view === "sketchPicker" ? "bottomLeft" : "bottom"}
      content={
        view === "sketchPicker" ? (
          <SketchPicker
            width={300}
            triangle="hide"
            color={value ? value : ""}
            onChange={({ hex }) => onChange(hex)}
          />
        ) : (
          <TwitterPicker
            triangle="hide"
            color={value ? value : ""}
            onChange={({ hex }) => {
              if (hex !== value) onChange(hex);
            }}
            //onChange={({ hex }) => onChange(hex)}
          />
        )
      }
    >
      {type === "sharp" ? (
        <Button
          style={{
            backgroundColor: value ? value : "unset",
            width: size ? size : 32,
            height: size ? size : 32,
          }}
        >
          {" "}
        </Button>
      ) : (
        <Button
          type="link"
          icon={
            <BiFontColor
              className="anticon"
              style={{
                color: value ? value : "",
                fontSize: 20,
              }}
            />
          }
        />
      )}
      <GlobalStyle />
    </Popover>
  );
};

export default ColorField;
