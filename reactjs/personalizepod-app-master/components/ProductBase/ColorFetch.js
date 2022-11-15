import { Button, notification } from "antd";
import React from "react";
import { FETCH_COLORS } from "graphql/mutate/productBase/colorManagementMutation";
import { useMutation } from "@apollo/client";
const ColorFetch = () => {
  const [FetchColor, { loading }] = useMutation(FETCH_COLORS);
  const handleFetch = () => {
    FetchColor({})
      .then(() => notification.success({ message: "Fetching" }))
      .catch((err) => notification.error({ message: err.message }));
  };
  return (
    <Button style={{ marginLeft: 10 }} loading={loading} onClick={handleFetch}>
      Fetch Colors
    </Button>
  );
};

export default ColorFetch;
