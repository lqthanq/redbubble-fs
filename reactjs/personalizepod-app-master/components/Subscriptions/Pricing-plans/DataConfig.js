import { Input, InputNumber, Select } from "antd";

export const dataConfig = [
  {
    name: "planName",
    label: "Plan Name",
    defaultValue: "",
    children: <Input placeholder="Enter plan name" />,
  },
  {
    name: "badge",
    label: "Badge",
    defaultValue: "None",
    children: (
      <Select>
        <Select.Option value="None">None</Select.Option>
        <Select.Option value="MostPopular">Most Popular</Select.Option>
      </Select>
    ),
  },
  {
    name: "pricing",
    label: "Pricing",
    defaultValue: 0,
    children: <InputNumber min={1} />,
  },
  {
    name: "billingCycle",
    label: "Billing Cycle",
    defaultValue: "Monthly",
    children: (
      <Select>
        <Select.Option value="Monthly">Monthly</Select.Option>
        <Select.Option value="Yearly">Yearly</Select.Option>
      </Select>
    ),
  },
  {
    name: "features",
    label: "Feature",
    expand: [
      {
        label: "Number of orders",
        key: "number_orders",
        fieldType: "text",
        prefix: "",
        value: "",
        suffix: "",
      },
      {
        label: "Auto fulfill to Fulfillment Service",
        key: "auto_fulfill_fulfillment_service",
        fieldType: "icon",
        prefix: "",
        value: "",
        suffix: "",
      },
      {
        label: "Storage",
        key: "storage",
        fieldType: "text",
        prefix: "",
        value: "",
        suffix: "",
      },
      {
        label: "Extra order fee",
        key: "extra_order_fee",
        fieldType: "text",
        prefix: "",
        value: "",
        suffix: "",
      },
      {
        label: "Extra storage fee",
        key: "extra_storage_fee",
        fieldType: "text",
        prefix: "",
        value: "",
        suffix: "",
      },
    ],
  },
  {
    name: "buttonText",
    label: "CTA Button Text",
    children: <Input placeholder="Choose plan" />,
  },
];
