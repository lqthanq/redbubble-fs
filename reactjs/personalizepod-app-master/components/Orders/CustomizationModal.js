import { gql, useMutation, useQuery } from "@apollo/client";
import { Col, message, Modal, Row, Skeleton, Tabs } from "antd";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import ArtworkFormPreview from "../Artworks/ArtworkFormPreview";
import ArtworkPreview from "../Artworks/ArtworkPreview";
import styled from "styled-components";
import Scrollbars from "react-custom-scrollbars";

const ORDER_QUERY = gql`
  query($id: String!) {
    order(id: $id) {
      id
      variant: productVariant {
        id
      }
      product {
        id
        title
        variants {
          id
          salePrice
          regularPrice
          productBase: productBaseVariant {
            attributes {
              name
              value
            }
          }
        }
      }
      personalizedData {
        printArea
        personalized
        artwork {
          id
          templates {
            layers
          }
        }
      }
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation($id: String!, $customize: Map) {
    updateOrderCustomize(id: $id, customize: $customize) {
      id
      personalizedData {
        printArea
        personalized
        artwork {
          id
          templates {
            layers
          }
        }
      }
    }
  }
`;

const ArtworkContainer = styled.div`
  .konvajs-content {
    width: 100% !important;

    canvas {
      width: 100% !important;
      height: auto !important;
    }
  }
`;

const CustomizationModal = ({
  orderId,
  visible = false,
  onCancel = () => {},
}) => {
  const [order, setOrder] = useState();
  const [product, setProduct] = useState();
  const [variantId, setVariantId] = useState();
  const [personalizedData, setPersonalizedData] = useState();
  const [orderPersonalized, setOrderPersonalized] = useState();
  const [artworkId, setArtworkId] = useState();
  const { data, loading, error } = useQuery(ORDER_QUERY, {
    variables: { id: orderId },
  });

  const [
    updateOrder,
    { data: updateData, loading: updateLoading },
  ] = useMutation(UPDATE_ORDER);

  useEffect(() => {
    if (data) {
      setOrder(data.order);
      setProduct(data.order.product);
      setVariantId(data.order.variant.id);
      setPersonalizedData(data.order.personalizedData);
      setArtworkId(get(data.order, "personalizedData[0].artwork.id"));
    }
  }, [data]);

  useEffect(() => {
    if (personalizedData) {
      var orderPersonalized = {};
      personalizedData.forEach((data) => {
        orderPersonalized[data.artwork.id] = data.personalized;
      });
      setOrderPersonalized(orderPersonalized);
    }
  }, [personalizedData]);

  const handleSubmit = () => {
    updateOrder({
      variables: {
        id: orderId,
        customize: orderPersonalized,
      },
    }).then((data) => {
      message.success("Order updated");
    });
    console.log(orderPersonalized);
  };

  return (
    <Modal
      visible={visible}
      width={1200}
      title="Edit Order Customizations"
      onCancel={onCancel}
      okText="Save changes"
      okButtonProps={{ loading: updateLoading }}
      onOk={handleSubmit}
    >
      {order ? (
        <Row gutter={[20, 20]}>
          <Col span={12}>
            {artworkId && (
              <ArtworkContainer>
                <ArtworkPreview
                  artworkId={artworkId}
                  personalized={get(orderPersonalized, artworkId)}
                />
              </ArtworkContainer>
            )}
          </Col>
          <Col span={12}>
            <div>
              <h3>{product?.title}</h3>
            </div>
            {personalizedData && (
              <Tabs activeKey={artworkId} onChange={(key) => setArtworkId(key)}>
                {personalizedData.map((personalized, index) => {
                  return (
                    <Tabs.TabPane
                      key={personalized.artwork.id}
                      tab={personalized.printArea}
                      style={{ paddingLeft: 1 }}
                    >
                      <Scrollbars autoHeight autoHeightMax={600}>
                        <ArtworkFormPreview
                          artworkId={personalized.artwork?.id}
                          personalized={get(
                            orderPersonalized,
                            personalized.artwork?.id
                          )}
                          onPersonalized={(data) =>
                            setOrderPersonalized({
                              ...orderPersonalized,
                              [personalized.artwork?.id]: data,
                            })
                          }
                        />
                      </Scrollbars>
                    </Tabs.TabPane>
                  );
                })}
              </Tabs>
            )}
          </Col>
        </Row>
      ) : (
        <Skeleton loading={true} />
      )}
    </Modal>
  );
};

export default CustomizationModal;
// import { Avatar, Col, Image, Row } from "antd";
// import CheckableTag from "antd/lib/tag/CheckableTag";
// import { ColorsComponent } from "components/Utilities/ColorComponent";
// import {
//   cloneDeep,
//   concat,
//   differenceWith,
//   isEqual,
//   map,
//   omit,
//   uniqWith,
// } from "lodash";
// import React, { useEffect } from "react";
// import { useMemo } from "react";
// import ArtworkFormPreview from "../Artworks/ArtworkFormPreview";

