import { useMutation } from "@apollo/client";
import { Card, notification, Pagination, Progress } from "antd";
import File from "components/Media/File";
import ImagePreview from "components/Media/ImagePreview";
import CustomizeLoadingCard from "components/Utilities/CustomizeLoadingCard";
import Grid from "components/Utilities/Grid";
import { UPDATE_CLIPART_ORDERS } from "graphql/mutate/clipart/clipartAction";
import React from "react";
import Scrollbars from "react-custom-scrollbars";
import {
  arrayMove,
  SortableContainer,
  SortableElement,
} from "react-sortable-hoc";
import styled from "styled-components";
const Container = styled.div`
  .ant-card-cover {
    margin: 0;
  }
`;

const SortableItem = SortableElement(
  ({
    clipart,
    setCustomClass,
    customClass,
    refetch,
    updateName,
    edit,
    setEdit,
  }) => {
    return (
      <div
        key={clipart.id}
        style={{
          border: "none",
          background: "white",
        }}
        className="drag-visible"
      >
        <File
          edit={edit}
          setEdit={setEdit}
          updateName={updateName}
          setCustomClass={setCustomClass}
          customClass={customClass}
          file={clipart.file}
          clipart={clipart}
          refetch={refetch}
        />
      </div>
    );
  }
);

const SortableList = SortableContainer(
  ({
    cliparts,
    setCustomClass,
    customClass,
    refetch,
    uploads,
    loading,
    updateName,
    edit,
    setEdit,
  }) => (
    <Grid gap={20} width={200}>
      {cliparts?.map((clipart, index) => (
        <SortableItem
          clipart={clipart}
          updateName={updateName}
          edit={edit}
          setEdit={setEdit}
          key={clipart.id}
          index={index}
          setCustomClass={setCustomClass}
          customClass={customClass}
          refetch={refetch}
        />
      ))}
      {uploads.map((up) => {
        return (
          <div key={up.uid}>
            <Card cover={<ImagePreview file={up.originFileObj} />}>
              {up.status === "done" ? (
                up.originFileObj.name
              ) : (
                <Progress percent={Math.round(up.percent)} type="line" />
              )}
            </Card>
          </div>
        );
      })}
      {loading ? <CustomizeLoadingCard times={4} height={200} /> : null}
    </Grid>
  )
);

const ClipartData = ({
  cliparts,
  setCustomClass,
  customClass,
  refetch,
  uploads,
  loading,
  updateName,
  edit,
  setEdit,
  pagination,
  category,
  filter,
  setCliparts,
}) => {
  const [updateClipartOrders] = useMutation(UPDATE_CLIPART_ORDERS);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const clipartsByOrder = arrayMove(cliparts, oldIndex, newIndex);
    setCliparts(clipartsByOrder);
    updateClipartOrders({
      variables: {
        input: clipartsByOrder.map((item, index) => {
          return {
            id: item.id,
            order: index * filter.page,
          };
        }),
      },
    })
      .then(() => {})
      .catch((err) => notification.error({ message: err.message }));
  };

  return (
    <Container className="clipart-list">
      <Scrollbars autoHeight autoHeightMax={"calc(100vh - 300px)"}>
        <Card bordered={false} className="card-main-content">
          <SortableList
            cliparts={cliparts}
            setCustomClass={setCustomClass}
            customClass={customClass}
            refetch={refetch}
            uploads={uploads}
            loading={loading}
            updateName={updateName}
            edit={edit}
            setEdit={setEdit}
            axis="xy"
            distance={1}
            lockToContainerEdges={true}
            onSortEnd={onSortEnd}
            helperClass="row-dragging"
            useDragHandle={!category || category?.hasChild}
          />
        </Card>
      </Scrollbars>
      <Pagination style={{ padding: "20px 16px" }} {...pagination} />
    </Container>
  );
};

export default ClipartData;
