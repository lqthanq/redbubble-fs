import { Collapse, Switch } from "antd";
import styled from "styled-components";

const { Panel } = Collapse;

const Container = styled.div`
  .custom-switch {
    .ant-switch {
      border-radius: 0;
      min-width: 90px;
      height: 29px;
    }
    .ant-switch-handle:before {
      border-radius: 0;
    }
    .light-content {
      .ant-switch-handle:before {
        content: "#000000";
      }
    }
    .dark-content {
      .ant-switch-handle:before {
        content: "#ffffff";
      }
    }
    .ant-switch-handle {
      width: 65px;
      height: 24px;
      top: 2px;
    }
    .ant-switch-checked .ant-switch-handle {
      left: calc(100% - 65px - 2px);
    }
  }
  .mb-15 {
    line-height: 30px;
  }
`;

const PrintareasMockupTab = ({ defaultBackgroud, setDefaultBackground }) => {
  console.log(defaultBackgroud);
  return (
    <Container defaultBackgroud={defaultBackgroud}>
      <Collapse defaultActiveKey={["general"]}>
        <Panel header="General" key="general">
          <div className="mb-15">
            <div>Change background with variant color:</div>
            <Switch defaultChecked={true} />
          </div>
          <div className="custom-switch mb-15">
            <div>Default background color: </div>
            <Switch
              className={defaultBackgroud ? "light-content" : "dark-content"}
              defaultChecked={false}
              onChange={(checked) => setDefaultBackground(checked)}
            />
          </div>
        </Panel>
        <Panel header="Apply to variants" key="variants">
          abc
        </Panel>
      </Collapse>
    </Container>
  );
};

export default PrintareasMockupTab;
