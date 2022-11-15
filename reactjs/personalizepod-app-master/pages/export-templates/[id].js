import ExportTemplateForm from "components/Orders/ExportTemplateForm";
import React from "react";
import { EXPORT_TEMPLATES_BY_ID } from "graphql/queries/exportTemplates/exportQuery";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { notification, Skeleton } from "antd";
import { UPDATE_EXPORT_TEMPLATE } from "graphql/mutate/exportTemplates/exportMutation";
import { messageSave } from "components/Utilities/message";
const EditTemplate = () => {
  const router = useRouter();
  const { data, loading: dataLoading } = useQuery(EXPORT_TEMPLATES_BY_ID, {
    variables: { id: router?.query?.id },
    fetchPolicy: "no-cache",
  });
  const exportById = data?.exportTemplateById;
  const [UpdateExportTemplate, { loading }] = useMutation(
    UPDATE_EXPORT_TEMPLATE
  );
  const onFinish = (values) => {
    if (values.columns) {
      values.columns.map((el) => {
        delete el.__typename;
      });
    }
    UpdateExportTemplate({
      variables: {
        input: { ...values, id: router?.query?.id },
      },
    })
      .then(() => {
        messageSave("Export Template");
        router.push("/export-templates", "/export-templates");
      })
      .catch((err) => notification.error({ message: err.message }));
  };
  if (dataLoading) return <Skeleton />;
  return (
    <div>
      <ExportTemplateForm
        loading={loading}
        exportById={exportById}
        onSubmit={(values) => onFinish(values)}
      />
    </div>
  );
};

export default EditTemplate;
