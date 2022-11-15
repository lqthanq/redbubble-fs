import { Button, Card, Form, Popover } from "antd";
import Slider from "./Slider";
//import { Filters } from "konva";
import { debounce, get, merge } from "lodash";
import styled from "styled-components";
import Grid from "components/Utilities/Grid";
import Scrollbars from "react-custom-scrollbars";
import { useAppValue } from "context";
import { useEffect } from "react";
import { ARTWORK } from "../../../actions";

const Container = styled.div`
  .ant-card {
    cursor: pointer;
    .ant-card-body {
      transition: all 0.2s ease;
    }
  }
  .selected {
    .ant-card-body {
      background: var(--primary-color);
      .ant-card-meta-description {
        color: #fff;
      }
    }
  }
`;
const filterProperties = {
  Blur: [
    {
      sample: "/sample-blur.png",
      key: "blurRadius",
      title: "Blur Radius",
      min: 0,
      max: 40,
      step: 0.05,
      default: 10,
    },
  ],
  Brighten: [
    {
      sample: "/sample-brighten.png",
      key: "brightness",
      title: "Brightness",
      min: -1,
      max: 1,
      step: 0.05,
      default: 0.1,
    },
  ],
  Contrast: [
    {
      sample: "/sample-contrast.png",
      key: "contrast",
      title: "Contrast",
      min: -100,
      max: 100,
      step: 1,
      default: 15,
    },
  ],
  // Emboss: [
  //   {
  //     key: "embossStrength",
  //     title: "Strength",
  //     min: 0,
  //     max: 10,
  //     step: 0.01,
  //   },
  //   {
  //     key: "embossWhiteLevel",
  //     title: "White Level",
  //     min: 0,
  //     max: 1,
  //     step: 0.01,
  //   },
  // ],
  Enhance: [
    {
      sample: "/sample-enhance.png",
      key: "enhance",
      title: "Enhance",
      min: -1,
      max: 1,
      step: 0.01,
      default: -0.5,
    },
  ],
  Grayscale: [
    {
      sample: "/sample-grayscale.png",
    },
  ],
  Pixelate: [
    {
      sample: "/sample-pixelate.png",
      key: "pixelSize",
      title: "Size",
      min: 1,
      max: 20,
      step: 1,
      default: 4,
    },
  ],
};

const ImageFilter = ({ layer }) => {
  const [_, dispatch] = useAppValue();
  const [form] = Form.useForm();
  const filter = get(layer, "_filters[0]");

  const onUpdate = (_, values) => {
    dispatch({
      type: ARTWORK.SET_LAYER,
      payload: {
        ...layer,
        ...values,
      },
    });
  };

  useEffect(() => {
    form.setFieldsValue(layer);
  }, [layer]);

  const filterForm = (filter) => {
    const properties = get(filterProperties, filter, []);
    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={layer}
        onValuesChange={debounce(onUpdate, 50)}
        style={{ width: 300 }}
      >
        {properties
          .filter((pro) => pro.key)
          .map((pro) => (
            <Form.Item label={pro.title} name={pro.key} key={pro.key}>
              <Slider min={pro.min} max={pro.max} step={pro.step} />
            </Form.Item>
          ))}
      </Form>
    );
  };

  return (
    <Popover
      content={
        <Scrollbars
          style={{ width: 300 }}
          autoHeight={true}
          autoHeightMax={"calc(100vh - 300px)"}
        >
          <Container>
            <Grid width={90} gap={5}>
              <Card
                cover={<img src="/sample.webp" alt="" size="small" />}
                bodyStyle={{ margin: 0, padding: 5, textAlign: "center" }}
                className={filter ? "" : "selected"}
                onClick={() => {
                  dispatch({
                    type: ARTWORK.SET_LAYER,
                    payload: {
                      ...layer,
                      _filters: [],
                    },
                  });
                }}
              >
                <Card.Meta description={"Normal"} size="small" />
              </Card>
              {Object.keys(filterProperties).map((key) => (
                <Card
                  key={key}
                  cover={
                    <img
                      src={`${
                        filterProperties[key][0].sample || "/sample.webp"
                      }`}
                      alt=""
                      size="small"
                    />
                  }
                  bodyStyle={{ margin: 0, padding: 5, textAlign: "center" }}
                  className={
                    get(layer, "_filters[0]") === key ? "selected" : ""
                  }
                  onClick={() => {
                    dispatch({
                      type: ARTWORK.SET_LAYER,
                      payload: {
                        ...merge(
                          ...filterProperties[key].map((p) => {
                            var obj = {};
                            if (p.default) {
                              obj[p.key] = p.default;
                            }
                            return obj;
                          })
                        ),
                        ...layer,
                        _filters: [key],
                      },
                    });
                  }}
                >
                  <Card.Meta description={key} size="small" />
                </Card>
              ))}
            </Grid>
            {filter ? filterForm(filter) : null}
          </Container>
        </Scrollbars>
      }
    >
      <Button type="link">Filter</Button>
    </Popover>
  );
};
export default ImageFilter;
