import { Button, Input } from "antd";
import AuthElement from "components/User/AuthElement";
import React, { useState } from "react";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import styled from "styled-components";
import { permissions } from "./Permissions";

const Container = styled.div`
  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 250px;
  }
  .btn-action {
    margin-left: 10px;
  }
  .btn-action-success {
    margin-left: 10px;
  }
`;

const EditText = ({ defaultValue, record, edit, setEdit, updateName }) => {
  const [text, setText] = useState();
  return (
    <Container>
      {!edit || record.id !== edit ? (
        <div className="flex item-center">
          <span>{defaultValue} </span>
          <AuthElement name={permissions.ClipartUpdate}>
            <Button
              className="btn-action"
              type="link"
              onClick={() => setEdit(record.id)}
              icon={<AiOutlineEdit className="custom-icon anticon" />}
            />
          </AuthElement>
        </div>
      ) : (
        <div className="flex">
          <Input
            autoFocus
            style={{ maxWidth: 250 }}
            defaultValue={defaultValue}
            onChange={(e) => setText(e.target.value)}
            onPressEnter={(e) => {
              if (e.target.value && record.title !== e.target.value) {
                updateName(record.id, e.target.value);
              }
              setEdit(false);
            }}
          />
          <Button
            type="link"
            onClick={() => {
              if (text && record.title !== text) {
                updateName(record.id, text);
              }
              setEdit(false);
            }}
            icon={
              <AiOutlineCheck className="custom-icon anticon btn-action-success" />
            }
          />
          <Button
            className="delete-button-color "
            type="link"
            onClick={() => setEdit(false)}
            icon={
              <AiOutlineClose className="custom-icon anticon delete-button-color" />
            }
          />
        </div>
      )}
    </Container>
  );
};

export default EditText;
