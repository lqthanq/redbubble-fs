import { Row, Col, Avatar, Menu, Modal, notification, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useState } from "react";
import useChangePassword from "./ChangePassword";
import { useRouter } from "next/dist/client/router";
import { useAppValue } from "../../context";
import Upload from "components/Media/Upload";
import createFile from "graphql/mutate/file/create";
import UPDATEPROFILE from "graphql/mutate/user/updateProfile";
import { useMutation } from "@apollo/client";
import { APP } from "actions";

const AvatarContainer = styled.div`
  width: 50px;
  height: 50px;
  position: relative;
  svg {
    position: absolute;
    left: calc(50% - 10px);
    top: calc(50% - 10px);
    font-size: 20px;
    color: #fff;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s;
  }
  &::after {
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    left: 0;
    top: 0;
    content: "";
    display: block;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    transition: opacity 0.3s;
  }
  &:hover {
    svg,
    &::after {
      opacity: 1;
    }
  }
`;

const UserMenu = ({ user }) => {
  const [showChangePass, setShowChangePass] = useState(false);
  const [{ currentUser }, dispatch] = useAppValue();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [CreateFile] = useMutation(createFile);
  const [updateProfile] = useMutation(UPDATEPROFILE);
  if (!user) {
    return "";
  }
  const handleCancel = () => {
    setShowChangePass(false);
  };
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
          updateProfile({
            variables: {
              input: {
                avatar: res.data.createFile.id,
              },
            },
          })
            .then(() => {})
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
    <div>
      <Menu
        style={{ borderRight: "none" }}
        selectable={false}
        className="p-top-user-setting"
      >
        <Menu.Item style={{ height: 60 }}>
          <Row style={{ width: 250 }}>
            <Col flex="60px" className="upload-avatar">
              <Upload
                onUpload={(files) => {
                  setFiles(files);
                  handleUpload(files);
                }}
                showUploadList={false}
              >
                <AvatarContainer>
                  <Avatar
                    size={50}
                    src={`${process.env.CDN_URL}/300x300/${
                      files.length
                        ? files && files.slice(-1)[0]?.key
                        : currentUser?.avatar?.key
                    }`}
                  >
                    {[user.firstName, user.lastName]
                      .map((str) => str.charAt(0))
                      .join("")}
                  </Avatar>
                  <FontAwesomeIcon icon={faCamera} />
                </AvatarContainer>
              </Upload>
            </Col>
            <Col flex="auto" style={{ lineHeight: 1, paddingTop: 12 }}>
              <h3
                style={{ marginBottom: 5 }}
              >{`${user.firstName} ${user.lastName}`}</h3>
              <div
                style={{
                  color: "#999",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "175px",
                  padding: "1px 0",
                  fontSize: "12.5px",
                  fontStyle: "italic",
                }}
              >
                {user.email}
              </div>
            </Col>
          </Row>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>Account settings</Menu.Item>
        <Menu.Item>Get help</Menu.Item>
        <Menu.Item>Refer friends</Menu.Item>
        <Menu.Item onClick={() => setShowChangePass(true)}>
          Change password
        </Menu.Item>
        <Menu.Item
          onClick={() => router.push("/user-profile", "/user-profile")}
        >
          User profile
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <div
            style={{ color: "red" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              //localStorage.removeItem("__token", token);
              dispatch({ type: APP.SET_CURRENT_USER, payload: null });
              router.push("/", "/");
            }}
          >
            Sign out
          </div>
        </Menu.Item>
      </Menu>
      <Modal
        footer={null}
        visible={showChangePass}
        onCancel={handleCancel}
        title="Change Password"
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              form="changePass"
              type="primary"
              htmlType="submit"
              style={{ marginRight: 5 }}
              loading={loading}
            >
              Save
            </Button>
          </div>
        }
      >
        {formChange}
      </Modal>
    </div>
  );
};

export default UserMenu;
