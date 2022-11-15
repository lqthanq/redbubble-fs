import { Button, Card, Image, Input, Tooltip } from "antd";
import { FileIcon } from "react-file-icon";
import mime from "mime-types";
import Meta from "antd/lib/card/Meta";
import ClipartAction from "components/Clipart/ClipartAction";
import { useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import ClipartColor from "components/Clipart/ClipartColor";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const File = ({
  file,
  clipart,
  refetch,
  customClass,
  setCustomClass,
  updateName,
  edit,
  setEdit,
}) => {
  const [text, setText] = useState();

  return (
    <Card
      className={
        customClass === clipart.id ? "card-item" : "custom-action card-item"
      }
      cover={((key, type) => {
        if (key && type.indexOf("image/") === 0) {
          return (
            <div>
              <ClipartColor record={clipart} refetchData={refetch} />
              <Image
                style={{ backgroundColor: "#f5f5f5", objectFit: "contain" }}
                width="100%"
                height="250px"
                fallback={`/no-preview.jpg`}
                preview={{
                  src: `${process.env.CDN_URL}/autoxauto/${file?.key}`,
                }}
                src={`${process.env.CDN_URL}/300x300/${file?.key}`}
              />
            </div>
          );
        }
        return <FileIcon extension={mime.extension(type)} radius={0} />;
      })(file.key, file.fileMime)}
    >
      <Meta
        title={
          <div
            id="clipartMeta"
            className="flex item-center space-between"
            style={{ fontWeight: 300, fontSize: 14 }}
          >
            {clipart.id === edit ? (
              <div className="flex">
                <Input
                  defaultValue={clipart.title}
                  onChange={(e) => setText(e.target.value)}
                  onPressEnter={(e) => {
                    if (clipart.title !== e.target.value) {
                      updateName(clipart.id, e.target.value);
                    }
                    setEdit(false);
                  }}
                />
                <Button
                  className="btn-action-success"
                  type="link"
                  onClick={() => {
                    if (text && clipart.title !== text) {
                      updateName(clipart.id, text);
                    }
                    setEdit(false);
                  }}
                  icon={
                    <AiOutlineCheck className="custom-icon anticon btn-action-success" />
                  }
                />
                <Button
                  className="delete-button-color "
                  type="link"
                  onClick={() => setEdit(false)}
                  icon={
                    <AiOutlineClose className="custom-icon anticon delete-button-color" />
                  }
                />
              </div>
            ) : (
              <>
                <div
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    lineHeight: "38px",
                  }}
                >
                  <Tooltip title={clipart.title}>
                    <span className="titleText">{clipart.title}</span>
                  </Tooltip>
                </div>
                <AuthElement name={permissions.ClipartUpdate}>
                  <div className="custom-action-show item-center flex ">
                    <Tooltip title="Edit title">
                      <Button
                        className="btn-action"
                        type="link"
                        size="small"
                        onClick={() => setEdit(clipart.id)}
                        icon={<BiEditAlt className="custom-icon anticon" />}
                      />
                    </Tooltip>
                    {/* <Divider type="vertical" /> */}
                    <ClipartAction
                      setCustomClass={setCustomClass}
                      refetch={refetch}
                      clipart={clipart}
                    />
                  </div>
                </AuthElement>
              </>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default File;
