import { useState } from "react";
import { Button, message, notification } from "antd";
import Upload from "./Upload";
import _ from "lodash";
import { useMutation } from "@apollo/client";
import createFile from "graphql/mutate/file/create";
import createClipart from "graphql/mutate/createClipart";
import createClipartCategory from "graphql/mutate/createClipartCategory";
import { LoadingOutlined } from "@ant-design/icons";
const ImportFolder = ({ onCompleted, parent }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [createFileMutation] = useMutation(createFile);
  const [createClipartMutation] = useMutation(createClipart);
  const [createCategoryMutation] = useMutation(createClipartCategory);
  const createFiles = async (files) => {
    let result;
    await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            createFileMutation({
              variables: {
                input: {
                  key: file.key,
                  fileName: file.name,
                  fileMime: file.type,
                  fileSize: file.size,
                  type: "clipart",
                },
              },
            })
              .then((res) => resolve(res.data.createFile))
              .catch((err) => reject(err));
          })
      )
    )
      .then((list) => (result = list))
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
    return result;
  };
  const createCliparts = async (files, categoryID) => {
    await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            createClipartMutation({
              variables: {
                title: file.fileName,
                file: {
                  id: file.id,
                  key: file.key,
                  fileName: file.fileName,
                  fileMime: file.fileMime,
                  fileSize: file.fileSize,
                },
                categoryID: categoryID,
              },
            })
              .then((res) => resolve(res.data.createClipart))
              .catch((err) => reject(err));
          })
      )
    ).catch((err) => {
      notification.error({ message: err.message });
      setLoading(false);
    });
    setLoading(false);
    onCompleted();
  };
  const createCategory = async (title, parentID) => {
    let result;
    await createCategoryMutation({
      variables: {
        title: title,
        parentID: parentID ? parentID : null,
      },
    })
      .then((res) => (result = res.data.createClipartCategory))
      .catch((err) => {
        notification.error({ message: err.message });
        setLoading(false);
      });
    return result;
  };
  function filterFiles(files, path) {
    const result = files.filter((el) =>
      _.isEqual(
        _.split(
          el.originFileObj.webkitRelativePath.slice(
            0,
            el.originFileObj.webkitRelativePath.lastIndexOf("/")
          ),
          "/"
        ),
        path
      )
    );
    return result;
  }
  function arrangeIntoTree(paths, files) {
    var tree = [];
    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];
      var cliparts = filterFiles(files, path);
      var currentLevel = tree;
      for (var j = 0; j < path.length; j++) {
        var part = path[j];
        var existingPath = findWhere(currentLevel, "name", part);
        if (existingPath) {
          currentLevel = existingPath.children;
        } else {
          var newPart = {
            name: part,
            children: [],
            cliparts: filterFiles(cliparts, path.slice(0, j + 1)),
          };
          currentLevel.push(newPart);
          currentLevel = newPart.children;
        }
      }
    }
    return tree;

    function findWhere(array, key, value) {
      let t = 0;
      while (t < array.length && array[t][key] !== value) {
        t++;
      }
      if (t < array.length) {
        return array[t];
      } else {
        return false;
      }
    }
  }
  const onHandling = (tree, parentID) => {
    tree.map(async (el) => {
      let cate = await createCategory(el.name, parentID);
      if (cate) {
        if (el.cliparts.length) {
          let files = await createFiles(el.cliparts);
          if (files) {
            createCliparts(files, cate.id);
          }
        }
        if (el.children.length) {
          onHandling(el.children, cate.id);
        }
      }
    });
  };
  const handleUpload = async (filesList) => {
    setUploading(true);
    let files = filesList.filter((el) =>
      [
        "image/jpg",
        "image/png",
        "image/tif",
        "image/tiff",
        "image/jpeg",
      ].includes(el.type)
    );
    if (files && files.length > 0) {
      let direc = files
        .map((el) =>
          el.originFileObj.webkitRelativePath.slice(
            0,
            el.originFileObj.webkitRelativePath.lastIndexOf("/")
          )
        )
        .reduce(
          (unique, item) =>
            unique.includes(item) ? unique : [...unique, item],
          []
        )
        .map((el) => _.split(el, "/"))
        .sort();
      let b = await arrangeIntoTree(direc, files);
      if (b) {
        onHandling(b, parent);
      }
    } else {
      notification.warning({ message: "No clipart in your folder" });
      setLoading(false);
    }
    setUploading(false);
  };
  return (
    <div>
      {loading && (
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
            Your folder is uploading. Please wait for completion!
          </p>
        </div>
      )}
      {uploading ? (
        <Button loading={loading}>Import from folder</Button>
      ) : (
        <Upload
          directory
          showUploadList={false}
          dragger={false}
          onUpload={handleUpload}
          onChange={() => setLoading(true)}
        >
          <Button loading={loading}>Import from folder</Button>
        </Upload>
      )}
    </div>
  );
};
export default ImportFolder;
