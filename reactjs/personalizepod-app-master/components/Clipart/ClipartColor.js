import { useMutation } from "@apollo/client";
import { Button, message, Popover, Tooltip } from "antd";
import { GlobalStyle } from "components/Konva/Utilities/ColorField";
import { messageSave } from "components/Utilities/message";
import { permissionCheck } from "components/Utilities/PermissionCheck";
import { permissions } from "components/Utilities/Permissions";
import { UPDATE_CLIPART_COLOR } from "graphql/mutate/clipart/clipartAction";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import styled from "styled-components";

const PopoverContainer = styled.div`
  .sketch-picker {
    box-shadow: none !important;
    padding: 0 !important;
  }
`;

const ClipartColor = ({ list, record, refetchData }) => {
  const [color, setColor] = useState(record?.color ?? "");
  const [updateClipartColor, { loading }] = useMutation(UPDATE_CLIPART_COLOR);

  const handleVisibleChange = (visible) => {
    if (!visible) {
      setColor("");
    }
  };

  const handleUpdateColor = (hex) => {
    setColor(hex ?? "");
    updateClipartColor({
      variables: {
        id: record.id,
        color: hex,
      },
    })
      .then(() => {
        messageSave("Color Clipart");
        refetchData();
      })
      .catch((err) => message.error(err.message));
  };

  const buttonSize = list ? 50 : 24;

  const colorView = (
    <div>
      {record?.color || color ? (
        <Tooltip title={color || record?.color}>
          <Button
            style={{
              backgroundColor: color || record?.color,
              width: buttonSize,
              padding: 0,
              height: buttonSize,
            }}
          >
            {" "}
          </Button>
        </Tooltip>
      ) : (
        <Tooltip
          title={
            permissionCheck(permissions.ClipartUpdate)
              ? "Click to set color"
              : "No color setting"
          }
        >
          <div
            style={{
              width: buttonSize,
              height: buttonSize,
              backgroundImage: `url(/transparent.png)`,
              backgroundSize: "16px",
              cursor: "pointer",
              border: "1px solid #999",
              boxShadow: "0 2px 0 rgb(0 0 0 / 2%)",
              borderRadius: 4,
            }}
          />
        </Tooltip>
      )}
      <GlobalStyle />
    </div>
  );

  return (
    <div>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          zIndex: 5,
          position: list ? "relative" : "absolute",
          left: list ? 0 : 5,
          top: list ? 0 : 5,
        }}
      >
        {permissionCheck(permissions.ClipartUpdate) ? (
          <Popover
            trigger="click"
            onVisibleChange={handleVisibleChange}
            content={
              <PopoverContainer>
                <SketchPicker
                  width={300}
                  color={color ?? record?.color}
                  onChange={({ hex }) => {
                    setColor(hex);
                  }}
                />
                <div style={{ textAlign: "right" }}>
                  <Button
                    onClick={() => handleUpdateColor(null)}
                    danger
                    size="small"
                    loading={color ? false : loading}
                  >
                    Clear
                  </Button>
                  <Button
                    style={{ marginLeft: 10 }}
                    type="primary"
                    size="small"
                    disabled={!color}
                    loading={color ? loading : false}
                    onClick={() => handleUpdateColor(color)}
                  >
                    Save
                  </Button>
                </div>
              </PopoverContainer>
            }
          >
            {colorView}
          </Popover>
        ) : (
          colorView
        )}
      </div>
    </div>
  );
};

export default ClipartColor;
