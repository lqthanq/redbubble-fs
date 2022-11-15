import { Button, Divider, Modal, Popconfirm, Tooltip } from "antd";
import S3Image from "components/Utilities/S3Image";
import { useAppValue } from "context";
import { CloseOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import ChooseArtWorkModal from "./ChooseArtWorkModal";
import { CAMPAIGN } from "actions";
import { cloneDeep } from "@apollo/client/utilities";

const CampaignArtwork = ({ dispatchCampaign }) => {
  const [{ campaign }, dispatch] = useAppValue();
  const { productBases, baseSelected, selectedArtwork } = campaign;
  const [showArtWorks, setShowArtWorks] = useState(null);
  const [artwork, setArtwork] = useState(null);

  const onClose = () => {
    setShowArtWorks(null);
  };

  useEffect(() => {
    const getArtwork = baseSelected?.printAreas?.find(
      (printArea) => printArea.artwork
    );
    if (getArtwork) {
      dispatch({
        type: CAMPAIGN.SET_SELECTED_ARTWORK,
        payload: {
          printFileId: getArtwork.id,
          artworkId: getArtwork.artwork.id,
        },
      });
    } else {
      dispatch({
        type: CAMPAIGN.SET_SELECTED_ARTWORK,
        payload: {
          printFileId: null,
          artworkId: null,
        },
      });
    }
  }, [baseSelected.id]);

  const chooseArtwork = (artw) => {
    let newBase = { ...baseSelected };
    newBase.printAreas = newBase.printAreas.map((p) => {
      if (p.id === showArtWorks) {
        return {
          ...p,
          artwork: artw,
        };
      } else {
        return p;
      }
    });
    dispatchCampaign(
      productBases.map((el) => {
        if (el.id === newBase.id) {
          return newBase;
        } else {
          return el;
        }
      })
    );
    const printAreaHasArtwork = newBase.printAreas.find(
      (printArea) => printArea.artwork && showArtWorks === printArea.id
    );
    dispatch({
      type: CAMPAIGN.SET_SELECTED_ARTWORK,
      payload: {
        printFileId: showArtWorks,
        artworkId: printAreaHasArtwork.artwork.id,
      },
    });
    onClose();
  };

  const removeArtwork = (id) => {
    let newBase = cloneDeep(baseSelected);
    newBase.printAreas = newBase.printAreas.map((p) => {
      if (p.id === id) {
        delete p.artwork;
        return p;
      } else {
        return p;
      }
    });
    dispatchCampaign(
      productBases.map((el) => {
        if (el.id === newBase.id) {
          return newBase;
        } else {
          return el;
        }
      })
    );
    if (id === selectedArtwork.printFileId) {
      const printFileHasArtwork = newBase.printAreas.find(
        (printArea) => printArea.artwork
      );
      dispatch({
        type: CAMPAIGN.SET_SELECTED_ARTWORK,
        payload: {
          printFileId: !printFileHasArtwork ? null : printFileHasArtwork.id,
          artworkId: !printFileHasArtwork
            ? null
            : printFileHasArtwork.artwork.id,
        },
      });
    }
  };

  return (
    <div>
      {baseSelected?.printAreas?.map((printFile, index) => {
        return (
          <div key={printFile.id}>
            {printFile.artwork ? (
              <div
                style={{
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({
                    type: CAMPAIGN.SET_SELECTED_ARTWORK,
                    payload: {
                      printFileId: printFile.id,
                      artworkId: printFile.artwork?.id,
                    },
                  });
                }}
              >
                <h4 style={{ textTransform: "capitalize", marginTop: 10 }}>
                  {printFile.name}
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px auto 30px",
                    alignItems: "center",
                    borderRadius: 4,
                    border:
                      selectedArtwork.artworkId === printFile.artwork.id &&
                      selectedArtwork.printFileId === printFile.id
                        ? "1px dashed var(--primary-color)"
                        : "1px solid transparent",
                    backgroundColor:
                      selectedArtwork.artworkId === printFile.artwork.id &&
                      selectedArtwork.printFileId === printFile.id
                        ? "#fff"
                        : "transparent",
                  }}
                >
                  <div style={{ border: "0.5px solid darkgray" }}>
                    <S3Image
                      preview={false}
                      src={printFile.artwork.templates[0].preview}
                      style={{
                        height: 100,
                        objectFit: "contain",
                        display: "inherit",
                        backgroundColor: "hls(0,0,90%)",
                      }}
                    />
                  </div>
                  <span className="ml-15">
                    {printFile.artwork.templates[0].title}
                  </span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Popconfirm
                      overlayClassName="menu-action-base-popconfirm"
                      title="Are you sure to remove this print file?"
                      okButtonProps={{
                        danger: true,
                      }}
                      placement="right"
                      onConfirm={(e) => {
                        e.stopPropagation();
                        removeArtwork(printFile.id);
                      }}
                      cancelText="No"
                    >
                      <Tooltip title="Remove">
                        <CloseOutlined
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            color: "var(--error-color)",
                            float: "right",
                            marginRight: 15,
                          }}
                          className="custom-icon anticon"
                        />
                      </Tooltip>
                    </Popconfirm>
                  </div>
                </div>
                {baseSelected?.printAreas.length - 1 > index && (
                  <Divider type="horizontal" style={{ margin: "15px 0" }} />
                )}
              </div>
            ) : (
              <Button.Group
                style={{ marginTop: 10, display: "block" }}
                key={printFile.name}
                size="small"
              >
                <Button
                  style={{ width: 70 }}
                  type="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowArtWorks(null);
                  }}
                >
                  {printFile.name}
                </Button>
                <Button onClick={() => setShowArtWorks(printFile.id)}>
                  Choose an artwork
                </Button>
              </Button.Group>
            )}
          </div>
        );
      })}
      {showArtWorks && (
        <Modal
          title="Choose Artwork"
          visible={showArtWorks ? true : false}
          onOk={() => chooseArtwork(artwork)}
          okButtonProps={{ disabled: artwork ? false : true }}
          width="90%"
          onCancel={onClose}
          className="modal-choose-artwork"
        >
          <ChooseArtWorkModal
            onOk={(artw) => chooseArtwork(artw)}
            onChange={(a) => setArtwork(a)}
          />
        </Modal>
      )}
    </div>
  );
};

export default CampaignArtwork;