// const CustomizationModal = ({
//   order,
//   baseSelected,
//   setBaseSelected,
//   attributesSelected,
//   setAttributesSelected,
//   variantIdSelected,
// }) => {
//   useEffect(() => {
//     if (order) {
//       const neworder = cloneDeep(order);
//       let newBaseSelected = neworder.product?.productBases.find(
//         (base) => base.id === neworder.productVariant.productBase.id
//       );
//       setBaseSelected(newBaseSelected);
//       setAttributesSelected(order.productVariant.productBaseVariant.attributes);
//     }
//   }, [order]);

//   const newVariantAttributes = useMemo(() => {
//     const variantsActive = order?.product?.variants.filter(
//       (variant) => variant.active && variant.productBaseId === baseSelected?.id
//     );
//     if (variantsActive?.length) {
//       let allAttributesFromVariant = concat(
//         ...variantsActive.map((item) => item.productBaseVariant?.attributes)
//       );
//       // unique attributes
//       allAttributesFromVariant = uniqWith(allAttributesFromVariant, isEqual);
//       const variantAttributes = allAttributesFromVariant.reduce((init, el) => {
//         const key = el.slug;
//         if (!init[key]) {
//           init[key] = [];
//         }
//         // get variants with the same attribute
//         const variantContainAttributes = variantsActive.filter(
//           (varr) =>
//             differenceWith([el], varr.productBaseVariant?.attributes, isEqual)
//               ?.length === 0
//         );
//         // filter all attribute that variant was contain
//         const attributeChecked = variantContainAttributes.filter((v) =>
//           isEqual(v.productBaseVariant.attributes, attributesSelected)
//         );
//         init[key].push({
//           ...el,
//           checked: !!attributeChecked.length,
//         });
//         return init;
//       }, {});
//       return variantAttributes;
//     }
//     return {};
//   }, [baseSelected, attributesSelected]);

//   const handleChangeAttribute = (attribute) => {
//     let newAttributes = cloneDeep(attributesSelected);
//     newAttributes = newAttributes.map((attri) => {
//       if (attri.slug === attribute.slug) {
//         return { ...attri, value: attribute.value };
//       }
//       return {
//         ...attri,
//       };
//     });
//     const hasVariant = order?.product?.variants.find((variant) =>
//       isEqual(variant.productBaseVariant.attributes, attributesSelected)
//     );
//     if (hasVariant && hasVariant?.productBaseId === baseSelected?.id) {
//       setAttributesSelected(newAttributes);
//     } else {
//       const temporaryVariant = order?.product?.variants.find(
//         (variant) =>
//           variant.productBaseVariant.attributes.findIndex((attri) =>
//             isEqual(attri, omit(attribute, "checked"))
//           ) >= 0
//       );
//       setAttributesSelected(temporaryVariant.productBaseVariant.attributes);
//     }
//   };

//   return (
//     <Row gutter={[24, 24]}>
//       <Col span={12}></Col>
//       <Col span={12}>
//         <h2>{order?.product?.title}</h2>
//         <span style={{ fontWeight: 500 }}>
//           {variantIdSelected?.salePrice}
//           {variantIdSelected?.salePrice < variantIdSelected?.regularPrice ? (
//             <del style={{ color: "gray", marginLeft: 10 }}>
//               $ {variantIdSelected?.regularPrice}
//             </del>
//           ) : null}
//         </span>
//         <div>
//           <div className="mt-15">Product Type</div>
//           <div style={{ display: "block" }}>
//             {order?.product?.productBases?.map((base) => (
//               <CheckableTag
//                 key={base.id}
//                 onChange={(checked) => {
//                   if (checked) {
//                     setBaseSelected(base);
//                   }
//                 }}
//                 checked={baseSelected?.id === base.id}
//               >
//                 {base.title}
//               </CheckableTag>
//             ))}
//           </div>
//         </div>
//         <div style={{ width: "100%", marginTop: 15 }}>
//           {map(newVariantAttributes, (item, key) =>
//             key.toLowerCase() === "color" ? (
//               <div key={key}>
//                 {item.map((attribute) => (
//                   <ColorsComponent
//                     key={attribute.value}
//                     value={attribute.value}
//                     checked={attribute.checked}
//                     checkEnable={true}
//                     onChange={() => handleChangeAttribute(attribute)}
//                     fulfillmentSlug={
//                       baseSelected?.fulfillment?.type == "Custom"
//                         ? null
//                         : baseSelected?.fulfillment?.slug
//                     }
//                     fulfillmentId={baseSelected?.fulfillment?.id}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div key={key} className="mt-15">
//                 {item.map((attribute) => (
//                   <Avatar
//                     key={attribute.value}
//                     style={{
//                       cursor: "pointer",
//                       border: `2px solid ${
//                         attribute.checked
//                           ? "var(--primary-color)"
//                           : "transparent"
//                       }`,
//                       boxSizing: "content-box",
//                       marginRight: 5,
//                     }}
//                     size={20}
//                     onClick={() => handleChangeAttribute(attribute)}
//                   >
//                     {attribute.value}
//                   </Avatar>
//                 ))}
//               </div>
//             )
//           )}
//         </div>
//         <h3>Personalized form</h3>
//         <ArtworkFormPreview
//           artworkId="ujGZ1PHxr"
//           personalized={{ template: 0 }}
//         />
//       </Col>
//     </Row>
//   );
// };

// export default CustomizationModal;
