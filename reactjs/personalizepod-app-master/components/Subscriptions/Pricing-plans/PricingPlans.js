import { Card, Table } from "antd";
import { forEach } from "lodash";
import React from "react";

// render: (text, row, index) => {
//   if (index < 4) {
//     return <a>{text}</a>;
//   }
//   return {
//     children: <a>{text}</a>,
//     props: {
//       colSpan: 5,
//     },
//   };
// },
const PricingPlans = () => {
  const renderContent = (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    if (index === 4) {
      obj.props.colSpan = 0;
    }
    return obj;
  };

  const data = [
    {
      name: "Chen",
      price: 8,
      sales: 7,
    },
    {
      name: "Howell",
      price: 9,
      sales: 5,
    },
    {
      name: "Dunn",
      price: 2,
      sales: 7,
    },
    {
      name: "Valencia",
      price: 7,
      sales: 9,
    },
    {
      name: "Anthony",
      price: 7,
      sales: 0,
    },
  ];

  const columns = [
    {
      type: "Sku",
      dataIndex: "sku",
      key: "sku",
      width: 200,
    },
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
      width: 200,
    },
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
      width: 200,
    },
  ];

  // const rows = [];

  // Object.keys(data[0]).forEach((key) => {
  //   rows.push([key, ...data.map((item) => item[key])]);
  // });

  // const columns = rows[0].map((a, i) => {
  //   console.log(a);
  //   return {
  //     title: "",
  //     render: (xx) => {
  //       console.log(xx);
  //       return xx[i];
  //     },
  //   };
  // });
  // console.log(rows, columns);
  return (
    <div className="p-24">
      <Table
        showHeader={false}
        pagination={false}
        columns={columns}
        dataSource={data}
        bordered
      />
    </div>
  );
};

export default PricingPlans;
