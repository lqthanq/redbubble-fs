import { InputNumber, Slider as AntSlider } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";

const Slider = ({ value = 0, onChange = () => {}, step = 1, min, max }) => {
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, [value]);

  useEffect(() => {
    handleChange(val);
  }, [val]);

  const handleChange = useCallback(
    debounce((v) => onChange(v), 200),
    []
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 60px",
        gap: 2,
        paddingLeft: 2,
      }}
    >
      <AntSlider
        value={val}
        onChange={(v) => setVal(v)}
        step={step}
        min={min}
        max={max}
      />
      <InputNumber
        size="small"
        style={{ width: "100%", fontSize: 14 }}
        //hidden={true}
        value={val}
        onChange={(v) => setVal(v)}
        step={step}
        min={min}
        max={max}
      />
    </div>
  );
};

export default Slider;
