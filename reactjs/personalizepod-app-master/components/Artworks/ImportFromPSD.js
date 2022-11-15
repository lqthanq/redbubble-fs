import { Button, message } from "antd";
import MediaSelector from "components/Media/MediaSelector";
import IMPORTFROMPSD from "graphql/mutate/artwork/importFromPSD";
import IMPORTFROMPSDSUB from "graphql/subscription/importArtworkFromPSD";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Subscription } from "@apollo/client/react/components";
import { useRouter } from "next/router";
import { useAppValue } from "context";

const ImportFromPSD = ({ categoryID = null }) => {
  const router = useRouter();
  const [showMedia, setShowMedia] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [{ sellerId }] = useAppValue();
  const [
    importArtwork,
    { data, loading: importLoading, error },
  ] = useMutation(IMPORTFROMPSD, { variables: { sellerId } });
  useEffect(() => {
    if (data) {
      setToken(data.importArtworkFromPSD);
    }
  }, [data]);
  return (
    <div>
      <Button
        onClick={() => setShowMedia(true)}
        loading={loading}
        disabled={categoryID === null}
      >
        Import From PSD
      </Button>
      {data && token && (
        <Subscription
          subscription={IMPORTFROMPSDSUB}
          variables={{ token }}
          onSubscriptionData={({ subscriptionData }) => {
            message.success("Artwork imported");
            setLoading(false);
            router.push(
              "/artworks/[id]/design",
              `artworks/${subscriptionData.data.artwork.id}/design`
            );
          }}
        />
      )}
      <MediaSelector
        visible={showMedia}
        accept=".psd"
        onCancel={() => setShowMedia(false)}
        onChange={(files) => {
          setShowMedia(false);
          setLoading(true);
          importArtwork({
            variables: {
              fileID: files[0].id,
              categoryID: categoryID,
            },
          });
        }}
      />
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
            Your artwork is importing from PSD. Please wait for completion!
          </p>
        </div>
      )}
    </div>
  );
};

export default ImportFromPSD;
