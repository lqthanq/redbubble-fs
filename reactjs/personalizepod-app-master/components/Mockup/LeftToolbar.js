import { Checkbox, Divider, Tabs } from "antd";
import Layers from "./Layers";
import { useAppValue } from "context";
import styled from "styled-components";
import Settings from "./Settings";
import { MOCKUP } from "actions";
import { cloneDeep } from "lodash";

const Container = styled.div`
  height: 100%;
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
const LeftToolbar = ({ campaignView, newMockupIds = [], setNewMockupIds }) => {
  const [{ mockupWorkspace }, dispatch] = useAppValue();
  const { mockup } = mockupWorkspace;

  return (
    <Container>
      {campaignView ? (
        <Checkbox
          checked={mockup?.isRender}
          disabled={!newMockupIds.includes(mockup?.id) && mockup?.isRender}
          onChange={(e) => {
            let newMockups = cloneDeep(mockupWorkspace.mockupsManage);
            if (e.target.checked) {
              setNewMockupIds([...newMockupIds, mockup.id]);
            }
            newMockups = newMockups.map((item) => {
              if (item.id === mockup?.id) {
                dispatch({
                  type: MOCKUP.SET,
                  payload: { ...mockup, isRender: e.target.checked },
                });
                return {
                  ...item,
                  isRender: e.target.checked,
                };
              }
              return { ...item };
            });
            dispatch({
              type: MOCKUP.SET_MOCKUPS,
              payload: newMockups,
            });
          }}
        >
          Using as a complex mockup
        </Checkbox>
      ) : null}
      <Divider style={{ margin: "15px 0" }} type="horizontal" />
      <Tabs className="canvas-left-toolbars" type="card">
        {(campaignView && mockup?.isRender) || !campaignView ? (
          <Tabs.TabPane tab="Printareas" key="printareas">
            <Layers />
          </Tabs.TabPane>
        ) : null}
        <Tabs.TabPane tab="Settings" key="settings">
          <Settings campaignView={campaignView} />
        </Tabs.TabPane>
      </Tabs>
    </Container>
  );
};

export default LeftToolbar;
