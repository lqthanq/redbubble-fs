import { Divider, notification, Tooltip } from "antd";
import Link from "next/link";
import CustomizePopconfirm from "components/Utilities/CustomizePopconfirm";
import changeLockStatus from "graphql/mutate/changeLockStatus";
import deleteArtwork from "graphql/mutate/deleteArtwork";
import { useMutation } from "@apollo/client";
import { AiTwotoneDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { HiDuplicate } from "react-icons/hi";
import { TiLockClosed, TiLockOpen } from "react-icons/ti";
import duplicateArtwork from "graphql/mutate/duplicateArtwork";
import {
  messageChange,
  messageDelete,
  messageDuplicate,
} from "components/Utilities/message";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";
import { permissionCheck } from "components/Utilities/PermissionCheck";

const ArtWorkAction = ({
  lockAction = false,
  artwork,
  setCustomClass,
  refetch,
}) => {
  const [ChangeLockStatus] = useMutation(changeLockStatus);
  const [DeleteArtwork] = useMutation(deleteArtwork);
  const [DuplicateArtwork] = useMutation(duplicateArtwork);

  const changeLock = () => {
    ChangeLockStatus({
      variables: { id: artwork.id, status: !artwork.lock },
    })
      .then(() => {
        messageChange("Artwork");
        refetch();
      })
      .catch((err) => notification.error({ message: err.message }));
  };

  const deleteArt = (id) => {
    DeleteArtwork({
      variables: { id: artwork.id },
    })
      .then(() => {
        messageDelete("Artwork");
        refetch();
      })
      .catch((err) => notification.error({ message: err.message }));
  };
  const cloneArt = () => {
    DuplicateArtwork({
      variables: { id: artwork.id },
    })
      .then(() => {
        messageDuplicate("Artwork");
        refetch();
      })
      .catch((err) => notification.error({ message: err.message }));
  };

  return (
    <div>
      {lockAction ? (
        <AuthElement name={permissions.ArtworkUpdate}>
          <CustomizePopconfirm
            title="Are you sure to change lock?"
            onConfirm={() => changeLock(artwork.id, artwork.lock)}
            icon={
              artwork.lock ? (
                <TiLockClosed className="custom-icon anticon" />
              ) : (
                <TiLockOpen className="custom-icon anticon" />
              )
            }
            tooltip={artwork.lock ? "Unlock" : "Lock"}
          />
        </AuthElement>
      ) : (
        <div className="align-action flex item-center">
          {!artwork.lock && (
            <>
              <Link
                href="/artworks/[id]/design"
                as={`/artworks/${artwork.id}/design`}
              >
                <Tooltip title="Edit">
                  <BiEditAlt className="custom-icon anticon" />
                </Tooltip>
              </Link>
              <AuthElement name={permissions.ArtworkCreate}>
                <Divider type="vertical" />
              </AuthElement>
            </>
          )}
          <AuthElement name={permissions.ArtworkCreate}>
            <CustomizePopconfirm
              placementPopconfirm="topRight"
              onClick={() => setCustomClass(artwork.id)}
              title="Are you sure to duplicate artwork?"
              onConfirm={() => cloneArt()}
              icon={<HiDuplicate className="custom-icon anticon" />}
              tooltip={"Duplicate"}
            />
          </AuthElement>
          {permissionCheck(permissions.DeleteArtwork) ? (
            <>
              <Divider type="vertical" />
              <CustomizePopconfirm
                placementPopconfirm="topRight"
                onClick={() => setCustomClass(artwork.id)}
                title="Are you sure to delete artwork?"
                okButtonProps={{
                  danger: true,
                }}
                onConfirm={() => deleteArt()}
                icon={
                  <AiTwotoneDelete className="custom-icon anticon delete-button-color" />
                }
                tooltip={"Delete"}
              />
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ArtWorkAction;
