import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/client";
import clipartsQuery from "../../graphql/queries/cliparts";
import clipartCategory from "../../graphql/queries/clipartCategory";
import createClipartMutate from "../../graphql/mutate/createClipart";
import { message, Button, Image, notification } from "antd";
import CustomizeMainContent from "components/Utilities/CustomizeMainContent";
import { get, remove } from "lodash";
import { useRouter } from "next/router";
import ClipartAction from "./ClipartAction";
import moment from "moment";
import ImportFolder from "components/Media/ImprotFolder";
import EditText from "components/Utilities/EditText";
import ClipartData from "./ClipartData";
import MediaSelector from "components/Media/MediaSelector";
import {
  UPDATE_CLIPART_ORDERS,
  UPDATE_CLIPART_TITLE,
} from "graphql/mutate/clipart/clipartAction";
import ClipartCategoryDisplaySetting from "./ClipartCategoryDisplaySetting";
import CustomizeAvatarOwner from "components/Utilities/CustomizeAvatarOwner";
import { messageSave } from "components/Utilities/message";
import { useAppValue } from "context";
import { isAdmin } from "components/Utilities/isAdmin";
import ClipartColor from "./ClipartColor";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";
import {
  arrayMove,
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { BiMoveVertical } from "react-icons/bi";

const Container = styled.div`
  border-left: 0.1rem solid #dfe3e8;
`;

const DragHandle = sortableHandle(() => (
  <BiMoveVertical className="anticon custom-icon" style={{ fontSize: 15 }} />
));

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);
const DraggableBodyRow = ({ dataSource, className, style, ...restProps }) => {
  const index = dataSource?.findIndex(
    (x) => x.id === restProps["data-row-key"]
  );
  return <SortableItem index={index} {...restProps} />;
};
const DraggableContainer = (props) => {
  const { onSortEnd } = props;
  return (
    <SortableContainer
      useDragHandle
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
      lockAxis="y"
    />
  );
};

