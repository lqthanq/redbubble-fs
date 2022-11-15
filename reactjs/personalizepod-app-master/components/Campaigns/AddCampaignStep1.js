import { CAMPAIGN } from "actions";
import { Button, Col, Drawer, Row } from "antd";
import { useAppValue } from "context";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ProductBaseSelected from "./ProductBaseSelected";
import ShowProductBases from "./ShowProductBases";

const AddCampaignStep1 = ({ showBases = false, setShowBases }) => {
  const router = useRouter();
  const [{ campaign }, dispatch] = useAppValue();
  const { productBases } = campaign;
  const basesLength = productBases?.length;

  const onClose = () => {
    setShowBases(false);
    dispatch({
      type: CAMPAIGN.RESET,
    });
  };

  return (
    <div>
      <Drawer
        className="add-campaign-drawer"
        placement="left"
        onClose={onClose}
        visible={showBases}
        closable={true}
        width={basesLength ? 800 : 400}
        footer={null}
        maskClosable={basesLength ? false : true}
      >
        <Row>
          <Col style={{ background: "#F4F6F8" }} span={basesLength ? 12 : 24}>
            <ShowProductBases />
          </Col>
          <Col
            style={{
              borderLeft: "1px solid #dfe3e8",
            }}
            span={12}
            hidden={!basesLength}
            className="productproductBases"
          >
            <ProductBaseSelected onClose={onClose} />
            <div
              className="flex space-between p-15"
              style={{ background: "#F4F6F8" }}
            >
              <Button onClick={() => onClose()}>Cancel</Button>
              <Button
                className="ml-15"
                type="primary"
                onClick={() => {
                  setShowBases(false);
                  router.push("new/step-2", "new/step-2");
                }}
              >
                Config Campaign
              </Button>
            </div>
          </Col>
        </Row>
      </Drawer>
    </div>
  );
};

export default AddCampaignStep1;
