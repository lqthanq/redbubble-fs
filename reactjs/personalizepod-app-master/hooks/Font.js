import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import FONTQUERY from "../graphql/queries/font";
import { getClient } from "../lib/apollo";
import { message } from "antd";

function useFont(fontFamily, callback = () => {}) {
  const [fontId, variant] = (fontFamily || "").split("-");
  const [font, setFont] = useState(null);
  const { loading } = useQuery(FONTQUERY, {
    client: getClient(),
    variables: {
      id: fontId,
    },
    onCompleted: (data) => setFont(data.font),
  });
  useEffect(() => {
    if (font && Array.isArray(font.variants)) {
      const WebFontLoader = require("webfontloader");
      font.variants
        .filter((v) => v.variant === variant)
        .forEach((v) => {
          const css = `@font-face {font-family:"${fontFamily}";src:url("${v.file.url}") format("truetype");}`;
          WebFontLoader.load({
            custom: {
              families: [fontFamily],
              urls: [`data:text/css;base64,${btoa(css)}`],
            },
            fontactive: () => {
              callback();
            },
            fontinactive: (familyName) => {
              message.error(`Could not load ${familyName} font`);
            },
            timeout: 20000,
          });
        });
    }
  }, [font, fontFamily, variant]);
  return font;
}

export default useFont;
