import React, { useRef, useState } from "react";
import styled from "styled-components";
import EmailEditor from "react-email-editor";
import { Button, Skeleton, PageHeader, Alert, Card } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import emailTemplate from "../../graphql/queries/emailTemplate";
import updateEmailTemplateMutation from "../../graphql/mutate/updateEmailTemplate";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`;

const Bar = styled.div`
  flex: 1;
  background-color: #61dafb;
  color: #000;
  padding: 10px;
  display: flex;
  max-height: 50px;
  div {
    flex: 1;
    font-size: 16px;
    text-align: left;
  }
  button {
    flex: 1;
    margin-left: 10px;
    max-width: 150px;
  }
`;

const EmailTemplate = ({ id }) => {
  const [template, setTemplate] = useState(null);
  const emailEditorRef = useRef(null);
  const [updateEmailTemplate] = useMutation(updateEmailTemplateMutation);
  const saveDesign = async () => {
    await emailEditorRef.current.editor.exportHtml(({ html }) => {
      emailEditorRef.current.editor.saveDesign((design) => {
        updateEmailTemplate({
          variables: {
            id: id,
            title: "New title",
            data: design,
            html: html,
          },
        });
      });
    });
  };

  return (
    <Container>
      <Bar>
        <PageHeader
          title={template ? template.title : "Loading..."}
          onBack={() => {}}
        />
        <Button onClick={saveDesign} icon={<SaveOutlined />}>
          Save Design
        </Button>
      </Bar>
      <Query
        query={emailTemplate}
        variables={{ id: id }}
        onCompleted={(data) => setTemplate(data.EmailTemplate)}
      >
        {({ data, loading, error }) => {
          if (loading) {
            return <Skeleton />;
          }
          if (data) {
            return (
              <Card>
                <EmailEditor
                  ref={emailEditorRef}
                  onLoad={() => {
                    setTimeout(() => {
                      if (emailEditorRef?.current) {
                        emailEditorRef.current.editor.loadDesign(
                          data.EmailTemplate.data
                        );
                      }
                    }, 200);
                  }}
                />
                <Card.Meta>{console.log(emailEditorRef)}</Card.Meta>
              </Card>
            );
          }
          if (error) {
            return <Alert message={error.message} />;
          }
        }}
      </Query>
    </Container>
  );
};

export default EmailTemplate;
