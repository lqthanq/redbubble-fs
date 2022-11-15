import { Button, Divider, Image, notification, Modal, Tooltip } from "antd";
import MediaSelector from "components/Media/MediaSelector";
import { messageSave } from "components/Utilities/message";
import { UPLOAD_DESIGN } from "graphql/mutate/order/orderAction";
import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import {
  AiOutlineDownload,
  AiOutlineEye,
  AiOutlineUpload,
} from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";
import { REGENDER_PRINTFILE } from "graphql/mutate/order/orderAction";
import { LoadingOutlined } from "@ant-design/icons";
import { HiOutlineExternalLink } from "react-icons/hi";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const OrderDesignFile = ({ order, refetch }) => {
  const [designs, setDesigns] = useState([]);
  const [customModal, setCustomModal] = useState({
    visible: false,
    type: null,
    applyTo: null,
  });
  const [Rengender, { loading: loadingRegender }] = useMutation(
    REGENDER_PRINTFILE
  );
  const [viewImage, setViewImage] = useState(null);
  const [uploadDesign, { loading }] = useMutation(UPLOAD_DESIGN);

  useEffect(() => {
    if (order) {
      setDesigns(order.designs);
    }
  }, [order]);

  const handleRegender = (id) => {
    if (id) {
      Rengender({
        variables: {
          designID: id,
          orderId: order.id,
        },
      }).catch((err) => notification.error({ message: err.message }));
    } else {
      Rengender({
        variables: {
          orderId: order.id,
        },
      }).catch((err) => notification.error({ message: err.message }));
    }
  };
  return (
    <div>
      {designs?.map((design, index) => {
        const imageFile = `${process.env.CDN_URL}/500x500/${design.file?.key}`;
        const fileOriginal = `${process.env.CDN_URL}/autoxauto/${design.file?.key}`;
        return (
          <div key={design.id}>
            <div className="flex space-between item-center">
              <span>{design.name}</span>
              <div>
                <AuthElement name={permissions.OrderUpdate}>
                  <Button
                    onClick={() => handleRegender(design.id)}
                    type="link"
                    icon={
                      ["Processing", "Pending"].includes(design.status) ? (
                        <LoadingOutlined />
                      ) : (
                        <FiRefreshCw className="anticon custom-icon" />
                      )
                    }
                    disabled={
                      ["InProduction", "Fulfilled"].includes(order.status) ||
                      ["Processing", "Pending"].includes(design.status)
                    }
                  >
                    {["Processing", "Pending"].includes(design.status)
                      ? design.status
                      : "Regenerate"}
                  </Button>
                </AuthElement>
                <Button
                  type="link"
                  disabled={
                    !design.file ||
                    ["Processing", "Pending"].includes(design.status)
                  }
                  onClick={() => window.open(fileOriginal, "_blank")}
                  icon={<AiOutlineDownload className="anticon custom-icon" />}
                >
                  Download
                </Button>
                <AuthElement name={permissions.OrderUploadDesign}>
                  <Button
                    type="link"
                    icon={<AiOutlineUpload className="anticon custom-icon" />}
                    onClick={() => {
                      setCustomModal({
                        visible: true,
                        type: "upload",
                        applyTo: index,
                      });
                    }}
                    disabled={
                      ["InProduction", "Fulfilled"].includes(order.status) ||
                      ["Processing", "Pending"].includes(design.status)
                    }
                  >
                    Upload custom
                  </Button>
                </AuthElement>
              </div>
            </div>
            <div
              className="flex content-center"
              style={{
                background: "lightgray",
                boxShadow:
                  "0 0 0 1px rgb(63 63 68 / 5%), 0 1px 3px 0 rgb(63 63 68 / 15%)",
              }}
            >
              {loading ? (
                <div className="screen-loading">
                  <div className="bounceball"></div>
                  <p
                    style={{
                      fontSize: 20,
                      marginBottom: 0,
                      lineHeight: 37,
                      marginLeft: 10,
                    }}
                  >
                    Your design is uploading. Please wait for completion!
                  </p>
                </div>
              ) : (
                <Image
                  style={{ backgroundColor: "#f5f5f5", objectFit: "contain" }}
                  width="auto"
                  height="auto"
                  preview={{
                    mask: (
                      <div>
                        <div className="flex item-center">
                          <AiOutlineEye /> Preview
                        </div>
                        <Tooltip title="View original">
                          <a
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            href={fileOriginal}
                            style={{
                              zIndex: 200000,
                              position: "absolute",
                              right: 0,
                              top: 0,
                            }}
                          >
                            <HiOutlineExternalLink
                              style={{
                                color: "white",
                                size: 30,
                              }}
                              className="anticon custom-icon"
                            />
                          </a>
                        </Tooltip>
                      </div>
                    ),
                    src: fileOriginal,
                  }}
                  src={imageFile}
                  fallback={`/images/default-img.png`}
                />
              )}
            </div>
            {designs?.length - 1 > index && <Divider type="horizontal" />}
          </div>
        );
      })}
      <div style={{ textAlign: "right" }}>
        <AuthElement name={permissions.OrderUpdate}>
          <Button
            hidden={!order?.designs?.length.toString()}
            className="mt-15"
            onClick={() => handleRegender()}
            loading={loadingRegender}
            disabled={designs.some((ds) =>
              ["Pending", "Processing"].includes(ds.status)
            )}
          >
            Re-generate all
          </Button>
        </AuthElement>
      </div>
      <MediaSelector
        visible={customModal.visible}
        onCancel={() =>
          setCustomModal({
            visible: false,
            type: null,
            apllyTo: null,
          })
        }
        accept=".jpg,.jpeg,.png"
        multiple={false}
        onChange={(files) => {
          const newDesigns = [...designs];
          newDesigns[customModal.applyTo] = {
            ...newDesigns[customModal.applyTo],
            file: files[0],
          };
          setDesigns(newDesigns);
          const designInput = newDesigns.map((ds) => {
            return {
              designId: ds.id,
              fileId: ds.file ? ds.file.id : null,
            };
          });
          uploadDesign({
            variables: {
              orderId: order.id,
              input: designInput.filter((item) => item.fileId),
            },
          })
            .then(() => {
              messageSave("Design");
              setCustomModal({
                visible: false,
                type: null,
                apllyTo: null,
              });
              refetch();
            })
            .catch((err) => notification.error({ message: err.message }));
        }}
      />
      <Modal
        title="Design"
        visible={viewImage}
        footer={null}
        onCancel={() => setViewImage(false)}
      >
        <div className="align-center">
          <img
            src={viewImage}
            style={{
              backgroundColor: "#f5f5f5",
              objectFit: "contain",
              width: "100%",
              height: "100%",
              marginBottom: 15,
            }}
          />
          <a href={viewImage} target="_blank">
            View design
          </a>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDesignFile;
