import { Card, Form, Input, Pagination, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import artworksQuery from "graphql/queries/artworks";
import Grid from "components/Utilities/Grid";
import ArtworkCategories from "components/Artworks/ArtworkCategories";
import moment from "moment";
import { debounce, get } from "lodash";
import CustomizeLoadingCard from "components/Utilities/CustomizeLoadingCard";
import styled from "styled-components";
import { AiFillCheckSquare } from "react-icons/ai";
import Scrollbars from "react-custom-scrollbars";
import EmptyData from "components/Utilities/EmptyData";
import { useAppValue } from "context";

const Container = styled.div`
  .ant-card-bordered .ant-card-cover {
    margin: 0;
  }
  .item-selected {
    position: relative;
  }
  .item-selected .ant-card-bordered {
    box-shadow: 0 0 0 2px rgba(92, 106, 196, 0.5),
      0 2px 3px 0 rgba(92, 106, 196, 0.15);
  }
  .custom-icon {
    position: absolute;
    top: 0;
    right: 0;
    color: #5c6ac4;
  }
  .description {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

const ChooseArtWorkModal = ({ onChange, onOk }) => {
  const [{ sellerId }] = useAppValue();
  const [form] = Form.useForm();
  const [categorySelect, setCategorySelect] = useState();
  const [artwork, setArtwork] = useState();
  const [filter, setFilter] = useState({
    pageSize: 24,
    categoryID: null,
    page: 1,
    sortBy: "title",
    order: "ASC",
    search: null,
  });

  const { data, loading } = useQuery(artworksQuery, {
    variables: { ...filter, sellerId },
    fetchPolicy: "network-only",
  });
  const artworks = data?.artworks.hits;

  const onSearchChange = (_, { search }) => {
    if (search) {
      setFilter({ ...filter, search, page: 1 });
    } else {
      setFilter({ ...filter, search: null });
    }
  };

  useEffect(() => {
    if (categorySelect && categorySelect[0]) {
      setFilter({
        ...filter,
        categoryID: categorySelect[0],
      });
    } else {
      setFilter({
        ...filter,
        categoryID: null,
      });
    }
  }, [categorySelect]);

  const pagination = {
    total: data?.artworks.count,
    pageSize: filter.pageSize,
    current: filter.page,
    onChange: (page, pageSize) => {
      setFilter({ ...filter, page, pageSize });
    },
  };
  return (
    <Container
      style={{
        display: "grid",
        gridTemplateColumns: "250px calc(100% - 250px)",
      }}
    >
      <ArtworkCategories
        setCategorySelect={setCategorySelect}
        categorySelect={categorySelect?.toString()}
        customBg={true}
        categoryImportBase={true}
        customBase={false}
        artworkCustom={true}
        height={350}
      />

      <Card>
        <div className="right-content">
          <Form
            form={form}
            layout="vertical"
            onValuesChange={debounce(onSearchChange, 300)}
          >
            <Form.Item name="search" initialValue={filter?.search ?? null}>
              <Input.Search
                className="input-tag"
                placeholder="Search artwork..."
              />
            </Form.Item>
          </Form>
        </div>
        <Scrollbars
          style={{ marginBottom: 0 }}
          autoHeight
          autoHeightMax="calc(100vh - 350px)"
        >
          {loading ? (
            <Grid style={{ margin: 1 }} gap={20} width={250}>
              <CustomizeLoadingCard times={4} height={250} />
            </Grid>
          ) : !artworks?.length ? (
            <EmptyData />
          ) : (
            <Grid style={{ margin: 1 }} gap={20} width={250}>
              {artworks.map((el) => (
                <div
                  key={el.id}
                  style={{ marginBottom: 2 }}
                  className={artwork?.id === el.id ? "item-selected" : null}
                >
                  <Card
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (el.id === artwork?.id) {
                        setArtwork(null);
                        onChange(null);
                      } else {
                        setArtwork(el);
                        onChange(el);
                      }
                    }}
                    onDoubleClick={() => {
                      setArtwork(el);
                      onChange(el);
                      onOk(el);
                    }}
                    cover={
                      <div
                        className="clipart"
                        style={{
                          paddingBottom: "67%",
                          backgroundImage:
                            el.templates && el.templates[0].preview
                              ? `url(${process.env.CDN_URL}300xauto/${el.templates[0].preview})`
                              : `/no-preview.jpg`,
                          borderRadius: 3,
                        }}
                      />
                    }
                  >
                    <div className="work-art-detail">
                      <div className="description">
                        <Tooltip title={el.title}>
                          <b>{el.title} </b>
                        </Tooltip>
                        <br />
                        {moment(el.createdAt).format("DD MMM YYYY")} -{" "}
                        {el.width}x{el.height} <br />
                        <span>
                          Used in {el.usedIn}{" "}
                          {el.usedIn === 1 ? "campaign" : "campaigns"}
                        </span>
                      </div>
                    </div>
                  </Card>
                  {artwork?.id === el.id ? (
                    <AiFillCheckSquare className="anticon custom-icon" />
                  ) : null}
                </div>
              ))}
            </Grid>
          )}
        </Scrollbars>
        <Pagination
          style={{ float: "right" }}
          className="mt-15"
          {...pagination}
        />
      </Card>
    </Container>
  );
};

export default ChooseArtWorkModal;
