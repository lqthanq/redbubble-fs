import { useMutation, useQuery } from "@apollo/client";
import { Button, Col, List, Row, Skeleton, Space } from "antd";
import { PLAN_MUTATION } from "graphql/mutate/subscriptions/plans/plan";
import { PRICING_PLANS } from "graphql/queries/subscriptionQuery/pricingPlans";
import React, { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import styled from "styled-components";
import { dataConfig } from "./DataConfig";
import Features from "./Features";
import SortPlanCard from "./SortPlanCard";

const Container = styled.div`
  background-color: white;
  margin: 0 26px;
  .site-card-wrapper {
    height: 100%;
    .ant-row {
      height: 100%;
      align-items: center;
      .title {
        border-right: 1px solid #f0f0f0;
        height: 100%;
        display: grid;
        align-items: center;
      }
      .card-column {
        border: 2px dashed #c0c0c0;
        background-color: #f4f6f8;
        width: 250px;
        padding: 5px;
        height: 100%;
        .plan-card {
          display: grid;
          height: 100%;
          align-items: center;
          justify-content: center;
          div {
            text-align: center;
          }
          .add-icon {
            font-size: 60px;
            background: white;
            border: 3px solid;
            border-radius: 50px;
          }
        }
      }
    }
  }
  .child-list {
    .ant-list-item {
      padding: 5px 0;
      border-bottom: none;
    }
  }
`;

const ConfigPlans = () => {
  const [pricingPlans, setPricingPlans] = useState([]);
  const [dataFields, setDataFields] = useState(dataConfig ?? []);
  const { data, loading } = useQuery(PRICING_PLANS);
  console.log(data, loading);
  const [createOrUpdatePlan, { loading: mutaLoading }] = useMutation(
    PLAN_MUTATION
  );
  useEffect(() => {
    setDataFields(dataConfig);
  }, []);

  useEffect(() => {
    setPricingPlans((prevState) =>
      prevState.map((item) => {
        return { ...item, features: dataFields };
      })
    );
  }, [dataFields]);

  const handleSave = () => {
    console.log(pricingPlans);
    // const input = pricingPlans.map(item => {
    //   return {

    //   }
    // })
    return;
    //
    // createOrUpdatePlan({
    //   variables: {
    //     input
    //   }
    // })
  };

  if (loading) return <Skeleton active={true} />;

  return (
    <div>
      <Container>
        <div className="site-card-wrapper">
          <Row>
            <Col span={6} className="title">
              <List
                size="large"
                bordered={false}
                dataSource={dataFields}
                renderItem={(item, i) => (
                  <List.Item className="child-list">
                    <div className="w100">
                      <div>{item.label}</div>
                      {item.expand?.length ? (
                        <Features
                          setDataFields={setDataFields}
                          itemIndex={i}
                          item={item}
                        />
                      ) : null}
                      {item.name === "features" && (
                        <Button
                          style={{ marginTop: 10, display: "block" }}
                          icon={<BsPlus className="anticon" />}
                          onClick={() => {
                            setDataFields((prevState) => {
                              let newData = [...prevState];
                              newData[i].expand = [
                                ...newData[i].expand,
                                {
                                  label: "",
                                  fieldType: "text",
                                  prefix: "",
                                  value: "",
                                  suffix: "",
                                },
                              ];
                              return newData;
                            });
                            setPricingPlans((prevState) => {
                              let newPlans = prevState.map((item) => {
                                return {
                                  ...item,
                                  features: [
                                    ...item.features,
                                    {
                                      label: "",
                                      fieldType: "text",
                                      prefix: "",
                                      value: "",
                                      suffix: "",
                                    },
                                  ],
                                };
                              });
                              console.log("newPlans", newPlans);
                              return newPlans;
                            });
                          }}
                        >
                          Add New Feature
                        </Button>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={18}>
              <SortPlanCard
                pricingPlans={pricingPlans}
                setPricingPlans={setPricingPlans}
                dataFields={dataFields}
              />
            </Col>
          </Row>
        </div>
      </Container>
      <Space
        style={{
          width: "100%",
          justifyContent: "flex-end",
          padding: 26,
        }}
      >
        <Button>Cancel</Button>
        <Button type="primary" onClick={() => handleSave()}>
          Save Changes
        </Button>
      </Space>
    </div>
  );
};

export default ConfigPlans;
