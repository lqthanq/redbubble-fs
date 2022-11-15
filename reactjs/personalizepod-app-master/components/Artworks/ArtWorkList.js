import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Pagination, Modal, Image, Space, Tag } from "antd";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import artworksQuery from "../../graphql/queries/artworks";
import artworkCategory from "../../graphql/queries/artworkCategory";
import Grid from "components/Utilities/Grid";
import { useRouter } from "next/router";
import CustomizeMainContent from "components/Utilities/CustomizeMainContent";
import ArtWorkAction from "./ArtWorkAction";
import moment from "moment";
import CustomizeLoadingCard from "components/Utilities/CustomizeLoadingCard";
import { get } from "lodash";
import useFilterArtwork from "./FilterArtwork";
import CustomizeAvatarOwner from "components/Utilities/CustomizeAvatarOwner";
import UseArtworkForm from "../../hooks/ArtworkForm";
import ImportFromPSD from "./ImportFromPSD";
import Scrollbars from "react-custom-scrollbars";
import Link from "next/link";
import { useAppValue } from "context";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const Container = styled.div`
  border-left: 0.1rem solid #dfe3e8;
  .lock-position {
    position: absolute;
    top: 2px;
    left: 2px;
    cursor: pointer;
    font-size: larger;
  }

  .ant-card-cover {
    margin: 0;
  }
`;

