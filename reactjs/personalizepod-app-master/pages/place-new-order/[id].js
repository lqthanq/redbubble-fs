import { Skeleton } from "antd";
import OrderDetail from "components/Orders/OrderDetail";
import OrderForm from "components/Orders/OrderForm";
import { ORDER_BY_ID } from "graphql/queries/order/orders";
import { cloneDeep, get } from "lodash";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";

const OrderFormDetail = ({ orderId }) => {
  const router = useRouter();
  const id = get(router, "query.id", orderId);
  const { data, loading, error } = useQuery(ORDER_BY_ID, {
    variables: {
      id,
    },
  });
  if (loading) return <Skeleton active={true} loading={loading} />;
  if (error) return null;

  return (
    <div>
      {orderId ? (
        <OrderDetail orderItem={cloneDeep({ ...data?.order })} />
      ) : (
        <OrderForm orderItem={cloneDeep({ ...data?.order })} />
      )}
    </div>
  );
};
OrderFormDetail.title = "Order";
export default OrderFormDetail;
