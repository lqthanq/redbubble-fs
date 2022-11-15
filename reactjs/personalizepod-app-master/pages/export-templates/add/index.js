import React from "react";
import { CREATE_EXPORT_TEMPLATE } from "graphql/mutate/exportTemplates/exportMutation";
import ExportTemplateForm from "components/Orders/ExportTemplateForm";
import { messageSave } from "components/Utilities/message";
import { useMutation } from "@apollo/client";
import { notification, Skeleton } from "antd";
import { useRouter } from "next/router";
const CreateExportTemplate = () => {
  const router = useRouter();
  const [createExportTemplate, { loading }] = useMutation(
    CREATE_EXPORT_TEMPLATE
  );
  const onFinish = (values) => {
    createExportTemplate({
      variables: {
        input: { ...values },
      },
    })
      .then(() => {
        messageSave("Export Template");
        router.push("/export-templates", "/export-templates");
      })
      .catch((err) => notification.error({ message: err.message }));
  };
  if (loading) {
    <Skeleton />;
  }
  return (
    <div>
      <ExportTemplateForm
        loading={loading}
        onSubmit={(values) => onFinish(values)}
      />
    </div>
  );
};

export default CreateExportTemplate;
