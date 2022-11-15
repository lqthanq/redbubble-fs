import { List, Menu } from "antd";
import React from "react";
import { BiText } from "react-icons/bi";
import { FaFolderOpen, FaImage } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { useAppValue } from "../../context";

const SharedLayerSelector = ({ onSelect = () => {} }) => {
  const [{ workspace }] = useAppValue();
  const { artwork } = workspace;
  const { sharedLayers } = artwork;
  return (
    <List
      style={{ width: 200 }}
      dataSource={sharedLayers}
      renderItem={(layer) => (
        <List.Item
          style={{ cursor: "pointer" }}
          key={layer.id}
          onClick={() => onSelect(layer)}
        >
          {layer.type === "Text" && <BiText className="anticon" />}
          {layer.type === "Image" && <FaImage className="anticon" />}
          {layer.type === "Option" && <IoMdOptions className="anticon" />}
          {layer.type === "Group" && <FaFolderOpen className="anticon" />}{" "}
          {layer.title}
        </List.Item>
      )}
    ></List>
  );
};

export default SharedLayerSelector;
