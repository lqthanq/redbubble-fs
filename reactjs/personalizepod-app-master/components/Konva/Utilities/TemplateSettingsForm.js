import { Form, Input, Space, Button, Image } from "antd";
import Upload from "components/Media/Upload";
import MediaSelector from "components/Media/MediaSelector";
import { useAppValue } from "context";
import { get } from "lodash";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ARTWORK } from "../../../actions";
import CREATEFILE from "graphql/mutate/file/create";
import { useMutation } from "@apollo/client";
import { DeleteOutlined } from "@ant-design/icons";
const Container = styled.div`
  padding: 20px 15px;
`;
const TemplateSettingsForm = () => {
  const [{ workspace }, dispatch] = useAppValue();
  const { artwork, selectedTemplate } = workspace;
  const [showMedia, setShowMedia] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [createFile] = useMutation(CREATEFILE);
  useEffect(() => {
    form.setFieldsValue({
      title: get(artwork, `templates[${selectedTemplate}].title`),
    });
  }, [selectedTemplate]);
  const handleOnChange = (_, values) => {
    dispatch({
      type: ARTWORK.SET,
      payload: {
        ...artwork,
        templates: artwork.templates.map((tpl, index) =>
          index === selectedTemplate ? { ...tpl, ...values } : tpl
        ),
      },
    });
  };
  return (
    <Container>
      <Form form={form} layout="vertical" onValuesChange={handleOnChange}>
        <Form.Item label="Label" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        {artwork.templateDisplayMode === "image" && (
          <Form.Item label="Preview">
            {get(artwork, `templates[${selectedTemplate}].thumbnail`) ? (
              <div>
                <Image
                  src={`${process.env.CDN_URL}400xauto/${get(
                    artwork,
                    `templates[${selectedTemplate}].thumbnail`
                  )}`}
                  fallback="/no-preview.jpg"
                />
                <DeleteOutlined
                  style={{
                    color: "var(--error-color)",
                    position: "absolute",
                    top: 10,
                    right: 10,
                  }}
                  onClick={() => {
                    dispatch({
                      type: ARTWORK.SET,
                      payload: {
                        ...artwork,
                        templates: artwork.templates.map((tpl, index) =>
                          index === selectedTemplate
                            ? { ...tpl, thumbnail: null }
                            : tpl
                        ),
                      },
                    });
                  }}
                />
              </div>
            ) : (
              <Upload
                fileList={fileList}
                accept=".jpg,.png"
                onChange={(files) => setFileList(files)}
                onUpload={(files) => {
                  createFile({
                    variables: {
                      input: {
                        key: files[0].key,
                        fileName: files[0].name,
                        fileMime: files[0].type,
                        fileSize: files[0].size,
                      },
                    },
                  }).then((res) => {
                    dispatch({
                      type: ARTWORK.SET,
                      payload: {
                        ...artwork,
                        templates: artwork.templates.map((tpl, index) =>
                          index === selectedTemplate
                            ? { ...tpl, thumbnail: res.data.createFile.key }
                            : tpl
                        ),
                      },
                    });
                    setFileList([]);
                  });
                }}
              >
                <p style={{ marginBottom: 20 }}>Drop files to upload or</p>
                <Space>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMedia(true);
                    }}
                  >
                    Media Library
                  </Button>
                  <Button>Select File</Button>
                </Space>
              </Upload>
            )}
            <MediaSelector
              visible={showMedia}
              defaultSource="library"
              onCancel={() => setShowMedia(false)}
              onChange={(files) => {
                dispatch({
                  type: ARTWORK.SET,
                  payload: {
                    ...artwork,
                    templates: artwork.templates.map((tpl, index) =>
                      index === selectedTemplate
                        ? { ...tpl, preview: files[0].key }
                        : tpl
                    ),
                  },
                });
                setShowMedia(false);
              }}
            />
          </Form.Item>
        )}
      </Form>
    </Container>
  );
};

export default TemplateSettingsForm;
