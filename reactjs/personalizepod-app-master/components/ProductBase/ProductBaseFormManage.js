import ProductBaseForm from "components/ProductBase/ProductBaseForm";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import PRODUCTBASE from "graphql/queries/productBase/productBaseById";
import { Form, notification, Skeleton } from "antd";
import updateProductBase from "graphql/mutate/productBase/updateProductBase";
import { messageSave } from "components/Utilities/message";
import { omit } from "lodash";
import { useAppValue } from "context";
import { CAMPAIGN } from "actions";
import { FULFILLMENTS } from "graphql/queries/productBase/fulfillments";
import createProductBase from "graphql/mutate/productBase/createProductBase";
import { useEffect, useState } from "react";

const ProductBaseFormManage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;
  const [
    { productBaseImport, baseVariants, campaign, sellerId },
    dispatch,
  ] = useAppValue();
  const [editProductBase, { loading: loadingUpdate }] = useMutation(
    updateProductBase
  );
  const [newProductBase, { loading: loadingCreate }] = useMutation(
    createProductBase
  );
  const [productBase, setProductBase] = useState();

  const clearTypeName = (data) => {
    if (data && data.length) {
      return data.map((el) => omit(el, ["__typename"]));
    }
    return [];
  };
  const { data: fulfillment } = useQuery(FULFILLMENTS);
  const { data, loading } = useQuery(PRODUCTBASE, {
    variables: {
      id: id,
    },
    skip: !id,
    onCompleted: (data) => {
      setProductBase(data.productBaseById);
      dispatch({
        type: "changeActiveVariant",
        payload: {
          baseVariants: clearTypeName(data?.productBaseById?.variants),
        },
      });
      dispatch({
        type: CAMPAIGN.SET,
        payload: {
          campaign: {
            ...campaign,
            baseSelected: data.productBaseById,
          },
        },
      });
    },
  });

  const dataFulfillmentServices = fulfillment ? fulfillment.fulfillments : [];

  const validateCustom = (values) => {
    if (values.printAreas && values.printAreas.find((design) => !design.name)) {
      return "print areas";
    } else if (
      baseVariants
        .filter((item) => item.active)
        .find((variant) =>
          variant.salePrice
            ? variant.salePrice > variant.regularPrice ||
              variant.salePrice < variant.cost
            : variant.regularPrice < variant.cost
        )
    ) {
      return "variants";
    }
    return false;
  };

  const handleCreateBase = (values) => {
    if (validateCustom(values)) {
      notification.error({
        message: `Please input ${validateCustom(values)} again`,
      });
    } else {
      if (values.printAreas) {
        values.printAreas.map((design) => {
          delete design.key;
          delete design.image;
        });
      }
      if (values.attributes) {
        values.attributes.map((attr) => {
          delete attr.key;
        });
      }
      newProductBase({
        variables: {
          input: {
            ...values,
            sellerId,
            fssProductBaseId: productBaseImport ? productBaseImport.id : null,
            fulfillmentId: productBaseImport
              ? dataFulfillmentServices
                  .filter(
                    (fulfill) =>
                      fulfill.slug === productBaseImport?.fulfillmentSlug
                  )
                  .map((el) => el.id)
                  .join()
              : values.fulfillmentId,
            attributes: productBaseImport
              ? clearTypeName(productBaseImport?.attributes)
              : values.attributes,
            variants: clearTypeName(
              baseVariants.map((variant) => {
                return {
                  attributes: clearTypeName(variant.attributes),
                  cost: variant.cost,
                  fulfillmentProductId: variant.fulfillmentProductId,
                  regularPrice: variant.regularPrice,
                  salePrice: variant.salePrice,
                  fssVariantId: variant.id,
                  active: variant.active ? variant.active : false,
                };
              })
            ),
          },
        },
      })
        .then((res) => {
          setProductBase(res.data.createProductBase);
          window.history.pushState(
            {},
            "",
            `/product-bases/${res.data.createProductBase.id}`
          );
          messageSave("Product Base");
        })
        .catch((err) => {
          const parseErrMessage = err.message.includes("GraphQL error:")
            ? err.message.subString(15).charAt(0).toUpperCase() +
              err.message.subString(16)
            : err.message;
          notification.error({
            message: parseErrMessage,
          });
        });
    }
  };

  const handleEditBase = (values) => {
    if (validateCustom(values)) {
      notification.error({
        message: `Please input ${validateCustom(values)} again`,
      });
    } else {
      delete values.fulfillmentType;
      delete values.fulfillmentId;
      delete values.fulfillmentProductId;
      values.attributes = values.attributes.map((attr) => omit(attr, "key"));
      editProductBase({
        variables: {
          id: productBase.id,
          input: {
            ...values,
            printAreas: values.printAreas.map((design) => {
              return {
                fileId: design.fileId,
                height: design.height,
                name: design.name,
                width: design.width,
                id: design.id,
              };
            }),
            variants: clearTypeName(
              baseVariants.map((variant) => {
                variant.attributes = variant.attributes?.map((att) =>
                  omit(att, "__typename")
                );
                return {
                  ...variant,
                };
              })
            ),
          },
        },
      })
        .then((res) => {
          setProductBase(res.data.updateProductBase);
          messageSave("Product Base");
        })
        .catch((err) => notification.error({ message: err.message }));
    }
  };

  useEffect(() => {
    if (productBase) {
      dispatch({
        type: "changeActiveVariant",
        payload: {
          baseVariants: clearTypeName(productBase?.variants),
        },
      });
    }
  }, [productBase]);

  if (loading) return <Skeleton />;

  return (
    <div>
      <ProductBaseForm
        form={form}
        productBaseImport={
          productBase || data?.productBaseById ? null : productBaseImport
        }
        productBase={productBase || data?.productBaseById}
        onSubmit={(values) =>
          productBase ? handleEditBase(values) : handleCreateBase(values)
        }
        loading={loadingUpdate || loadingCreate}
      />
    </div>
  );
};
export default ProductBaseFormManage;
