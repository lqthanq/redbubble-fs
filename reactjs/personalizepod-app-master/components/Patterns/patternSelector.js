import { Button, Col, message, Popover, Row } from "antd";
import Scrollbars from "react-custom-scrollbars";
import styled from "styled-components";
import Upload from "../Media/Upload";
import createPatternMutate from "../../graphql/mutate/createPattern";
import patternsQuery from "../../graphql/queries/patterns";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const Container = styled.div``;
const PatternSelector = ({ onChange = () => {} }) => {
  const [files, setFiles] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createPatternMutation] = useMutation(createPatternMutate);
  const { data, refetch } = useQuery(patternsQuery);
  useEffect(() => {
    if (data) {
      setPatterns(data.patterns.hits);
    }
  }, [data]);
  useEffect(() => {
    if (files.length > 0) {
      setLoading(true);
      Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            createPatternMutation({
              variables: {
                file: {
                  key: file.key,
                  fileName: file.name,
                  fileSize: file.size,
                  fileMime: file.type,
                },
              },
            })
              .then((res) => {
                resolve(res.data.createPattern);
              })
              .catch((err) => {
                reject(err);
              });
          });
        })
      )
        .then((res) => {
          refetch();
          setLoading(false);
          setFiles([]);
        })
        .catch((err) => {
          message.error(err.message);
          setLoading(false);
          setFiles([]);
        });
    }
  }, [files]);
  return (
    <Popover
      placement="bottom"
      content={
        <Container>
          <Scrollbars style={{ width: 320, height: 330 }}>
            <div style={{ overflow: "hidden" }}>
              <Row type="flex" gutter={[10, 10]}>
                <Col span={8}>
                  <img
                    src="/patterns/none.jpg"
                    alt="nopattern"
                    style={{ width: 100, height: "auto", cursor: "pointer" }}
                    onClick={() => onChange(null)}
                  />
                </Col>
                {patterns.map((pattern) => (
                  <Col span={8} key={pattern.id}>
                    <img
                      src={`${process.env.CDN_URL}100xauto/${pattern.file.key}`}
                      alt={pattern.id}
                      style={{ width: 100, height: "auto", cursor: "pointer" }}
                      onClick={() => onChange(pattern)}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </Scrollbars>
          <Upload
            dragger={false}
            style={{ width: "100%" }}
            fileList={files}
            onUpload={(files) => setFiles(files)}
            accept=".jpg,.png"
            showUploadList={false}
            disabled={loading}
          >
            <Button block loading={loading}>
              Upload
            </Button>
          </Upload>
        </Container>
      }
    >
      <Button type="link">Pattern</Button>
    </Popover>
  );
};

export default PatternSelector;
