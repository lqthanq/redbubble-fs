import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Progress,
  Row,
  Skeleton,
} from "antd";
import ImagePreview from "components/Media/ImagePreview";
import CustomUploadView from "components/Utilities/CustomUploadView";
import createFile from "graphql/mutate/file/create";
import {
  CREATE_FULFILLMENT,
  UPDATE_FULFILLMENT,
} from "graphql/mutate/productBase/fulfillmentMutations";
import { FULFILLMENT_BY_ID } from "graphql/queries/productBase/fulfillments";
import { remove } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { AiTwotoneDelete } from "react-icons/ai";
import styled from "styled-components";
import { get } from "lodash";
import { messageSave } from "components/Utilities/message";
import { useAppValue } from "context";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const Container = styled.div`
  .file-upload-preview {
    padding-top: 24px;
    .ant-col {
      position: relative;
    }
    img {
      max-width: 100%;
    }
    .delete {
      width: 25px;
      fill: #de3618;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  }
`;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const FulfillmentForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const [{ sellerId }] = useAppValue();
  const [createFileMutation] = useMutation(createFile);
  const [createFulfillmentService, { loading: loadingCreate }] = useMutation(
    CREATE_FULFILLMENT
  );
  const [updateFulfillmentService, { loading: loadingUpdate }] = useMutation(
    UPDATE_FULFILLMENT
  );
  const { data, loading, error } = useQuery(FULFILLMENT_BY_ID, {
    variables: {
      id,
    },
    skip: !id,
    onCompleted(res) {
      setFileUploads(
        res?.FulfillmentById.image ? [res.FulfillmentById.image] : []
      );
    },
  });
  const fulfillmentByID = data?.FulfillmentById;
  const [fileUploads, setFileUploads] = useState([]);

  if (loading) return <Skeleton />;
  if (error) return `${error.message}`;

  const backToList = () => {
    router.push("/product-bases/fulfillments", "/product-bases/fulfillments");
  };

  const onSaveFulfillment = (values, imageId) => {
    if (!id) {
      createFulfillmentService({
        variables: {
          input: { ...values, imageId, sellerId },
        },
      })
        .then(() => {
          messageSave("Fulfillment");
          backToList();
        })
        .catch((err) => {
          notification.error({ message: err.message });
        });
    } else {
      updateFulfillmentService({
        variables: {
          input: { ...values, imageId, id },
        },
      })
        .then(() => {
          messageSave("Fulfillment");
          backToList();
        })
        .catch((err) => {
          notification.error({ message: err.message });
        });
    }
  };

  const onFinish = (values) => {
    if (fileUploads.length === 0 || fileUploads[0]?.id) {
      onSaveFulfillment(values, fileUploads[0]?.id ?? null);
    } else {
      createFileMutation({
        variables: {
          input: {
            key: fileUploads[0].key,
            fileName: fileUploads[0].name,
            fileMime: fileUploads[0].type,
            fileSize: fileUploads[0].size,
          },
        },
      })
        .then((res) => onSaveFulfillment(values, res.data.createFile.id))
        .catch((err) =>
          notification.error({ message: get(err, "[0].message") })
        );
    }
  };

  return (
    <Container style={{ margin: "0px 24px" }}>
      <h3 style={{ marginLeft: 32 }}>
        {id ? "Edit Custom Fulfillment" : "New Custom Fulfillment"}
      </h3>
      <Form {...layout} onFinish={(values) => onFinish(values)}>
        <Row gutter={[24, 24]}>
          <Col span={24} sm={24} md={12} lg={14} xl={16}>
            <Card>
              <Form.Item
                label="Title"
                name="title"
                initialValue={fulfillmentByID?.title ?? ""}
                rules={[
                  {
                    required: true,
                    message: "Please input custom fulfillment title!",
                  },
                ]}
              >
                <Input placeholder="Custom fulfillment title" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                initialValue={fulfillmentByID?.description ?? ""}
              >
                <Input.TextArea
                  rows="4"
                  placeholder="Custom fulfillment description"
                />
              </Form.Item>
            </Card>
          </Col>
          <Col span={24} sm={24} md={12} lg={10} xl={8}>
            <Card title="Image">
              <CustomUploadView
                multiple={false}
                onlyLibrary={true}
                fileUploads={fileUploads}
                setFileUploads={setFileUploads}
                showUploadList={false}
              />
              <Row className="file-upload-preview" gutter={[10, 10]}>
                {fileUploads?.map((f) => (
                  <Col key={f.uid || f.id} span={24}>
                    <ImagePreview file={f.originFileObj ?? f} />
                    {f.percent && (
                      <Progress percent={Math.round(f.percent)} size="small" />
                    )}
                    <AiTwotoneDelete
                      size={30}
                      className="delete"
                      onClick={(e) => {
                        e.preventDefault();
                        remove(fileUploads, (file) =>
                          f.uid ? file.uid === f.uid : file.id === f.id
                        );
                        setFileUploads([...fileUploads]);
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
        <Divider type="horizontal" />
        <div style={{ textAlign: "right" }}>
          <Button className="mr-15" onClick={() => backToList()}>
            Cancel
          </Button>
          <AuthElement name={permissions.FulfillmentServiceUpdate}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loadingCreate || loadingUpdate}
            >
              {id ? "Update" : "Create"} fulfillment
            </Button>
          </AuthElement>
        </div>
      </Form>
    </Container>
  );
};

export default FulfillmentForm;
