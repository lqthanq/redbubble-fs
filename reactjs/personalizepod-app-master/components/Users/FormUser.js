import { Form, Input, notification, Row, Col, Progress, Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import Upload from "components/Media/Upload";
import createFile from "graphql/mutate/file/create";
import styled from "styled-components";
import {
  messageDuplicateEmail,
  messageSave,
} from "components/Utilities/message";
import { FaCloudUploadAlt } from "react-icons/fa";
import { CREATE_USER, UPDATE_USER } from "graphql/mutate/user/userAction";
import ImagePreview from "components/Media/ImagePreview";
import { AiTwotoneDelete } from "react-icons/ai";
import { last } from "lodash";

const Container = styled.div`
  .p-upload {
    .ant-upload {
      padding: 0px;
    }
    .ant-upload-drag {
      border: none;
    }
  }
  .ant-upload.ant-upload-drag {
    background: #fff;
  }
`;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const FormUser = ({ user, refetch, onCancel }) => {
  const [form] = Form.useForm();
  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER);
  const [CreateFile] = useMutation(createFile);
  const [image, setImage] = useState();
  const [createUser, { loading: createLoading }] = useMutation(CREATE_USER);

  useEffect(() => {
    if (user) {
      setImage(user.avatar);
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } else {
      setImage();
    }
  }, [user]);

  const onhandleCancel = () => {
    onCancel();
    setImage();
    form.resetFields();
  };

  const onFinish = (values) => {
    if (user) {
      updateUser({
        variables: {
          id: user.id,
          input: { ...values, avatar: image ? image.id : null },
        },
      })
        .then((res) => {
          if (res) {
            messageSave("User");
            refetch();
            onhandleCancel();
          }
        })
        .catch((err) => notification.error({ message: err.message }));
    } else {
      if (values.confirm) {
        delete values.confirm;
      }
      if (image) {
        CreateFile({
          variables: {
            input: {
              source: "aws",
              key: image.key,
              fileName: image.name,
              fileMime: image.type,
              fileSize: image.size,
            },
          },
        })
          .then((res) => {
            handleCreateUser(res.data.createFile.id, values);
          })
          .catch((err) => notification.error({ message: err.message }));
      } else {
        handleCreateUser(null, values);
      }
    }
  };

  const handleCreateUser = (avatar, values) => {
    createUser({
      variables: {
        input: { ...values, avatar },
      },
    })
      .then((res) => {
        if (res) {
          messageSave("User");
          refetch();
          onhandleCancel();
        }
      })
      .catch((err) => {
        if (err.message.includes("duplicate")) {
          messageDuplicateEmail("email");
        }
      });
  };

  return [
    <Container>
      <Form id="user" form={form} {...layout} onFinish={onFinish}>
        <Form.Item
          style={{
            display: "grid",
            justifyContent: "center",
          }}
        >
          <div className="p-upload" style={{ width: 100 }}>
            <Upload
              showUploadList={false}
              onChange={(files) => {
                setImage(last(files));
              }}
              accept=".jpg,.png"
            >
              <div
                style={{
                  position: "relative",
                }}
              >
                {image ? (
                  <div>
                    <ImagePreview
                      styles={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                      }}
                      file={image.originFileObj ?? image}
                    />
                    <div>
                      <AiTwotoneDelete
                        style={{ position: "absolute", bottom: 0, left: "45%" }}
                        className="delete-button-color"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImage();
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      border: "1px dashed #ddd",
                      borderRadius: 120,
                      display: "grid",
                      alignItems: "center",
                      background: "#f0f0f0",
                    }}
                  >
                    <div>
                      <FaCloudUploadAlt className="anticon custom-icon" />
                      <br />
                      Upload Avatar
                    </div>
                  </div>
                )}
              </div>
            </Upload>
          </div>
        </Form.Item>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please input your first name!",
                },
              ]}
              label="First name"
              name="firstName"
            >
              <Input placeholder="First name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please input your last name!",
                },
              ]}
              label="Last name"
              name="lastName"
            >
              <Input placeholder="Last name" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          rules={[
            {
              type: "email",
              required: true,
              message: "Please input your email!",
            },
          ]}
          label="Email"
          name="email"
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: user ? false : true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="************" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: user ? false : true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="************" />
            </Form.Item>
          </Col>
        </Row>
        {/* {!currentUser?.roles?.some((role) => role === "Seller") ? (
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please select roles!",
                },
              ]}
              label="Roles"
              name="roles"
              mode="multiple"
            >
              <Select mode="multiple" placeholder="Select roles">
                {roles?.userRoles?.map((role) => (
                  <Select.Option key={role} value={role}>
                    {role}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : null} */}
      </Form>
    </Container>,
    { createLoading, updateLoading, form, setImage },
  ];
};

export default FormUser;
