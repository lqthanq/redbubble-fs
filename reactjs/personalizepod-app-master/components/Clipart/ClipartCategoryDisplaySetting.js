import {
  Input,
  Radio,
  Form,
  Button,
  Drawer,
  Skeleton,
  message,
  Checkbox,
  Alert,
} from "antd";
import ColorField from "components/Konva/Utilities/ColorField";
import ImageField from "components/Konva/Utilities/ImageField";
import styled from "styled-components";
import clipartCategoryByID from "graphql/queries/clipartCategory";
import { useMutation } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { omit } from "lodash";

const UPDATE_SETTINGS = gql`
  mutation(
    $id: String!
    $displayMode: DisplayMode
    $value: String
    $applyNested: Boolean
  ) {
    updateClipartCategoryDisplaySettings(
      id: $id
      displayMode: $displayMode
      value: $value
      applyNested: $applyNested
    ) {
      id
      key: id
      parentID
      title
      numberOfCliparts
    }
  }
`;
const Container = styled.div`
  .ant-form-item {
    margin-bottom: 5px;
  }
`;
const ClipartCategoryDisplaySetting = () => {
  const [form] = Form.useForm();
  const [updateSettings, { loading }] = useMutation(UPDATE_SETTINGS);
  const router = useRouter();
  const { settings, categoryID } = router.query;

  const handleSubmit = (values) => {
    updateSettings({ variables: { id: categoryID, ...values } })
      .then((res) => message.success("Settings updated"))
      .catch((err) => {
        message.error(err.message);
      });
  };
  return settings ? (
    <Drawer
      title="Category Settings"
      width={400}
      visible={categoryID ? true : false}
      mask={false}
      maskClosable={false}
      onClose={() => {
        router.query = omit(router.query, ["settings"]);
        router.push(router);
      }}
      footer={
        <div
          style={{
            textAlign: "right",
          }}
        >
          <Button
            onClick={() => {
              router.query = omit(router.query, ["settings"]);
              router.push(router);
            }}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button
            loading={loading}
            onClick={() => form.submit()}
            type="primary"
          >
            Update
          </Button>
        </div>
      }
    >
      <Container>
        {categoryID && (
          <Query
            query={clipartCategoryByID}
            skip={!categoryID}
            variables={{ id: categoryID }}
            fetchPolicy="network-only"
            onCompleted={(data) => {
              form.setFieldsValue({
                ...data.clipartCategory?.displaySettings,
                applyNested: false,
              });
            }}
          >
            {({ data, loading, error }) => {
              if (loading) {
                return <Skeleton />;
              }
              if (data) {
                const { displaySettings } = data.clipartCategory;
                const isFolder = data.clipartCategory.numberOfCliparts === 0;
                return (
                  <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    {displaySettings.parentDisplayMode && (
                      <Form.Item
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.label !== curValues.label
                        }
                      >
                        {() => {
                          switch (displaySettings.parentDisplayMode) {
                            case "ImageSwitcher":
                              return (
                                <Form.Item label="Image" name="value">
                                  <ImageField size={100} />
                                </Form.Item>
                              );
                            case "ColorSwitcher":
                              return (
                                <Form.Item label="Color" name="value">
                                  <ColorField
                                    type="sharp"
                                    view="sketchPicker"
                                    size={50}
                                  />
                                </Form.Item>
                              );
                            default:
                              return (
                                <Form.Item
                                  label="Value"
                                  name="value"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Display value is required",
                                    },
                                  ]}
                                >
                                  <Input
                                    autoFocus={true}
                                    width="100%"
                                    size="small"
                                    placeholder="Label"
                                  />
                                </Form.Item>
                              );
                          }
                        }}
                      </Form.Item>
                    )}
                    <Form.Item
                      label="Display mode"
                      name="displayMode"
                      rules={[
                        {
                          required: data?.clipartCategory?.hasChild,
                          message: "Display mode is required",
                        },
                      ]}
                    >
                      <Radio.Group disabled={!isFolder}>
                        <Radio value="Dropdown" style={{ display: "block" }}>
                          Dropdown
                        </Radio>
                        <Radio value="Button" style={{ display: "block" }}>
                          Button
                        </Radio>
                        <Radio
                          value="ImageSwitcher"
                          style={{ display: "block" }}
                        >
                          Image switcher
                        </Radio>
                        <Radio
                          value="ColorSwitcher"
                          style={{ display: "block" }}
                        >
                          Color switcher
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      label=""
                      name="applyNested"
                      valuePropName="checked"
                    >
                      <Checkbox disabled={!isFolder}>
                        Apply this settings for all subcategories also
                      </Checkbox>
                    </Form.Item>
                  </Form>
                );
              }
              if (error) {
                return <Alert message={error.message} type="error" />;
              }
            }}
          </Query>
        )}
      </Container>
    </Drawer>
  ) : null;
};

export default ClipartCategoryDisplaySetting;
