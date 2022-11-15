import { Tag } from "antd";
import styled from "styled-components";
import { publishedStatus } from "./PublishedStores";

const Container = styled.div``;

const StatusInStoreView = ({ item, storeId }) => {
  const matchStore = item?.campaignStores.find(
    (store) => store.storeId === storeId
  );
  const matchStatus = publishedStatus.find((item) =>
    matchStore ? item.status === matchStore.status : item.status === "New"
  );

  return (
    <Container>
      {matchStore ? (
        <Tag
          style={{
            textTransform: "capitalize",
            color: matchStatus?.color,
            backgroundColor: matchStatus?.bgColor,
            border: `1px solid ${matchStatus?.border}`,
            cursor: "pointer",
          }}
          onClick={() => {
            if (matchStore.permaLink) {
              window.open(matchStore.permaLink, "_blank");
            }
          }}
        >
          {matchStatus.title}
        </Tag>
      ) : (
        <Tag
          style={{
            textTransform: "capitalize",
            color: matchStatus?.color,
            backgroundColor: matchStatus?.bgColor,
            border: `1px solid ${matchStatus?.border}`,
          }}
        >
          Push New
        </Tag>
      )}
    </Container>
  );
};

export default StatusInStoreView;
