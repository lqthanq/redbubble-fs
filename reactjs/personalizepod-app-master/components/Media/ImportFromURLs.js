import { forwardRef, useImperativeHandle } from "react";
import { Form, Input, notification } from "antd";
import styled from "styled-components";
import downloadFromURL from "graphql/mutate/downloadFromURL";
import { useMutation } from "@apollo/client";

const Container = styled.div`
  margin: 16px 16px 16px 0;
`;

const ImportFromURLs = forwardRef(({ files, onUpload, limit }, ref) => {
  const [form] = Form.useForm();
  const [downloadFromURLMutation] = useMutation(downloadFromURL);

  useImperativeHandle(ref, () => ({
    handleImportURL() {
      form.submit();
    },
    handleResetForm() {
      form.resetFields();
    },
  }));

  const handleGetFile = ({ url }) => {
    downloadFromURLMutation({
      variables: { url },
    })
      .then((res) => {
        console.log(res.data.downloadFromURL);
        if (
          limit &&
          res.data.downloadFromURL.fileSize / (1024 * 1024) > limit
        ) {
          Modal.confirm({
            title: `File size must smaller than ${limit}MB!`,
          });
        } else {
          onUpload([res.data.downloadFromURL]);
        }
        form.resetFields();
      })
      .catch((err) => notification.error(err.message));
  };

  const validateURLs = (url) => {
    var reurl = /(https?:\/\/.*\.(?:png|jpg|svg|jpeg))/i;
    return reurl.test(url);
  };

  return (
    <Container>
      <Form form={form} onFinish={(values) => handleGetFile(values)}>
        <Form.Item
          style={{ marginBottom: 0 }}
          name="url"
          required
          rules={[
            {
              validator: (_, value) =>
                validateURLs(value)
                  ? Promise.resolve()
                  : Promise.reject("Invalid image URL!"),
            },
          ]}
        >
          <Input.TextArea
            placeholder="https://"
            style={{ height: 300, resize: "none" }}
            rows="5"
          />
        </Form.Item>
      </Form>
    </Container>
  );
});

export default ImportFromURLs;
