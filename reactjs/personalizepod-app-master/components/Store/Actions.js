import { Dropdown, Menu, Modal, notification, Button } from "antd";
import { AiOutlineDisconnect, AiTwotoneDelete } from "react-icons/ai";
import { GrUpdate } from "react-icons/gr";
import {
  DISCONNECT_STORE,
  REMOVE_STORE,
  RECONNECT_STORE,
  UPDATE_WEBHOOK,
} from "graphql/mutate/store/mutationStore";
import { useMutation } from "@apollo/client";
import { get } from "lodash";
import {
  messageDelete,
  messageDisconnected,
} from "components/Utilities/message";
import { VscDebugDisconnect } from "react-icons/vsc";
import { IoIosArrowDown } from "react-icons/io";

const StoreAction = ({ store, refetch }) => {
  const id = store.id;
  const [disconnectStore, { loading: disconnectLoading }] = useMutation(
    DISCONNECT_STORE
  );
  const [updateStoreSettings, { loading: updateLoading }] = useMutation(
    UPDATE_WEBHOOK
  );
  const [reconnectStore, { loading: reconnectLoading }] = useMutation(
    RECONNECT_STORE
  );
  const [removeStore, { loading: removeLoading }] = useMutation(REMOVE_STORE);

  const handleRemoveStore = () => {
    Modal.error({
      title: "Are you sure to delete store?",
      onOk: () => {
        removeStore({
          variables: {
            id,
          },
        })
          .then(() => {
            messageDelete("Store");
            refetch();
          })
          .catch((err) => notification.error({ message: get(err, "Error") }));
      },
      okButtonProps: { removeLoading },
    });
  };

  const handleConfirmUpdate = () => {
    Modal.confirm({
      title: "Are you sure to update store webhook?",
      onOk: () => {
        updateStoreSettings({
          variables: { id },
        })
          .then(() => {
            notification.success({
              message: "The store webhook has been updated!",
            });
            refetch();
          })
          .catch((err) => notification.error({ message: err.message }));
      },
      okButtonProps: { loading: updateLoading },
      okText: "Update",
    });
  };

  const handleDisconnectStore = () => {
    Modal.warning({
      title: "Are you sure to disconnect store?",
      onOk: () => {
        disconnectStore({
          variables: {
            id,
          },
        })
          .then(() => {
            messageDisconnected("Store");
            refetch();
          })
          .catch((err) => notification.error({ message: err?.message }));
      },
      okButtonProps: { loading: disconnectLoading },
    });
  };

  const handleReconnectStore = () => {
    Modal.warning({
      title: "Are you sure to reconnect store?",
      onOk: () => {
        reconnectStore({
          variables: {
            id,
          },
        })
          .then((res) => (window.location = res?.data?.reconnectStore))
          .catch((err) => notification.error({ message: err?.message }));
      },
      okButtonProps: { loading: reconnectLoading },
    });
  };

  return (
    <Dropdown
      overlay={
        <Menu
          onClick={({ key }) => {
            switch (key) {
              case "webhook":
                return handleConfirmUpdate();
              case "disconnect":
                return handleDisconnectStore();
              case "reconnect":
                return handleReconnectStore();
              case "delete":
                return handleRemoveStore();
              default:
                break;
            }
          }}
        >
          <Menu.Item
            hidden={!store.status}
            key="disconnect"
            icon={<AiOutlineDisconnect className="anticon custom-icon" />}
          >
            Disconnect
          </Menu.Item>
          <Menu.Item
            hidden={store.status}
            key="reconnect"
            icon={<VscDebugDisconnect className="anticon custom-icon" />}
          >
            Reconnect
          </Menu.Item>
          <Menu.Item
            key="delete"
            icon={
              <AiTwotoneDelete className="anticon custom-icon delete-button-color" />
            }
          >
            Delete
          </Menu.Item>
          <Menu.Item key="webhook" icon={<GrUpdate className="anticon " />}>
            Update Webhook
          </Menu.Item>
        </Menu>
      }
      placement="bottomRight"
      arrow
    >
      <Button>
        Action <IoIosArrowDown className="anticon" />
      </Button>
    </Dropdown>
  );
};

export default StoreAction;
