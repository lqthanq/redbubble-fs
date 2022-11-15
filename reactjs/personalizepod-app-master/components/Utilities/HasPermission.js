import React from "react";
import { Query } from "@apollo/client/react/components";
import HASPERMISSION from "graphql/queries/hasPermission";
import { Skeleton } from "antd";

const HasPermission = ({ permissions = null, children }) => {
  if (permissions === null) return children;
  if (Array.isArray(permissions)) {
    for (i in permissions) {
      <Query query={HASPERMISSION} variables={{ permission: permissions[i] }}>
        {({ data, loading, error }) => {
          if (loading) {
            return <Skeleton />;
          }
          if (error) {
            return null;
          }
          if (data) {
            if (data.hasPermission) {
              return { children };
            } else {
              return null;
            }
          }
        }}
      </Query>;
    }
  } else {
    return (
      <Query query={HASPERMISSION} variables={{ permission: permissions }}>
        {({ data, loading, error }) => {
          if (loading) {
            return <Skeleton />;
          }
          if (error) {
            return null;
          }
          if (data) {
            if (data.hasPermission) {
              return children;
            } else {
              return null;
            }
          }
        }}
      </Query>
    );
  }
};

export default HasPermission;
