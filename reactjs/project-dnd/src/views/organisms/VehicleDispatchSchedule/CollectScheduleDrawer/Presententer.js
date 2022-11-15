import React from "react";
import { DrawerOnRight, TextSearcher } from "views/molecules";
import CollectScheduleToggleButton from "../CollectScheduleToggleButton";
import { Droppable, Draggable } from "react-beautiful-dnd";
import VehicleDispatches from "../VehicleDispatches";
/**
 *  を表示するコンポーネントです。
 * @param {*} props
 * @returns
 */
const Presententer = (props) => {
  return (
    <div>
      <div>
        <CollectScheduleToggleButton />
        <DrawerOnRight titleDrawer="定期回収">
          <TextSearcher />
          <Droppable droppableId={props.droppableId}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: "300px" }} >
                {props.sideBarItems.map((sidebarItem, index) => (
                  <Draggable key={index} draggableId={props.draggableId + index} index={index}>
                    {(provided) => (
                      <VehicleDispatches
                        innerRef={provided.innerRef}
                        provided={provided}
                        data={sidebarItem} />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DrawerOnRight>
      </div>
    </div>
  );
};
export default Presententer;
