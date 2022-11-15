import { Popover, Button, Row, Col, Divider, Form, InputNumber } from "antd";
import styled from "styled-components";
import { useAppValue } from "context";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import { ARTWORK } from "../../../actions";
const Container = styled.div`
  width: 350px;
  .ant-col {
    > span {
      display: flex;
      align-items: center;
      height: 40px;
      cursor: pointer;
      width: max-content;
      svg.anticon {
        font-size: 24px;
        margin-right: 5px;
      }
    }
  }
`;
const LayerAdvance = ({ layer }) => {
  const [form] = Form.useForm();
  const [{ workspace }, dispatch] = useAppValue();
  const { selectedTemplate } = workspace;
  useEffect(() => {
    form.setFieldsValue({ rotation: 0, skewX: 0, ...layer });
  }, [
    layer.id,
    layer.x,
    layer.y,
    layer.width,
    layer.height,
    layer.rotation,
    layer.skewX,
    layer.scaleX,
    layer.scaleY,
  ]);
  const handleUpdate = (_, values) => {
    dispatch({
      type: ARTWORK.SET_LAYER,
      payload: { ...layer, ...values },
    });
  };
  const isSharedLayer = useMemo(() => {
    return selectedTemplate !== -1 && layer.shared_layer_id;
  }, [selectedTemplate, layer.id]);
  return (
    <Popover
      placement="bottom"
      forceRender={true}
      overlayStyle={{ opacity: 0.5 }}
      content={
        <Form
          form={form}
          layout="vertical"
          onValuesChange={debounce(handleUpdate, 200)}
        >
          <Container>
            <Divider orientation="left">Size</Divider>
            {!isSharedLayer && (
              <Row gutter={15}>
                <Col span={12}>
                  <Form.Item label="Width" name="width">
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Height" name="height">
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Row gutter={15}>
              <Col span={12}>
                <Form.Item label="Left" name="x">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Top" name="y">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            {!isSharedLayer && (
              <>
                <Divider orientation="left">Transform</Divider>
                <Row gutter={15}>
                  <Col span={12}>
                    <Form.Item label="Rotate" name="rotation">
                      <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Skew" name="skewX">
                      <InputNumber style={{ width: "100%" }} step={0.1} />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Container>
        </Form>
      }
    >
      <Button type="link">Advance</Button>
    </Popover>
  );
};

export default LayerAdvance;
