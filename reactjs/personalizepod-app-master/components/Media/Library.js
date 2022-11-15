import {
  Col,
  Input,
  Form,
  Row,
  Select,
  DatePicker,
  Skeleton,
  Progress,
  Pagination,
} from "antd";
import { debounce, difference, last, remove } from "lodash";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import FILEQUERY from "../../graphql/queries/files";
import { AiFillCheckSquare } from "react-icons/ai";
import Grid from "../Utilities/Grid";
import Scrollbars from "components/Utilities/Scrollbars";
import { defaultStyles, FileIcon } from "react-file-icon";
import { useAppValue } from "context";

const Container = styled.div`
  .p-icon {
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .file-style {
    height: 120px;
    display: grid;
  }
  .file-style svg {
    height: 100%;
  }
`;

const Library = forwardRef(
  (
    {
      files = [],
      multiple = false,
      onChange = () => {},
      setSelect,
      select,
      accept,
      limit,
    },
    ref
  ) => {
    const [form] = Form.useForm();
    const [selected, setSelected] = useState(files);
    const mime = accept.split(",");
    const mimeFilter = mime.map((el) => el.replace(".", ""));
    const fileRequired = accept.includes(".");
    const [filter, setFilter] = useState({
      search: "",
      from: null,
      to: null,
      mime: fileRequired ? mimeFilter : [],
      page: 1,
      pageSize: 40,
    });
    const [{ sellerId }] = useAppValue();
    const [libraryFiles, setLibraryFiles] = useState([]);
    const { data, loading, error } = useQuery(FILEQUERY, {
      variables: {
        ...filter,
        sellerId,
      },
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        setLibraryFiles(data.files.hits);
      },
    });

    useImperativeHandle(ref, () => ({
      handleSetLibraryFiles() {
        const newLibraryFiles = [...libraryFiles].filter(
          (el) => el.id !== select.id
        );
        setLibraryFiles([...newLibraryFiles]);
      },
      handleRenameFiles(fileEdited) {
        setSelected(
          selected.map((el) =>
            el.id === fileEdited.id ? { ...el, fileName: fileEdited.title } : el
          )
        );
        setLibraryFiles(
          libraryFiles.map((el) =>
            el.id === fileEdited.id ? { ...el, fileName: fileEdited.title } : el
          )
        );
      },
    }));

    const handleChange = (changes, values) => {
      const convertChanges = {
        ...changes,
        ...values,
        from: values.range ? values.range[0] : null,
        to: values.range ? values.range[1] : null,
        mime: values.mime.length ? values.mime : fileRequired ? mimeFilter : [],
      };
      delete convertChanges.range;
      setFilter({ ...filter, ...convertChanges, page: 1 });
    };

    useEffect(() => {
      onChange(selected);
      const a = selected && selected.find((el) => el.id === select?.id);
      setSelect(a ? a : last(selected));
    }, [selected]);

    useEffect(() => {
      setSelected(files);
    }, [files]);

    const handleClick = (file) => (e) => {
      e.preventDefault();
      if (selected.some((f) => f.id === file.id)) {
        remove(selected, (f) => f.id === file.id);
        setSelected([...selected]);
      } else {
        setSelect(file);
        if (multiple) {
          setSelected([...selected, file]);
        } else {
          setSelected([file]);
        }
      }
    };

    const pagination = {
      total: data?.files?.count,
      pageSize: filter.pageSize,
      current: filter.page,
      onChange: (page, pageSize) => {
        setFilter({ ...filter, pageSize, page });
      },
    };

    if (error) return error.message;

    return (
      <Container>
        <Form form={form} onValuesChange={debounce(handleChange, 200)}>
          <Row type="flex" gutter={10}>
            <Col span={16} style={{ display: "flex", gap: 16 }}>
              <Form.Item
                style={{ marginBottom: 16 }}
                name="mime"
                initialValue={
                  filter.mime.length === mimeFilter.length ? [] : filter.mime
                }
                // difference(mimeFilter, [2, 3]).length === 0
                // mimeFilter > 0 ? fileRequired ? [] :
              >
                {fileRequired ? (
                  <Select
                    placeholder="Select mime type..."
                    mode="multiple"
                    style={{ width: 300 }}
                  >
                    {mimeFilter.map((el) => (
                      <Select.Option key={el} value={el}>
                        {el.toUpperCase()}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <Select
                    placeholder="Select mime type..."
                    mode="multiple"
                    style={{ width: 300 }}
                  >
                    <Select.Option value="psd">PSD</Select.Option>
                    <Select.Option value="png">PNG</Select.Option>
                    <Select.Option value="jpg">JPG</Select.Option>
                    <Select.Option value="jpeg">JPEG</Select.Option>
                    <Select.Option value="ttf">TTF</Select.Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item style={{ marginBottom: 16 }} name="range">
                <DatePicker.RangePicker />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item style={{ marginBottom: 16 }} name="search">
                <Input.Search placeholder="Search..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Scrollbars
          style={{
            width: "auto",
            height: "calc(100vh - 400px)",
          }}
        >
          {loading ? (
            <Skeleton />
          ) : (
            <Grid gap={10} width={120}>
              {libraryFiles?.map((file) => {
                const getFileSelectedId =
                  select && selected.find((el) => el.id === select.id);
                return (
                  <div span={24} sm={12} md={12} lg={8} xl={6} key={file.id}>
                    <div
                      style={{
                        border:
                          limit &&
                          file.fileSize / (1024 * 1024) > limit &&
                          selected.map((f) => f.id).indexOf(file.id) !== -1
                            ? "3px solid red"
                            : getFileSelectedId?.id === file.id
                            ? "3px solid #5c6ac4"
                            : selected.map((f) => f.id).indexOf(file.id) !== -1
                            ? "3px solid #999"
                            : "1px solid rgb(221, 221, 221)",
                      }}
                    >
                      <div
                        onClick={handleClick(file)}
                        className="p-library"
                        style={{
                          backgroundImage: `url(${process.env.CDN_URL}200xauto/${file.key})`,
                        }}
                      >
                        {file.fileMime.includes("image") &&
                        !file.key.includes("psd") ? null : (
                          <div className="file-style">
                            <FileIcon
                              extension={file.key.substr(file.key.length - 3)}
                              {...defaultStyles[
                                file.key.substr(file.key.length - 3)
                              ]}
                            />
                            <span
                              style={{
                                width: "100%",
                                textAlign: "center",
                                padding: "0 5px",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                position: "absolute",
                                color: "white",
                                background: "rgb(0,0,0,0.4)",
                                bottom: 0,
                              }}
                            >
                              {file.fileName}
                            </span>
                          </div>
                        )}
                        {selected.map((f) => f.id).indexOf(file.id) !== -1 && (
                          <div className="p-icon">
                            <AiFillCheckSquare
                              style={{
                                color:
                                  limit &&
                                  file.fileSize / (1024 * 1024) > limit &&
                                  selected.map((f) => f.id).indexOf(file.id) !==
                                    -1
                                    ? "red"
                                    : getFileSelectedId?.id === file.id
                                    ? "#5c6ac4"
                                    : "#999",
                                fontSize: "20px",
                              }}
                              checked={true}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Grid>
          )}
        </Scrollbars>
        <Pagination style={{ padding: "16px 0" }} {...pagination} />
      </Container>
    );
  }
);

export default Library;
