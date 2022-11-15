import { useEffect, useState } from "react";
import { Button, Col, Row } from "antd";
import CampaignPreview from "components/Campaigns/CampaignPreview";
import CampaignPrintAreas from "components/Campaigns/CampaignPrintAreas";
import styled from "styled-components";
import { useAppValue } from "context";
import CampaignLayout from "layouts/campaign";
import ShowProductBases from "components/Campaigns/ShowProductBases";
import { AiOutlineClose } from "react-icons/ai";
import useCampaignGeneralSettingsForm from "components/Campaigns/CampaignGeneralSettings";
import { CAMPAIGN } from "actions";
import { WarningUnsave } from "components/Utilities/WarningUnsave";

const Container = styled.div`
  background: #f4f6f8;
  height: calc(100% - 60px);
  .ant-card-head {
    border-bottom: 1px solid #d9d9d9;
  }
  .ant-collapse-content-box {
    padding: 15px;
  }
  .ant-card-head-title {
    padding: 12px 0;
  }
  .ant-card {
    height: 100%;
    background: #f4f6f8;
  }
  .ant-collapse-item-active .ant-collapse-header {
    background: #f4f6f8;
    border-bottom: 1px solid #d9d9d9;
    padding: 14px 15px;
    padding-left: 15px;
  }
  .ant-collapse {
    background: #f4f6f8;
  }
  .ant-collapse-header {
    height: 52px;
  }
  .ant-collapse .ant-collapse-item-disabled > .ant-collapse-header {
    color: #000000d9;
    cursor: default;
  }
`;

const AddCampaignStep2 = ({ storesData }) => {
  const [{ campaign }, dispatch] = useAppValue();
  const { productBases, productInput, baseSelected } = campaign;
  const [addMorePage, setAddMorePage] = useState(false);
  const [formView, formAction] = useCampaignGeneralSettingsForm({
    setAddMorePage,
    addMorePage,
    storesData,
  });

  useEffect(() => {
    const newBaseSelected = productBases?.find(
      (base) => base.id === baseSelected?.id
    );
    if (newBaseSelected) {
      dispatch({
        type: CAMPAIGN.SET,
        payload: {
          campaign: {
            ...campaign,
            baseSelected: newBaseSelected,
          },
        },
      });
    } else {
      if (productBases) {
        dispatch({
          type: CAMPAIGN.SET,
          payload: {
            campaign: {
              ...campaign,
              baseSelected: productBases[0],
            },
          },
        });
      }
    }
  }, [productBases]);

  WarningUnsave(true);

  return (
    <Container>
      <Row className="step2-campaign">
        <Col hidden={!addMorePage} span={6}>
          <ShowProductBases productInput={productInput} />
          <Button
            type="link"
            style={{ position: "absolute", top: 15, right: 0 }}
            size="small"
            onClick={() => setAddMorePage(false)}
            icon={<AiOutlineClose className="custom-icon anticon" />}
          />
        </Col>
        <Col
          span={6}
          style={{
            borderLeft: "1px solid #dfe3e8",
            borderRight: "1px solid #d9d9d9",
          }}
        >
          {formView}
        </Col>
        {baseSelected && (
          <Col
            hidden={addMorePage}
            span={18}
            style={{
              borderRight: "1px solid #d9d9d9",
            }}
          >
            <Row>
              <Col
                span={8}
                style={{
                  borderRight: "1px solid #d9d9d9",
                }}
              >
                <CampaignPrintAreas />
              </Col>
              <Col span={16}>
                <CampaignPreview
                  loading={formAction?.loading}
                  form={formAction?.form}
                  setAddMorePage={setAddMorePage}
                />
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </Container>
  );
};

AddCampaignStep2.Layout = CampaignLayout;
export default AddCampaignStep2;