const ArtWorkList = (props) => {
  const router = useRouter();
  const [{ sellerId }] = useAppValue();
  const { categoryID, customBg } = props;
  const [artworks, setArtworks] = useState([]);
  const [customClass, setCustomClass] = useState(false);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState({
    ...router.query,
    pageSize: 20,
    categoryID: categoryID,
    page: get(router, "query.page", 1),
    sortBy: get(router, "query.sortBy", "created_at"),
    order: get(router, "query.order", "DESC"),
    sellerId,
  });

  const { data: categoryData } = useQuery(artworkCategory, {
    variables: {
      ID: categoryID,
      sellerId,
    },
  });

  const [artworkForm, artworkData] = UseArtworkForm({
    artwork: { categories: categoryID ? [{ id: categoryID }] : [] },
  });

  useEffect(() => {
    if (artworkData && artworkData.data && artworkData.data.artwork) {
      setVisible(false);
      router.push(
        "/artworks/[id]/design",
        `artworks/${artworkData.data.artwork.id}/design`
      );
    }
  }, [artworkData]);

  const { data, loading, error, refetch } = useQuery(artworksQuery, {
    variables: {
      ...filter,
      sellerId,
      categoryID: get(router, "query.categoryID", null),
      page: get(router, "query.page", 1),
      sortBy: get(router, "query.sortBy", "created_at"),
      order: get(router, "query.order", "DESC"),
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setArtworks(data.artworks.hits);
    },
  });

  const refetchData = () => {
    refetch().then((res) => {
      setArtworks(res.data.artworks.hits);
    });
  };

  const [formFilter, { form }] = useFilterArtwork({
    filter,
    setFilter,
  });

  const resetFilter = () => {
    setFilter({
      ...filter,
      order: "DESC",
      sortBy: "created_at",
      search: null,
    });
    router.query = {};
    router.push(router);
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      width: 400,
      render: (record) => (
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "90px auto",
            alignItems: "center",
          }}
        >
          <Image
            style={{ backgroundColor: "#f5f5f5", objectFit: "cover" }}
            width="90px"
            height="90px"
            preview={{
              src: `${process.env.CDN_URL}/autoxauto/${record.templates[0].preview}`,
            }}
            src={`${process.env.CDN_URL}/100x100/${record.templates[0].preview}`}
            fallback={`/no-preview.jpg`}
          />
          <div className="lock-position">
            <ArtWorkAction
              refetch={refetchData}
              artwork={record}
              lockAction={true}
            />
          </div>
          {record.lock ? (
            <b className="ml-15" style={{ color: "#006fbb" }}>
              {record.title}
            </b>
          ) : (
            <b className="ml-15">
              <Link
                as={`/artworks/${record.id}/design`}
                href={`/artworks/[id]/design`}
              >
                {record.title}
              </Link>
            </b>
          )}
        </div>
      ),
    },
    // { title: "Used in", key: "usedin", width: 150 },
    {
      title: "Author",
      key: "author",
      width: 200,
      dataIndex: "author",
      render: (author) => (
        <CustomizeAvatarOwner
          size={32}
          src={`${process.env.CDN_URL}/300x300/${author?.avatar?.key}`}
          author={author}
        />
      ),
    },
    {
      title: "Date",
      key: "date",
      width: 150,
      dataIndex: "createdAt",
      render: (data) => moment(data).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      width: 100,
      key: "action",
      align: "right",
      render: (record) => (
        <ArtWorkAction
          refetch={refetchData}
          artwork={record}
          setCustomClass={setCustomClass}
        />
      ),
    },
  ];

  const pagination = {
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 30, 50, 100],
    total: data?.artworks.count,
    pageSize: filter?.pageSize,
    current: +get(router, "query.page", 1),
    onChange: (page, pageSize) => {
      router.query.page = page;
      setFilter({ ...filter, pageSize, page });
      router.push(router);
    },
    showTotal: (total, range, a) =>
      `${range[0]} to ${range[1]} of ${total} items`,
  };
  const onCloseTagSortBy = () => {
    setFilter({
      ...filter,
      sortBy: "created_at",
      order: "DESC",
    });
    delete router.query?.sortBy;
    delete router.query.order;
    router.push(router);
    form.setFieldsValue({
      sortBy: "created_at",
      order: "DESC",
    });
  };
  const tagFilter = () => (
    <div>
      {router?.query?.sortBy ? (
        <Tag
          className="tag-filter-campaign"
          closable
          onClose={onCloseTagSortBy}
        >
          Sort by:{" "}
          {router?.query?.sortBy === "title"
            ? "Alphabetical"
            : router?.query?.sortBy === "updated_at"
            ? "Last edited"
            : "Date created"}{" "}
          ({router?.query?.order === "ASC" ? "ASC" : "DESC"})
        </Tag>
      ) : null}
    </div>
  );

  if (error) return `${error.message}`;

  return (
    <Container className={!customBg ? "p-15-24 system-background" : "p-15-24"}>
      <CustomizeMainContent
        headerTitle={
          categoryID ? categoryData?.artworkCategory?.title : "All artworks"
        }
        headerButton={
          <AuthElement name={permissions.ArtworkCreate}>
            <Space>
              <ImportFromPSD categoryID={categoryID} />
              <Button
                onClick={() => setVisible(true)}
                type="primary"
                //disabled={!categoryID}
              >
                Add New
              </Button>
            </Space>
          </AuthElement>
        }
        form={form}
        filter={filter}
        tagFilter={tagFilter()}
        setFilter={setFilter}
        loading={loading}
        dataSource={artworks}
        columns={columns}
        refetch={refetchData}
        pagination={pagination}
        customLayout={true}
        filterContainer={formFilter}
        resetFilter={resetFilter}
        cancelText={
          filter.order !== "ASC" || filter.sortBy !== "title"
            ? "Clear"
            : "Cancel"
        }
      >
        <Scrollbars autoHeight autoHeightMax={"calc(100vh - 300px)"}>
          <Card bordered={false} className="card-main-content">
            <Grid gap={20} width={250}>
              {loading ? (
                <CustomizeLoadingCard times={4} height={300} />
              ) : (
                artworks &&
                artworks.map((el) => (
                  <div className="card-item" key={el.id}>
                    <Card
                      className={customClass === el.id ? null : "custom-action"}
                      onMouseLeave={() => setCustomClass(false)}
                      onMouseEnter={() => setCustomClass(el.id)}
                      cover={
                        <div>
                          <Image
                            style={{
                              backgroundColor: "#f5f5f5",
                              objectFit: "contain",
                            }}
                            width="100%"
                            height="250px"
                            preview={{
                              src: `${process.env.CDN_URL}/autoxauto/${el.templates[0].preview}`,
                            }}
                            fallback={`/no-preview.jpg`}
                            src={`${process.env.CDN_URL}/300x300/${el.templates[0].preview}`}
                          />
                          <div className="lock-position">
                            <ArtWorkAction
                              refetch={refetchData}
                              artwork={el}
                              lockAction={true}
                            />
                          </div>
                        </div>
                      }
                    >
                      <div className="work-art-detail">
                        <div className="description">
                          {el.lock ? (
                            <b style={{ color: "#006fbb" }}>{el.title}</b>
                          ) : (
                            <b>
                              <Link
                                as={`/artworks/${el.id}/design`}
                                href={`/artworks/[id]/design`}
                              >
                                {el.title}
                              </Link>
                            </b>
                          )}
                          <br />
                          {moment(el.createdAt).format("DD MMM YYYY")} -{" "}
                          {el.width}x{el.height} <br />
                          <div
                            style={{
                              justifyContent: "space-between",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ lineHeight: "22px" }}>
                              Used in {el.usedIn}{" "}
                              {el.usedIn === 1 ? "campaign" : "campaigns"}
                            </span>
                            <div className="custom-action-show">
                              <ArtWorkAction
                                setCustomClass={setCustomClass}
                                refetch={refetchData}
                                artwork={el}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))
              )}
            </Grid>
          </Card>
        </Scrollbars>
        <Pagination style={{ padding: "20px 16px" }} {...pagination} />
      </CustomizeMainContent>
      {artworkData && (
        <Modal
          visible={visible}
          title="Add new artwork"
          onCancel={() => setVisible(false)}
          onOk={() => artworkData.form.submit()}
          okButtonProps={{ loading: artworkData.loading }}
          okText="Save"
        >
          {artworkForm}
        </Modal>
      )}
    </Container>
  );
};
export default ArtWorkList;
