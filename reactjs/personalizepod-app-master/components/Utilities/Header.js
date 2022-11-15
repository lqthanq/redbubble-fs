import { useRouter } from "next/router";
import styled from "styled-components";
import { useAppValue } from "../../context";
import UserMenu from "./UserMenu";
import Link from "next/link";

import { Avatar, Row, Button, Col, Popover, Select } from "antd";
import { CAMPAIGN } from "actions";
import { isAdmin } from "./isAdmin";
import { useQuery } from "@apollo/client";
import { SELLERS } from "graphql/queries/users";
import { useState } from "react";
import { debounce } from "lodash";
import AuthElement from "components/User/AuthElement";
import { permissions } from "./Permissions";

const Container = styled.div`
  box-shadow: 0 1px 5px 0 rgba(41, 85, 115, 0.21);
  z-index: 2;
  padding: 0 15px;
  display: flex;
  align-items: center;
  > .ant-row {
    width: 100%;
  }
  .ant-avatar {
    cursor: pointer;
  }
  .menu-min {
    display: none;
  }

  @media screen and (max-width: 900px) {
    .abc {
      display: none;
    }
    .menu-min {
      display: block;
    }
  }
`;

const Header = ({ noChangeSeller = false }) => {
  const [{ currentUser, sellerId }, dispatch] = useAppValue();
  const [search, setSearch] = useState("");
  const { data } = useQuery(SELLERS, {
    variables: {
      filter: {
        search,
        block: false,
      },
    },
    skip: !isAdmin(),
  });

  const router = useRouter();

  const handleSearch = (value) => setSearch(value);

  return (
    <Container>
      <Row type="flex" justify="middle">
        <Link
          href={currentUser ? "/cliparts" : "/"}
          as={currentUser ? "/cliparts" : "/"}
        >
          <a>
            <img
              alt="logo"
              src="/images/logo-app.png"
              style={{ maxWidth: 180 }}
            />
          </a>
        </Link>
        <Col flex="auto" className="ml-15">
          <div hidden={!isAdmin() || noChangeSeller}>
            <Select
              style={{ width: 200 }}
              showSearch
              placeholder="Search sellers..."
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={sellerId}
              onSelect={(newSellerId) => {
                dispatch({
                  type: "setSellerId",
                  payload: newSellerId,
                });
                localStorage.sellerId = newSellerId;
                if (!sellerId) {
                  router.back();
                }
              }}
              onSearch={debounce(handleSearch, 300)}
            >
              {data?.sellers?.hits?.map((seller) => (
                <Select.Option key={seller.id} value={seller.id}>
                  {seller.firstName + " " + seller.lastName}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col flex="269px" align="right" justify="middle">
          {currentUser ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <AuthElement name={permissions.CampaignCreate}>
                <Button
                  style={{ maxWidth: 175, marginRight: 15 }}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/campaigns/new", "/campaigns/new");
                    dispatch({
                      type: CAMPAIGN.RESET,
                    });
                  }}
                >
                  Start New Campaign
                </Button>
              </AuthElement>
              <Popover
                content={<UserMenu user={currentUser} />}
                placement="bottomRight"
                trigger="click"
              >
                <Avatar
                  size={40}
                  src={
                    currentUser?.avatar?.key
                      ? `${process.env.CDN_URL}/100x100/${currentUser?.avatar?.key}`
                      : null
                  }
                >
                  {[currentUser.firstName, currentUser.lastName]
                    .map((str) => str.charAt(0))
                    .join("")}
                </Avatar>
              </Popover>
            </div>
          ) : (
            <div>
              <Button>
                <Link href="/" as="/">
                  <a>Login</a>
                </Link>
              </Button>
            </div>
          )}
        </Col>
      </Row>
      {/* {!currentUser && <LoginForm visible={true} modal={true} />} */}
    </Container>
  );
};

export default Header;
