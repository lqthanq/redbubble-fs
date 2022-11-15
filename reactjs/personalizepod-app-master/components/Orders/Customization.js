import { useMutation } from "@apollo/client";
import { Button, Modal, notification, Table, Tabs } from "antd";
import AuthElement from "components/User/AuthElement";
import { clearTypeName } from "components/Utilities/ClearTypeName";
import { permissions } from "components/Utilities/Permissions";
import { UPDATE_ORDER } from "graphql/mutate/order/orderAction";
import { forEach, get, sum, omit, concat } from "lodash";
import React, { useState } from "react";
import { useMemo } from "react";
import CustomizationModal from "./CustomizationModal";
import Image from "../Utilities/S3Image";

const treeToArray = (arr) => {
  var res = [];
  if (Array.isArray(arr)) {
    arr.forEach((el) => {
      res.push({ ...omit(el, ["layers"]) });
      if (Array.isArray(el.layers)) {
        res.push(...treeToArray(el.layers));
      }
    });
  }
  return res;
};

const Customization = ({ order, loading, refetch }) => {
  const [customVisible, setCustomVisible] = useState(false);
  const [baseSelected, setBaseSelected] = useState();
  const [attributesSelected, setAttributesSelected] = useState({});
  const { personalizedData } = order;
  const [updateCustomize, { loading: mutationLoading }] = useMutation(
    UPDATE_ORDER
  );

  const handleOk = () => {
    updateCustomize({
      variables: {
        id: order.id,
        input: {
          customize: {
            productBaseId: baseSelected.id,
            attibutes: clearTypeName(attributesSelected),
            customize: order.customize,
          },
        },
      },
    })
      .then(() => {
        notification.success({
          message: "The order customization updated successfully!",
        });
        setCustomVisible(false);
        refetch();
      })
      .catch((err) => notification.error({ message: err.message }));
  };

  // const dataSource = useMemo(() => {
  //   let data = [];
  //   forEach(order?.customize, (item, key) =>
  //     data.push({
  //       id: key,
  //       label: item.label,
  //       type: item.type,
  //       value: item.value,
  //     })
  //   );
  //   return data;
  // }, [order]);

  // const columns = [
  //   {
  //     title: "Field",
  //     key: "field",
  //     width: 200,
  //     dataIndex: "label",
  //     render: (label) => label,
  //   },
  //   {
  //     title: "Value",
  //     key: "value",
  //     width: "auto",
  //     align: "right",
  //     dataIndex: "type",
  //     render: (type, record) => {
  //       switch (type) {
  //         case "Image":
  //           return (
  //             <Image
  //               style={{ backgroundColor: "#f5f5f5", objectFit: "contain" }}
  //               width="80px"
  //               height="80px"
  //               preview={{
  //                 src: `${process.env.CDN_URL}autoxauto/${record.value?.key}`,
  //               }}
  //               src={`${process.env.CDN_URL}100x100/${record.value?.key}`}
  //               fallback={`/images/default-img.png`}
  //             />
  //           );

  //         default:
  //           return record.value;
  //       }
  //     },
  //   },
  // ];

  // const tableWidth = sum(columns.map((c) => c.width));

  const variantIdSelected = useMemo(() => {
    const variantsActive = order?.product?.variants.find((variant) =>
      _.isEqual(variant.productBaseVariant.attributes, attributesSelected)
    );
    return variantsActive?.productBaseId === baseSelected?.id
      ? variantsActive
      : null;
  }, [attributesSelected]);

  const dataSource = ({ personalized, artwork }) => {
    var flatLayers = treeToArray(
      concat(...artwork.templates.map((tpl) => tpl.layers))
    );
    var rows = [];
    const template = get(personalized, "template", 0);
    if (artwork.templates.length > 1) {
      rows.push({
        id: "template",
        title: "Template",
        data: artwork.templates[template].title,
      });
    }
    forEach(personalized, (data, id) => {
      if (id !== "template") {
        var layer = flatLayers.find((l) => l.id === id);
        if (!layer || !get(layer, "personalized.enable", false)) return;
        rows.push({
          id: id,
          title: get(layer, "personalized.label", layer.title),
          data: data,
        });
      }
    });
    return rows;
  };
  return (
    <div>
      <Tabs>
        {personalizedData?.map((data, index) => (
          <Tabs.TabPane key={index} tab={data.printArea}>
            <Table
              style={{ marginLeft: 1 }}
              dataSource={dataSource(data)}
              columns={[
                {
                  title: "Field",
                  dataIndex: "title",
                },
                {
                  title: "Value",
                  dataIndex: "data",
                  render: (data) => {
                    if (typeof data === "object") {
                      if (data.key) {
                        return (
                          <Image
                            src={data.key}
                            style={{ backgroundColor: "hsl(0, 0%, 90%)" }}
                          />
                        );
                      }
                      return <pre>{JSON.stringify(data)}</pre>;
                    }
                    return data;
                  },
                  align: "right",
                },
              ]}
              rowKey={(row) => row.id}
              pagination={false}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
      <div style={{ textAlign: "right" }}>
        <AuthElement name={permissions.OrderUpdate}>
          <Button
            hidden={!dataSource.length}
            onClick={() => setCustomVisible(true)}
            className="mt-15"
          >
            Edit Customization
          </Button>
        </AuthElement>
      </div>
      <CustomizationModal
        visible={customVisible}
        orderId={order.id}
        onCancel={() => setCustomVisible(false)}
      />
    </div>
  );
};

export default Customization;
