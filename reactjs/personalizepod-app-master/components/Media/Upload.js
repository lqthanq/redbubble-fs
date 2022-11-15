import { Upload as AntUpload, message } from "antd";
import { useMutation } from "@apollo/client";
import SIGNEDURL from "../../graphql/mutate/file/signedUrl";
import axios from "axios";
import { omit } from "lodash";
import { getClient } from "lib/apollo";

const Upload = (props) => {
  const {
    onChange = () => {},
    onUpload = () => {},
    dragger = true,
    multiple = false,
    limit,
  } = props;
  const [signedUrl] = useMutation(SIGNEDURL);

  const handeUpload = (file) => {
    if (!limit || file.size / (1024 * 1024) <= limit) {
      return new Promise(async (resolve, reject) => {
        signedUrl({ variables: { filename: file.name } })
          .then((res) => {
            file.key = res.data.createSignedUrl.key;
            resolve(res.data.createSignedUrl.url);
          })
          .catch((error) => {
            message.error(error.message);
            reject(error);
          });
      });
    }
  };

  const handleOnChange = ({ fileList }) => {
    onChange(fileList);
    if (fileList.every((f) => f.status === "done")) {
      onUpload(fileList);
    }
  };

  const handleCustomRequest = ({
    action,
    file,
    onError,
    onProgress,
    onSuccess,
  }) => {
    axios
      .put(action, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (e) => {
          onProgress({ percent: (e.loaded / e.total) * 100 }, file);
        },
      })
      .then((res) => onSuccess(res.data, file))
      .catch((err) => {
        onError(err, file);
      });
  };

  return dragger ? (
    <AntUpload.Dragger
      {...omit(props, ["value"])}
      action={handeUpload}
      onChange={handleOnChange}
      customRequest={handleCustomRequest}
      multiple={multiple}
    >
      {props.children}
    </AntUpload.Dragger>
  ) : (
    <AntUpload
      {...omit(props, ["value"])}
      action={handeUpload}
      onChange={handleOnChange}
      customRequest={handleCustomRequest}
      multiple={multiple}
    >
      {props.children}
    </AntUpload>
  );
};

export const uploadFromBase64 = async (
  path,
  filename,
  data,
  onProgress = () => {}
) => {
  const client = getClient();
  const signedUrl = await client
    .mutate({
      mutation: SIGNEDURL,
      variables: {
        path: path,
        filename: filename,
      },
    })
    .then(async (res) => {
      return res.data.createSignedUrl;
    })
    .catch((err) => err);
  return new Promise(async (resolve, reject) => {
    var file = await fetch(data)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], "tmp.png", { type: "image/png" }));
    axios
      .put(signedUrl.url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (e) => {
          onProgress({ percent: (e.loaded / e.total) * 100 }, file);
        },
      })
      .then(() => resolve(signedUrl.key))
      .catch((err) => {
        reject(err);
      });
  });
};

export default Upload;
