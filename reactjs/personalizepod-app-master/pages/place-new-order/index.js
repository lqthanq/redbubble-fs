import PlaceNewOrderStep1 from "components/PlaceNewOrder/PlaceNewOrderStep1";

const OrderFormDetail = ({ orderId }) => {
  return (
    <div>
      <PlaceNewOrderStep1 />
    </div>
  );
};
OrderFormDetail.title = "Order";
export default OrderFormDetail;
