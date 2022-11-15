import { Tabs } from "antd";
import styled from "styled-components";
import Layers from "./Layers";
import { useAppValue } from "../../context";
import { get } from "lodash";
import TemplateSettingsForm from "./Utilities/TemplateSettingsForm";
import SharedLayers from "./SharedLayers";
import { ARTWORK } from "../../actions";
const Container = styled.div`
  height: 100%;
  padding-top: 9px;
  border-left: 1px solid #d9d9d9;
  .ant-tabs {
    min-height: 100%;
    &.canvas-left-toolbars {
      .ant-tabs-ink-bar {
        display: none;
      }
      .ant-tabs-nav-list {
        svg {
          font-size: 24px;
        }
      }
      .ant-tabs-content-holder {
        border-left: none;
        margin-left: 0;
        overflow-y: auto;
      }
      .ant-tabs-tabpane {
        padding-left: 0;
      }
      .ant-collapse {
        background-color: transparent;
        border-radius: 0;
        border: none;
        .ant-collapse-item {
          border-color: hsla(0, 0%, 100%, 0.07);
          &:last-child {
            border-radius: 0;
          }
        }
        .ant-collapse-content {
          border-radius: 0;
          .ant-form-item {
            margin-bottom: 10px;
          }
        }
      }
    }
  }
`;
const LeftToolbar = () => {
  const [{ workspace }, dispatch] = useAppValue();
  const { artwork, selectedTemplate } = workspace;
  const layers = get(artwork, `[${selectedTemplate}].layers`, []);
  return (
    <Container>
      <Tabs
        tabPosition="top"
        className="canvas-left-toolbars"
        tabBarStyle={{ marginBottom: 0 }}
        type="card"
        tabBarStyle={{ marginLeft: 5, marginBottom: 0 }}
        onChange={(key) => {
          if (key === "shared-layers") {
            dispatch({
              type: ARTWORK.SET_SELECTED_TEMPLATE,
              payload: -1,
            });
          } else if (selectedTemplate === -1) {
            dispatch({
              type: ARTWORK.SET_SELECTED_TEMPLATE,
              payload: 0,
            });
          }
        }}
      >
        <Tabs.TabPane key="layers" tab="Layers">
          <Layers layers={layers} />
        </Tabs.TabPane>
        <Tabs.TabPane key="shared-layers" tab="Shared Layers">
          <SharedLayers />
        </Tabs.TabPane>
        <Tabs.TabPane key="settings" tab="Template Settings">
          <TemplateSettingsForm />
        </Tabs.TabPane>
      </Tabs>
    </Container>
  );
};

export default LeftToolbar;
