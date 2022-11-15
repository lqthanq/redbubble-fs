import { Button, Card, Tag } from "antd";
import React from "react";
import { AiOutlineExport, AiOutlineEye } from "react-icons/ai";
import styled from "styled-components";

const Container = styled.div`
  margin: 0 26px;
  .header-button {
    display: flex;
    justify-content: flex-end;
    button {
      color: var(--custom-link-color);
    }
  }
`;

const InvoiceDetail = () => {
  return (
    <Container>
      <Card>
        <div>
          <div className="header-button">
            <Button
              type="link"
              icon={<AiOutlineEye className="anticon custom-icon" />}
            >
              View PDF
            </Button>
            <Button
              type="link"
              icon={<AiOutlineExport className="anticon custom-icon" />}
            >
              Export PDF
            </Button>
          </div>
          <div>
            <img
              alt="logo"
              src="/images/logo-app.png"
              style={{ maxWidth: 200, marginBottom: 15 }}
            />
            <div>
              <div className="flex item-center">
                <h2 style={{ marginBottom: 0 }}>INVOICE</h2>{" "}
                <Tag className="ml-15" color="orange-inverse">
                  Pending
                </Tag>
              </div>
              <div className="flex item-center space-between">
                <p>Invoice: #1212</p>
                <p>
                  Date: Apr 30, 2021
                  <span className="ml-15">Due Date: May 03, 2021</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default InvoiceDetail;
