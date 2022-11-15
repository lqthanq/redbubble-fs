import { Modal } from "antd";
import React, { useState } from "react";
import Scrollbars from "./Scrollbars";

const ModalShowFile = ({ file, size = 300, showLarge = true }) => {
  const [viewLarge, setViewLarge] = useState(false);

  const handleOk = () => {
    setViewLarge(false);
  };

  return (
    <div>
      <div
        onClick={() => {
          if (showLarge && file?.key) {
            setViewLarge(true);
          }
        }}
        className="clipart"
        style={{
          cursor: showLarge && file?.key ? "pointer" : "default",
          backgroundImage: file?.key
            ? `url(${process.env.CDN_URL}/${size}x${size}/${file.key})`
            : "url(https://culturaltrust.org/wp-content/themes/oct/assets/img/no-img.png)",
        }}
      />
      <Modal
        className="modal-img"
        title="Basic Modal"
        visible={viewLarge}
        onOk={handleOk}
        onCancel={handleOk}
        width="80"
      >
        <Scrollbars style={{ height: "calc(100vh - 200px)" }}>
          <img
            style={{ width: "100%" }}
            src={`${process.env.CDN_URL}/autoxauto/${file?.key}`}
            alt="full-img"
          />
        </Scrollbars>
      </Modal>
    </div>
  );
};

export default ModalShowFile;
