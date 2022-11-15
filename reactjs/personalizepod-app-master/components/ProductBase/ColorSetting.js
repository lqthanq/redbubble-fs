import {
  Button,
  Divider,
  Input,
  Modal,
  notification,
  Pagination,
  Popconfirm,
  Popover,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import styled from "styled-components";
import { CaretDownOutlined } from "@ant-design/icons";
import ImagePrintarea from "./ImagePrintarea";
import {
  DELETE_COLOR,
  UPDATE_COLORS,
} from "graphql/mutate/productBase/colorManagementMutation";
import { useMutation } from "@apollo/client";
import { clearTypeName } from "components/Utilities/ClearTypeName";
import { messageSave, messageDelete } from "components/Utilities/message";
import { AiFillDelete } from "react-icons/ai";
import { GlobalStyle } from "components/Konva/Utilities/ColorField";
import AuthElement from "components/User/AuthElement";
import { permissions } from "components/Utilities/Permissions";

const Container = styled.div``;

const ColorSetting = ({
  selectedRowKeys,
  selectedRows,
  refetch,
  settingOnlyColor,
  setSelectedRowKeys,
  pagination,
}) => {
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState(selectedRows || []);
  const [UpdateColors, { loading }] = useMutation(UPDATE_COLORS);
  const [deleteColor] = useMutation(DELETE_COLOR);

  useEffect(() => {
    if (selectedRows) {
      setDataSource(selectedRows);
    }
  }, [selectedRows]);
  // const code = record?.code?.includes("#")
  //   ? `${record?.code}`
  //   : `{#${record?.code}}`;
  const columns = [
    {
      title: "Color name",
      key: "name",
      dataIndex: "name",
      width: 180,
      render: (name, record, index) => (
        <Input
          value={name}
          onChange={(e) => {
            setDataSource(
              dataSource?.map((item, i) =>
                i === index ? { ...item, name: e.target.value } : { ...item }
              )
            );
          }}
        />
      ),
    },
    {
      title: "Color",
      key: "code",
      dataIndex: "code",
      width: 120,
      render: (code, record, index) => (
        <Popover
          content={
            <SketchPicker
              width={300}
              // triangle="hide"
              color={code ? code : ""}
              onChange={({ hex }) => {
                setDataSource(
                  dataSource?.map((item, i) =>
                    i === index ? { ...item, code: hex } : { ...item }
                  )
                );
              }}
            />
          }
        >
          <Button
            style={{
              backgroundColor: code
                ? `${code.includes("#") ? code : `#${code}`}`
                : "gray",
              width: 50,
              height: 50,
            }}
          >
            {" "}
          </Button>
          <GlobalStyle />
        </Popover>
      ),
    },
    {
      title: "Pattern",
      key: "pattern",
      dataIndex: "pattern",
      width: 100,
      render: (pattern, record, index) => (
        <div style={{ position: "relative" }}>
          <AuthElement name={permissions.ColorUpdate}>
            <ImagePrintarea
              record={pattern}
              settingColor={true}
              onChange={(v) => {
                setDataSource(
                  dataSource?.map((item, i) =>
                    i === index ? { ...item, pattern: v } : { ...item }
                  )
                );
              }}
            />
            <Popconfirm
              title="Are you sure to delete this pattern？"
              onConfirm={() => {
                setDataSource(
                  dataSource?.map((item, i) =>
                    i === index ? { ...item, pattern: null } : { ...item }
                  )
                );
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                hidden={!pattern}
                type="link"
                style={{ position: "absolute", top: "-5px", right: "15px" }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                icon={<AiFillDelete className="anticon delete-button-color" />}
              />
            </Popconfirm>
          </AuthElement>
        </div>
      ),
    },
  ];

  const handleSubmit = () => {
    UpdateColors({
      variables: {
        input: clearTypeName(
          dataSource?.map((item) => {
            return {
              code: item.code.includes("#")
                ? item.code.substring(1)
                : item.code,
              id: item.id,
              name: item.name,
              pattern: item?.pattern?.id ?? null,
            };
          })
        ),
      },
    })
      .then((res) => {
        messageSave("Color");
        refetch();
        setVisible(false);
        setSelectedRowKeys([]);
      })
      .catch((err) => {
        if (err.message === "duplicate color in fulfillment") {
          notification.error({
            message: "Duplicate color in fulfillment. Please input name color.",
          });
        } else {
          notification.error({
            message: err.message,
          });
        }
      });
  };

  const handleDeleteColor = (id) => {
    deleteColor({
      variables: {
        id,
      },
    })
      .then((res) => {
        messageDelete("Color");
        refetch();
      })
      .catch((err) =>
        notification.error({
          message: err.message,
        })
      );
  };

  return (
    <Container>
      {settingOnlyColor ? (
        <div>
          <Button
            style={{ padding: "4px 0px" }}
            onClick={() => setVisible(true)}
            type="link"
          >
            Edit
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure to delete this color?"
            onConfirm={() => handleDeleteColor(selectedRows[0]?.id)}
          >
            <a href="#" className="delete-button-color ">
              Delete
            </a>
          </Popconfirm>
        </div>
      ) : (
        <div className="flex" style={{ padding: 16 }}>
          <Pagination {...pagination} />
          <Button.Group>
            <Button>
              {selectedRowKeys.length} item
              {`${selectedRowKeys.length > 1 ? "s" : ""}`} are selected
            </Button>
            <Button
              onClick={() => setVisible(true)}
              disabled={!selectedRowKeys.length}
              type="primary"
              loading={loading}
            >
              Setting <CaretDownOutlined />
            </Button>
          </Button.Group>
        </div>
      )}
      <Modal
        className="p-modal-color"
        visible={visible}
        title={settingOnlyColor ? "Color Setting" : "Bulk Settings"}
        onCancel={() => {
          setDataSource(selectedRows);
          setVisible(false);
        }}
        footer={
          <div>
            <Button
              onClick={() => {
                setDataSource(selectedRows);
                setVisible(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => handleSubmit()}
            >
              Save
            </Button>
          </div>
        }
      >
        <Table
          className="table-color-management"
          style={{ boxShadow: "none" }}
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          bordered={false}
          pagination={false}
        />
      </Modal>
    </Container>
  );
};

export default ColorSetting;
