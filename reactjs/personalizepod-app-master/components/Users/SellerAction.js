import React from "react";
import { BiEditAlt } from "react-icons/bi";
import { RiErrorWarningFill } from "react-icons/ri";
import styled from "styled-components";

const Container = styled.div``;

const SellerAction = () => {
  const actionMenu = () => (
    <Menu onClick={({ key }) => console.log(key)}>
      <Menu.Item key="edit" icon={<BiEditAlt className="anticon" />}>
        Edit
      </Menu.Item>
      <Menu.Item key="edit" icon={<RiErrorWarningFill className="anticon" />}>
        Suspend
      </Menu.Item>
    </Menu>
  );

  return (
    <Container>
      <Dropdown overlay={actionMenu}>
        <Button>
          Action <IoIosArrowDown className="anticon" />
        </Button>
      </Dropdown>
    </Container>
  );
};

export default SellerAction;
