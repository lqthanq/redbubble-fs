import {
  arrayMove,
  SortableContainer,
  SortableElement,
} from "react-sortable-hoc";
import { Button, Image, Popconfirm, Space, Switch } from "antd";
import { AiFillDelete } from "react-icons/ai";
import { useAppValue } from "context";
import { CAMPAIGN, MOCKUP } from "actions";
import styled from "styled-components";
import { cloneDeep, orderBy } from "lodash";
import Scrollbars from "react-custom-scrollbars";

const Container = styled.div`
  display: flex;
  margin: 12px 15px;
  height: 125px;
`;

const timeout = (delay) => {
  return new Promise((res) => setTimeout(res, delay));
};

const SortableItem = SortableElement(
  ({ mockup, mockupFixed, mockupSelected, setMockup, handleDeleteMockup }) => {
    const [{ campaign, mockupWorkspace }, dispatch] = useAppValue();
    const { productInput } = campaign;
    const { mockup: currentMockup, mockupsManage } = mockupWorkspace;
    return (
      <li
        style={{
          listStyle: "none",
          marginRight: 10,
          padding: 5,
          border: `1px solid ${
            mockupSelected?.id === mockup.id ? "#5c6ac4" : "#f0f0f0"
          }`,
          background: mockupSelected?.id === mockup.id ? "#fafafa" : "inherit",
          position: "relative",
          zIndex: 2000,
          cursor: "pointer",
        }}
        className="drag-visible"
        key={mockup.id}
      >
        <Image
          onClick={async (e) => {
            e.preventDefault();
            const matchMockup = mockupWorkspace.mockupsManage.find(
              (item) => item.id === mockup.id
            );
            setMockup(matchMockup);
            dispatch({
              type: MOCKUP.SET,
              payload: {
                ...mockup,
                matchMockup,
              },
            });
            dispatch({ type: MOCKUP.SET_SELECTED_LAYERS, payload: [] });
          }}
          preview={false}
          fallback={`/no-preview.jpg`}
          src={
            mockup.preview &&
            mockup.preview.indexOf("data:image/png;base64") !== 0
              ? `${process.env.CDN_URL}200x200/${mockup.preview}`
              : mockup.preview
          }
          style={{ width: 100, height: 100, objectFit: "contain" }}
        />
        <div
          style={{
            position: "absolute",
            cursor: "pointer",
            top: 0,
            right: 5,
            zIndex: 2001,
          }}
        >
          {mockupFixed ? (
            <Switch
              onChange={(value) => {
                let newExcludeMockups = [...productInput.excludeMockups];
                if (value) {
                  newExcludeMockups = newExcludeMockups.filter(
                    (el) => el !== mockup.id
                  );
                } else {
                  newExcludeMockups.push(mockup.id);
                }
                dispatch({
                  type: CAMPAIGN.SET,
                  payload: {
                    campaign: {
                      ...campaign,
                      productInput: {
                        ...productInput,
                        excludeMockups: newExcludeMockups,
                      },
                    },
                  },
                });
              }}
              checked={!productInput?.excludeMockups?.includes(mockup.id)}
              size="small"
            />
          ) : (
            <Popconfirm
              title="Are you sure to delete this mockup?"
              onConfirm={() => handleDeleteMockup(mockup)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                style={{ padding: 0 }}
                icon={
                  <AiFillDelete
                    style={{
                      color: "var(--error-color)",
                    }}
                    className="custom-icon anticon "
                  />
                }
              ></Button>
            </Popconfirm>
          )}
        </div>
      </li>
    );
  }
);
const SortableList = SortableContainer(
  ({ mockups, mockupSelected, setMockup, uploadCard, handleDeleteMockup }) => {
    return (
      <Scrollbars autoHeightMax="118px">
        <ul
          style={{ padding: 0, display: "flex", marginBottom: 0 }}
          className="drag-visible"
        >
          {orderBy(mockups, ["ordering"], ["asc"]).map((mockup, index) => {
            return (
              <SortableItem
                handleDeleteMockup={handleDeleteMockup}
                key={mockup.id}
                setMockup={setMockup}
                index={index}
                mockupFixed={mockup.isRender}
                mockup={mockup}
                mockupSelected={mockupSelected}
              />
            );
          })}
          <Space>{uploadCard}</Space>
        </ul>
      </Scrollbars>
    );
  }
);
const SortMockupList = ({
  mockupSelected,
  setMockup,
  uploadCard,
  mediaModal,
  lengthLimit,
  handleDeleteMockup,
}) => {
  const [{ mockupWorkspace }, dispatch] = useAppValue();
  const { mockupsManage } = mockupWorkspace;
  const onSortEnd = ({ oldIndex, newIndex }) => {
    let newMockups = cloneDeep(
      arrayMove(
        orderBy(mockupsManage, ["ordering"], ["asc"]),
        oldIndex,
        newIndex
      )
    );
    newMockups = newMockups.map((mockupItem, index) => {
      return {
        ...mockupItem,
        ordering: index,
      };
    });
    dispatch({
      type: MOCKUP.SET_MOCKUPS,
      payload: newMockups,
    });
  };
  return (
    <Container className="carousel-wrapper">
      <SortableList
        mockupSelected={mockupSelected}
        setMockup={setMockup}
        onSortEnd={onSortEnd}
        lockAxis="x"
        mockups={mockupsManage}
        helperClass="row-dragging"
        useDragHandle={false}
        axis={"xy"}
        lengthLimit={lengthLimit}
        uploadCard={uploadCard}
        dispatch={dispatch}
        distance={1}
        handleDeleteMockup={handleDeleteMockup}
      />
      {mediaModal(true)}
    </Container>
  );
};

export default SortMockupList;