const Cliparts = ({ categoryID }) => {
  const router = useRouter();
  const [{ sellerId }] = useAppValue();
  const handleCheckFilter = (clipartFilter) => {
    if (!categoryID && !router.query.categoryID) {
      delete clipartFilter.categoryID;
    }
    clipartFilter.page = +clipartFilter.page;
    return clipartFilter;
  };
  const [category, setCategory] = useState(null);
  const [edit, setEdit] = useState(false);
  const [cliparts, setCliparts] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [customClass, setCustomClass] = useState(false);
  const [uploadFile, showUploadFile] = useState(false);
  const [filter, setFilter] = useState(
    handleCheckFilter({
      ...router.query,
      pageSize: 24,
      categoryID: [categoryID],
      page: get(router, "query.page", 1),
      search: get(router, "query.search", null),
    })
  );

  const { data, loading, error, refetch } = useQuery(clipartsQuery, {
    variables: { ...filter, sellerId },
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setCliparts(data.cliparts.hits);
    },
  });

  const [createClipartMutation, { loading: mutationLoading }] = useMutation(
    createClipartMutate
  );
  const [updateClipartTitle] = useMutation(UPDATE_CLIPART_TITLE);
  const [updateClipartOrders] = useMutation(UPDATE_CLIPART_ORDERS);

  const refetchData = () => {
    refetch().then((res) => {
      setCliparts(res.data.cliparts.hits);
    });
  };

  const updateName = (id, title) => {
    updateClipartTitle({
      variables: {
        id,
        title,
      },
    })
      .then(() => {
        messageSave("Clipart");
        refetchData();
      })
      .catch((err) => message.error(err.message));
  };

  useEffect(() => {
    setEdit(false);
    setFilter(
      handleCheckFilter({
        ...filter,
        ...router.query,
        categoryID: [router.query.categoryID],
        page: 1,
      })
    );
  }, [router.query.categoryID]);

  const pagination = {
    total: data?.cliparts.count,
    pageSize: filter.pageSize,
    current: +get(router, "query.page", 1),
    onChange: (page, pageSize) => {
      setFilter({ ...filter, pageSize, page });
      router.query.page = page;
      router.push(router);
    },
    showTotal: (total, range, a) =>
      `${range[0]} to ${range[1]} of ${total} items`,
  };

  const createClipart = (file) => {
    createClipartMutation({
      variables: {
        title: file.fileName,
        file: {
          id: file.id,
          key: file.key,
          fileName: file.fileName,
          fileMime: file.fileMime,
          fileSize: file.fileSize,
          type: "clipart",
        },
        categoryID: categoryID,
      },
    })
      .then((res) => {
        remove(uploads, (f) => f.uid === file.uid);
        setUploads(uploads);
        setCliparts([...cliparts, res.data.createClipart]);
        messageSave("Clipart");
        refetchData();
      })
      .catch((err) => message.error(err.message));
  };

  const columns = [
    {
      title: "File",
      key: "file",
      width: 400,
      className: "edit-action drag-visible",
      render: (record) => (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "90px calc(100% - 90px)",
            alignItems: "center",
          }}
        >
          <Image
            className={`preview-color-${record.id}`}
            style={{ backgroundColor: "#f5f5f5", objectFit: "contain" }}
            width="90px"
            height="90px"
            preview={{
              src: `${process.env.CDN_URL}/autoxauto/${record?.file?.key}`,
            }}
            src={`${process.env.CDN_URL}/100x100/${record?.file?.key}`}
          />
          <span className="ml-15">
            <EditText
              updateName={(id, title) => updateName(id, title)}
              edit={edit}
              setEdit={setEdit}
              defaultValue={record.title}
              record={record}
            />
          </span>
        </div>
      ),
    },
    {
      title: "Color",
      key: "color",
      className: "drag-visible",
      width: 200,
      render: (record) => (
        <ClipartColor list={true} refetchData={refetchData} record={record} />
      ),
    },
    {
      title: isAdmin() ? "Seller" : "Author",
      className: "drag-visible",
      key: "author",
      dataIndex: "author",
      width: 200,
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
      className: "drag-visible",
      dataIndex: "createdAt",
      width: 150,
      render: (createdAt) => moment(createdAt).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      width: 100,
      className: "drag-visible",
      key: "action",
      align: "right",
      render: (record) => (
        <AuthElement name={permissions.ClipartDelete}>
          <ClipartAction
            setCustomClass={setCustomClass}
            refetch={refetchData}
            clipart={record}
          />
        </AuthElement>
      ),
    },
  ];

  if (category && !category.hasChild) {
    columns.unshift({
      title: "",
      dataIndex: "sort",
      width: 30,
      className: "drag-visible",
      render: () => <DragHandle />,
    });
  }

  const { data: clipartCategroryData } = useQuery(clipartCategory, {
    variables: { id: categoryID },
    skip: !categoryID,
  });

  useEffect(() => {
    if (clipartCategroryData) {
      setCategory(clipartCategroryData.clipartCategory);
    } else if (!categoryID) {
      setCategory();
    }
  }, [clipartCategroryData]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newCliparts = arrayMove(cliparts, oldIndex, newIndex);
    setCliparts(newCliparts);
    updateClipartOrders({
      variables: {
        input: newCliparts.map((item, index) => {
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

  if (error) return `${error.message}`;

  return (
    <Container className="p-15-24 system-background">
      <CustomizeMainContent
        components={
          !category || category.hasChild
            ? {}
            : {
                body: {
                  wrapper: (props) => (
                    <DraggableContainer {...props} onSortEnd={onSortEnd} />
                  ),
                  row: (restProps) => (
                    <DraggableBodyRow {...restProps} dataSource={cliparts} />
                  ),
                },
              }
        }
        uploadFile={uploadFile}
        headerTitle={category?.title || "All cliparts"}
        headerButton={
          <div className="flex w-100 space-between">
            <div className="flex">
              <AuthElement name={permissions.ClipartCreate}>
                <Button
                  type="primary"
                  disabled={!category || category.hasChild}
                  onClick={() => showUploadFile(true)}
                  style={{ marginRight: 10 }}
                >
                  Add New
                </Button>
                <ImportFolder
                  parent={categoryID}
                  onCompleted={() => {
                    refetchData();
                  }}
                />
              </AuthElement>
            </div>
            <AuthElement name={permissions.ClipartUpdate}>
              <Button
                onClick={() => {
                  router.query.settings = 1;
                  router.push(router);
                }}
                type="primary"
                disabled={!categoryID}
              >
                Settings
              </Button>
            </AuthElement>
          </div>
        }
        headerExpand={
          <MediaSelector
            onChange={(files) => files.forEach((file) => createClipart(file))}
            multiple={true}
            visible={uploadFile}
            onCancel={() => {
              if (!mutationLoading) {
                showUploadFile(false);
              }
            }}
            accept=".png"
            fileType="clipart"
          />
        }
        loading={loading}
        dataSource={cliparts}
        columns={columns}
        refetch={refetchData}
        pagination={pagination}
        customLayout={true}
        filterContainer={<div />}
        filter={filter}
        setFilter={setFilter}
        multipleFilter={false}
      >
        <ClipartData
          filter={filter}
          category={category}
          pagination={pagination}
          edit={edit}
          setEdit={setEdit}
          updateName={updateName}
          cliparts={cliparts}
          setCustomClass={setCustomClass}
          customClass={customClass}
          refetch={refetchData}
          uploads={uploads}
          loading={loading}
          setCliparts={setCliparts}
        />
      </CustomizeMainContent>
      <ClipartCategoryDisplaySetting />
    </Container>
  );
};

export default Cliparts;
