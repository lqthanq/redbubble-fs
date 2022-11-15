import EmailEditor from "react-email-editor";
import { useRef, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import emailTemplate from "../../graphql/queries/emailTemplate";
import {
  Input,
  Form,
  Button,
  Skeleton,
  notification,
  PageHeader,
  Card,
} from "antd";
import updateEmailTemplate from "../../graphql/mutate/updateEmailTemplate";
import { useRouter } from "next/router";
import MediaSelector from "../Media/MediaSelector";
import { Tokens } from "./tokens";
import { Tools } from "./tools";
import Meta from "antd/lib/card/Meta";
import Scrollbars from "components/Utilities/Scrollbars";
import { messageSave } from "components/Utilities/message";
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};
const FromEmailTemplate = (props) => {
  const emailEditorRef = useRef();
  const router = useRouter();
  const { id } = props;
  const { data, loading } = useQuery(emailTemplate, {
    variables: {
      id: id,
    },
    fetchPolicy: "no-cache",
  });
  const [editTitle, setEditTitle] = useState(false);
  const [show, setShow] = useState(false);
  const [dataEdit, setDataEdit] = useState(null);
  const [files, setFiles] = useState([]);
  useEffect(() => {
    if (files.length) {
      window.done({ url: process.env.CDN_URL + "autoxauto/" + files[0].key });
    }
  }, [files]);
  const [updateTemplate] = useMutation(updateEmailTemplate);
  const onFinish = (values) => {
    emailEditorRef.current.editor.exportHtml((data2) => {
      const { design, html } = data2;
      updateTemplate({
        variables: {
          template: data.EmailTemplate.template,
          subject: dataEdit ?? data.EmailTemplate.subject,
          id: id,
          html: html,
          data: data2,
        },
      }).then((res) => {
        setDataEdit(null);
        setEditTitle(false);
        messageSave("Template");
        router.push("/email-templates", "/email-templates");
      });
    });
  };
  const onLoad = () => {
    emailEditorRef.current.editor.registerCallback(
      "selectImage",
      (data, done) => {
        setShow(true);
        window.done = done;
      }
    );
    // you can load your template here;
    emailEditorRef.current.editor.loadDesign(data?.EmailTemplate?.data?.design);
  };
  if (loading) return <Skeleton />;
  return (
    <div>
      <Form {...layout} onFinish={onFinish}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <PageHeader
            title="Email Templates Update"
            onBack={() => router.back()}
          />

          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "24px" }}
          >
            Save
          </Button>
        </div>
        <Scrollbars style={{ width: "auto", height: "calc(100vh - 131px)" }}>
          <Card>
            <Meta
              style={{ marginBottom: 20, lineHeight: "60px" }}
              title={
                <div>
                  Subject:
                  {editTitle ? (
                    <Input
                      style={{ width: "auto" }}
                      className="ml-15"
                      value={dataEdit ?? data?.EmailTemplate?.subject}
                      onBlur={() => setEditTitle(false)}
                      onChange={(e) => setDataEdit(e.target.value)}
                    />
                  ) : (
                    <span onClick={() => setEditTitle(true)} className="ml-15">
                      {dataEdit ?? data?.EmailTemplate?.subject}
                    </span>
                  )}
                </div>
              }
            />
            <EmailEditor
              ref={emailEditorRef}
              onLoad={() =>
                setTimeout(() => {
                  onLoad();
                }, 500)
              }
              minHeight="calc(100vh - 260px)"
              options={{
                mergeTags: Tokens,
                tools: Tools,
              }}
            />
          </Card>
        </Scrollbars>
      </Form>
      <MediaSelector
        visible={show}
        onCancel={() => setShow(false)}
        onChange={(files) => setFiles(files)}
      />
    </div>
  );
};
export default FromEmailTemplate;
