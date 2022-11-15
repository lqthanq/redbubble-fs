import {
  Button,
  Col,
  Form,
  Input,
  List,
  Popconfirm,
  Row,
  Select,
  Space,
} from "antd";
import React, { useState } from "react";
import { AiFillDelete, AiOutlineCheck, AiOutlineEdit } from "react-icons/ai";
import styled from "styled-components";

const Container = styled.div`
  button {
    width: 20px;
    height: 20px;
    padding: 0;
  }
  .ant-list-item {
    display: inherit;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`;

const Features = ({ item, setDataFields, itemIndex }) => {
  const [editMode, setEditMode] = useState(false);
  return (
    <Container>
      <List
        size="small"
        bordered={false}
        dataSource={item.expand}
        renderItem={(field, index) => (
          <List.Item>
            {field.label && editMode !== index ? (
              <div className="flex space-between item-center">
                <span style={{ lineHeight: "36px" }}>+ {field.label}</span>
                <Button
                  type="link"
                  icon={<AiOutlineEdit className="anticon" />}
                  onClick={() => setEditMode(index)}
                />
                <Popconfirm
                  title="Are you sure to delete this feature?"
                  onConfirm={() =>
                    setDataFields((prevState) => {
                      let newData = [...prevState];
                      newData[itemIndex].expand = newData[
                        itemIndex
                      ].expand.filter((_, i) => i !== index);
                      return newData;
                    })
                  }
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="link"
                    icon={<AiFillDelete className="anticon" />}
                  />
                </Popconfirm>
              </div>
            ) : (
              <Form
                onValuesChange={(valuesChange) => {
                  setEditMode(index);
                  setDataFields((prevState) => {
                    let newData = [...prevState];
                    newData[itemIndex].expand[index] = {
                      ...newData[itemIndex].expand[index],
                      ...valuesChange,
                    };
                    return newData;
                  });
                }}
              >
                <Row gutter={[8, 8]}>
                  <Col span={13}>
                    <Form.Item name="label" initialValue={field.label}>
                      <Input placeholder="Label" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="fieldType" initialValue={field.fieldType}>
                      <Select placeholder="Field type">
                        <Select.Option value="icon">Icon</Select.Option>
                        <Select.Option value="text">Text</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Space>
                      <Button
                        disabled={!field.label}
                        type="link"
                        icon={<AiOutlineCheck className="anticon" />}
                        onClick={() => setEditMode(false)}
                      />
                      <Button
                        type="link"
                        onClick={() =>
                          setDataFields((prevState) => {
                            let newData = [...prevState];
                            newData[itemIndex].expand = newData[
                              itemIndex
                            ].expand.filter((_, i) => i !== index);
                            return newData;
                          })
                        }
                        icon={<AiFillDelete className="anticon" />}
                      />
                    </Space>
                  </Col>
                </Row>
              </Form>
            )}
          </List.Item>
        )}
      />
    </Container>
  );
};

export default Features;
