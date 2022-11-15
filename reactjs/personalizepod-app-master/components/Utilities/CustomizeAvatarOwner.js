import { Avatar, Popover } from "antd";
import React from "react";
import { AiOutlineMail } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div``;
const CustomizeAvatarOwner = ({
  showAvatar = true,
  src,
  size,
  author,
  showEmail = false,
}) => {
  return (
    <Container>
      {author && (
        <div>
          <Popover
            placement="bottom"
            overlayClassName="popover-owner"
            content={
              <div>
                <Avatar
                  hidden={!author.avatar}
                  size={200}
                  src={src}
                  shape="square"
                  style={{ marginBottom: 10 }}
                >
                  {author?.firstName?.charAt(0)}
                  {author?.lastName?.charAt(0)}
                </Avatar>
                <div>
                  <strong>
                    {author?.firstName} {author?.lastName}
                  </strong>
                </div>
                <div>
                  <AiOutlineMail className="anticon" /> {author?.email}
                </div>
              </div>
            }
          >
            <div className="flex item-center">
              {showAvatar ? (
                <Avatar size={size} src={src}>
                  {author?.firstName?.charAt(0)}
                  {author?.lastName?.charAt(0)}
                </Avatar>
              ) : (
                <FaUserEdit className="anticon ml-15" />
              )}
              <div style={{ display: "grid", marginLeft: 10 }}>
                <span>
                  {author?.firstName} {author?.lastName}
                </span>
                {<span hidden={!showEmail}>{author.email}</span>}
              </div>
            </div>
          </Popover>
        </div>
      )}
    </Container>
  );
};

export default CustomizeAvatarOwner;
