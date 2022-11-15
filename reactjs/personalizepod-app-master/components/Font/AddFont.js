import Upload from "../Media/Upload";
import { Form, Input, Button, message } from "antd";
import { useMutation } from "@apollo/client";
import createFileMutate from "../../graphql/mutate/file/create";
import createFontMutate from "../../graphql/mutate/createFont";
import { get } from "lodash";

const AddFont = () => {
  const { form } = Form.useForm();
  const [createFile] = useMutation(createFileMutate);
  const [createFont] = useMutation(createFontMutate);
  const handleSubmit = ({ family, ttf }) => {
    createFile({
      variables: {
        key: get(ttf, "[0].key"),
        fileName: get(ttf, "[0].name"),
        fileSize: get(ttf, "[0].size"),
        fileMime: get(ttf, "[0].type") || "font/ttf",
      },
    })
      .then((res) => {
        createFont({
          variables: {
            family: family,
            ttf: res.data.createFile.id,
          },
        }).then(() => {
          message.success("Font created");
        });
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="family" label="Family">
        <Input />
      </Form.Item>
      <Form.Item name="ttf" label="TTF font file">
        <Upload accept=".ttf">Click or drag file here to upload</Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};
export default AddFont;
