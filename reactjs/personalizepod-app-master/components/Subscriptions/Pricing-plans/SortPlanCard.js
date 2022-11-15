import {
  arrayMove,
  SortableContainer,
  SortableElement,
} from "react-sortable-hoc";
import { Button, Form, Input, Space } from "antd";
import styled from "styled-components";
import { cloneDeep, orderBy } from "lodash";
import Scrollbars from "react-custom-scrollbars";
import { BsPlus } from "react-icons/bs";
import { FaTimesCircle } from "react-icons/fa";
import { useEffect } from "react";

const Container = styled.div`
  display: flex;
  margin: 12px 15px;
  height: 100%;
`;

const SortableItem = SortableElement(
  ({ planIndex, plan, dataFields, setPricingPlans }) => {
    const [form] = Form.useForm();
    useEffect(() => {
      form.setFieldsValue({
        features: plan.features,
      });
    }, [plan]);
    return (
      <li
        style={{
          listStyle: "none",
          marginRight: 10,
          padding: 5,
          position: "relative",
          zIndex: 20,
          cursor: "pointer",
        }}
        className="drag-visible"
        key={planIndex}
      >
        <div className="card-column">
          <Form
            form={form}
            onValuesChange={(valuesChange) => {
              console.log(valuesChange);
              setPricingPlans((prevState) => {
                let newPricings = [...prevState];
                console.log(newPricings[planIndex]);
                // newPricings[planIndex] = {
                //   ...newPricings[planIndex],
                //   ...valuesChange,
                // };
                // console.log(planIndex, newPricings[planIndex], newPricings);
                // return newPricings;
                return prevState;
              });
            }}
          >
            {dataFields?.map((item) =>
              item.name !== "features" ? (
                <Form.Item
                  initialValue={item.initialValue}
                  key={item.name}
                  name={item.name}
                >
                  {item.children}
                </Form.Item>
              ) : (
                <Form.List key={item.name} name="features">
                  {(fields) => (
                    <div>
                      {fields.map((field) => (
                        <Space key={field.key} className="flex">
                          {console.log(field, item, plan.features)}
                          <Form.Item {...field} name={[field.name, "prefix"]}>
                            <Input placeholder="Prefix" />
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, "value"]}>
                            {/* {el.fieldType === "text" ? (
                              <Input placeholder="Value" />
                            ) : (
                              <Button icon={<FaTimesCircle />} />
                            )} */}
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, "suffix"]}>
                            <Input placeholder="Suffix" />
                          </Form.Item>
                        </Space>
                      ))}
                    </div>
                  )}
                </Form.List>
              )
            )}
          </Form>
        </div>
      </li>
    );
  }
);
const SortableList = SortableContainer(
  ({ pricingPlans, dataFields, setPricingPlans }) => {
    return (
      <Scrollbars autoHeight autoHeightMax="100%">
        <ul
          style={{ padding: 0, display: "flex", marginBottom: 0 }}
          className="drag-visible"
        >
          {orderBy(pricingPlans, ["ordering"], ["asc"]).map((plan, index) => {
            return (
              <SortableItem
                dataFields={dataFields}
                key={index}
                index={index}
                plan={plan}
                setPricingPlans={setPricingPlans}
                planIndex={index}
              />
            );
          })}
          <Space>
            {
              <div className="card-column">
                <div className="plan-card">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setPricingPlans([
                        ...pricingPlans,
                        {
                          planName: "",
                          badge: "None",
                          pricing: 1,
                          billingCycle: "Monthly",
                          features: dataFields[4].expand,
                          buttonText: "Choose plan",
                        },
                      ])
                    }
                  >
                    <BsPlus className="add-icon" />
                    <p>Add New Plan</p>
                  </div>
                </div>
              </div>
            }
          </Space>
        </ul>
      </Scrollbars>
    );
  }
);
const SortPlanCard = ({ pricingPlans, setPricingPlans, dataFields }) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    let newMockups = cloneDeep(
      arrayMove(orderBy([], ["ordering"], ["asc"]), oldIndex, newIndex)
    );
  };
  return (
    <Container className="carousel-wrapper">
      <SortableList
        onSortEnd={onSortEnd}
        lockAxis="x"
        helperClass="row-dragging"
        useDragHandle={false}
        axis={"xy"}
        distance={1}
        setPricingPlans={setPricingPlans}
        pricingPlans={pricingPlans}
        dataFields={dataFields}
      />
    </Container>
  );
};

export default SortPlanCard;
