import { Button, notification, Popconfirm } from "antd";
import CustomizeMainContent from "components/Utilities/CustomizeMainContent";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";
import { EXPORT_TEMPLATES } from "graphql/queries/exportTemplates/exportQuery";
import { useMutation, useQuery } from "@apollo/client";
import { AiTwotoneDelete } from "react-icons/ai";
import { DELETE_EXPORT_TEMPLATE } from "graphql/mutate/exportTemplates/exportMutation";
import { messageDelete } from "components/Utilities/message";
import Link from "next/link";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";
const Container = styled.div``;
const ExportTemplateList = () => {
  const router = useRouter();
  const [filter, setFilter] = useState({
    search: "",
  });
  const { data, refetch } = useQuery(EXPORT_TEMPLATES, {
    variables: { search: filter.search },
    fetchPolicy: "no-cache",
  });
  const exportTemplates = data?.exportTemplates;
  const [DeleteExportTemplate] = useMutation(DELETE_EXPORT_TEMPLATE);
  const columns = [
    {
      title: "Template name",
      key: "name",
      dataIndex: "name",
      width: 600,
      render: (name, record) => (
        <b>
          <Link
            as={`/export-templates/${record.id}`}
            href={`/export-templates/[id]`}
          >
            {name}
          </Link>
        </b>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      width: 80,
      render: (record) => (
        <AuthElement name={permissions.ExportTemplateDelete}>
          <Button type="link">
            <Popconfirm
              title="Are you sure to delete export template?"
              okButtonProps={{
                danger: true,
              }}
              okText="Yes"
              cancelText="No"
              onConfirm={() =>
                DeleteExportTemplate({
                  variables: { id: record.id },
                })
                  .then(() => {
                    messageDelete("Export Template");
                    refetch();
                  })
                  .catch((err) => notification.error({ message: err.message }))
              }
            >
              <AiTwotoneDelete
                style={{ color: "var(--error-color)" }}
                className="custom-icon anticon"
              />
            </Popconfirm>
          </Button>
        </AuthElement>
      ),
    },
  ];
  return (
    <Container className="p-15-24">
      <CustomizeMainContent
        pagination={false}
        customLayout={false}
        columns={columns}
        dataSource={exportTemplates}
        multipleFilter={false}
        filter={filter}
        setFilter={setFilter}
        headerTitle="Export Templates"
        headerButton={
          <AuthElement name={permissions.ExportTemplateCreate}>
            <Button
              type="primary"
              type="primary"
              onClick={() =>
                router.push("/export-templates/add", "/export-templates/add")
              }
            >
              Add Export Template
            </Button>
          </AuthElement>
        }
      />
    </Container>
  );
};

export default ExportTemplateList;
