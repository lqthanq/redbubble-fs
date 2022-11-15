import { InputNumber } from "antd";
import React from "react";

const InputNumberBase = ({ value, onChange, max, disabled, width }) => {
  return (
    <InputNumber
      style={{ width: width ? width : "" }}
      disabled={disabled}
      onChange={(e) => {
        onChange(e);
      }}
      value={value}
      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
      min={0}
      max={max ? max : 10000000}
    />
  );
};

export default InputNumberBase;
