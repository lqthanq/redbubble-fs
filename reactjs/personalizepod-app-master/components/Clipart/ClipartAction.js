import { Button, notification } from "antd";
import CustomizePopconfirm from "components/Utilities/CustomizePopconfirm";
import { useMutation } from "@apollo/client";
import { AiTwotoneDelete } from "react-icons/ai";
import { DELETE_CLIPART } from "graphql/mutate/clipart/clipartAction";
import { messageDelete } from "components/Utilities/message";

const ClipartAction = ({ clipart, setCustomClass, refetch, placement }) => {
  const [deleteClipart] = useMutation(DELETE_CLIPART);
  const deleteArt = () => {
    deleteClipart({
      variables: { id: clipart.id },
    })
      .then(() => {
        messageDelete("Clipart");
        refetch();
      })
      .catch(() => notification.error({ message: err.message }));
  };

  return (
    <div className="align-action">
      <CustomizePopconfirm
        okButtonProps={{
          danger: true,
        }}
        placementPopconfirm="topRight"
        onClick={() => setCustomClass(clipart.id)}
        title="Are you sure to delete clipart?"
        onConfirm={() => deleteArt()}
        icon={
          <Button
            className="btn-action"
            type="link"
            size="small"
            icon={
              <AiTwotoneDelete className="custom-icon anticon delete-button-color" />
            }
          />
        }
        tooltip={"Delete"}
      />
    </div>
  );
};

export default ClipartAction;
