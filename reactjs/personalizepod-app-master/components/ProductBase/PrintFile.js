import { Button, Col, Input, InputNumber, Row, Select, Form } from "antd";
import React, { useEffect, useState } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import _ from "lodash";
import { FaPlusCircle } from "react-icons/fa";
import ImagePrintarea from "./ImagePrintarea";
import styled from "styled-components";
import ProductBaseImport from "./ProductBaseImport";
const Container = styled.div`
  .col-attr {
    padding: 10px;
  }
  table {
    tr {
      border-bottom: 1px solid #9999993d;
      th {
        padding: 20px 10px;
        background-color: #e4e2e252;
      }
      td {
        padding: 10px;
      }
    }
  }
`;
const PrintFile = ({
  value,
  onChange = () => {},
  productBaseImport,
  productBase,
}) => {
  const [printFile, setPrintFile] = useState(value ? value : []);
  const [count, setCount] = useState(0);
  const handleAdd = (e) => {
    setPrintFile((prevState) => {
      return [
        ...prevState,
        { key: count, name: "", width: null, height: null },
      ];
    });
    setCount(count + 1);
  };
  useEffect(() => {
    if (onChange) {
      onChange(printFile);
    }
  }, [onChange, printFile]);
  return (
    <Container>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr style={{ margin: "20px 0" }}>
            <th style={{ width: "51%" }}>Name</th>
            <th style={{ width: "21%" }}>Width</th>
            <th style={{ width: "21%" }}>Height</th>
            <th style={{ width: "7%", textAlign: "right" }}>Action</th>
          </tr>
          {printFile.map((pri, index) => (
            <tr className="tr-content-printfile" key={index}>
              <td style={{ width: "%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <Form.Item
                      validateStatus={pri.name === "" ? "error" : ""}
                      // style={{ display: "inline-block" }}
                    >
                      <Input
                        style={{ width: "100%" }}
                        placeholder="Name"
                        value={pri.name}
                        onChange={(e) => {
                          setPrintFile(
                            printFile.map((item, key) =>
                              key === index
                                ? { ...item, name: e.target.value }
                                : item
                            )
                          );
                        }}
                      />
                    </Form.Item>
                    <div>
                      {pri.name === "" ? (
                        <small
                          style={{
                            position: "absolute",
                            // bottom: 73 ,
                            color: "var(--error-color)",
                          }}
                        >
                          Please input name
                        </small>
                      ) : null}
                    </div>
                  </div>
                </div>
              </td>
              <td style={{ width: "21%" }}>
                <Form.Item
                  rules={[{ required: true }]}
                  validateStatus={
                    (pri.name !== "" && pri.width === null) ||
                    (pri.height !== null && pri.width === null)
                      ? "error"
                      : ""
                  }
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    placeholder="px"
                    value={pri.width}
                    onChange={(e) => {
                      setPrintFile(
                        printFile.map((item, key) =>
                          key === index ? { ...item, width: e } : item
                        )
                      );
                    }}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                {(pri.name !== "" && pri.width === null) ||
                (pri.height !== null && pri.width === null) ? (
                  <small
                    style={{
                      position: "absolute",
                      color: "var(--error-color)",
                    }}
                  >
                    Please input width
                  </small>
                ) : null}
              </td>
              <td style={{ width: "21%" }}>
                <Form.Item
                  validateStatus={
                    (pri.name !== "" && pri.height === null) ||
                    (pri.width !== null && pri.height === null)
                      ? "error"
                      : ""
                  }
                >
                  <InputNumber
                    min={0}
                    style={{ textAlign: "center", width: "100%" }}
                    placeholder="px"
                    value={pri.height}
                    onChange={(e) => {
                      setPrintFile(
                        printFile.map((item, key) =>
                          key === index ? { ...item, height: e } : item
                        )
                      );
                    }}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                {(pri.name !== "" && pri.height === null) ||
                (pri.width !== null && pri.height === null) ? (
                  <small
                    style={{
                      position: "absolute",
                      color: "var(--error-color)",
                    }}
                  >
                    Please input height
                  </small>
                ) : null}
              </td>
              <td
                style={{
                  width: "7%",
                  textAlign: "right",
                  padding: "10px 0px",
                }}
              >
                <Button
                  type="link"
                  disabled={productBaseImport || productBase ? true : false}
                  onClick={() => {
                    setPrintFile((prevState) => {
                      return prevState.filter((el, i) => i !== index);
                    });
                  }}
                  icon={
                    <AiTwotoneDelete
                      style={{ color: "var(--error-color)" }}
                      className="custom-icon anticon"
                    />
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex space-between" style={{ paddingTop: 10 }}>
        <Button
          onClick={() => handleAdd()}
          disabled={
            productBaseImport || productBase?.fulfillment?.type === "BuiltIn"
              ? true
              : false
          }
        >
          <FaPlusCircle className="anticon" /> New printarea
        </Button>
      </div>
    </Container>
  );
};

export default PrintFile;
