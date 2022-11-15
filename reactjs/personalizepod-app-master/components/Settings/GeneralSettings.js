import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
  Select,
  Switch,
} from "antd";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { CEATE_SETTING, UPDATE_SETTING } from "graphql/mutate/settingMutation";
import { useMutation, useQuery } from "@apollo/client";
import { messageSave } from "components/Utilities/message";
import { SETTINGS } from "graphql/queries/settingQuery";

const Container = styled.div``;
const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};
const GeneralSettings = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const { data, loading } = useQuery(SETTINGS, {
    onCompleted: (data) => {
      let setting = data?.settings?.reduce(
        (init, item) => ({ ...init, data: item }),
        {}
      );
      setDataSource(
        setting?.data?.settings || [
          {
            apiKey: "",
            autoSubmit: {
              number: 0,
              time: "hour",
            },

            receivedTracking: "nothing",
            submitDelay: {
              number: 0,
              time: "hour",
            },
            trackingMore: false,
            url: "",
          },
        ]
      );
      form.setFieldsValue({
        trackingMore: !!setting?.data?.settings?.find((el) => el.trackingMore),
      });
      form.setFieldsValue({
        receivedTracking: setting?.data?.settings[0].receivedTracking,
      });
    },
  });
  const [CreateSetting, { loading: createLoading }] = useMutation(
    CEATE_SETTING
  );
  const [UpdateSetting, { loading: updateLoading }] = useMutation(
    UPDATE_SETTING
  );
  const setting =
    data &&
    data.settings.length > 0 &&
    data.settings.reduce((init, item) => ({ ...init, data: item }), {});
  // useEffect(() => {
  //   if (setting) {
  //     setDataSource(setting?.data?.settings || []);
  //   }
  // }, [setting]);
  const onFinish = (values) => {
    if (!data.settings.length) {
      CreateSetting({
        variables: {
          title: "Order trackings",
          type: "TrackingMore",
          menu: "General",
          settings: dataSource,
        },
      })
        .then(() => {
          messageSave("Setting");
        })
        .catch((err) => notification.error({ message: err.message }));
    } else {
      UpdateSetting({
        variables: {
          ...setting?.data,
          settings: dataSource,
        },
      })
        .then(() => {
          messageSave("Setting");
        })
        .catch((err) => notification.error({ message: err.message }));
    }
  };
  return (
    <Container style={{ padding: "0 24px 24px 24px" }}>
      <Card title="Order trackings">
        {dataSource.map((sett, index) => (
          <Form layout="vertical" key={index}>
            <Form.Item>
              <Switch
                style={{ padding: "10px 0px" }}
                checked={sett.trackingMore}
                onChange={(value) =>
                  setDataSource(
                    dataSource.map((item, id) =>
                      id === index
                        ? {
                            ...item,
                            trackingMore: value,
                            apiKey: value === true ? sett.apiKey : "",
                            submitDelay:
                              value === true
                                ? {
                                    number: sett.submitDelay?.number,
                                    time: sett.submitDelay?.time,
                                  }
                                : {
                                    number: 0,
                                    time: "hour",
                                  },
                          }
                        : item
                    )
                  )
                }
              />
            </Form.Item>
            {sett.trackingMore ? (
              <Form.Item noStyle>
                <Form.Item label="TrackingMore API Key">
                  <Input
                    value={sett.apiKey}
                    onChange={(e) =>
                      setDataSource(
                        dataSource.map((item, id) =>
                          id === index
                            ? { ...item, apiKey: e.target.value }
                            : item
                        )
                      )
                    }
                    placeholder="TrackingMore API Key"
                  />
                </Form.Item>
                <Divider />
                <Form.Item label="Auto submit delay">
                  <div style={{ alignItems: "center", display: "flex" }}>
                    Auto submit tracking code to store after
                    <div style={{ display: "flex", margin: "0px 5px" }}>
                      <InputNumber
                        value={sett.submitDelay?.number}
                        onChange={(e) =>
                          setDataSource(
                            dataSource.map((item, id) =>
                              id === index
                                ? {
                                    ...item,
                                    submitDelay: {
                                      number: e,
                                      time: sett.submitDelay?.time,
                                    },
                                  }
                                : item
                            )
                          )
                        }
                        min={0}
                        max={10000}
                      />
                      <Select
                        style={{ width: 200, marginLeft: 5 }}
                        value={sett.submitDelay?.time}
                        onChange={(value) =>
                          setDataSource(
                            dataSource.map((item, id) =>
                              id === index
                                ? {
                                    ...item,
                                    submitDelay: {
                                      number: sett.submitDelay?.number,
                                      time: value,
                                    },
                                  }
                                : item
                            )
                          )
                        }
                      >
                        <Select.Option value="hour">Hour(s)</Select.Option>
                        <Select.Option value="day">Day(s)</Select.Option>
                        {/* <Select.Option value="month">Month(s)</Select.Option> */}
                      </Select>
                    </div>
                    if status difference "notfound".
                  </div>
                </Form.Item>
              </Form.Item>
            ) : null}

            <Divider />
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.trackingMore !== currentValues.trackingMore
              }
            >
              {sett.trackingMore ? (
                <p>What to do when TrackingMore out of quota?</p>
              ) : (
                <p>What to do when the order received a tracking code?</p>
              )}
            </Form.Item>
            <Form.Item>
              <Radio.Group
                value={sett.receivedTracking}
                onChange={(e) =>
                  setDataSource(
                    dataSource.map((item, id) =>
                      id === index
                        ? {
                            ...item,
                            receivedTracking: e.target.value,
                            autoSubmit:
                              e.target.value === "auto"
                                ? {
                                    number: sett.autoSubmit?.number,
                                    time: sett.autoSubmit?.time,
                                  }
                                : {
                                    number: 0,
                                    time: "hour",
                                  },
                          }
                        : item
                    )
                  )
                }
              >
                <Radio style={radioStyle} value="nothing">
                  Do nothing
                </Radio>
                <Radio style={radioStyle} value="auto">
                  Auto submit tracking code to store after{" "}
                </Radio>
              </Radio.Group>
            </Form.Item>
            <div style={{ alignItems: "center", display: "flex" }}>
              <InputNumber
                min={0}
                max={100000}
                disabled={sett.receivedTracking === "nothing" ? true : false}
                value={sett.autoSubmit?.number}
                onChange={(e) =>
                  setDataSource(
                    dataSource.map((item, id) =>
                      id === index
                        ? {
                            ...item,
                            autoSubmit: {
                              number: e,
                              time: sett.autoSubmit?.time,
                            },
                          }
                        : item
                    )
                  )
                }
              />
              <Select
                style={{ width: 200, marginLeft: 5 }}
                disabled={sett.receivedTracking === "nothing" ? true : false}
                value={sett.autoSubmit?.time}
                onChange={(value) =>
                  setDataSource(
                    dataSource.map((item, id) =>
                      id === index
                        ? {
                            ...item,
                            autoSubmit: {
                              number: sett.autoSubmit?.number,
                              time: value,
                            },
                          }
                        : item
                    )
                  )
                }
              >
                <Select.Option value="hour">Hour(s)</Select.Option>
                <Select.Option value="day">Day(s)</Select.Option>
                {/* <Select.Option value="month">Month(s)</Select.Option> */}
              </Select>
            </div>
            <Form.Item
              style={{ textAlign: "right", marginTop: 20, marginBottom: 0 }}
            >
              <Button
                onClick={() => onFinish()}
                type="primary"
                loading={createLoading || updateLoading}
              >
                Save changes
              </Button>
            </Form.Item>
          </Form>
        ))}
      </Card>
    </Container>
  );
};

export default GeneralSettings;
