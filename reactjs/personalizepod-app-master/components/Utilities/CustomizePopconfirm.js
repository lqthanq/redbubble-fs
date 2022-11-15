import React from "react";
import { Popconfirm, Tooltip } from "antd";

const CustomizePopconfirm = (props) => {
  const {
    onConfirm,
    icon,
    tooltip,
    title,
    onClick,
    placementTooltip,
    placementPopconfirm,
    okButtonProps,
    disabled,
  } = props;

  return (
    <Popconfirm
      placement={placementPopconfirm}
      title={title}
      okText="Yes"
      cancelText="No"
      onConfirm={() => onConfirm()}
      okButtonProps={okButtonProps}
      disabled={disabled}
    >
      <Tooltip title={tooltip} placement={placementTooltip}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          onClick={() => {
            if (onClick) {
              onClick();
            }
          }}
        >
          {icon}
        </div>
      </Tooltip>
    </Popconfirm>
  );
};

export default CustomizePopconfirm;
