import React, { useEffect, useRef, useState, useCallback } from "react";
import Grid from "components/Utilities/Grid";
import FileField from "components/Media/FileField";
import MediaSelector from "components/Media/MediaSelector";
import { Button, Checkbox } from "antd";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { get, uniqBy } from "lodash";
const Container = styled.div`
  .ant-checkbox-wrapper {
    position: absolute;
    left: 5px;
    top: 0;
  }
  .image-item {
    .delete-icon {
      display: none;
      position: absolute;
      right: 3px;
      top: 3px;
      font-size: 20px;
      fill: var(--error-color);
      cursor: pointer;
    }
    &:hover {
      .delete-icon {
        display: block;
      }
    }
  }
`;
const useStateCallback = (initState) => {
  const [state, _setState] = useState(initState);
  const callBackRef = useRef();
  const isFirstCallbackCall = useRef(true);
  const setState = useCallback((setStateAction, callback) => {
    callBackRef.current = callback;
    _setState(setStateAction);
  }, []);
  useEffect(() => {
    if (isFirstCallbackCall.current) {
      isFirstCallbackCall.current = false;
      return;
    }
    callBackRef.current?.(state);
  }, [state]);
  return [state, setState];
};

const ImagesField = ({ value, onChange = () => {} }) => {
  const [files, setFiles] = useStateCallback([]);
  const [selected, setSelected] = useStateCallback();
  const [showMediaSelector, setShowMediaSelector] = useState(false);

  useEffect(() => {
    setFiles((value || []).map((v) => v.file));
    var defaultVal = (value || []).find((v) => v.active);
    if (defaultVal) {
      setSelected(defaultVal.file.id);
    } else {
      setSelected(get(value, "[0].file.id", null));
    }
  }, [value]);

  const doUpdate = (files) => {
    onChange(
      files.map((file) => ({
        active: file.id === selected,
        file: file,
      }))
    );
  };

  return (
    <Container>
      <Grid width={64} gap={5}>
        {files.map((file, index) => (
          <div
            key={`${index}${file.id}`}
            className="image-item"
            style={{
              border: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <FileField
              size={64}
              value={file}
              editable={false}
              onClick={() =>
                setSelected(file.id, (selected) => {
                  onChange(
                    files.map((file) => ({
                      active: file.id === selected,
                      file: file,
                    }))
                  );
                })
              }
            />
            {selected === file.id && <Checkbox checked={true} />}
            {files.length > 1 && (
              <CloseCircleOutlined
                className="delete-icon"
                style={{ color: "var(--error-color)" }}
                onClick={(e) => {
                  if (files.length === 1) return;
                  e.preventDefault();
                  onChange(
                    files
                      .filter((f) => file.id !== f.id)
                      .map((file) => ({
                        active: file.id === selected,
                        file: file,
                      }))
                  );
                }}
              />
            )}
          </div>
        ))}
        <div
          style={{
            border: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            type="link"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setShowMediaSelector(true)}
          ></Button>
        </div>
        <MediaSelector
          visible={showMediaSelector}
          multiple={true}
          onCancel={() => setShowMediaSelector(false)}
          onChange={(newFiles) => {
            setFiles(
              uniqBy([...files, ...newFiles], (file) => file.id),
              doUpdate
            );
          }}
        />
      </Grid>
    </Container>
  );
};

export default ImagesField;
