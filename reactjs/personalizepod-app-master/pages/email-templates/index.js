import { useQuery, useMutation } from "@apollo/client";
import emailTemplates from "../../graphql/queries/emailTemplates";
import { Skeleton, Table, Button, Tooltip, Input, notification } from "antd";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import updateEmailTemplate from "../../graphql/mutate/updateEmailTemplate";
import { AiOutlineEdit } from "react-icons/ai";
import { sum } from "lodash";
import { messageSave } from "components/Utilities/message";
const Container = styled.div`
  .data {
    cursor: pointer;
  }
`;
const EmailTemplates = () => {
  const inputRef = useRef(null);
  const { data, loading, refetch } = useQuery(emailTemplates);
  const [editTitle, setEditTitle] = useState(null);
  const [dataEdit, setDataEdit] = useState(null);
  const [updateTemplate] = useMutation(updateEmailTemplate);
  const router = useRouter();
  const UpdateEmailTemplate = () => {
    if (dataEdit) {
      updateTemplate({
        variables: dataEdit,
      })
        .then(() => {
          refetch();
          messageSave("Template");
        })
        .catch((err) => notification.error({ message: err.message }));
    }
    setEditTitle(null);
    setDataEdit(null);
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editTitle]);
  const columns = [
    {
      title: "Template",
      dataIndex: "template",
      key: "template",
      width: "40%",
      render: (template) => (
        <div style={{ lineHeight: "40px" }}>{template}</div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      width: "40%",
      onCell: (record) => {
        return {
          onClick: () => {
            setEditTitle(record.id);
          },
        };
      },
      render: (title, record) =>
        editTitle !== record.id ? (
          <p className="data">{title}</p>
        ) : (
          <Input
            ref={inputRef}
            onBlur={UpdateEmailTemplate}
            defaultValue={title}
            onPressEnter={UpdateEmailTemplate}
            onChange={(e) =>
              setDataEdit({ ...record, subject: e.target.value })
            }
          />
        ),
    },
    {
      title: "Action",
      align: "right",
      className: "action",
      width: 300,
      render: (record) => (
        <div>
          <Tooltip title="Edit store">
            <Button
              size="small"
              icon={<AiOutlineEdit />}
              onClick={() => {
                router.push(
                  "email-templates/[id]",
                  `email-templates/${record.id}`
                );
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  const tableWidth = sum(columns.map((c) => c.width));
  if (loading) return <Skeleton />;
  return (
    <Container className="content">
      <Table
        columns={columns}
        dataSource={data.EmailTemplates}
        scroll={{ x: tableWidth }}
        rowKey={(record) => record.id}
      />
    </Container>
  );
};
EmailTemplates.title = "Email Templates";
export default EmailTemplates;
