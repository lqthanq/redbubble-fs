import { Row, Col, Popover, Button, Tabs, Input, Select, message } from "antd";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import fontsQuery from "../../graphql/queries/fonts";
import publicFontsQuery from "../../graphql/queries/publicFonts";
import fontQuery from "../../graphql/queries/font";
import createFontMutate from "../../graphql/mutate/createFont";
import { Scrollbars } from "react-custom-scrollbars";
import { get, last } from "lodash";
import Upload from "../Media/Upload";
import styled from "styled-components";

const Container = styled.div`
  .ant-btn {
    overflow: hidden;
    text-overflow: ellipsis;
    span {
      text-overflow: ellipsis;
    }
  }
`;
const FontSelector = ({ fontFamily = "", onSelect = () => {} }) => {
  const [id, variant] = fontFamily.split("-");
  const [update, setUpdate] = useState(false);
  const [fonts, setFonts] = useState([]);
  const [upload, setUpload] = useState();
  const [filter, setFilter] = useState({
    search: null,
    page: 1,
    pageSize: 30,
  });
  const [selectedFont, setSelectedFont] = useState();
  const [selectedVariant, setSelectedVariant] = useState();
  const { data, loading, refetch } = useQuery(fontsQuery, {
    variables: filter,
  });
  const publicFonts = useQuery(publicFontsQuery, { variables: filter });

  useEffect(() => {
    if (selectedFont) {
      setSelectedVariant(
        selectedFont.variants
          .map((v) => v.variant)
          .find((v) => v === variant) || selectedFont.variants[0].variant
      );
    }
  }, [selectedFont]);

  useEffect(() => {
    if (
      update && //Only send update if data changed by humans
      selectedFont &&
      selectedVariant &&
      selectedFont.variants.map((v) => v.variant).includes(selectedVariant) &&
      `${selectedFont.id}-${selectedVariant}` !== fontFamily
    ) {
      onSelect(`${selectedFont.id}-${selectedVariant}`);
      setUpdate(false);
    }
  }, [selectedVariant, selectedFont, update]);

  useEffect(() => {
    if (data) {
      setFonts(data.fonts.hits);
    }
  }, [data]);

  const handleFontChange = (font) => {
    setUpdate(true);
    setSelectedFont(font);
  };

  const handleVariantChange = (variant) => {
    setUpdate(true);
    setSelectedVariant(variant);
  };

  const [createFontMutation] = useMutation(createFontMutate);

  useEffect(() => {
    if (upload) {
      createFontMutation({
        variables: {
          family: upload.name,
          file: {
            key: upload.key,
            fileName: upload.name,
            fileSize: upload.size,
            fileMime: upload.type || "font/ttf",
          },
        },
      })
        .then((res) => {
          handleFontChange(res.data.createFont);
          refetch();
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  }, [upload]);

  return (
    <Container>
      {id && (
        <Query
          query={fontQuery}
          variables={{ id: id }}
          onCompleted={({ font }) => setSelectedFont(font)}
        >
          {() => null}
        </Query>
      )}
      <Popover
        placement="bottomLeft"
        trigger="click"
        content={
          <Tabs
            tabBarExtraContent={
              <Row gutter={10}>
                <Col flex="auto">
                  <Input
                    placeholder="Search"
                    onChange={(e) =>
                      setFilter({ ...filter, search: e.target.value })
                    }
                  />
                </Col>
                <Col flex="100px">
                  <Upload
                    accept=".ttf"
                    dragger={false}
                    onUpload={(files) => {
                      setUpload(last(files));
                    }}
                    showUploadList={false}
                  >
                    <Button block>Upload Font</Button>
                  </Upload>
                </Col>
              </Row>
            }
            defaultActiveKey="global"
          >
            <Tabs.TabPane tab="Global Fonts" key="global">
              <Scrollbars style={{ width: 600, height: 400 }}>
                <Row type="flex" style={{ width: 600 }} gutter={[30, 20]}>
                  {publicFonts.data &&
                    publicFonts.data.fonts.hits.map((font) => (
                      <Col
                        span={24}
                        lg={12}
                        key={font.id}
                        onClick={() => handleFontChange(font)}
                        style={{ overflow: "hidden", cursor: "pointer" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>{font.family}</span>
                          <img
                            src={`${process.env.ELEMENT_URL}font-preview/${font.id}-${font.variants[0].variant}/Sample`}
                          />
                        </div>
                      </Col>
                    ))}
                </Row>
              </Scrollbars>
            </Tabs.TabPane>
            <Tabs.TabPane tab="My Fonts" key="my-fonts">
              <Row type="flex" style={{ width: 600 }} gutter={[30, 20]}>
                {fonts.map((font) => (
                  <Col
                    span={24}
                    lg={12}
                    key={font.id}
                    onClick={() => handleFontChange(font)}
                    style={{ overflow: "hidden", cursor: "pointer" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{font.family}</span>
                      <img
                        src={`${process.env.ELEMENT_URL}font-preview/${font.id}-${font.variants[0].variant}/Sample`}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </Tabs.TabPane>
          </Tabs>
        }
      >
        <Button block style={{ width: 150 }}>
          {get(selectedFont, "family", "Select font")}
        </Button>
      </Popover>
      {selectedFont && (
        <Select
          style={{ width: 100, marginLeft: 10 }}
          value={selectedVariant}
          onChange={handleVariantChange}
        >
          {selectedFont.variants.map((v) => (
            <Select.Option key={v.variant}>{v.variant}</Select.Option>
          ))}
        </Select>
      )}
    </Container>
  );
};
export default FontSelector;
