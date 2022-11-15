import { Col, Row, Image, Form, notification } from "antd";
import { UPLOAD_DESIGN } from "graphql/mutate/order/orderAction";
import { useMutation } from "@apollo/client";
import styled from "styled-components";
import ImagePrintarea from "components/ProductBase/ImagePrintarea";
import Scrollbars from "react-custom-scrollbars";

const Container = styled.div`
  .ant-image-preview-img {
    background: lightgray;
  }
`;

const OrderUploadDesign = ({
  order,
  handleClose,
  refetch,
  newDesigns,
  setNewDesigns,
}) => {
  const [UploadDesign, { loading }] = useMutation(UPLOAD_DESIGN);

  const onFinish = () => {
    UploadDesign({
      variables: {
        orderId: order.id,
        input: newDesigns
          .filter((item) => item.file)
          .map((el) => {
            return {
              designId: el?.id,
              fileId: el?.file ? el?.file?.id : null,
            };
          }),
      },
    })
      .then((res) => {
        notification.success({
          message: "The Order Designs Uploaded Successfully!",
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

  return [
    <Container>
      <Form id="upload" onFinish={onFinish}>
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
          {newDesigns && (
            <Col span={12}>
              <Scrollbars autoHeight autoHeightMax={"calc(100vh - 300px)"}>
                {newDesigns?.map((el, index) => (
                  <div
                    style={{
                      width: "100%",
                      height: "320px",
                      marginBottom: 20,
                      cursor: "pointer",
                    }}
                    key={index}
                  >
                    <h3>{el?.name ? el.name : el.basePrintAreaName}</h3>
                    <ImagePrintarea
                      uploadOrder={el.file}
                      onChange={(v) =>
                        setNewDesigns(
                          newDesigns.map((item, i) =>
                            i === index ? { ...item, file: v } : item
                          )
                        )
                      }
                    />
                  </div>
                ))}
              </Scrollbars>
            </Col>
          )}
        </Row>
      </Form>
    </Container>,
    {
      loading,
      disableButton: newDesigns && !newDesigns?.some((item) => item.file),
    },
  ];
};

export default OrderUploadDesign;
