import { Row, Col, Input, InputNumber } from "antd";
import { forwardRef, useState, useEffect } from "react";
import { set } from "lodash";

const Shipping = forwardRef((props, ref) => {
  const { onChange, value } = props;

  return (
    <div>
      <Row gutter={[5, 5]}>
        <Col span={8}>
          <span>Us</span>
        </Col>
        <Col span={8}>
          <InputNumber
            style={{ width: "100%" }}
            value={value?.us?.firstProductFee}
            onChange={(number) => {
              onChange({
                ...value,
                us: { ...value.us, firstProductFee: number },
              });
            }}
          />
        </Col>
        <Col span={8}>
          <InputNumber
            style={{ width: "100%" }}
            value={value?.us?.additionalProductFee}
            onChange={(number) => {
              onChange({
                ...value,
                us: { ...value.us, additionalProductFee: number },
              });
            }}
          />
        </Col>
      </Row>
      <Row gutter={[5, 5]}>
        <Col span={8}>
          <span>Canada</span>
        </Col>
        <Col span={8}>
          <InputNumber
            style={{ width: "100%" }}
            value={value?.canada?.firstProductFee}
            onChange={(number) => {
              onChange({
                ...value,
                canada: { ...value.canada, firstProductFee: number },
              });
            }}
          />
        </Col>
        <Col span={8}>
          <InputNumber
            style={{ width: "100%" }}
            value={value?.canada?.additionalProductFee}
            onChange={(number) => {
              onChange({
                ...value,
                canada: { ...value.canada, additionalProductFee: number },
              });
            }}
          />
        </Col>
      </Row>
      <Row gutter={[5, 5]}>
        <Col span={8}>
          <span>International</span>
        </Col>
        <Col span={8}>
          <InputNumber
            style={{ width: "100%" }}
            value={value?.international?.firstProductFee}
            onChange={(number) => {
              onChange({
                ...value,
                international: { ...value.canada, firstProductFee: number },
              });
            }}
          />
        </Col>
        <Col span={8}>
          <InputNumber
            style={{ width: "100%" }}
            value={value?.international?.additionalProductFee}
            onChange={(number) => {
              onChange({
                ...value,
                international: {
                  ...value.international,
                  additionalProductFee: number,
                },
              });
            }}
          />
        </Col>
      </Row>
    </div>
  );
});
export default Shipping;
