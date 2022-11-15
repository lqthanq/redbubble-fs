import { Button, Dropdown, Menu, notification, Popconfirm } from "antd";
import React, { useState } from "react";
import { AiTwotoneDelete, AiOutlineReload } from "react-icons/ai";
import { BiEditAlt, BiUpload } from "react-icons/bi";
import { HiDuplicate } from "react-icons/hi";
import styled from "styled-components";
import {
  DELETE_CAMPAIGN,
  RETRY_PUSH_CAMPAIGN,
  DUPLICATE_CAMPAIGN,
} from "graphql/mutate/campaign/campaignAction";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import {
  messageDelete,
  messageDuplicate,
  messageRetry,
} from "components/Utilities/message";
import { IoIosArrowDown } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import PushCampaignModal from "./PushCampaignModal";
import { useAppValue } from "context";
import { CAMPAIGN } from "actions";
import { permissions } from "components/Utilities/Permissions";
import { permissionCheck } from "components/Utilities/PermissionCheck";

const Container = styled.div``;
const CampaignAction = ({ record, refetch, layoutTable }) => {
  const [{ campaign }, dispatch] = useAppValue();
  const { productInput } = campaign;
  const router = useRouter();
  const [deleteProduct] = useMutation(DELETE_CAMPAIGN);
  const [retryPushCampaign] = useMutation(RETRY_PUSH_CAMPAIGN);
  const [duplicateCampaign] = useMutation(DUPLICATE_CAMPAIGN);
  const [pushModal, setPushModal] = useState(false);

  const onConfirm = (value) => {
    switch (value) {
      case "delete":
        deleteProduct({ variables: { id: record.id } })
          .then(() => {
            messageDelete("Campaign");
            refetch();
          })
          .catch((err) => notification.error({ message: err.message }));
        return;
      case "duplicate":
        duplicateCampaign({ variables: { id: record.id } })
          .then(() => {
            messageDuplicate("Campaign");
            refetch();
          })
          .catch((err) => notification.error({ message: err.message }));
        return;
      default:
        retryPushCampaign({ variables: { id: record.id } })
          .then(() => {
            messageRetry("Campaign");
            refetch();
          })
          .catch((err) => notification.error({ message: err.message }));
        return;
    }
  };

  const editBase = () => (
    <div
      onClick={() => router.push("/campaigns/[id]", `/campaigns/${record.id}`)}
    >
      <BiEditAlt className="custom-icon anticon" style={{ marginRight: 5 }} />{" "}
      Edit
    </div>
  );

  const campaignAction = [
    {
      title: "duplicate",
      icon: <HiDuplicate className="custom-icon anticon" />,
      permission: permissions.CampaignCreate,
    },
    {
      title: "retry",
      icon: <AiOutlineReload className="custom-icon anticon" />,
      permission: permissions.CampaignUpdate,
    },
    {
      title: "quick push",
      icon: <BiUpload className="custom-icon anticon" />,
      permission: permissions.CampaignUpdate,
    },
    {
      title: "delete",
      icon: (
        <AiTwotoneDelete
          style={{ color: "var(--error-color)" }}
          className="custom-icon anticon"
        />
      ),
      permission: permissions.CampaignDelete,
    },
  ];

  return (
    <Container>
      <Dropdown
        placement="bottomRight"
        disabled={record?.status === "Processing" ? true : false}
        overlay={
          <Menu style={{ border: "1px solid #e8e6e6" }}>
            <Menu.Item>{editBase()}</Menu.Item>
            {campaignAction.map((item) => (
              <Menu.Item
                hidden={
                  (item.title === "duplicate" && record?.status === "Error") ||
                  (item.title === "retry" && record?.status !== "Error") ||
                  !permissionCheck(item.permission)
                }
                key={item.title}
              >
                {item.title === "delete" ? (
                  <Menu
                    style={{
                      position: "absolute",
                      width: "100%",
                      top: 97,
                      left: 0,
                    }}
                  >
                    <Menu.Divider />
                  </Menu>
                ) : null}
                {item.title === "quick push" ? (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setPushModal(true);
                      dispatch({
                        type: CAMPAIGN.SET,
                        payload: {
                          campaign: {
                            ...campaign,
                            productInput: {
                              ...record,
                              productId: record?.products[0]?.id,
                              campaignId: record?.id,
                              updatedAt: record?.updatedAt,
                            },
                          },
                        },
                      });
                    }}
                  >
                    {item.icon}
                    <span
                      style={{
                        textTransform: "capitalize",
                        marginLeft: 8,
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                ) : (
                  <Popconfirm
                    overlayClassName="menu-action-base-popconfirm"
                    title={`Are you sure to ${item.title} this campaign?`}
                    placement="topRight"
                    onConfirm={() => onConfirm(item.title)}
                    cancelText="No"
                    okButtonProps={{
                      danger: item.title === "delete",
                    }}
                  >
                    {item.icon}
                    <span
                      style={{
                        textTransform: "capitalize",
                        color:
                          item.title === "delete"
                            ? "var(--error-color)"
                            : "#454f5b",
                      }}
                    >
                      {item.title}
                    </span>
                  </Popconfirm>
                )}
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        <Button style={{ padding: layoutTable ? "auto" : 8 }}>
          {layoutTable ? (
            <>
              Action
              <IoIosArrowDown style={{ marginLeft: 8 }} className="anticon" />
            </>
          ) : (
            <BsThreeDotsVertical size="18px" className="anticon" />
          )}
        </Button>
      </Dropdown>
      {record?.id === productInput?.campaignId ? (
        <PushCampaignModal
          key={record.id}
          pushModal={pushModal}
          setPushModal={setPushModal}
          campaignItem={record}
        />
      ) : null}
    </Container>
  );
};

export default CampaignAction;
