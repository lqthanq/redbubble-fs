import { useQuery } from "@apollo/client";
import { Avatar, Tooltip } from "antd";
import stores from "graphql/queries/stores";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import styled from "styled-components";
import { publishedStatus } from "./PublishedStores";

const Container = styled.div``;

const PublishedInStoreView = ({ item }) => {
  const [customClass, setCustomClass] = useState();

  const { data: dataStores } = useQuery(stores, {
    variables: {
      filter: {
        status: true,
        pageSize: -1,
      },
    },
  });

  const listStores = dataStores?.stores?.hits;

  return (
    <Container>
      <div
        style={{
          width: 220,
          display: "flex",
          flexWrap: "wrap",
          marginLeft: 10,
        }}
      >
        {item?.campaignStores.length ? (
          item?.campaignStores.map((store, index) => {
            const matchStore = listStores?.find((s) => s.id === store.storeId);
            const matchStatus = publishedStatus.find(
              (item) =>
                item.status === store.pushStatus || item.status === store.status
            );
            if (matchStore) {
              return (
                <div
                  style={{
                    marginLeft: "-10px",
                    zIndex:
                      customClass?.storeId === matchStore.id &&
                      customClass.campaignId === item.id
                        ? 2
                        : "inherit",
                  }}
                  onMouseEnter={() =>
                    setCustomClass({
                      storeId: matchStore.id,
                      campaignId: item.id,
                    })
                  }
                  onMouseLeave={() => setCustomClass()}
                  key={matchStore.id}
                >
                  <Tooltip
                    title={
                      <div className="flex item-center">
                        {`${matchStore.title}: ${store.status}`}
                        {store.permaLink && (
                          <a
                            style={{ color: "white" }}
                            className="ml-15 flex item-center"
                            target="_blank"
                            href={store.permaLink}
                          >
                            <FaEye className="anticon" />
                          </a>
                        )}
                      </div>
                    }
                  >
                    <Avatar
                      style={{
                        textTransform: "capitalize",
                        color: matchStatus?.color,
                        backgroundColor: matchStatus?.bgColor,
                        border: `1px solid ${matchStatus?.border}`,
                        cursor: store.permaLink ? "pointer" : "default",
                      }}
                      onClick={() => {
                        if (store.permaLink) {
                          window.open(store.permaLink, "_blank");
                        }
                      }}
                    >
                      {matchStore.title.charAt(0)}
                    </Avatar>
                  </Tooltip>
                </div>
              );
            } else {
              return <div key={index} style={{ height: 32 }} />;
            }
          })
        ) : (
          <div style={{ height: 32 }} />
        )}
      </div>
    </Container>
  );
};

export default PublishedInStoreView;
