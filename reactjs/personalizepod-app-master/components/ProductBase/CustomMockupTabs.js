import { Tabs } from "antd";
import styled from "styled-components";
import PrintareasMockupTab from "./PrintareasMockupTab";

const Container = styled.div`
  .ant-tabs-nav {
    margin: 0;
  }
  .ant-collapse {
    border: none;
  }
`;
const { TabPane } = Tabs;

const CustomMockupTabs = ({ defaultBackgroud, setDefaultBackground }) => {
  return (
    <Container>
      <Tabs type="card" defaultActiveKey="printareas">
        <TabPane tab="Printareas" key="printareas">
          <PrintareasMockupTab
            defaultBackgroud={defaultBackgroud}
            setDefaultBackground={setDefaultBackground}
          />
        </TabPane>
        <TabPane tab="Settings" key="settings">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>
    </Container>
  );
};

export default CustomMockupTabs;
