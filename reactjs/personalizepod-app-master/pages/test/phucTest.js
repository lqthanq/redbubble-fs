import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Card,Table } from "antd";
import styled from "styled-components";
const phucTest = () => {
  const Container = styled.div`
    margin: 26px;
  `;
  const PLANS = gql`
    query plans {
      plans {
        id
        createdAt
        planName
        badge
        pricing
        billingCycle
        buttonText
        sorting
        features {
          label
          key
          prefix
          value
          suffix
          fieldType
          sorting
        }
      }
    }
  `;
  const { loading, error, data } = useQuery(PLANS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  console.log(data.plans);
  const dataSource = data.plans.map((data2) => data2.planName);
  console.log(dataSource);

  const columns = [
    {
      title: 'Free',
      dataIndex: 'features',
      render:(text,record) => record.features.map(data => 
        <div>{data.value}</div>
      ) 
    }
  ]
    
  

    
  


  

  return (
    <Container>
      <Card>
        {
          data.plans.map(data2 =>
            <Table columns={columns} dataSource={data.plans}></Table>  
          )
        }
      </Card>
    </Container>
  );
};

export default phucTest;
