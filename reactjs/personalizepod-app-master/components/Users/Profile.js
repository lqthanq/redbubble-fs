import { useMutation, useQuery } from "@apollo/client";
import { Button, Col, Drawer, notification, Row } from "antd";
import React, { useState } from "react";
import me from "../../graphql/queries/me";
import styled from "styled-components";
import useFormUser from "components/Users/FormUser";
import useChangePassword from "../Utilities/ChangePassword";
import Upload from "components/Media/Upload";
import createFile from "graphql/mutate/file/create";
import { messageSave } from "components/Utilities/message";
import { UPDATE_USER } from "graphql/mutate/user/userAction";

const Container = styled.div`
  padding: 20px;
  .p-upload {
    width: 100%;
    height: 150px;
    .ant-upload {
      padding: 0px;
    }
    .ant-upload-drag {
      border: none;
    }
  }
`;
const Profile = () => {
  const { data, refetch } = useQuery(me);
  const [files, setFiles] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [CreateFile] = useMutation(createFile);
  const [updateUser] = useMutation(UPDATE_USER);
  const userMe = data?.me?.user;
  const handleCancel = () => {
    setShowEditProfile(false);
    setShowChangePass(false);
  };
  const [formUser, { createLoading, updateLoading }] = useFormUser({
    showEdit: userMe,
    refetch,
    onCancel: handleCancel,
  });
  const [formChange, { loading }] = useChangePassword({
    onCancel: handleCancel,
  });
  const handleUpload = (files) => {
    const newFile = files?.slice(-1)[0];
    CreateFile({
      variables: {
        input: {
          source: "aws",
          key: newFile.key,
          fileName: newFile.name,
          fileMime: newFile.type,
          fileSize: newFile.size,
        },
      },
    })
      .then((res) => {
        if (res) {
          updateUser({
            variables: {
              id: userMe?.id,
              input: {
                avatar: res.data.createFile.id,
                firstName: userMe?.firstName,
                lastName: userMe?.lastName,
              },
            },
          })
            .then(() => {
              messageSave("Avatar");
              refetch();
            })
            .catch((err) => {
              notification.error({ message: err.message });
            });
        }
      })
      .catch((err) => {
        notification.error({ message: err.message });
      });
  };
  return (
    <Container>
      <Row>
        <Col span={24} md={12} lg={10} xl={5}>
          <div className="p-upload">
            <Upload
              onUpload={(files) => {
                setFiles(files);
                handleUpload(files);
              }}
              showUploadList={false}
            >
              <div
                style={{
                  position: "relative",
                  height: 0,
                  paddingBottom: "66%",
                  backgroundImage:
                    files.length || userMe?.avatar !== null
                      ? `url(${process.env.CDN_URL}/300x300/${
                          files.length
                            ? files && files.slice(-1)[0]?.key
                            : userMe?.avatar?.key
                        })`
                      : `url(https://culturaltrust.org/wp-content/themes/oct/assets/img/no-img.png)`,
                  backgroundSize: "contain",
                  backgroundColor:
                    files.length || userMe?.avatar !== null
                      ? "#f5f5f5"
                      : "#fff",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  border: "1px dashed #ddd",
                  borderRadius: 3,
                }}
              />
            </Upload>
          </div>
        </Col>
        <Col span={24} md={12} lg={14} xl={19}>
          <div style={{ marginLeft: 15 }}>
            <h2>
              {userMe.firstName} {userMe.lastName}
            </h2>
            <p>
              <strong>Email: </strong>
              {userMe.email}
            </p>
            <p>
              <strong>Phone: </strong>
            </p>
            <p>
              <strong>Address: </strong>
            </p>
          </div>
          <div>
            <Button type="link" onClick={() => setShowEditProfile(true)}>
              Edit Profile
            </Button>
            <Button type="link" onClick={() => setShowChangePass(true)}>
              Change password
            </Button>
          </div>
          <Drawer
            width="400"
            visible={showEditProfile}
            title="Edit Profile"
            onClose={handleCancel}
            footer={
              <div style={{ textAlign: "right" }}>
                <Button onClick={handleCancel} style={{ marginRight: 5 }}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  form="user"
                  loading={createLoading || updateLoading}
                >
                  Save
                </Button>
              </div>
            }
          >
            {formUser}
          </Drawer>
          <Drawer
            width="400"
            visible={showChangePass}
            onClose={handleCancel}
            title="Change Password"
            footer={
              <div style={{ textAlign: "right" }}>
                <Button style={{ marginRight: 5 }} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  form="changePass"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Save
                </Button>
              </div>
            }
          >
            {formChange}
          </Drawer>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
