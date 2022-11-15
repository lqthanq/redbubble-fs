import { Table, Checkbox, Skeleton, Button, message, Form, Input } from "antd";
import { useQuery } from "@apollo/client";
import { Mutation } from "@apollo/client/react/components";
import { useEffect, useState } from "react";
import updatePermissions from "../../../graphql/mutate/updatePermissions";
import { debounce, omit } from "lodash";
import permissions from "../../../graphql/queries/permissions";

const PermissionPage = () => {
  const [filter, setFilter] = useState("");
  const [rolePermissions, setRolePermissions] = useState();
  const [form] = Form.useForm();
  const { data, loading, error } = useQuery(permissions);

  useEffect(() => {
    if (data) {
      setRolePermissions(data.rolePermissions);
    }
  }, [data]);
  const onValuesChange = (_, values) => {
    setFilter(values.search);
  };
  if (loading) return <Skeleton />;
  return (
    <div style={{ padding: "0 20px" }}>
      <Form form={form} onValuesChange={debounce(onValuesChange, 200)}>
        <Form.Item name="search">
          <Input.Search></Input.Search>
        </Form.Item>
      </Form>
      {data && rolePermissions && (
        <Table
          dataSource={data.permissions.filter((p) => p.indexOf(filter) !== -1)}
          pagination={false}
          rowKey={(row) => row}
          columns={((roles) => {
            var cols = [{ title: "Permision" }];
            roles.forEach((role) => {
              cols.push({
                title: role,
                width: 200,
                align: "center",
                render: (permission) => {
                  var rolePermission = rolePermissions.find(
                    (rp) => rp.role === role && rp.permission === permission
                  );
                  return (
                    <Checkbox
                      checked={rolePermission.allow}
                      onChange={(e) => {
                        setRolePermissions(
                          rolePermissions.map((rp) =>
                            rp.permission === permission && rp.role === role
                              ? { ...rp, allow: e.target.checked }
                              : rp
                          )
                        );
                      }}
                    />
                  );
                },
              });
            });
            return cols;
          })(data.roles)}
        />
      )}
      <Mutation mutation={updatePermissions}>
        {(mutation, res) => (
          <div style={{ margin: "30px 0", textAlign: "right" }}>
            <Button
              type="primary"
              loading={res.loading}
              onClick={(e) => {
                e.preventDefault();
                mutation({
                  variables: {
                    input: rolePermissions.map((rp) =>
                      omit(rp, ["__typename"])
                    ),
                  },
                }).then(() => {
                  message.success("Permisions saved");
                });
              }}
            >
              Save
            </Button>
          </div>
        )}
      </Mutation>
    </div>
  );
};

PermissionPage.title = "Permissions";
export default PermissionPage;
