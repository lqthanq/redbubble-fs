import { Skeleton } from "antd";
import OrderForm from "components/Orders/OrderForm";
import { ORDER_BY_ID } from "graphql/queries/order/orders";
import { cloneDeep, get } from "lodash";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { REGENDER_SUBSCRIPTION } from "graphql/queries/order/orders";
import { useEffect } from "react";

const OrderFormDetail = () => {
  const router = useRouter();
  const id = get(router, "query.id", null);
  const { data, loading, error, refetch, subscribeToMore } = useQuery(
    ORDER_BY_ID,
    {
      variables: {
        id,
      },
    }
  );

  const order = cloneDeep({ ...data?.order });

  useEffect(() => {
    if (subscribeToMore) {
      subscribeToMore({
        document: REGENDER_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData?.data?.reGeneratePrintFile) return prev;
          console.log(prev, subscriptionData?.data?.reGeneratePrintFile);
          return {
            ...order,
            ...subscriptionData.data.reGeneratePrintFile,
          };
        },
      });
    }
  }, [id]);

  if (loading)
    return (
      <div className="p-24">
        <Skeleton active={true} loading={loading} />
      </div>
    );
  if (error) return null;
  return (
    <div>
      <OrderForm refetch={refetch} order={order} />
    </div>
  );
};
OrderFormDetail.title = "Order";
export default OrderFormDetail;
