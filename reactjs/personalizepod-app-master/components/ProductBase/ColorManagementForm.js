import { Button, Form, Input, notification, Popover, Select } from "antd";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { ADD_COLOR } from "graphql/mutate/productBase/colorManagementMutation";
import { useMutation, useQuery } from "@apollo/client";
import MediaSelector from "components/Media/MediaSelector";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import { messageSave } from "components/Utilities/message";
import { AiFillDelete } from "react-icons/ai";
import { GlobalStyle } from "components/Konva/Utilities/ColorField";

const ColorManagementForm = ({
  refetch,
  setViewForm,
  fulfillmentSelected,
  productBase,
}) => {
  const [form] = Form.useForm();
  const [color, setColor] = useState();
  const [upload, setUpload] = useState(false);
  const [images, setImages] = useState();
  const { data: dataFulfillment } = useQuery(FULFILLMENTS);
  const [addColor, { loading }] = useMutation(ADD_COLOR);

  const onFinish = (values) => {
    addColor({
      variables: {
        input: {
          ...values,
          code: values.code?.includes("#")
            ? values.code.substring(1)
            : values.code,
          pattern: images ? images.id : null,
          active: true,
        },
      },
    })
      .then(() => {
        messageSave("Color");
        refetch();
        form.resetFields();
        setViewForm(false);
        setImages();
        setColor();
      })
      .catch((err) => {
        notification.error({
          message: err.message,
        });
      });
  };

  return [
    <div>
      <Form id="formColor" layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          name="fulfillment"
          label="Select fulfillment"
          rules={[{ required: true, message: "Please select fulfillment." }]}
          initialValue={
            fulfillmentSelected?.length > 0
              ? fulfillmentSelected
              : productBase && productBase?.fulfillment?.id
              ? productBase?.fulfillment?.id
              : ""
          }
        >
          <Select disabled={fulfillmentSelected}>
            {dataFulfillment?.fulfillments
              ?.filter((el) => el.type === "Custom")
              .map((fulfill) => (
                <Select.Option key={fulfill.id} value={fulfill.id}>
                  {fulfill.title}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="name"
          label="Color name"
          rules={[{ required: true, message: "Please input name." }]}
        >
          <Input placeholder="Enter color name" />
        </Form.Item>
        <Form.Item
          label="Color setting"
          name="code"
          style={{ marginBottom: 0 }}
          rules={[{ required: true, message: "Please select color." }]}
        >
          <div className="flex" style={{ alignItems: "flex-end" }}>
            <Popover
              content={
                <SketchPicker
                  width={300}
                  color={color ?? ""}
                  onChange={({ hex }) => {
                    setColor(hex);
                    form.setFieldsValue({
                      code: hex,
                    });
                  }}
                />
              }
            >
              <Button
                style={{
                  backgroundColor: color ? color : "gray",
                  width: 100,
                  height: 100,
                }}
              >
                {" "}
              </Button>
              <GlobalStyle />
            </Popover>
            <div
              onClick={() => setUpload(true)}
              style={{
                width: 100,
                height: 100,
                border: "1px dashed #999",
                marginLeft: 20,
                position: "relative",
              }}
            >
              {images ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                      objectFit: "contain",
                      backgroundColor: "darkgray",
                    }}
                    src={`${process.env.CDN_URL}/500x500/${images.key}`}
                  />
                  <Button
                    type="link"
                    style={{ position: "absolute", top: 0, right: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImages();
                    }}
                    icon={
                      <AiFillDelete className="anticon delete-button-color" />
                    }
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    style={{ width: "100%", height: "100%", cursor: "pointer" }}
                    src={"/images/upload-icon.png"}
                  />
                </div>
              )}
            </div>
          </div>
        </Form.Item>
      </Form>
      <MediaSelector
        visible={upload}
        showUploadList={true}
        onCancel={() => setUpload(false)}
        onChange={(files) => {
          setImages(files[0]);
        }}
      />
    </div>,
    { form, loading },
  ];
};

export default ColorManagementForm;
