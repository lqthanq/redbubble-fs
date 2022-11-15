import { Button, Modal, notification, Spin, Table, Tag, Tooltip } from "antd";
import { useAppValue } from "context";
import { PUSH_CAMPAIGN } from "graphql/mutate/campaign/campaignAction";
import { cloneDeep, get, sum } from "lodash";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Scrollbars from "react-custom-scrollbars";
import { useRouter } from "next/router";
import moment from "moment";
import {
  CAMPAIGN_BY_ID,
  CAMPAIGN_STORE_UPDATING_SUPSCRIPTION,
} from "graphql/queries/campaign/campaignQuery";
import stores from "graphql/queries/stores";
import { LoadingOutlined } from "@ant-design/icons";
import { publishedStatus } from "./PublishedStores";
import { FaEye } from "react-icons/fa";

const PushCampaignModal = ({ pushModal, setPushModal, campaignItem }) => {
  const router = useRouter();
  const id = campaignItem ? campaignItem.id : get(router, "query.id", null);
  const [campaignStoresData, setCampaignStoresData] = useState([]);
  const [{ campaign, sellerId }] = useAppValue();
  const { productInput } = campaign;
  const [processing, setProcessing] = useState();
  const { data, loading, error } = useQuery(stores, {
    variables: { filter: { status: true, sellerId } },
  });
  const {
    data: campaignData,
    loading: campaignLoading,
    subscribeToMore,
  } = useQuery(CAMPAIGN_BY_ID, {
    variables: { id: id ?? productInput.campaignId },
    skip: !(id || productInput.campaignId) || !pushModal,
  });
  const [pushCampaign, { loading: pushLoading }] = useMutation(PUSH_CAMPAIGN);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const getId = id || productInput.campaignId;

  useEffect(() => {
    if (campaignData) {
      const newCampaignStoresData = data?.stores?.hits.map((store) => {
        const matchStore = campaignData.campaign?.campaignStores?.find(
          (el) => el.storeId === store.id
        );
        if (matchStore) {
          return {
            id: store.id,
            domain: store.domain,
            title: store.title,
            campaignStoreId: matchStore.id,
            status: matchStore.status,
            pushStatus: matchStore.pushStatus,
            updatedAt: campaignData.campaign?.updatedAt,
            pushedAt: matchStore.pushedAt,
            permaLink: matchStore.permaLink,
          };
        }
        return {
          id: store.id,
          domain: store.domain,
          title: store.title,
          status: "none",
          permaLink: null,
          updatedAt: campaignData.campaign?.updatedAt,
          pushedAt: null,
        };
      });
      setCampaignStoresData(newCampaignStoresData);
    }
  }, [campaignData]);

  useEffect(() => {
    if (subscribeToMore && campaignData) {
      subscribeToMore({
        document: CAMPAIGN_STORE_UPDATING_SUPSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (
            !subscriptionData?.data?.CampaignStoreUpdating ||
            subscriptionData?.data?.CampaignStoreUpdating.campaignId !== getId
          )
            return prev;
          var newCampaign = cloneDeep(prev.campaign);
          const oldStoreIndex = newCampaign.campaignStores.findIndex(
            (store) =>
              store.storeId ===
              subscriptionData?.data?.CampaignStoreUpdating?.storeId
          );
          if (oldStoreIndex >= 0) {
            newCampaign.campaignStores[oldStoreIndex] = {
              ...newCampaign.campaignStores[oldStoreIndex],
              ...subscriptionData?.data?.CampaignStoreUpdating,
            };
          } else {
            newCampaign.campaignStores.push({
              ...subscriptionData?.data?.CampaignStoreUpdating,
            });
          }
          setProcessing();
          return {
            campaign: newCampaign,
          };
        },
      });
    }
  }, [campaignData]);

  const pushCampaignAction = (storeIds) => {
    pushCampaign({
      variables: {
        id: id ?? productInput.campaignId,
        storeIds,
      },
    })
      .then(() => {
        setSelectedRowKeys([]);
      })
      .catch((err) => notification.error({ message: err.message }));
  };

  const parseTime = (abc) => {
    if (moment().format("MMM Do YY") === moment(abc).format("MMM Do YY")) {
      return moment(abc).fromNow();
    }
    return moment(abc).format("DD MMM YYYY");
  };

  const columns = [
    {
      title: "Store",
      dataIndex: "title",
      width: 200,
      key: "title",
      render: (title, record) =>
        record?.permaLink ? (
          <div className="flex item-center">
            <a target="_blank" href={record.domain}>
              {title}
            </a>
            <Tooltip title="Link to product">
              <a
                className="ml-15 flex item-center"
                target="_blank"
                href={record.permaLink}
              >
                <FaEye className="anticon" />
              </a>
            </Tooltip>
          </div>
        ) : (
          <a target="_blank" href={record.domain}>
            {title}
          </a>
        ),
    },
    {
      title: "Published",
      key: "pushedAt",
      dataIndex: "pushedAt",
      width: 150,
      render: (pushedAt) => (pushedAt ? parseTime(pushedAt) : "None"),
    },
    {
      title: "Campaign Updated",
      dataIndex: "updatedAt",
      width: 150,
      key: "updatedAt",
      render: (updatedAt) => parseTime(updatedAt),
    },
    {
      title: "Status",
      width: 80,
      key: "status",
      dataIndex: "status",
      render: (status, record) => {
        const matchStatus = publishedStatus.find(
          (item) => item.status === status
        );
        const itemError = record.pushStatus === "Error";
        return (
          <Tag
            style={{
              color: matchStatus ? matchStatus.color : "#2c404b",
              border: `1px solid ${
                itemError
                  ? "#efa2ad"
                  : matchStatus
                  ? matchStatus.border
                  : "#007868"
              }`,
            }}
            color={
              itemError
                ? "#efa2ad"
                : matchStatus
                ? matchStatus?.bgColor
                : "#8abcb3"
            }
          >
            {matchStatus
              ? `${matchStatus?.title} ${itemError ? "error" : ""}`
              : `Push new ${itemError ? "error" : ""}`}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      width: 150,
      align: "right",
      key: "action",
      render: (record) => {
        switch (record.pushStatus || processing) {
          case "Pushing":
          case "Processing":
          case "Pending":
            return (
              <div style={{ lineHeight: "36px" }}>
                <Spin
                  className="mr-15"
                  indicator={<LoadingOutlined className="anticon" spin />}
                />

                {record.pushStatus === "Pending" ||
                processing === `Processing-${record.id}`
                  ? "Processing"
                  : record.pushStatus}
              </div>
            );
          default:
            return (
              <Button
                disabled={record.status === "Latest"}
                type="primary"
                onClick={() => {
                  setProcessing(`Processing-${record.id}`);
                  pushCampaignAction([record.id]);
                }}
              >
                {record.pushStatus === "Error" ? "Retry" : "Push"}
              </Button>
            );
        }
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled:
        ["Latest"].includes(record.status) ||
        ["Processing", "Pushing", "Pending"].includes(record.pushStatus),
    }),
  };

  const tableWidth = sum(columns.map((c) => c.width));

  if (error || loading || campaignLoading) return null;

  return (
    <Modal
      width={800}
      visible={pushModal}
      title="Select stores"
      okText="Push to selected stores"
      okButtonProps={{
        disabled: !selectedRowKeys.length,
        loading: pushLoading,
      }}
      cancelText="Close"
      onCancel={() => {
        setPushModal(false);
        setSelectedRowKeys([]);
      }}
      onOk={() => pushCampaignAction(selectedRowKeys)}
    >
      <Scrollbars autoHeight autoHeightMax={"calc(100vh - 500px)"}>
        <Table
          size="small"
          rowKey="id"
          scroll={{ x: tableWidth }}
          pagination={false}
          dataSource={campaignStoresData}
          columns={columns}
          rowSelection={rowSelection}
        />
      </Scrollbars>
    </Modal>
  );
};

export default PushCampaignModal;
