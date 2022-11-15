import PHOTOQUERY from "../../graphql/queries/photos";
import CREATEPHOTOMUTATE from "../../graphql/mutate/createPhoto";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { Query } from "@apollo/client/react/components";
import Upload from "../Media/Upload";
import { useState } from "react";
import { message } from "antd";
import Masonry from "react-masonry-css";

const Container = styled.div`
  padding: 0 10px;
  .photo-selector {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-left: -10px;
    width: auto;
  }
  .photo {
    padding-left: 10px;
    background-clip: padding-box;
    padding-bottom: 10px;
    > div {
      margin-bottom: 10px;
    }
  }
`;
const PhotoSelector = ({ onSelect = () => {} }) => {
  const [fileUploads, setFileUploads] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [createPhotoMutation] = useMutation(CREATEPHOTOMUTATE);
  const createPhoto = (files) => {
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            createPhotoMutation({
              variables: {
                file: {
                  key: file.key,
                  fileName: file.name,
                  fileSize: file.size,
                  fileMime: file.type,
                },
              },
            })
              .then((res) => resolve(res.data.createPhoto))
              .catch((err) => reject(err));
          })
      )
    )
      .then((res) => {
        console.log(res);
        setFileUploads([]);
      })
      .catch((err) => {
        message.error(err.message);
        setFileUploads([]);
      });
  };
  return (
    <Container>
      <Upload fileList={fileUploads} onUpload={createPhoto}>
        <span style={{ margin: "30px 0", display: "block" }}>
          Click or drop images here
        </span>
      </Upload>
      <Query
        query={PHOTOQUERY}
        onCompleted={(data) => setPhotos(data.photos.hits)}
      >
        {() => null}
      </Query>
      <Masonry
        breakpointCols={2}
        className="photo-selector"
        columnClassName="photo"
        style={{ marginTop: 20 }}
      >
        {photos.map((photo) => (
          <img
            src={`${process.env.CDN_URL}200xauto/${photo.file.key}`}
            key={photo.id}
            style={{ maxWidth: "100%" }}
            onClick={(e) => {
              e.preventDefault();
              onSelect(photo);
            }}
          />
        ))}
      </Masonry>
    </Container>
  );
};

export default PhotoSelector;
