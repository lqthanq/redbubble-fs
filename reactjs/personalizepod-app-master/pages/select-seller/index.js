import { useQuery } from "@apollo/client";
import { Select } from "antd";
import { isAdmin } from "components/Utilities/isAdmin";
import { useAppValue } from "context";
import { SELLERS } from "graphql/queries/users";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 40% 60%;
  padding: 15px 50px;
  margin: auto;
  height: 100%;
  width: 100%;
  .ant-select-selector {
    background: #5c6ac4 !important;
    border-color: #5c6ac4 !important;
    text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
    box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
  }
  .ant-select-selection-placeholder {
    color: white;
  }
  .ant-select-arrow {
    color: white;
  }
  .ant-select-selection-item {
    color: white;
  }
  .ant-select-selection-search {
    input {
      color: white;
    }
  }
`;

const SelectSeller = () => {
  const [{ sellerId }, dispatch] = useAppValue();
  const router = useRouter();
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

  const handleSearch = (value) => setSearch(value);

  return (
    <Container>
      <div>
        <h1>Browse Data?</h1>
        <p style={{ fontSize: 24 }}>
          To browse data, you need select a
          <br /> seller first.
          <br />
          You can select seller in the header or here.
        </p>
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
      <div>
        <img
          alt="logo"
          src="/images/bg-seller.png"
          style={{
            maxWidth: "-webkit-fill-available",
            filter: "hue-rotate(60deg)",
          }}
        />
      </div>
    </Container>
  );
};

export default SelectSeller;
