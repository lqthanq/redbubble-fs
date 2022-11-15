import { Input, PageHeader, Form, Card, Button, Skeleton } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";
import TemplateConfigForm from "./TemplateConfigForm";
import { EXPORT_TEMPLATE_COLUMNS } from "graphql/queries/exportTemplates/exportQuery";
import { useQuery } from "@apollo/client";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const Container = styled.div`
  .ant-page-header {
    padding: 18px 0px;
  }
  .align-right {
    margin-bottom: 0;
  }
`;
const ExportTemplateForm = ({ exportById, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { data, loading: dataLoading } = useQuery(EXPORT_TEMPLATE_COLUMNS);
  const exportTemplateColumns = data?.exportTemplateColumns;
  const onFinish = (values) => {
    onSubmit(values);
  };
  if (dataLoading) return <Skeleton />;
  return (
    <Container className="p-15-24">
      <PageHeader
        title={exportById ? "Edit Export Template" : "New Export Template"}
        onBack={() => router.back()}
      />
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Template Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
            initialValue={exportById ? exportById.name : ""}
          >
            <Input placeholder="Template name" />
          </Form.Item>
          <Form.Item
            initialValue={
              exportById
                ? exportById.columns
                : exportTemplateColumns?.reduce(
                    (init, t) => [
                      ...init,
                      { name: t.label, value: t.value, type: "defined_value" },
                    ],
                    []
                  )
            }
            label="Template Configs"
            name="columns"
          >
            <TemplateConfigForm exportTemplateColumns={exportTemplateColumns} />
          </Form.Item>
          <Form.Item className="align-right">
            <Button
              className="mr-15"
              onClick={() =>
                router.push("/export-templates", "/export-templates")
              }
            >
              Cancel
            </Button>
            <AuthElement name={permissions.ExportTemplateUpdate}>
              <Button type="primary" loading={loading} htmlType="submit">
                Save Template
              </Button>
            </AuthElement>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
};

export default ExportTemplateForm;
