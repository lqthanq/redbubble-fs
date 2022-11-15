import { useMutation } from "@apollo/client";
import { Col, Form, Image, notification, Row, Tooltip } from "antd";
import { ACCEPT_DESIGN } from "graphql/mutate/order/orderAction";
import { useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import { AiOutlineEye } from "react-icons/ai";
import { HiOutlineExternalLink } from "react-icons/hi";

const AcceptDesign = ({ order, handleClose, refetch, newDesigns }) => {
  const [AcceptDesign, { loading }] = useMutation(ACCEPT_DESIGN);
  const [type, setType] = useState(true);

  const onAccept = (accept) => {
    setType(accept);
    AcceptDesign({
      variables: { orderId: order.id, accept },
    })
      .then(() => {
        notification.success({
          message: `The Order Designs ${
            accept ? "Accepted" : "Rejected"
          } Successfully!`,
        });
        refetch();
        handleClose();
      })
      .catch((err) => notification.error({ message: err.message }));
  };

  const availableMockup = order?.product?.mockups?.find(
    (el) => el.variantId === order?.productVariant?.id
  );

  const imageMockup = availableMockup
    ? availableMockup.image
    : order?.product?.mockups && order?.product?.mockups[0]?.image;

  const formData = (
    <Row gutter={[24, 0]} style={{ margin: "0", padding: 20 }}>
      <Col span={12}>
        <h3>Thumnail</h3>
        <Image
          style={{ backgroundColor: "#f5f5f5", objectFit: "contain" }}
          width="100%"
          height="300px"
          preview={{
            src: `${process.env.CDN_URL}/autoxauto/${imageMockup}`,
          }}
          src={`${process.env.CDN_URL}/300x300/${imageMockup}`}
          fallback={`/images/default-img.png`}
        />
      </Col>
      <Col span={12}>
        <Scrollbars autoHeight autoHeightMax={"calc(100vh - 300px)"}>
          {newDesigns &&
            newDesigns.map((item, index) => (
              <div key={index}>
                <h3>{item?.name ? item.name : item.basePrintAreaName}</h3>
                <Image
                  key={index}
                  style={{ backgroundColor: "#f5f5f5", objectFit: "contain" }}
                  width="100%"
                  height="300px"
                  preview={{
                    mask: (
                      <div>
                        <div className="flex item-center">
                          <AiOutlineEye /> Preview
                        </div>
                        <Tooltip title="View original">
                          <a
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            href={`${process.env.CDN_URL}/autoxauto/${item?.file?.key}`}
                            style={{
                              zIndex: 200000,
                              position: "absolute",
                              right: 0,
                              top: 0,
                            }}
                          >
                            <HiOutlineExternalLink
                              style={{
                                color: "white",
                                size: 30,
                              }}
                              className="anticon custom-icon"
                            />
                          </a>
                        </Tooltip>
                      </div>
                    ),
                    src: `${process.env.CDN_URL}/autoxauto/${item?.file?.key}`,
                  }}
                  src={`${process.env.CDN_URL}/300x300/${item?.file?.key}`}
                  fallback={`/images/default-img.png`}
                />
              </div>
            ))}
        </Scrollbars>
      </Col>
    </Row>
  );

  return [
    <div>
      <Form hidden={true} id="reject" onFinish={() => onAccept(false)}>
        {formData}
      </Form>
      <Form id="accept" onFinish={() => onAccept(true)}>
        {formData}
      </Form>
    </div>,
    {
      loadingAccept: type && loading,
      loadingReject: !type && loading,
      disableAcceptButton: newDesigns
        ? newDesigns.find((item) => !item.file)
        : true,
    },
  ];
};

export default AcceptDesign;
